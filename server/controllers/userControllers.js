import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendRes } from '../utils/responseHandler.js';

export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return sendRes(res, 400, false, "All fields are required")
        }

        if (password.length < 8) {
            return sendRes(res, 400, false, "Password must be at least 8 characters long")
        }
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return sendRes(res, 400, false, "Username or Email already exists")
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        
        await newUser.save();
         sendRes(res, 200, true, "User registered successfully.")

    } catch (error) {
        sendRes(res, 500, false, "Server Error ", error.message)
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendRes(res, 400, false, "Please provide email and password");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendRes(res, 400, false, "Invalid Credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendRes(res, 400, false, "Invalid Credentials")
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, isVerified: user.isVerified, username: user.username },
            process.env.JWT_SECRET
        );

        const userData = {
                id: user._id,
                username: user.username,
                role: user.role,
                status: user.isVerified,
                token,
            }

            sendRes(res, 200, true, "Login Successfully", userData)

    } catch (error) {
        sendRes(res, 500, false, "Server Error", error.message)
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return sendRes(res, 404, false, "User not found");
        }

        return sendRes(res, 200, true, "User data retrieved successfully", user);
        
    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } })
            .select("-password")
            .sort({ createdAt: -1 });

        return sendRes(res, 200, true, "All users retrieved successfully", users);
        
    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { status, userId } = req.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return sendRes(res, 400, false, "Invalid status value");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isVerified: status },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return sendRes(res, 404, false, "User not found");
        }

        return sendRes(res, 200, true, `User status updated to ${status}`, updatedUser);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};