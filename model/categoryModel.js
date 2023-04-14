const mongoose = require('mongoose');

// const { ObjectId } = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;
