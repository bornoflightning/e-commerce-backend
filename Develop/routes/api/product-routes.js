const router = require('express').Router();
const { reset } = require('nodemon');
const { Product, Category, Tag, ProductTag } = require('../../models');


// this route gets all the products
router.get('/', async (req, res) => {
  
  try {
    const allProducts = await Product.findAll({include: [ Category,{ model: Tag, through: Tag}]});
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error);    
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const oneProduct = await Product.findByPk( req.params.id, { include: [ Category,{ model: Tag, through: Tag}]});
    if (!oneProduct) {
      res.status(404).json({message : 'The product requested was not found, please try again with the correct info'});
      return;
    }
    res.status(200).json(oneProduct);

  } catch (error) {
    res.status(505).json("There was an error, here are the details: " + error);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body).then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((error) => {
      console.log(error);
      res.status(400).json("There was an error, here are the details: " + error);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((error) => {
      // console.log(err);
      res.status(400).json("There was an error, here are the details: " + error);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteProduct = await Product.destroy({
      where: { id: req.params.id }
    });
    if (!deleteProduct) {
      res.status(404).json({ message: 'The product requested was not found, please try again with the correct info' });
      return;
    }
    res.status(200).json({message: 'You succesfully deleted the product'});
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " +error);
  }
});

module.exports = router;
