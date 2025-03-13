require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"], // Explicitly allow 'x-user-id'
    credentials: true, // If using authentication tokens
  })
);


// ------------------------------------------------------------------
// 1) CONNECT TO MONGODB
// ------------------------------------------------------------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ------------------------------------------------------------------
// 2) DEFINE MONGOOSE SCHEMAS & MODELS
// ------------------------------------------------------------------

// Users
const userSchema = new mongoose.Schema({
  principalId: { type: String, unique: true, required: true },
});
const User = mongoose.model('User', userSchema);

// Stores
const storeSchema = new mongoose.Schema({
  name: String
});
const Store = mongoose.model('Store', storeSchema);

// Vendor Models: For the vendor’s AI models

const vendorModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  apiEndpoint: { type: String, required: true },
  userId: { type: String, required: true },
  image: { type: String, default: "" },
  status: { type: String, default: "Live" },
  wallet_principal_id: { type: String, required: true }, 
});

const VendorModel = mongoose.model('VendorModel', vendorModelSchema);

// Marketplace Models (publicly visible models, different from vendor’s own)

const marketplaceModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, default: "" },
  wallet_principal_id: { type: String, required: true }, 
});

const MarketplaceModel = mongoose.model('MarketplaceModel', marketplaceModelSchema);

// Transactions (deposits, withdrawals, purchases, etc.)
const transactionSchema = new mongoose.Schema({
  userId: String,      // Reference to the User
  modelId: String,     // ✅ Ensure Model ID is saved
  amount: Number,
  type: String         // 'purchase', 'deposit', etc.
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// ------------------------------------------------------------------
// 3) AUTHENTICATION MIDDLEWARE
// ------------------------------------------------------------------
function authenticate(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing x-user-id header' });
  }
  req.userId = userId;
  next();
}


// ------------------------------------------------------------------
// 7) USER ACCOUNT ENDPOINTS (Auth / Profile)
// ------------------------------------------------------------------

/**
 * /api/auth/register [POST]
 * /api/auth/login    [POST]
 * /api/auth/logout   [POST]
 * /api/auth/refresh  [POST]
 */
app.post('/api/auth/register', (req, res) => {
  // Stub
  res.json({ message: 'Register endpoint (stub)' });
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { principalId } = req.body;

    if (!principalId) {
      return res.status(400).json({ error: '❌ Missing principal ID' });
    }

    // 🔄 Upsert: If user exists, return it. Otherwise, create a new one.
    const user = await User.findOneAndUpdate(
      { principalId },  // Find by principalId
      { principalId },  // If not found, create new user
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ User logged in: ${principalId}`);

    return res.json({ message: '✅ User authenticated', user });

  } catch (error) {
    console.error("❌ Error during login:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ IMPORTANT: Apply Authentication Middleware AFTER Login Route
function authenticate(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(401).json({ error: '❌ Unauthorized: Missing x-user-id header' });
  }
  req.userId = userId;
  next();
}


app.post('/api/auth/logout', (req, res) => {
  // Stub
  res.json({ message: 'Logout endpoint (stub)' });
});
app.post('/api/auth/refresh', (req, res) => {
  // Stub
  res.json({ message: 'Token refresh endpoint (stub)' });
});

/**
 * /api/users/profile [GET, PUT]
 */
app.route('/api/users/profile')
  // GET: fetch user profile
  .get(async (req, res) => {
    try {
      // If you actually store userId in the DB, you can do:
      const user = await User.findOne({ _id: req.userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  // PUT: update user profile
  .put(async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// ------------------------------------------------------------------
// 4) APPLY GLOBAL MIDDLEWARE
// ------------------------------------------------------------------
// Apply authentication only to protected routes
app.use('/api/vendor', authenticate);
app.use('/api/users', authenticate);
app.use('/api/billing', authenticate);
// ❌ Do NOT apply authentication to marketplace routes!

// ------------------------------------------------------------------
// 5) VENDOR API ENDPOINTS
// ------------------------------------------------------------------

/**
 * /api/vendor/dashboard-stats [GET]
 */
app.get('/api/vendor/dashboard-stats', async (req, res) => {
  // For demo, return static stats
  const response = {
    totalRevenue: 1234,
    activeUsers: 573,
    apiCalls: 12234,
    revenueChange: 20.1,
    userChange: 201,
    apiCallsChange: 19
  };
  res.json(response);
});

/**
 * /api/vendor/models [GET, POST]
 */
app.get('/api/vendor/models', async (req, res) => {
  try {
    const models = await VendorModel.find({ userId: req.userId });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/vendor/models", async (req, res) => {
  try {
    const { name, description, category, price, apiEndpoint, image, wallet_principal_id } = req.body;

    if (!name || !description || !category || !price || !apiEndpoint || !wallet_principal_id) {
      return res.status(400).json({ error: "❌ Missing required fields, including wallet principal ID" });
    }

    const newModel = new VendorModel({
      name,
      description,
      category,
      price,
      apiEndpoint,
      userId: req.userId,
      image: image || "https://picsum.photos/seed/model4/400/300",
      wallet_principal_id, 
    });

    await newModel.save();

    const newMarketplaceModel = new MarketplaceModel({
      name,
      description,
      category,
      price,
      image: image || "https://picsum.photos/seed/model4/400/300",
      wallet_principal_id,
    });

    await newMarketplaceModel.save();

    res.status(201).json({ vendorModel: newModel, marketplaceModel: newMarketplaceModel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * /api/vendor/models/:id [GET, PUT, DELETE]
 */
app.route('/api/vendor/models/:id')
  // GET: Retrieve specific model
  .get(async (req, res) => {
    try {
      const model = await VendorModel.findById(req.params.id);
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  // PUT: Update specific model and sync changes to MarketplaceModel
  .put(async (req, res) => {
    try {
      console.log("📡 Update request received:", req.body);

      const updatedModel = await VendorModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedModel) {
        return res.status(404).json({ error: 'Model not found' });
      }

      // Update the corresponding Marketplace model
      const updatedMarketplaceModel = await MarketplaceModel.findOneAndUpdate(
        { name: updatedModel.name, wallet_principal_id: updatedModel.wallet_principal_id },
        { 
          $set: {
            name: updatedModel.name,
            description: updatedModel.description,
            category: updatedModel.category,
            price: updatedModel.price,
            image: updatedModel.image
          }
        },
        { new: true }
      );

      console.log("✅ Vendor model updated:", updatedModel);
      console.log("✅ Marketplace model updated:", updatedMarketplaceModel);

      res.json({ vendorModel: updatedModel, marketplaceModel: updatedMarketplaceModel });

    } catch (error) {
      console.error("❌ Error updating model:", error);
      res.status(500).json({ error: error.message });
    }
  })
  // DELETE: Delete specific model and remove from MarketplaceModel
  .delete(async (req, res) => {
    try {
      const deletedVendorModel = await VendorModel.findByIdAndDelete(req.params.id);

      if (!deletedVendorModel) {
        return res.status(404).json({ error: 'Model not found' });
      }

      // Also delete from MarketplaceModel
      const deletedMarketplaceModel = await MarketplaceModel.findOneAndDelete({
        name: deletedVendorModel.name,
        wallet_principal_id: deletedVendorModel.wallet_principal_id
      });

      console.log("✅ Vendor model deleted:", deletedVendorModel);
      console.log("✅ Marketplace model deleted:", deletedMarketplaceModel);

      res.json({ message: 'Model deleted successfully' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


/**
 * /api/vendor/models/:id/stats [GET]
 */
app.get('/api/vendor/models/:id/stats', async (req, res) => {
  try {
    const model = await VendorModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    // Dummy stats example
    const stats = {
      modelId: model._id,
      apiCallsLast30Days: 1200,
      revenueLast30Days: 12.34,
      trending: true
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/vendor/revenue/history [GET]
 */
app.get('/api/vendor/revenue/history', async (req, res) => {
  // Return dummy data for now
  const history = [
    { date: '2023-01-01', revenue: 10 },
    { date: '2023-02-01', revenue: 15 },
    { date: '2023-03-01', revenue: 20 }
  ];
  res.json(history);
});

/**
 * /api/vendor/models/:id/deploy [POST]
 */
app.post('/api/vendor/models/:id/deploy', async (req, res) => {
  try {
    const model = await VendorModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    model.status = 'Live';
    await model.save();
    res.json({ message: `Model ${model.name} deployed to production`, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/vendor/models/:id/versions [GET]
 */
app.get('/api/vendor/models/:id/versions', async (req, res) => {
  // Dummy version data
  const versions = [
    { version: '1.0', deployedAt: '2023-01-01' },
    { version: '1.1', deployedAt: '2023-02-15' }
  ];
  res.json(versions);
});

/**
 * /api/vendor/models/:id/rollback [POST]
 */
app.post('/api/vendor/models/:id/rollback', async (req, res) => {
  // Dummy response
  res.json({ message: `Model ${req.params.id} rolled back successfully` });
});

// ------------------------------------------------------------------
// 6) MARKETPLACE API ENDPOINTS
// ------------------------------------------------------------------

/**
 * /api/marketplace/models [GET]
 */
app.get('/api/marketplace/models', async (req, res) => {
  try {
    const models = await MarketplaceModel.find({});
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/marketplace/models/:id', async (req, res) => {
  try {
    const model = await MarketplaceModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }    
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * /api/marketplace/models/featured [GET]
 */
app.get('/api/marketplace/models/featured', async (req, res) => {
  // For demo, just return the first one or some random selection
  try {
    const all = await MarketplaceModel.find({});
    const featured = all.slice(0, 1);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/marketplace/models/categories [GET]
 */
app.get('/api/marketplace/models/categories', (req, res) => {
  // Hardcoded for now
  const categories = ['NLP', 'Image Generation', 'Speech Recognition', 'Analytics'];
  res.json(categories);
});

/**
 * /api/marketplace/models/search [GET]
 * Query param: ?q=...
 */
app.get('/api/marketplace/models/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing query param ?q=' });
  }
  try {
    // Simple $or search by name or category
    const matches = await MarketplaceModel.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') }
      ]
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/marketplace/models/:id/purchase [POST]
 */
app.post('/api/marketplace/models/:id/purchase', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.header("x-user-id"); // ✅ Capture User ID from request

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid model ID" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const model = await MarketplaceModel.findById(id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    if (!model.wallet_principal_id) {
      return res.status(400).json({ error: "No recipient wallet found for this model" });
    }

    const numericPrice = parseFloat(model.price) || 0;

    // ✅ Check if user already purchased the model
    const existingPurchase = await Transaction.findOne({ userId, modelId: id, type: "purchase" });
    if (existingPurchase) {
      return res.status(400).json({ error: "User already purchased this model" });
    }

    // ✅ Save purchase transaction with modelId included
    const newTx = new Transaction({
      userId, 
      modelId: id,  // ✅ Ensures `modelId` is saved in MongoDB
      amount: numericPrice,
      type: "purchase",
    });

    await newTx.save();

    console.log(`✅ Purchase recorded: Model ID: ${id} | User ID: ${userId}`);

    res.json({
      message: `Model "${model.name}" purchased successfully`,
      wallet_principal_id: model.wallet_principal_id,
    });

  } catch (error) {
    console.error("❌ API Purchase Error:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/users/purchases/:modelId', async (req, res) => {
  try {
    const userId = req.header("x-user-id");
    const { modelId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    // ✅ Ensure correct user and model are checked
    const transaction = await Transaction.findOne({ userId, modelId, type: "purchase" });

    if (transaction) {
      console.log(`✅ User ${userId} has purchased model ${modelId}`);
    } else {
      console.log(`❌ User ${userId} has NOT purchased model ${modelId}`);
    }

    res.json({ purchased: !!transaction }); // ✅ Returns true if user has purchased the model

  } catch (error) {
    console.error("❌ Error fetching purchase status:", error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * /api/marketplace/models/:id/subscribe [POST]
 */
app.post('/api/marketplace/models/:id/subscribe', async (req, res) => {
  try {
    const model = await MarketplaceModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    // Dummy subscription logic
    res.json({ message: `You have subscribed to model: ${model.name}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/marketplace/models/:id/rate [POST]
 */
app.post('/api/marketplace/models/:id/rate', (req, res) => {
  const { rating } = req.body;
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }
  // In a real app, store rating in DB
  res.json({ message: `Thank you for rating model ${req.params.id} with a score of ${rating}` });
});

/**
 * /api/marketplace/models/:id/test [POST]
 */
app.post('/api/marketplace/models/:id/test', async (req, res) => {
  try {
    const model = await MarketplaceModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    // Pretend we run a test
    res.json({ message: `Test run successful for model: ${model.name}`, output: 'Sample output...' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------------
// 7) USER ACCOUNT ENDPOINTS (Purchases / Subscriptions)
// ------------------------------------------------------------------


/**
 * /api/users/purchases [GET]
 */
app.get('/api/users/purchases', async (req, res) => {
  try {
    // Return transactions of type 'purchase' for this user
    const userTx = await Transaction.find({ userId: req.userId, type: 'purchase' });
    res.json(userTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/users/subscriptions [GET]
 */
app.get('/api/users/subscriptions', (req, res) => {
  // Not storing subscription data (stub)
  res.json([{ modelId: 'm-101', subscribedOn: '2023-03-10' }]);
});


app.get('/api/users/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    // ✅ Find a transaction where the user purchased THIS model
    const transaction = await Transaction.findOne({
      userId: req.userId,
      type: "purchase",
      modelId: id, // ✅ Ensure purchase is for this model
    });

    if (transaction) {
      return res.json({ purchased: true });
    } else {
      return res.json({ purchased: false });
    }
  } catch (error) {
    console.error("❌ Error fetching purchase status:", error);
    res.status(500).json({ error: error.message });
  }
});


// ------------------------------------------------------------------
// 8) BILLING & PAYMENT ENDPOINTS
// ------------------------------------------------------------------

/**
 * /api/billing/transactions [GET]
 */
app.get('/api/billing/transactions', async (req, res) => {
  try {
    const userTx = await Transaction.find({ userId: req.userId });
    res.json(userTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/billing/balance [GET]
 */
app.get('/api/billing/balance', async (req, res) => {
  // A real balance calculation might sum up deposits - purchases - withdrawals, etc.
  // For demo, we’ll just return a dummy fixed value
  res.json({ userId: req.userId, balance: 100.0 });
});

/**
 * /api/billing/withdraw [POST]
 */
app.post('/api/billing/withdraw', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }
  try {
    const tx = new Transaction({
      userId: req.userId,
      amount,
      type: 'withdraw'
    });
    await tx.save();
    res.json({ message: `Successfully withdrew ${amount} ICP` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * /api/billing/deposit [POST]
 */
app.post('/api/billing/deposit', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid deposit amount' });
  }
  try {
    const tx = new Transaction({
      userId: req.userId,
      amount,
      type: 'deposit'
    });
    await tx.save();
    res.json({ message: `Successfully deposited ${amount} ICP` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------------
// 9) USER MANAGEMENT (LEGACY): /api/users & /api/stores [CRUD style]
// ------------------------------------------------------------------

/**
 * /api/users [GET, POST, PUT, DELETE]
 * Query param: ?id=...
 */
/**
 * ✅ Fetch Users (by `principalId`)
 */
app.get('/api/users', async (req, res) => {
  const { principalId } = req.query;

  try {
    if (principalId) {
      const user = await User.findOne({ principalId });
      return user
        ? res.json(user)
        : res.status(404).json({ error: 'User not found' });
    }
    
    const allUsers = await User.find({});
    res.json(allUsers);

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * ✅ Register User (with `principalId`)
 */
app.post('/api/users', async (req, res) => {
  const { principalId } = req.body; // DFINITY only provides `principalId`

  if (!principalId) {
    return res.status(400).json({ error: 'Missing principalId' });
  }

  try {
    // Upsert: If user exists, return it. If not, create it.
    const user = await User.findOneAndUpdate(
      { principalId },
      { principalId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(user);

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * ✅ Update User (shouldn't be needed, but keeping for admin use)
 */
app.put('/api/users', async (req, res) => {
  const { principalId } = req.query;
  if (!principalId) {
    return res.status(400).json({ error: 'Missing principalId' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { principalId },
      { $set: req.body },  // Update only provided fields
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * ✅ Delete User
 */
app.delete('/api/users', async (req, res) => {
  const { principalId } = req.query;
  if (!principalId) {
    return res.status(400).json({ error: 'Missing principalId' });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ principalId });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * /api/stores [GET, POST, PUT, DELETE]
 * Query param: ?id=...
 */
app.get('/api/stores', async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const store = await Store.findById(id);
      return store
        ? res.json(store)
        : res.status(404).json({ error: 'Store not found' });
    }
    const allStores = await Store.find({});
    res.json(allStores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stores', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Missing required field: name' });
  }
  try {
    const newStore = new Store({ name });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stores', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing query param: id' });
  }
  try {
    const updated = await Store.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/stores', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing query param: id' });
  }
  try {
    const deleted = await Store.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------------
// 10) START THE SERVER
// ------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ICP AI Marketplace API is running on port ${PORT}`);
});
