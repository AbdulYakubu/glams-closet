import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item";
import Title from "../components/Title";
import { FaRegWindowClose } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    getCartCount,
    navigate,
    updateQuantity,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      const initialQuantities = {};

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
            initialQuantities[`${items}-${item}`] = cartItems[items][item];
          }
        }
      }

      setCartData(tempData);
      setQuantities(initialQuantities);
    }
  }, [cartItems, products]);

  const increment = (id, size) => {
    const key = `${id}-${size}`;
    const newValue = (quantities[key] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [key]: newValue }));
    updateQuantity(id, size, newValue);
  };

  const decrement = (id, size) => {
    const key = `${id}-${size}`;
    if (quantities[key] > 1) {
      const newValue = quantities[key] - 1;
      setQuantities((prev) => ({ ...prev, [key]: newValue }));
      updateQuantity(id, size, newValue);
    }
  };

  return (
    <div>
      <div className="bg-primary pb-16">
        <div className="max-padd-container py-10">
          {/* Title */}
          <div className="flexStart gap-x-4">
            <Title title1="Cart" title2="List" title1Styles="h3" />
            <h5 className="medium-15 text-gray-30 relative bottom-1.5">
              ({getCartCount()} Items)
            </h5>
          </div>

          {/* Cart Items */}
          <div className="mt-6">
            {cartData.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-10">
                🛒 Your cart is empty. Go add some goodies!
              </div>
            ) : (
              cartData.map((item, i) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );

                if (!productData) return null;

                const key = `${item._id}-${item.size}`;

                return (
                  <div
                    key={i}
                    className="rounded-xl bg-white p-4 mb-4 shadow-sm hover:shadow transition"
                  >
                    <div className="flex gap-4 sm:gap-6 items-start">
                      <img
                        src={productData.image[0]}
                        alt="product"
                        className="w-20 sm:w-24 rounded-md object-cover"
                      />
                      <div className="flex flex-col w-full">
                        <div className="flexBetween mb-1">
                          <h5 className="h5 line-clamp-1">
                            {productData.name}
                          </h5>
                          <FaRegWindowClose
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className="cursor-pointer text-secondary hover:text-red-500"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Size: {item.size}
                        </p>
                        <div className="flexBetween">
                          <div className="flex items-center gap-2 border rounded-full bg-slate-100 px-3 py-1">
                            <button
                              onClick={() => decrement(item._id, item.size)}
                              className="text-gray-700 hover:text-secondary"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="text-sm px-2">
                              {quantities[key] || 1}
                            </span>
                            <button
                              onClick={() => increment(item._id, item.size)}
                              className="text-gray-700 hover:text-secondary"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <h4 className="h4 text-secondary">
                            {currency} {productData.price * (quantities[key] || 1)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Total Section */}
{cartData.length > 0 && (
  <div className="mt-16 px-4 sm:px-0">
    <div className="w-full sm:w-[450px] mx-auto bg-white p-5 sm:p-6 rounded-xl shadow-md">
      <CartTotal />
      <button
        onClick={() => navigate("/place-order")}
        className="btn-secondary mt-6 w-full py-3 text-sm sm:text-base"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Cart;