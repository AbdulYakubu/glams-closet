import express from 'express';
import { allOrders, placeOrder, placeOrderMobileMoney, updateStatus, userOrders, verifymobilemoney } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/authUser.js';

const orderRouter = express.Router()

orderRouter.post('/list',adminAuth, allOrders)
orderRouter.post('/status',adminAuth, updateStatus)

//For payment
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/mobilemoney',authUser, placeOrderMobileMoney)

//Verify Payment
orderRouter.post('/verifymobilemoney', authUser, verifymobilemoney)

// For user
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter;