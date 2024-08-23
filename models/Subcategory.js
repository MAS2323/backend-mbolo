const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  whatsapp: { type: String, required: true },
  image: { type: String, required: true },
  pdf: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorites",
      required: true,
    },
  ],
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
