import express from 'express';
import { becomeInstructor, getInstructorProfile, updateInstructor } from '../../controllers/user/instructorController';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/instructor-profile/:id', getInstructorProfile);

router.use(protect);

router.post('/become-instructor', becomeInstructor);
router.patch('/update-profile', updateInstructor);

export default router;