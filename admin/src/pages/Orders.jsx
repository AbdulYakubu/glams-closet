import React, { useEffect, useState } from "react";
import { TfiPackage } from "react-icons/tfi";
import axiosInstance from "../axiosInstance";
import { currency } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      {/*console.log("Fetching Orders - URL:", "/api/order/list");*/ }
      const response = await axiosInstance.get("/api/order/all");
      {/*console.log("Orders Response:", response.data);*/ }

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    const status = e.target.value;
    try {
      {/*console.log("Updating Status - Order ID:", orderId, "Status:", status);*/ }
      const response = await axiosInstance.post("/api/order/status", { orderId, status });
      {/*console.log("Status Update Response:", response.data);*/ }

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  return (
    <div className="px-4 sm:px-8 mt-6 sm:mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl bg-white p-5 shadow-md border border-slate-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#e0f7fa] rounded-full">
                  <TfiPackage className="text-2xl text-[#0097a7]" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="font-semibold text-gray-800">{order._id}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-800">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Total:</span>{" "}
                  {currency}
                  {order.amount}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Payment:</span>{" "}
                  {order.payment ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Items Ordered</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity}{" "}
                      <span className="italic">({item.size || "N/A"})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                <p className="text-sm text-gray-600">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state || ""}, {order.address.country},{" "}
                  {order.address.digitalAddress || ""}
                </p>
                <p className="text-sm text-gray-600">📞 {order.address.phone}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Payment Method:</span>{" "}
                {order.paymentMethod || "N/A"}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Out for Delivery"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {order.status}
                </span>

                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="text-xs p-1 rounded border border-gray-300 bg-white focus:outline-none"
                >
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center text-gray-500 mt-12 text-sm">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;