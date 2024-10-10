const Product = require("../models/Products");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = {
  createProduct: async (req, res) => {
    // const newProduct = new Product(req.body);
    // try {
    //   await newProduct.save();
    //   res.status(200).json("product created successfully");
    // } catch (error) {
    //   res.status(500).json("failed to create the product");
    // }
    try {
      const {
        title,
        supplier,
        price,
        product_location,
        description,
        userId,
        phoneNumber,
        imageUrl,
        whatsapp,
      } = req.body;

      // Verificar que el userId esté presente en el cuerpo de la solicitud
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      // Verificar que el userId tenga el formato correcto de ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }

      // Verificar que el usuario exista
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Crear el nuevo producto
      const newProduct = new Product({
        title,
        supplier,
        price,
        images: imageUrl,
        product_location,
        description,
        phoneNumber,
        whatsapp,
        user: userId, // Asociar el producto con el usuario
      });

      // Guardar el producto en la base de datos
      const savedProduct = await newProduct.save();

      // Añadir el producto al array de productos del usuario
      await User.findByIdAndUpdate(userId, {
        $push: { products: savedProduct._id },
      });

      res.status(201).json(savedProduct);
    } catch (err) {
      console.error("Error al crear el producto:", err); // Mostrar detalles del error en la consola
      res
        .status(500)
        .json({ error: "Failed to create the product", details: err.message }); // Enviar detalles del error en la respuesta
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("failed to get the products");
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("failed to get the product");
    }
  },

  searchProduct: async (req, res) => {
    try {
      const result = await Product.aggregate([
        {
          $search: {
            index: "mbolo_app",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to get the products" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json("product not found");
      }
      res.status(200).json("product deleted successfully");
    } catch (error) {
      res.status(500).json("failed to delete the product");
    }
  },
};
