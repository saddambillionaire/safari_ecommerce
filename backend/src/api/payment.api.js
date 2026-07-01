import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Le charriot est vide" });
    }

    // Calculate total from server-side (don't trust client - ever.)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Produit ${item.product.name} non trouvé` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Stock insuffisant pour ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = 10.0; // $10
    const tax = subtotal * 0.16; // 16%
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Total de la commande invalid" });
    }

    // find or create the stripe customer
    let customer;
    if (user.stripeCustomerId) {
      // find the customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // create the customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      // add the stripe customer ID to the  user object in the DB
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
    }

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // convert to cents
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },
      // in the webhooks section we will use this metadata
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ error: "EChec de creation de la requête de paiment" });
  }
}

// export async function handleWebhook(req, res) {
//   console.log("\n================ WEBHOOK RECEIVED ================");

//   const sig = req.headers["stripe-signature"];
//   console.log("Stripe Signature:", sig ? "Present ✅" : "Missing ❌");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       ENV.STRIPE_WEBHOOK_SECRET,
//     );

//     console.log("✅ Signature verified");
//     console.log("Event Type:", event.type);
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:");
//     console.error(err);
//     return res.status(400).send(`Erreur Webhook: ${err.message}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;

//     console.log("\n=========== PAYMENT SUCCEEDED ===========");
//     console.log("Payment Intent ID:", paymentIntent.id);

//     console.log("\nMetadata:");
//     console.log(paymentIntent.metadata);

//     try {
//       const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
//         paymentIntent.metadata;

//       console.log("\nParsed metadata:");
//       console.log({
//         userId,
//         clerkId,
//         totalPrice,
//       });

//       console.log("\nChecking existing order...");

//       const existingOrder = await Order.findOne({
//         "paymentResult.id": paymentIntent.id,
//       });

//       if (existingOrder) {
//         console.log("⚠️ Order already exists:", existingOrder._id);
//         return res.json({ received: true });
//       }

//       console.log("No existing order.");

//       console.log("\nCreating order...");

//       const order = await Order.create({
//         user: userId,
//         clerkId,
//         orderItems: JSON.parse(orderItems),
//         shippingAddress: JSON.parse(shippingAddress),
//         paymentResult: {
//           id: paymentIntent.id,
//           status: "succeeded",
//         },
//         totalPrice: parseFloat(totalPrice),
//       });

//       console.log("✅ Order created:", order._id);

//       console.log("\nUpdating stock...");

//       const items = JSON.parse(orderItems);

//       for (const item of items) {
//         console.log(`Updating ${item.product} (-${item.quantity})`);

//         await Product.findByIdAndUpdate(item.product, {
//           $inc: { stock: -item.quantity },
//         });
//       }

//       console.log("✅ Stock updated");
//     } catch (error) {
//       console.error("\n❌ ERROR INSIDE WEBHOOK");
//       console.error(error);

//       if (error.errors) {
//         console.error("\nValidation Errors:");
//         console.error(error.errors);
//       }

//       if (error.stack) {
//         console.error(error.stack);
//       }
//     }
//   } else {
//     console.log("Ignoring event:", event.type);
//   }

//   console.log("=============== END WEBHOOK ===============\n");

//   res.json({ received: true });
// }

//

export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      // IDEMPOTENCY CHECK (important)
      const existingOrder = await Order.findOne({
        stripeEventId: event.id,
      });

      if (existingOrder) {
        console.log("Duplicate webhook ignored:", event.id);
        return res.json({ received: true });
      }

      const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
        paymentIntent.metadata || {};

      if (!orderItems || !shippingAddress) {
        console.error("Missing metadata in payment intent");
        return res.json({ received: true });
      }

      const items = JSON.parse(orderItems);
      const address = JSON.parse(shippingAddress);

      const order = await Order.create({
        user: userId,
        clerkId,
        orderItems: items,
        shippingAddress: address,
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        stripeEventId: event.id,
        totalPrice: parseFloat(totalPrice),
      });

      await Promise.all(
        items.map((item) =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          }),
        ),
      );

      console.log("Order created:", order._id);
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  res.json({ received: true });
}
