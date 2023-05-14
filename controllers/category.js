/* eslint-disable consistent-return */
const categoryModel = require('../model/categoryModel');

exports.getAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.json({ category, success: true });
  } catch (error) {
    return res
      .status(404)
      .send({ message: error.message, success: false });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body.data;
    const category = await categoryModel.findOne({ name });
    if (category) {
      return res.status(400).send({ message: 'these category already exist', success: false });
    }
    // eslint-disable-next-line new-cap
    const newCategory = new categoryModel({
      name,
      description,
    });
    newCategory.save();
    return res
      .status(200).send({ message: 'Category saved successfully', success: true });
  } catch (error) {
    return res.status(404).send({ message: 'something went wrong', success: false });
  }
};
exports.editCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const editedCategory = await categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: { name: req.body.name, description: req.body.description } },
    );
    if (editedCategory) {
      return res.json({ success: true, message: 'Category updated successfully' });
    }
    return res.json({ message: 'Category not updated successfully', success: false });
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await categoryModel.deleteOne({ _id: id });
    if (deletedCategory) {
      return res.json({ success: true, message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.getExactCategoryAsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const exactCategory = await categoryModel.findOne({ _id: id });
    if (exactCategory) {
      return res.json({ exactCategory, success: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};
