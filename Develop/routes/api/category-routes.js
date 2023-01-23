const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const productData = await Category.findAll();
    res.status(200).json(productData);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const oneCategory = await Category.findByPk(req.params.id, { include: [{model: Product}]  });
    res.status(200).json(oneCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory)
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(updateCategory)
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error)
  }
  
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCategory = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!deleteCategory) {
      res.status(404).json({ message: 'There is no category9 assigned to the id that you provided' });
      return;
    }
    res.status(200).json(deleteCategory);
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error);
  }
});

module.exports = router;
