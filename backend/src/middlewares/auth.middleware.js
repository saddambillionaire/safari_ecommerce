import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(), // This middleware checks if the user is authenticated using Clerk. If not authenticated, it will return a 401 Unauthorized response.
    async (req, res, next) => {
        try {
            const clerkId = req.auth.userId; // Get the user ID from Clerk's authentication information
           if (!clerkId) {
                return res.status(401).json({ message: "Unauthorized - Clerk ID not found" });
            }
            const user = await User.findOne({ clerkId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
];  

export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - Utilisateur non authentifié" });
    }
    if (req.user.email !== ENV.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Accès refusé - Admins uniquement" });
    } 
    next();
};      