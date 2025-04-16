import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, currency, token, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("Please login to view orders");
        navigate("/login");
        return;
      }

      console.log("Fetching Orders - URL:", `${backendUrl}/api/order/userorders`);
      console.log("Fetching Orders - Token:", token.slice(0, 20) + "...");

      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Orders Response:", response.data);

      if (response.data.success) {
        const allItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allItems.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("AxiosError:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Orders endpoint not found. Please contact support.");
      } else {
        toast.error(error.response?.data?.message || "Error fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const renderStatusBadge = (status) => {
    const statusClasses = {
      Delivered: "bg-green-100 text-green-700",
      Shipped: "bg-blue-100 text-blue-700",
      Packing: "bg-yellow-100 text-yellow-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
    };
    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const renderSkeleton = () => {
    return [...Array(3)].map((_, i) => (
      <div key={i} className="bg-white p-4 mt-3 rounded-lg shadow animate-pulse">
        <div className="flex gap-6">
          <div className="w-[77px] h-[77px] bg-slate-200 rounded-lg" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-slate-200 w-1/2 rounded" />
            <div className="h-3 bg-slate-200 w-full rounded" />
            <div className="h-3 bg-slate-200 w-3/4 rounded" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="bg-primary mb-16">
        <div className="max-padd-container py-10">
          <Title title1="Order" title2="List" />

          {loading ? (
            renderSkeleton()
          ) : orderData.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              🛍️ No orders yet. Start shopping!
            </div>
          ) : (
            orderData.map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 mt-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="text-gray-700 flex flex-col gap-4">
                  <div className="flex gap-6">
                    <div>
                      <img
                        src={item.image[0]}
                        alt="order-img"
                        className="sm:w-[77px] w-20 aspect-square object-cover rounded-lg"
                      />
                    </div>

                    <div className="block w-full">
                      <h5 className="h5 capitalize line-clamp-1">{item.name}</h5>

                      <div className="flexBetween flex-wrap mt-1">
                        <div>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Price:</span> {currency}
                              {item.price}
                            </p>
                            <p>
                              <span className="font-medium">Quantity:</span>{" "}
                              {item.quantity}
                            </p>
                            <p>
                              <span className="font-medium">Size:</span> {item.size}
                            </p>
                          </div>

                          <div className="mt-2 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(item.date).toDateString()}
                            </p>
                            <p>
                              <span className="font-medium">Payment:</span>{" "}
                              {item.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                          {renderStatusBadge(item.status)}
                          <button
                            onClick={loadOrderData}
                            className="btn-secondary !py-1.5 !px-3 !text-xs"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
