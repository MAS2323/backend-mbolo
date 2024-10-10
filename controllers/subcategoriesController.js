const Subcategory = require("../models/Subcategory");
const mongoose = require("mongoose");
const path = require("path");

// Configuración de Multer

module.exports = {
  getSubcategoriesByCategory: async (req, res) => {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send("Invalid categoryId format");
    }

    try {
      const subcategories = await Subcategory.find({ category: categoryId });
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSubcategory: async (req, res) => {
   try {
     const {
       name,
       description,
       image,
       location,
       phoneNumber,
       whatsapp,
       pdf,
       category,
     } = req.body;

     if (!name) {
       return res.status(400).json({ error: "Name is required" });
     }

     const subcategory = new Subcategory({
       name,
       description,
       image,
       location,
       phoneNumber,
       whatsapp,
       pdf,
       category,
     });

     await subcategory.save();
     res.status(201).json(subcategory);
   } catch (error) {
     console.error("Error creating subcategory:", error);
     res.status(500).json({ error: error.message });
   }
  },
  getSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      res.status(500).json({ error: "Failed to fetch subcategory" });
    }
  },

  getAllSubcategories: async (req, res) => {
    try {
      const subcategories = await Subcategory.find().lean(); // Use .lean() to get plain JavaScript objects
      subcategories.forEach((subcategory, index) => {
        try {
          JSON.stringify(subcategory);
        } catch (err) {
          console.error(`Error serializing subcategory at index ${index}:`, err);
        }
      });
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Server error while fetching subcategories" });
    }
  },

  updateSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const { name, description, image, location, contact } = req.body;
      const updatedSubcategory = await Subcategory.findByIdAndUpdate(
        subcategoryId,
        { name, description, image, location, contact },
        { new: true }
      );
      if (!updatedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json(updatedSubcategory);
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ error: "Failed to update subcategory" });
    }
  },

  deleteSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const deletedSubcategory = await Subcategory.findByIdAndDelete(
        subcategoryId
      );
      if (!deletedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ error: "Failed to delete subcategory" });
    }
  },

  searchSubcategories: async (req, res) => {
    try {
      const result = await Subcategory.aggregate([
        {
          $search: {
            index: "subcategorias",
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
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Failed to get the subcategories" });
    }
  },
};

module.exports.upload = upload;
