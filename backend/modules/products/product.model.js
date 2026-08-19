import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    dimensions: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    productImages: {
      type: [String],
      default: [],
    },

    totalQty: {
      type: Number,
      required: true,
      min: 0,
    },

    minHours: {
      type: Number,
      required: true,
      min: 1,
    },

    pricing: {
      hourly: {
        type: Number,
        required: true,
        min: 0,
      },

      halfDay: {
        type: Number,
        required: true,
        min: 0,
      },

      fullDay: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    availability: {
      type: Boolean,
      default: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;