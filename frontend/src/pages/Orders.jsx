import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const Orders = () => {
  const { products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  // Temporary Data
  useEffect(() => {
    const data = products.slice(0, 5).map((item) => ({
      ...item,
      quantity: 1, // Add temporary quantity
      size: 'M', // Add temporary size
      date: new Date().toISOString(), // Add temporary date
      status: 'Delivered', // Add temporary status
    }));
    setOrderData(data);
  }, [products]);

  return (
    <div>
      <div className="bg-primary mb-16">
        {/* Container */}
        <div className="max-padd-container py-10">
          <Title title1={'Order'} title2={'List'} />
          {/* Order List */}
          {orderData.map((item, i) => (
            <div key={i} className="bg-white p-4 mt-3 rounded-lg shadow-sm">
              <div className="text-gray-700 flex flex-col gap-4">
                <div className="flex gap-6">
                  {/* Image */}
                  <div>
                    <img
                      src={item.image[0]}
                      alt="order-img"
                      className="sm:w-[77px] rounded-lg"
                    />
                  </div>
                  {/* Order Info */}
                  <div className="block w-full">
                    <h5 className="h5 capitalize line-clamp-1">{item.name}</h5>
                    <div className="flexBetween flex-wrap">
                      <div>
                        <div className="flex items-center gap-x-2 sm:gap-x-3">
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Price:</h5>
                            <p>${item.price}</p>
                          </div>
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Quantity:</h5>
                            <p>{item.quantity}</p>
                          </div>
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Size:</h5>
                            <p>{item.size}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h5 className="medium-14">Date:</h5>
                          <p>{new Date(item.date).toDateString()}</p>
                        </div>
                        <div className="mt-2">
                          <h5 className="medium-14">Payment:</h5>
                          <p>Credit Card</p> {/* Temporary payment data */}
                        </div>
                      </div>
                      <div>
                        {/* Status & Button */}
                        <div className="flex gap-3">
                          <div className="flex items-center gap-2">
                            <p
                              className={`min-w-2 h-2 rounded-full ${
                                item.status === 'Delivered'
                                  ? 'bg-green-500'
                                  : 'bg-yellow-500'
                              }`}
                            ></p>
                            <p className="medium-14">{item.status}</p>
                          </div>
                          <button
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;