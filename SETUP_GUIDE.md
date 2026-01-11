# How to Run Your Restaurant Website with MongoDB Integration

## Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
The `.env` file is already created with your MongoDB connection string:
```
VITE_API_URL=http://localhost:5000/api
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the Application

#### Option A: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```
This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

#### Option B: Run Separately
Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## How It Works

### 1. User Submits Order Form
- User adds items to cart on the Menu page
- Goes to Orders page and clicks "Proceed to Checkout"
- Fills out customer information (name, email, phone, address, notes)
- Clicks "Submit Order"

### 2. Frontend Sends POST Request
- Form data is sent to `POST http://localhost:5000/api/orders`
- Order includes:
  - Customer info
  - Cart items
  - Pricing details (subtotal, discount, tax, total)
  - Order status (defaults to 'pending')

### 3. Backend Saves to MongoDB
- Express server receives the request
- Validates required fields
- Creates new Order document
- Saves to MongoDB database
- Returns success response with order details

### 4. Display Orders
- Orders page automatically refreshes
- Shows "Order History" section below the cart
- Displays all orders from the database
- Filters by user email if logged in

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (supports filtering by userId or email)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Health Check
- `GET /api/health` - Check if server is running

## File Structure

### Backend
- `server.js` - Express server setup and MongoDB connection
- `server/models/Order.js` - MongoDB schema for orders
- `server/routes/order.routes.js` - API endpoints for orders

### Frontend
- `src/lib/api-order.js` - API helper functions
- `src/pages/OrdersPage.jsx` - Order form and history display
- `src/styles/orders.css` - Styling for orders page

## MongoDB Schema

```javascript
{
  userId: String (optional),
  customerName: String (required),
  email: String (required),
  phone: String (optional),
  items: Array of {id, name, price, quantity, image},
  subtotal: Number,
  discount: Number,
  tax: Number,
  total: Number,
  status: String (pending/confirmed/preparing/ready/delivered/cancelled),
  deliveryAddress: String (optional),
  notes: String (optional),
  timestamps: {createdAt, updatedAt}
}
```

## Testing

1. Start both servers with `npm run dev:all`
2. Open http://localhost:5173
3. Navigate to Menu, add items to cart
4. Go to Orders page
5. Click "Proceed to Checkout"
6. Fill out the form and submit
7. Check MongoDB Atlas to see the saved order
8. Order should appear in "Order History" section

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Ensure port 5000 is not in use

### Orders not saving
- Check browser console for errors
- Verify backend is running on port 5000
- Check MongoDB connection in server logs

### Orders not displaying
- Check if API_URL in frontend matches backend port
- Open browser DevTools Network tab to see API calls
- Verify orders exist in MongoDB
