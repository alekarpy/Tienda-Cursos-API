import express from "express";

import  {
    getCourses,
    getCourseByID,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByCategory

} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseByID);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.get('/category/:categoryId', getCoursesByCategory);

export default router;





