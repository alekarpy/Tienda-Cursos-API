import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  {
    name: 'Desarrollo Web',
    description: 'Aprende a desarrollar aplicaciones web profesionales'
  },
  {
    name: 'Ciencia de Datos',
    description: 'Análisis de datos, visualización y aprendizaje automático'
  },
  {
    name: 'Diseño Gráfico',
    description: 'Crea gráficos y diseños creativos para la web'
  },
  {
    name: 'Marketing',
    description: 'Aprende a crear campañas de marketing online'
  },
];

const products = [
  {
    title: 'Javascript Avanzado: Domínalo Como Un Master',
    description: 'Domina los conceptos avanzados de Javascript de la mano de un experto a través de ejercicios prácticos',
    price: 1899,
    instructor: 'Luis Cruz',
    duration: 25,
    level: 'avanzado',
    students: 1002,
    rating: 4.8,
      category: 'Desarrollo Web'

  },
  {
    title: 'React: Crea Aplicaciones Web de Alto Nivel',
    description: 'Aprende a crear aplicaciones web de alto nivel con React y sus herramientas asociadas',
    price: 899,
    instructor: 'María Martínez',
    duration: 30,
    level: 'principiante',
    students: 200,
    rating: 5,
      category: 'Desarrollo Web'
  },
  {
    title: 'Python Total: Analiza Datos En Tiempo Real',
    description: 'Aprende a analizar datos en tiempo real con Python y librerías como Pandas y Matplotlib',
    price: 299,
    instructor: 'Miguel González',
    duration: 35,
    level: 'principiante',
    students: 4200,
    rating: 5,
      category: 'Ciencia de Datos'
  },
  {
    title: 'Angular: Crea Aplicaciones Web Complejas',
    description: 'Aprende a crear aplicaciones web complejas con Angular y a utilizar como un experto este framework de desarrollo web',
    price: 1999,
    instructor: 'Sarah Campos',
    duration: 15,
    level: 'avanzado',
    students: 1000,
    rating: 4.5,
      category: 'Desarrollo Web'
  },
  {
    title: 'Consumo de APIS: Aprende con Node.JS',
    description: 'Aprende a consumir APIS con Node.JS y a utilizar librerías como Axios y Fetch',
    price: 499,
    instructor: 'David Brown',
    duration: 40,
    level: 'intermedio',
    students: 120,
    rating: 1.5,
      category: 'Desarrollo Web'
  },
  {
    title: 'Diseño de Interfaces: Aprende con Figma',
    description: 'Aprende a diseñar interfaces con Figma y a utilizar como un experto este herramienta de diseño',
    price: 1100,
    instructor: 'Emily Carvalho',
    duration: 28,
    level: 'principiante',
    students: 2300,
    rating: 5,
      category: 'Diseño Gráfico'
  },
  {
    title: 'Desarrollo de Aplicaciones Móviles: Aprende con React Native',
    description: 'Aprende a desarrollar aplicaciones móviles con React Native y a utilizar como un experto este framework de desarrollo web',
    price: 1380,
    instructor: 'Alex Rodriguez',
    duration: 22,
    level: 'avanzado',
    students: 1320,
    rating: 4.3,
      category: 'Desarrollo Web'
  },
  {
    title: 'Marketing Digital: Aprende con Google Analytics',
    description: 'Aprende a utilizar Google Analytics y a analizar datos para mejorar tus estrategias de marketing digital',
    price: 299,
    instructor: 'Roberto Palacios',
    duration: 32,
    level: 'intermedio',
    students: 1500,
    rating: 3.8,
      category: 'Marketing'
  },
  {
    title: 'SQL : Aprende a Utilizar Bases de Datos',
    description: 'Aprende a utilizar bases de datos con SQL y a transformar tus datos en información valiosa para tu empresa',
    price: 399,
    instructor: 'Lisa Garcia',
    duration: 26,
    level: 'principiante',
    students: 1000,
    rating: 5,
      category: 'Desarrollo Web'
  },
  {
    title: 'Power Bi : Aprende a Crear Informes para tu Negocio',
    description: 'Aprende a crear informes con Power Bi y a utilizar como un expert o esta herramienta de análisis de datos',
    price: 499,
    instructor: 'Kevin Martinez',
    duration: 45,
    level: 'intermedio',
    students: 1200,
    rating: 4.9,
      category: 'Ciencia de Datos'
  },
  {
    title: 'Conoce a tu Cliente: Aprende a Crear Personas',
    description: 'Aprende a crear personas y a utilizar como un experto esta herramienta de diseño de personas',
    price: 399,
    instructor: 'Maria Rodriguez',
    duration: 30,
    level: 'principiante',
    students: 800,
    rating: 2.2,
      category: 'Marketing'
  },
  {
    title: 'Ilustrator : Conviértete en un Gran Ilustrador',
    description: 'Aprende a utilizar Illustrator y a transformar tus ideas en imágenes',
    price: 422,
    instructor: 'Carlos Perez',
    duration: 24,
    level: 'principiante',
    students: 1200,
    rating: 4.9,
      category: 'Diseño Gráfico'
  },
  {
    title: 'Fotografía Creativa: Vuélvete un Gran Fotógrafo',
    description: 'Aprende a utilizar una cámara profesional y aprende técnicas de fotografía actuales',
    price: 1333,
    instructor: 'Ana Lopez',
    duration: 35,
    level: 'intermedio',
    students: 200,
    rating: 3.6,
      category: 'Diseño Gráfico'
  },
];

const users = [
  {
      username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
      unsername: 'karla',
    email: 'karla@example.com',
    password: 'password123',
    role: 'cliente'
  },
  {
      username: 'selene',
    email: 'selene@example.com',
    password: 'password123',
    role: 'cliente'
  },
  {
      username: 'juanito',
    email: 'juan@example.com',
    password: 'password123',
    role: 'cliente'
  },
  {
      username:'maria',
    email: 'maria@example.com',
    password: 'password123',
    role: 'cliente'
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    console.log('Elementos eliminados');
    
    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categorías creadas');
    
    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

      // Prepare products with correct category IDs
      const productsWithCategoryIds = products.map(product => {
          return {
              ...product,
              category: categoryMap[product.category] // Replace name with ID
          };
      });


      // Insert products with correct category IDs
      await Product.insertMany(productsWithCategoryIds);
      console.log('Cursos añadidos');


      // Insert users
    await User.insertMany(users);
    console.log('Usuarios Añadidos');
    
    console.log('Datos de la base de datos cargados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al cargar los datos en la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();