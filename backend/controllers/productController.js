import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Controller function for adding a product
const addProduct = async (req, res) => {
    try {
        // Trim keys to remove unexpected spaces
        const body = Object.fromEntries(
            Object.entries(req.body).map(([key, value]) => [key.trim(), value])
        );

        console.log("Received request body:", body); // Debugging
        console.log("Received files:", req.files); // Debugging

        const { name, description, price, category, subCategory, sizes, popular } = body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Convert price safely
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid price value" });
        }

        // Ensure sizes is properly parsed
        let parsedSizes = [];
        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
            if (!Array.isArray(parsedSizes)) throw new Error();
        } catch (e) {
            return res.status(400).json({ success: false, message: "Invalid sizes format" });
        }

        // Extract images if provided
        const images = req.files ? ["image1", "image2", "image3", "image4"]
            .map(key => req.files[key]?.[0])
            .filter(img => img !== undefined) : [];

        // Upload images to Cloudinary or use a default image
        let imagesUrl = ["https://via.placeholder.com/150"];
        if (images.length > 0) {
            try {
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                        return result.secure_url;
                    })
                );
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        // Create product data
        const productData = {
            name,
            description,
            price: parsedPrice,
            category,
            subCategory,
            popular: popular === "true",
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now(),
        };

        // Save product to database
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller function for removing a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller function for getting details of a single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller function for listing all products
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, removeProduct, singleProduct, listProduct };