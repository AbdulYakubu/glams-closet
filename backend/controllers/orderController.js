import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
//import userModel from "../models/userModel";


// Controller function for placing order using COD method

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({success: true, message: "Order Placed"})
    }
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
}
}

//Controller function for placing order using mobile money method
const placeOrderMobileMoney = async (req, res) => {
    
}
//controller function for getting all orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
    
}

//controller function for getting user orders for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})

    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
        
    }

}

//controller function for updating order status for admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// controller function for verify mobile money
const verifymobilemoney = async (req, res) => {
    

}
export {placeOrder, placeOrderMobileMoney,allOrders, userOrders, updateStatus, verifymobilemoney}