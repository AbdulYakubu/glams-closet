import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { cartItems, products, delivery_charges } = useContext(ShopContext);

  // Calculate cart subtotal
  const cartAmount = Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) return total;

    const itemTotal = Object.entries(sizes).reduce((sum, [size, quantity]) => {
      return sum + quantity * product.price;
    }, 0);

    return total + itemTotal;
  }, 0);

  const shippingFee = cartAmount === 0 ? 0 : delivery_charges;
  const totalAmount = cartAmount + shippingFee;

  // Format amount using ₵ symbol and comma separators
  const formatCurrency = (amount) =>
    `₵${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <section className="w-full max-padd-container" role="region" aria-labelledby="cart-total-title">
      <Title title1="Cart" title2="Total" title1Styles="h3" />

      <div className="flexBetween pt-3">
        <h5 className="h5">SubTotal:</h5>
        <p className="h5">{formatCurrency(cartAmount)}</p>
      </div>

      <hr className="mx-auto h-[1px] w-full bg-gray-900/10 my-1" />

      <div className="flexBetween pt-3">
        <h5 className="h5">Shipping Fee:</h5>
        <p className="h5">{formatCurrency(shippingFee)}</p>
      </div>

      <hr className="mx-auto h-[1px] w-full bg-gray-900/10 my-1" />

      <div className="flexBetween pt-3">
        <h5 className="h5">Total:</h5>
        <p className="h5">{formatCurrency(totalAmount)}</p>
      </div>

      <hr className="mx-auto h-[1px] w-full bg-gray-900/10 my-1" />
    </section>
  );
};

export default CartTotal;
