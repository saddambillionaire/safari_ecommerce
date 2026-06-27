import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating doit être entre 1 and 5" });
    }

    const user = req.user;

    // verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    if (order.clerkId !== user.clerkId) {
      return res.status(403).json({ error: "pas d'autorisation de regarder cet avis" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ error: "Vous ne pouvez regarder que l'avis des commandes livrés" });
    }

    // verify product is in the order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (!productInOrder) {
      return res.status(400).json({ error: "Produit introuvable dans cette commande" });
    }
    // check if review already exists
    const existingReview = await Review.findOne({productId, userId:user._id })
    if (!existingReview) {
      return res.status(400).json({ error: "Vous avez déjà donné votre avis pour ce produit" });
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating
    })

    res.status(201).json({ message: "Votre avis a été soumis avec succès", review });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Avis introuvable" });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "NVous n'etes pas autorisé à effacer cet avis" });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}