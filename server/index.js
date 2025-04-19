import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log environment info
console.log(`Server starting in ${NODE_ENV} mode`);

// MongoDB client
let db;

// Connect to MongoDB
async function connectToMongo() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully');
    db = client.db();
    
    // Create indexes
    await db.collection('components').createIndex({ category: 1 });
    await db.collection('components').createIndex({ name: 1 });
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// API Routes
app.get('/api', (req, res) => {
  res.send('ArDacity Component API is running.');
});


// Get all components
app.get('/api/components', async (req, res) => {
  try {
    const components = await db.collection('components').find().toArray();
    res.json(components);
  } catch (err) {
    console.error('Error fetching components:', err);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Get a single component by ID
app.get('/api/components/:id', async (req, res) => {
  try {
    const component = await db.collection('components').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json(component);
  } catch (err) {
    console.error(`Error fetching component ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

// Get components by category
app.get('/api/components/category/:category', async (req, res) => {
  try {
    const components = await db.collection('components')
      .find({ category: req.params.category })
      .toArray();
    
    res.json(components);
  } catch (err) {
    console.error(`Error fetching components by category ${req.params.category}:`, err);
    res.status(500).json({ error: 'Failed to fetch components by category' });
  }
});

// Create a new component
app.post('/api/components', async (req, res) => {
  try {
    const { name, category, description, variants = [] } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const now = new Date();
    
    // Process variants
    const processedVariants = variants.map(variant => ({
      ...variant,
      _id: new ObjectId(),
      createdAt: now,
      updatedAt: now
    }));
    
    // Create the component
    const result = await db.collection('components').insertOne({
      name,
      category,
      description: description || '',
      variants: processedVariants,
      createdAt: now,
      updatedAt: now
    });
    
    // Check if category exists, if not, create it
    const categoryExists = await db.collection('categories').findOne({ name: category });
    if (!categoryExists) {
      await db.collection('categories').insertOne({
        name: category,
        createdAt: now
      });
    }
    
    // Fetch the created component
    const createdComponent = await db.collection('components').findOne({
      _id: result.insertedId
    });
    
    res.status(201).json(createdComponent);
  } catch (err) {
    console.error('Error creating component:', err);
    res.status(500).json({ error: 'Failed to create component' });
  }
});

// Update an existing component
app.put('/api/components/:id', async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    // Update the component
    await db.collection('components').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          ...(name && { name }),
          ...(category && { category }),
          ...(description !== undefined && { description }),
          updatedAt: new Date()
        }
      }
    );
    
    // Fetch the updated component
    const updatedComponent = await db.collection('components').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!updatedComponent) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json(updatedComponent);
  } catch (err) {
    console.error(`Error updating component ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// Delete a component
// Delete a category
app.delete('/api/categories/:name', async (req, res) => {
  try {
    const categoryName = req.params.name;

    // Check if any component is using this category
    const componentsWithCategory = await db.collection('components').countDocuments({
      category: categoryName
    });

    if (componentsWithCategory > 0) {
      return res.status(400).json({
        error: `Cannot delete category "${categoryName}" because it is used by ${componentsWithCategory} component(s)`
      });
    }

    // Delete the category
    const result = await db.collection('categories').deleteOne({ name: categoryName });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error(`Error deleting category ${req.params.name}:`, err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});


// Create a new variant for a component
app.post('/api/components/:id/variants', async (req, res) => {
  try {
    const { name, description, code, author, deployedLink } = req.body;
    
    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }
    
    const now = new Date();
    const variantId = new ObjectId();
    
    // Add the variant to the component
    await db.collection('components').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          variants: {
            _id: variantId,
            name,
            description: description || '',
            code,
            author: author || 'Anonymous',
            deployedLink: deployedLink || '',
            createdAt: now,
            updatedAt: now
          }
        },
        $set: { updatedAt: now }
      }
    );
    
    // Get the created variant
    const component = await db.collection('components').findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { 'variants': { $elemMatch: { _id: variantId } } } }
    );
    
    if (!component || !component.variants || component.variants.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    
    res.status(201).json(component.variants[0]);
  } catch (err) {
    console.error(`Error creating variant for component ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to create variant' });
  }
});

// Update an existing variant
app.put('/api/components/:id/variants/:variantId', async (req, res) => {
  try {
    const { name, description, code, author, deployedLink } = req.body;
    const now = new Date();
    
    // Update fields to set
    const updateFields = {};
    if (name) updateFields['variants.$.name'] = name;
    if (description !== undefined) updateFields['variants.$.description'] = description;
    if (code) updateFields['variants.$.code'] = code;
    if (author) updateFields['variants.$.author'] = author;
    if (deployedLink !== undefined) updateFields['variants.$.deployedLink'] = deployedLink;
    updateFields['variants.$.updatedAt'] = now;
    updateFields['updatedAt'] = now;
    
    // Update the variant
    const result = await db.collection('components').updateOne(
      { 
        _id: new ObjectId(req.params.id),
        'variants._id': new ObjectId(req.params.variantId)
      },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Component or variant not found' });
    }
    
    // Get the updated variant
    const component = await db.collection('components').findOne(
      { 
        _id: new ObjectId(req.params.id),
        'variants._id': new ObjectId(req.params.variantId)
      },
      { projection: { 'variants': { $elemMatch: { _id: new ObjectId(req.params.variantId) } } } }
    );
    
    if (!component || !component.variants || component.variants.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    
    res.json(component.variants[0]);
  } catch (err) {
    console.error(`Error updating variant ${req.params.variantId}:`, err);
    res.status(500).json({ error: 'Failed to update variant' });
  }
});

// Delete a variant
app.delete('/api/components/:id/variants/:variantId', async (req, res) => {
  try {
    const result = await db.collection('components').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $pull: { variants: { _id: new ObjectId(req.params.variantId) } },
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.status(204).end();
  } catch (err) {
    console.error(`Error deleting variant ${req.params.variantId}:`, err);
    res.status(500).json({ error: 'Failed to delete variant' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.collection('categories').find().toArray();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const result = await db.collection('categories').insertOne({
      name,
      createdAt: new Date()
    });
    
    const createdCategory = await db.collection('categories').findOne({
      _id: result.insertedId
    });
    
    res.status(201).json(createdCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete a category
app.delete('/api/categories/:name', async (req, res) => {
  try {
    // First check if there are components using this category
    const componentsWithCategory = await db.collection('components').countDocuments({
      category: req.params.name
    });
    
    if (componentsWithCategory > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category because it contains components. Delete the components first.' 
      });
    }
    
    const result = await db.collection('categories').deleteOne({
      name: req.params.name
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(204).end();
  } catch (err) {
    console.error(`Error deleting category ${req.params.name}:`, err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Start the server
async function startServer() {
  await connectToMongo();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);