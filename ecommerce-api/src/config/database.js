import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;

        await mongoose.connect(dbURI, {
            // Si usas MongoDB < 8 puedes activar estas opciones:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log("✅ MongoDB is connected");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default dbConnection;
