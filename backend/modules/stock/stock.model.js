import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["in", "out", "adjustment"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    previousQty: {
      type: Number,
      required: true,
    },

    newQty: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

export default StockMovement;