import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import Title from "../components/Title";

const Wishlist = () => {
    const { wishlistItems, products, addToCart, setWishlistItems } = useContext(ShopContext);

    // Function to move item from wishlist to cart
    const moveToCart = (itemId, size) => {
        addToCart(itemId, size); // ✅ Add item to cart
        setWishlistItems(prevWishlist => {
            toast.info("Item moved to cart and removed from wishlist");
            return prevWishlist.filter(id => id !== itemId);
        });
    };

    // Function to remove item from wishlist
    const removeFromWishlist = (itemId) => {
        setWishlistItems(prevWishlist => prevWishlist.filter(id => id !== itemId));
        toast.info("Item removed from wishlist");
    };

    return (
        <div className="max-padd-container py-10">
            <Title title1={'Wishlist'} title2={'Items'} titleStyles={'h3'}/>
            
            {wishlistItems.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div className="grid gap-4">
                    {wishlistItems.map((itemId) => {
                        const product = products.find((p) => p._id === itemId);
                        if (!product) return null;

                      return (
                          
                            <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg shadow">
                                <div className="flex items-center gap-4">
                                    <img src={product.image[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <h3 className="text-lg font-medium">{product.name}</h3>
                                        <p className="text-sm text-gray-500">GHS {product.price}.00</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveToCart(product._id, product.sizes[0])}
                                        className="btn-secondary flex items-center gap-1 p-2 rounded-lg sm:flex-col"
                                    >
                                        <TbShoppingBagPlus /> Cart
                                    </button>

                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="btn-light p-2 rounded-lg"
                                    >
                                        <FaTrash className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Wishlist;