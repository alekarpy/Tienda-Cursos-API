// src/utils/seedData.js
import mongoose from 'mongoose';
import Course from '../models/course.js';
import Category from '../models/category.js';
import dbConnection from "../config/database.js";

const MONGO_URI = 'mongodb://localhost:27017/ecommerce-db'; // Cambia por tu URI

async function seed() {
    await mongoose.connect(MONGO_URI);

    await Course.deleteMany({});
    await Category.deleteMany({});

    const categories = await Category.insertMany([
        { name: 'Programación' },
        { name: 'Diseño' },
        { name: 'Marketing' }
    ]);

    const courses = [
        {
            name: 'JavaScript Básico',
            description: 'Aprende JS desde cero',
            price: 50,
            stock: 20,
            imageURL: 'https://ejemplo.com/js.png',
            category: categories[0]._id
        },
        {
            name: 'Diseño UX',
            description: 'Principios de UX',
            price: 70,
            stock: 15,
            imageURL: 'https://ejemplo.com/ux.png',
            category: categories[1]._id
        },
        {
            name: 'SEO para principiantes',
            description: 'Optimiza tu web',
            price: 40,
            stock: 10,
            imageURL: 'https://ejemplo.com/seo.png',
            category: categories[2]._id
        }
    ];

    await Course.insertMany(courses);

    console.log('Datos de prueba insertados');
    mongoose.disconnect();
}

seed();