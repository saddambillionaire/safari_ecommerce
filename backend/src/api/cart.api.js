import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    }).populate("items.product");

    // 🧠 If no cart exists → create one
    if (!cart) {
      const user = req.user;

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });

      return res.status(200).json({ cart });
    }

    // 🧼 CLEANUP: remove invalid (deleted) products
    const originalLength = cart.items.length;

    cart.items = cart.items.filter((item) => item?.product != null);

    const wasCleaned = cart.items.length !== originalLength;

    // 💾 persist cleanup only if needed
    if (wasCleaned) {
      await cart.save();
    }

    return res.status(200).json({
      cart,
      cleaned: wasCleaned, // optional but useful for debugging/UI
    });
  } catch (error) {
    console.error("Error in getCart controller:", error);

    return res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    // validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuffisant" });
    }

    let cart = await Cart.findOne({ clerkId: req.user.clerkId });

    if (!cart) {
      const user = req.user;

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    // check if item already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      // // increment quantity by 1
      // const newQuantity = existingItem.quantity + 1;
      // increment quantity by requested amount
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Stock insuffisant" });
      }
      existingItem.quantity = newQuantity;
    } else {
      // add new item
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({ message: "Articlé ajouté au charriot", cart });
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ error: "la quantité doit être d'au moins 1" });
    }

    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Charriot introuvable" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Article indisponible dans le charriot " });
    }

    // check if product exists & validate stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuffisant" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res
      .status(200)
      .json({ message: "Le charriot est mis à jour avec succès", cart });
  } catch (error) {
    console.error("Error in updateCartItem controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Charriot introuvable" });
    }

    // Garde uniquement les articles dont l'id est différent => suppression
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();

    res.status(200).json({ message: "Article enlevé du charriot", cart });
  } catch (error) {
    console.error("Error in removeFromCart controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Charriot introuvable" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Charriot supprimé avec succès", cart });
  } catch (error) {
    console.error("Error in clearCart controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Les concepts importants à retenir
// req.body → données envoyées par le frontend.
// req.params → données dans l'URL (/cart/:productId).
// req.user → utilisateur ajouté par le middleware d'authentification.
// findOne() → récupère un document.
// findById() → récupère un document à partir de son _id.
// find() → récupère plusieurs documents.
// populate() → remplace un ObjectId par le document complet référencé.
// save() → sauvegarde les modifications faites sur un document.
// filter() → crée un nouveau tableau en supprimant certains éléments.
// find() → retourne l'élément trouvé.
// findIndex() → retourne la position (index) de l'élément trouvé.
