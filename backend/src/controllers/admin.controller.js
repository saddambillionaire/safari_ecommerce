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
                use_filename: true,
                unique_filename: false,
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

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);     

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (stock !== undefined && stock !== null) product.stock = parseInt(stock);
        if (category) product.category = category;

        // handle image updates if new images are uploaded
        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: 'Maximum 3 images sont autorisées' });
            }
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'products'
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);
        }

        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
    }
}

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export async function getAllOrders(_, res) {
    try {
        // Fetch all orders from the database (pseudo-code)
        const orders = await Order.find()
        .populate('user', 'name email')
        .populate("orderItems.product")
        .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        
        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({ message: 'Statut de commande invalide' });
        }
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }   
        order.status = status;

        if (status === 'shipped ' && !order.shippedAt) {
            order.shippedAt = new Date();
        }

        if (status === 'delivered' && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({ message: 'Statut de la commande mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande' });
    }   
}

// export async function getAllCustomers(_, res) {
//     try {
//         const customers = await User.find().sort({ createdAt: -1 });
//         res.status(200).json(customers);
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
//     }
// }
export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });

    console.log("CUSTOMERS COUNT =", customers.length);
    console.log("CUSTOMERS =", customers);

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des clients",
    });
  }
}

export async function getDashboardStats(_, res) {
    try {
        const totalOrders = await Order.countDocuments();
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({ totalProducts, totalOrders, totalRevenue, totalCustomers });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
}
