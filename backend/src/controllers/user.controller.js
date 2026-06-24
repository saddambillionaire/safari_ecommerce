import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const { label, nomComplet, ville, commune, quartier, avenue, phoneNumber, isDefault } =
      req.body;

    const user = req.user;

    if (!nomComplet || !ville  || !commune || !quartier, avenue, phoneNumber) {
      return res.status(400).json({ error: "Missing required address fields" });
    }

    // if this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      nomComplet,
      ville,
      commune,
      quartier,
      avenue,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error in addAddress controller:", error);
     res.status(500).json({ error: "Erreur Serveur" });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error in getAddresses controller:", error);
     res.status(500).json({ error: "Erreur Serveur" });
  }
}

export async function updateAddress(req, res) {
  try {
    const { label, nomComplet, ville, commune, quartier, avenue, phoneNumber, isDefault } =
      req.body;

    const { addressId } = req.params;

    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // if this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.nomComplet = nomComplet || address.nomComplet;
    address.ville = ville || address.ville;
    address.commune = commune || address.commune;
    address.quartier = quartier || address.quartier;
    address.avenue = avenue || address.avenue;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.status(200).json({ message: "L'addresse est mis à jour avec succès", addresses: user.addresses });
  } catch (error) {
    console.error("Error in updateAddress controller:", error);
    res.status(500).json({ error: "Erreur Serveur" });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({ message: "L'addresse est supprimé avec succès", addresses: user.addresses });
  } catch (error) {
    console.error("Error in deleteAddress controller:", error);
     res.status(500).json({ error: "Erreur Serveur" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if product is already in the wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product existe déjà dans la liste d'envies" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Produit ajouté dans la liste d'envies", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    // check if product is already in the wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Produit introuvable dans la liste d'envies" });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({ message: "Produit retiré de la liste d'envies", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in removeFromWishlist controller:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getWishlist(req, res) {
  try {
    // we're using populate because wishlist is just an array of product ids
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}