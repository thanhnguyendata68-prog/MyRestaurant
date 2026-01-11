import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST - Create a new order
router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerName || !orderData.email || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerName, email, and items are required' 
      });
    }

    // Create new order
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// GET - Get all orders (optionally filtered by user)
router.get('/orders', async (req, res) => {
  try {
    const { userId, email } = req.query;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    if (email) {
      query.email = email;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// GET - Get a single order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
});

// PATCH - Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      details: error.message 
    });
  }
});

// DELETE - Delete an order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      error: 'Failed to delete order',
      details: error.message 
    });
  }
});

export default router;
