import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

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

export async function handleWebhook(req, res) {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("❌ Invalid webhook signature:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Ignore events we don't process.
  if (event.type !== "payment_intent.succeeded") {
    return res.status(200).json({ received: true });
  }

  const paymentIntent = event.data.object;

  console.log(`📦 Processing payment_intent.succeeded: ${paymentIntent.id}`);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const metadata = paymentIntent.metadata ?? {};

      const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
        metadata;

      // Validate metadata
      if (
        !userId ||
        !clerkId ||
        !orderItems ||
        !shippingAddress ||
        !totalPrice
      ) {
        throw new Error("Missing required payment metadata.");
      }

      let items;
      let address;

      try {
        items = JSON.parse(orderItems);
        address = JSON.parse(shippingAddress);
      } catch (err) {
        throw new Error(`Invalid metadata JSON: ${err.message}`);
      }

      // Application-level idempotency check
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      }).session(session);

      if (existingOrder) {
        console.log(`ℹ️ Order already exists for payment ${paymentIntent.id}.`);
        return;
      }

      // Reserve stock
      for (const item of items) {
        const result = await Product.updateOne(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            session,
          },
        );

        if (result.modifiedCount !== 1) {
          throw new Error(`Insufficient stock for product ${item.product}`);
        }
      }

      // Create order
      await Order.create(
        [
          {
            user: userId,
            clerkId,
            stripeCustomerId: paymentIntent.customer,

            orderItems: items,
            shippingAddress: address,

            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amountReceived: paymentIntent.amount_received / 100,
              currency: paymentIntent.currency,
              paymentMethod: paymentIntent.payment_method,
              processedAt: new Date(),
            },

            totalPrice: Number(totalPrice),

            status: "paid",
            paidAt: new Date(),
          },
        ],
        {
          session,
        },
      );

      console.log(
        `✅ Order successfully created for payment ${paymentIntent.id}`,
      );
    });

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    // Duplicate key => webhook replay.
    if (error?.code === 11000) {
      console.log(
        `ℹ️ Duplicate webhook ignored for payment ${paymentIntent.id}.`,
      );

      return res.status(200).json({
        received: true,
      });
    }

    console.error("========== WEBHOOK FAILED ==========");
    console.error(error);

    // Returning a non-2xx response tells Stripe to retry.
    return res.status(500).json({
      error: "Webhook processing failed.",
    });
  } finally {
    await session.endSession();
  }
}
