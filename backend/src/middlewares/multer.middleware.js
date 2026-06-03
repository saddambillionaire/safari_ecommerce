import multer from "multer";
import path from "path";
// cb => callback function, used in multer configuration to specify the destination and filename for uploaded files
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".jpg", ".jpeg", ".png", ".webp"];
        const unique = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${unique}${safeExt}`);  //
    }
});

// file filter : jpg, png, jpeg,webp
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extensionName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extensionName && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("seules les images de type jpg, png ou webp sont autorisées"), false);
    }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // Limite de 5MB pour les fichiers téléchargés
