import {requireAuth} from "@clerk/express";
import {User} from "../models/user.model.js";
import {ENV} from "../config/env.js";

export const protectRoute = [
    requireAuth(), // This middleware ensures that the user is authenticated. It will add the user's authentication information to req.auth.
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId;
            if (!clerkId) {
                return res.status(401).json({ error: "Unauthorized - Invalid token" });
            }
            const user = await User.findOne({ clerkId });
            if (!user) {
                return res.status(404).json({ error: "Unauthorized - User not found" });
            }  
            req.user = user; // Attach the user object to the request for use in subsequent middleware or route handlers
            next(); // Proceed to the next middleware or route handler  

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

];

export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not authenticated" });
    }
    if (req.user.email !== ENV.ADMIN_EMAIL) {
        return res.status(403).json({ error: "Forbidden - Admins only" });
    }
    next();
};  

