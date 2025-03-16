import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products as initialProducts } from '../assets/assets/data'; // Rename imported products

// Create the context
export const ShopContext = createContext();

// Create the provider component
const ShopContextProvider = (props) => {
  const currency = "GHS";
  const delivery_charges = 10;
  const navigate = useNavigate();

  const [products, setProducts] = useState(initialProducts); // Use renamed variable

  // Value to be provided by the context
  const value = { currency, delivery_charges, navigate, products, setProducts };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
