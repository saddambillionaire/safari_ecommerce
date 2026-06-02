import cloudinary from "../config/cloudinary.js";
import { Product }from "../models/Product.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Au moins une image est requise" });
    }
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Vous pouvez télécharger jusqu'à 3 images" });
    }
    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, { folder: "products" });
      });
    const uploadResults = await Promise.all(uploadPromises); // Assuming you are using multer to handle file uploads
    
    // secure_url
    const imageUrls = uploadResults.map(result => result.secure_url);

    const product = await Product.create({
      name,
      description,  
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls
      });

    res.status(201).json({ message: "Produit crée avec succes", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Echec à l'interieur du serveur" });
  }
}
export async function getProducts(_, res) {
    try {
        // -1 pour trier par ordre décroissant (du plus récent au plus ancien)
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Echec à l'interieur du serveur" });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (stock) product.stock = parseInt(stock);
        if (category) product.category = category;
       
        // handle images updates if new images are uploaded
        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Vous pouvez télécharger jusqu'à 3 images" });
            }
            const uploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, { folder: "products" });
            });
            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map(result => result.secure_url);
        }

        await product.save();

        res.status(200).json({ message: "Produit mis à jour avec succès", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Echec à l'interieur du serveur" });
    }
}

export async function getAllOrders(req, res) {
  try {
    // Assuming you have an Order model and it has a reference to the User model
    const orders = await Order.find().
    populate("user", "name email").sort({ createdAt: -1 })
    .populate("orderItems.product", "name price")
    .sort({ createdAt: -1 }); // Populate product details in the order
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Echec à l'interieur du serveur" });
  }
}

export async function updateOrderStatus(req, res) {
  try {    const { orderId } = req.params;
    const { status } = req.body;

    if(!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Status invalide" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    } 
    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();
    
    res.status(200).json({ message: "Status de la commande mis à jour avec succès", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Echec à l'interieur du serveur" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    // Assuming you have a User model and you want to get all users with the role of "customer"
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Echec à l'interieur du serveur" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    totalRevenue = totalRevenue[0]?.totalRevenue[0].total || 0;
    totalCustomers = await User.countDocuments({ role: "customer" });

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Echec à l'interieur du serveur" });
  }
}