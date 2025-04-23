import express from 'express';
import { becomeInstructor, updateInstructor } from '../../controllers/user/instructorController';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();


router.post('/become-instructor',protect, becomeInstructor);
router.patch('/update-profile',protect, updateInstructor);

export default router;