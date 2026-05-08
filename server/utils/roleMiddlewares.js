import { sendRes } from "./responseHandler.js";

export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return sendRes(res, 403, false, "Access denied. Admin resource only.");
    }
};

export const verifyWorker = (req, res, next) => {
    if (req.user && req.user.role === 'worker') {
        next();
    } else {
        return sendRes(res, 403, false, "Access denied. Worker resource only.");
    }
};

export const verifyClient = (req, res, next) => {
    if (req.user && req.user.role === 'client') {
        next();
    } else {
        return sendRes(res, 403, false, "Access denied. Client resource only.");
    }
};