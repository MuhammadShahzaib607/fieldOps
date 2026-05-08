import Job from '../models/Job.js';
import { sendRes } from '../utils/responseHandler.js';
import Groq from "groq-sdk";
import dotenv from "dotenv"

dotenv.config();

const groq = new Groq({ apiKey: process.env.API_KEY });

export const addJobNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return sendRes(res, 400, false, "Note text is required");
        }

        const job = await Job.findById(id);
        if (!job) {
            return sendRes(res, 404, false, "Job not found");
        }

        const now = new Date();
        const datePart = now.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        }).replace(/ /g, '-');
        
        const timePart = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        }).toLowerCase(); 

        const formattedDate = `${datePart} ${timePart}`;

        const newNote = {
            senderRole: req.user.role,
            text: text,
            time: formattedDate,
            senderName: req.user.username
        };

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $push: { notes: newNote } },
            { new: true }
        );

        return sendRes(res, 200, true, "Note added successfully", updatedJob.notes);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

// Admin Controllers 

export const createJob = async (req, res) => {
    try {
        const { title, description, workerId, clientId, phone, location } = req.body;

        if (!title || !description || !workerId || !clientId || !phone || !location) {
            return sendRes(res, 400, false, "All fields are required to create a job");
        }

        const newJob = new Job({
            title,
            description,
            createdBy: req.user.id,
            workerId,
            clientId,
            phone,
            location
        });

        await newJob.save();
        return sendRes(res, 201, true, "Job created and assigned successfully", newJob);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const job = await Job.findById(id);
        if (!job) {
            return sendRes(res, 404, false, "Job not found");
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return sendRes(res, 200, true, "Job updated successfully", updatedJob);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);
        if (!job) {
            return sendRes(res, 404, false, "Job not found");
        }

        await Job.findByIdAndDelete(id);

        return sendRes(res, 200, true, "Job deleted successfully");

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const getAllJobsForAdmin = async (req, res) => {
    try {
        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username') 
            .populate('workerId', 'username email')
            .populate('clientId', 'username email');

        return sendRes(res, 200, true, "All jobs retrieved successfully for Admin", jobs);
        
    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const improveJobContent = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return sendRes(res, 400, false, "Original title is required");
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a service coordination assistant for a task management app. 
                    The title and description are for a 'Job Card' assigned to a technician/worker.

                    Rules:
                    1. Keep the same language (English or Roman Urdu).
                    2. Max title length: 4-6 words. It should be a direct task (e.g., 'AC Service & Gas Refill' instead of 'Expert Cooling Solutions').
                    3. Description: Max 20 words. Focus on 'What needs to be done' (e.g., 'Check cooling, clean filters, and fix noise issues').
                    4. Tone: Professional, direct, and action-oriented. No marketing fluff.
                    5. Return ONLY a JSON object: {"improvedTitle": "...", "description": "..."}`
                },
                {
                    role: "user",
                    content: `Improve this service title: ${title}`
                }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);

        return sendRes(res, 200, true, "AI Content generated", aiResponse);

    } catch (error) {
        return sendRes(res, 500, false, "AI Error", error.message);
    }
};

// Worker Controllers

export const getWorkerJobs = async (req, res) => {
    try {
        const workerId = req.user.id;

        const jobs = await Job.find({ workerId: workerId })
            .sort({ createdAt: -1 })
            .populate('clientId', 'username email')
            .populate('createdBy', 'username');

        return sendRes(res, 200, true, "Worker jobs retrieved successfully", jobs);
        
    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const updateJobStatusByWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ['pending', 'in-progress', 'completed', 'cancelled'];

        if (!status || !allowedStatus.includes(status)) {
            return sendRes(res, 400, false, "Invalid status. Please provide a valid status.");
        }

        const job = await Job.findById(id);

        if (!job) {
            return sendRes(res, 404, false, "Job not found");
        }

        if (job.workerId.toString() !== req.user.id) {
            return sendRes(res, 403, false, "Access denied. You are not assigned to this job.");
        }

        let updateData = { status: status };

        if (status === 'completed') {
            updateData.completedAt = new Date();
        } else {
            updateData.$unset = { completedAt: "" };
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return sendRes(res, 200, true, `Job status updated to ${status}`, updatedJob);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

// Client Controllers 

export const getClientJobs = async (req, res) => {
    try {
        const clientId = req.user.id;

        const jobs = await Job.find({ clientId: clientId })
            .sort({ createdAt: -1 })
            .populate('workerId', 'username')
            .populate('clientId', 'username')
            .populate('createdBy', 'username');

        return sendRes(res, 200, true, "Your jobs retrieved successfully", jobs);
        
    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};

export const cancelOrderByClient = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findOne({ _id: id, clientId: req.user.id });

        if (!job) {
            return sendRes(res, 404, false, "Job not found or you are not authorized to cancel this order");
        }

        if (job.status === 'completed') {
            return sendRes(res, 400, false, "Completed jobs cannot be cancelled");
        }

        // Status update
        job.status = 'cancelled';
        await job.save();

        return sendRes(res, 200, true, "Order cancelled successfully", job);

    } catch (error) {
        return sendRes(res, 500, false, "Server Error", error.message);
    }
};