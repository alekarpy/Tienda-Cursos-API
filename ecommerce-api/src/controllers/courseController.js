import Course from '../models/course.js'

async function getCourses(req, res){
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [courses, total] = await Promise.all([
            Course.find().sort({name: 1}).skip(skip).limit(limit).populate('category'),
            Course.countDocuments()
        ]);

        res.json({
            courses,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error){
        res.status(500).send({error})
    }

}
async function getCourseByID(req, res){
    try {
        const id = req.params.id
        const course = await Course.findById(id).populate('category');
        if(!course){
            return res.status(404).json({message: "Course not found"})
        }
        res.json(course);
    } catch (error){
        res.status(500).send({error})
    }
}
async function getCoursesByCategory(req,res) {
    try{
        const id = req.params.idCategory;
        const courses = await Course.find({category:id}).populate('category').sort({name:1});
        if(courses.lenght===0){
            return res.status(404).json({message:'No courses found on this category'});
        }
        res.json(courses);
    } catch (error){
        res.status(500).json({error})
    }
}

async function createCourse(req, res){
    try {
        const {name, description, price, stock, imageURL, category} = req.body;
        if(!name || !description || !price || !stock || !imageURL || !category){
            return res.status(400).json({error: "All fields are required"});
        }
        const newCourse = await Course.create({name, description, price, stock, imageURL, category});
        res.status(201).json(newCourse)
    } catch (error){
        res.status(500).send({error})
    }
}

async function updateCourse(req, res){
    try {
        const id = req.params.id;
        const {name, description, price, stock, imageURL, category} = req.body;
        if(!name || !description || !price || !stock || !imageURL || !category){
            return res.status(400).json({error: "All fields are required"});
        }
        const updatedCourse = await Course.findByIdAndUpdate(id, {name, description, price, stock, imageURL, category}, {new:true})
        if(!updatedCourse){
            return res.status(404).json({message: 'Course not found'});
        }
        res.status(200).json(updatedCourse)
    } catch (error){
        res.status(500).send({error})
    }
}

async function deleteCourse(req, res){
    try {
        const id = req.params.id;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if(!deletedCourse){
            return res.status(404).json({message: "Course not found"});
        }
        res.status(204).send()
    } catch (error){
        res.status(500).send({error})
    }
}

export {
    getCourses,
    getCourseByID,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByCategory
}