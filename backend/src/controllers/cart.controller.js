import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    // Recherche un panier dont le clerkId correspond à l'utilisateur connecté.
    // populate("items.product") remplace les ObjectId des produits par les documents Product complets.
    let cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    }).populate("items.productId");

    // Si aucun panier n'existe encore pour cet utilisateur
    if (!cart) {
      // On récupère l'utilisateur depuis req.user
      const user = req.user;

      // Création d'un nouveau panier vide
      cart = await Cart.create({
        userId: user._id,         // Référence MongoDB vers l'utilisateur
        clerkId: user.clerkId,  // Identifiant Clerk
        items: [],              // Tableau vide de produits
      });
    }

    // Renvoie le panier trouvé ou créé
    res.status(200).json({ cart });
  } catch (error) {
    // Affiche l'erreur dans la console du serveur
    console.error("Error in getCart controller:", error);

    // Renvoie une erreur 500 au client
    res.status(500).json({
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
        userId: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    // check if item already in the cart
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
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
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Articlé ajouté au charriot", cart });
  } catch (error) {
    console.error("Error in addToCart controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "la quantité doit être d'au moins 1" });
    }

    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Charriot introuvable" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Article indisponible dans le charriot " });
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

    res.status(200).json({ message: "Le charriot est mis à jour avec succès", cart });
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
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
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