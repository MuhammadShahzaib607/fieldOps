import express from 'express';
import { addJobNote, cancelOrderByClient, createJob, deleteJob, getAllJobsForAdmin, getClientJobs, getWorkerJobs, improveJobContent, updateJob, updateJobStatusByWorker } from '../controllers/jobControllers.js';
import { verifyAdmin, verifyClient, verifyWorker } from '../utils/roleMiddlewares.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Admin Routes
router.post('/create', verifyToken, verifyAdmin, createJob);
router.put('/update/:id', verifyToken, verifyAdmin, updateJob);
router.delete('/delete/:id', verifyToken, verifyAdmin, deleteJob);
router.get('/all', verifyToken, verifyAdmin, getAllJobsForAdmin);
router.post('/ai/improve-job-content', verifyToken, improveJobContent);
// Worker Routes
router.get('/my-tasks', verifyToken, verifyWorker, getWorkerJobs);
router.put('/update-my-job-status/:id', verifyToken, verifyWorker, updateJobStatusByWorker);
// Client Routes
router.get('/my-orders', verifyToken, verifyClient, getClientJobs);
router.put('/cancel-my-order/:id', verifyToken, verifyClient, cancelOrderByClient);

router.post('/add-note/:id', verifyToken, addJobNote);

export default router;