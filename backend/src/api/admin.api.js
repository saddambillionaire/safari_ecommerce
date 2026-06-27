import cloudinary from '../config/cloudinary.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;
        // Validate input
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!req.files || !req.files.length === 0) {
            return res.status(400).json({ message: 'Au moins une image est requise' });
        }

        if (req.files.length > 3) {
            return res.status(400).json({ message: 'Maximum 3 images sont autorisées' });
        }
        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: 'products',
            });
        });
        const uploadResults = await Promise.all(uploadPromises);

        // secure_url
        const imageUrls = uploadResults.map((result) => result.secure_url);

        // Save product to database (pseudo-code)
        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit' });
    }
}

export async function getAllProducts(_, res) {
    try {
        // -1 means descending order
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
}
// update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (stock !== undefined && stock !== null) {
      product.stock = parseInt(stock);
    }
    if (category) product.category = category;

    // Handle image replacement
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "Maximum 3 images sont autorisées" });
      }

      // DELETE OLD IMAGES FROM CLOUDINARY
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((imageUrl) => {
          const publicId =
            "products/" + imageUrl.split("/products/")[1]?.split(".")[0];

          if (publicId) {
            return cloudinary.uploader.destroy(publicId);
          }
        });

        await Promise.all(deletePromises.filter(Boolean));
      }

      // UPLOAD NEW IMAGES
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products",
        })
      );

      const uploadResults = await Promise.all(uploadPromises);

      product.images = uploadResults.map(
        (result) => result.secure_url
      );
    }

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du produit" });
  }
}
