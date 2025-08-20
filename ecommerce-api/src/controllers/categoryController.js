import Category from '../models/category.js';

async function getCategories(req, res) {
    try{
        const categories = await Category.find().populate('parentCategory').sort({ name: 1}); //populate es para que me traiga los datos de la categoria
        res.status(200).json(categories);

    }catch (error) {
        res.status(500).send({error});
    }
}


async function getCategoryById(req, res) {
    try {
        const category = await Category.findById(req.params.id).populate('parentCategory');
        if (!category) {
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).send({error});
    }
}

//const getCategoryById = async (req, res) => {} // se puede usar async/await de esta manera. Es igual


async function createCategory(req, res) {
    try {
        const {name, description, parentCategory, imageURL} = req.body;
        const newCategory = new Category ({
            name,
            description,
            parentCategory: parentCategory || null,
            imageURL: imageURL || null,
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).send({error});
    }
}


async function updateCategory(req, res) {
    try {
        const {name, description, parentCategory, imageURL} = req.body;
        const idCategory = req.params.id;

        const updatedCategory = await Category.findByIdAndUpdate(idCategory, {
            name, description, parentCategory, imageURL},
            {new: true}
            );

        if(!updatedCategory) {
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json(updatedCategory);

    } catch (error) {
        res.status(500).send({error});
    }
};

async function getProductsByCategory(req, res) {
    try {
        const category = await Category.findById(req.params.id).populate('products');
        if (!category) {
            return res.status(404).json({message: "Categoria no encontrada"});
        }
        res.status(200).json(category.products);
    } catch (error) {
        res.status(500).send({error});
    }
}

async function deleteCategory(req, res) {
    try {
        const idCategory = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(idCategory);
        if(!deletedCategory) {
            return res.status(404).json({message: "Category not found"});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({error});
    }
}


export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory
}


