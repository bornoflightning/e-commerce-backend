const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({include : [{model: Product, through: ProductTag}]});
    res.status(200).json(allTags);
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error);
    
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const singleTag = await Tag.findByPk(req.params.id, { include: [{model: Product, through : ProductTag}]});
    res.status(200).json(singleTag);
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag)
  } catch (error) {
    res.status(500).json("There was an error, here are the details: " + error);
  }

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
try {
  const currentId = req.params.id
  const updatedTag = Tag.update(req.body, {where: {id: currentId}});
  if (!currentId) {
    res.status(404).json({message : 'The product requested was not found, please try again with the correct info'});
    return;
  }
  res.status(200).json(updatedTag);
} catch (error) {
  res.status(500).json("There was an error, here are the details: " + error);
}
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
try {
  const deleteTag = await Tag.destroy({where: {id: req.params.id}});
  if (!deleteTag) {
    res.status(404).json({message : 'The product requested was not found, please try again with the correct info'});
    return;
  }
  res.status(200).json(deleteTag);
} catch (error) {
  res.status(500).json("There was an error, here are the details: " + error);
}
});

module.exports = router;
