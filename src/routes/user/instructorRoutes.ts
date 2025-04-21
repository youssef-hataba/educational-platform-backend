import express from 'express';
import { becomeInstructor } from '../../controllers/user/instructorController';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();


router.post('/become-instructor',protect, becomeInstructor);

export default router;