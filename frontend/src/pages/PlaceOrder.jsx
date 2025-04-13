import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_charges,
    products,
    backendUrl,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    region: "",
    digitalAddress: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount()+ delivery_charges
      }
      switch (method) {
        //api calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          console.log(response)
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        default:
          break
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  };

  const [method, setMethod] = useState("cod");
  return (
    <div>
      <div className="bg-primary mb-16">
        {/*Container */}
        <form onSubmit={onSubmitHandler} className="max-padd-container py-10">
          <div className="flex flex-col xs:flex-row gap-20 xs:gap-28">
            {/*Left side */}
            <div className="flex flex-1 flex-col gap-3 text-[95%]">
              <Title title1={"Delivery"} title2={"Information"} />
              <div className="flex gap-3">
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.firstName}
                  name="firstName"
                  placeholder="First Name"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.lastName}
                  name="lastName"
                  placeholder="Last Name"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
              </div>
              <input
                type="text"
                onChange={onChangeHandler}
                value={formData.email}
                name="email"
                placeholder="Email"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none " required
              />
              <input
                type="tel"
                onChange={onChangeHandler}
                value={formData.phone}
                pattern="[0-9]{10}"
                name="phone"
                placeholder="Phone"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none " required
              />
              <input
                type="text"
                onChange={onChangeHandler}
                value={formData.street}
                name="street"
                placeholder="Street"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none "
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.city}
                  name="city"
                  placeholder="City"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.region}
                  name="region"
                  placeholder="Region"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.digitalAddress}
                  name="digitalAddress"
                  placeholder="Digital Address"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
                <input
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.country}
                  name="country"
                  placeholder="Country"
                  className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2" required
                />
              </div>
            </div>

            {/*Right side*/}
            <div className="flex flex-1 flex-col">
              <CartTotal />

              {/*Payment method */}
              <div className="my-6">
                <h3 className="bold-20 mb-5">
                  {" "}
                  Payment <span className="text-secondary">Method</span>
                </h3>
                <div className="flex gap-3">
                  <div
                    onClick={() => setMethod("mobile")}
                    className={`${
                      method === "mobile" ? "btn-dark" : "btn-white"
                    } !py-1 text-xs cursor-pointer`}
                  >
                    Mobile Money
                  </div>
                  <div
                    onClick={() => setMethod("cod")}
                    className={`${
                      method === "cod" ? "btn-dark" : "btn-white"
                    } !py-1 text-xs cursor-pointer`}
                  >
                    Cash On Delivery
                  </div>
                </div>
              </div>
              <div>
                <button type="submit" className="btn-secondary">
                  Place Order{" "}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
