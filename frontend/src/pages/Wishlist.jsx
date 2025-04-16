import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaLock,
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";

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
    currency,
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

  const [method, setMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [mobileDetails, setMobileDetails] = useState({
    network: "",
    transactionId: null,
  });
  const [paymentLoading, setPaymentLoading] = useState({
    card: false,
    mobile: false,
    cod: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Valid 10-digit phone number required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.region.trim()) newErrors.region = "Region is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    
    if (method === "card") {
      if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardDetails.number)) 
        newErrors.cardNumber = "Valid 16-digit card number required";
      if (!cardDetails.name.trim()) newErrors.cardName = "Cardholder name required";
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) 
        newErrors.expiry = "Valid expiry date required (MM/YY)";
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = "Valid CVV required";
    }
    
    if (method === "mobile" && !mobileDetails.network) {
      newErrors.network = "Please select a mobile network";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, cardDetails, mobileDetails, method]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onCardChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      const cleanValue = value.replace(/\D/g, "").substr(0, 16);
      const formattedValue = cleanValue
        .match(/.{1,4}/g)
        ?.join(" ")
        .trim() || "";
      setCardDetails((data) => ({ ...data, [name]: formattedValue }));
      return;
    }

    if (name === "expiry") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})/, "$1/")
        .substr(0, 5);
      setCardDetails((data) => ({ ...data, [name]: formattedValue }));
      return;
    }

    setCardDetails((data) => ({ ...data, [name]: value }));
  };

  const onMobileChange = (e) => {
    const { name, value } = e.target;
    setMobileDetails((data) => ({ ...data, [name]: value }));
  };

  const processCardPayment = async () => {
    try {
      // This is a mock Stripe-like payment processing
      // In production, you'd use a real payment gateway like Stripe or Paystack
      const paymentData = {
        amount: getCartAmount() + delivery_charges,
        currency: currency.toLowerCase(),
        card: {
          number: cardDetails.number.replace(/\s/g, ""),
          exp_month: cardDetails.expiry.split("/")[0],
          exp_year: cardDetails.expiry.split("/")[1],
          cvc: cardDetails.cvv,
          name: cardDetails.name,
        },
        description: "E-commerce order payment",
      };

      // Mock API call - replace with real payment gateway endpoint
      const response = await axios.post(
        `${backendUrl}/api/payment/card`,
        paymentData,
        { headers: { token } }
      );

      return {
        success: response.data.success,
        transactionId: response.data.transactionId,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Card payment processing failed",
      };
    }
  };

  const processMobileMoneyPayment = async () => {
    try {
      const paymentData = {
        amount: getCartAmount() + delivery_charges,
        currency: currency.toLowerCase(),
        phone: formData.phone,
        network: mobileDetails.network,
        email: formData.email,
      };

      // Initiate mobile money payment request
      const response = await axios.post(
        `${backendUrl}/api/payment/mobile`,
        paymentData,
        { headers: { token } }
      );

      if (response.data.success) {
        // Update mobile details with transaction ID
        setMobileDetails((prev) => ({
          ...prev,
          transactionId: response.data.transactionId,
        }));
        
        // You might want to implement a polling mechanism to check payment status
        return {
          success: true,
          transactionId: response.data.transactionId,
          message: "Mobile money payment request sent. Please approve on your phone.",
        };
      }

      return {
        success: false,
        message: response.data.message || "Mobile money payment initiation failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Mobile money payment processing failed",
      };
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors");
      return;
    }

    setPaymentLoading((prev) => ({ ...prev, [method]: true }));

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_charges,
        paymentMethod: method,
      };

      let response;
      switch (method) {
        case "cod":
          response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          break;

        case "mobile":
          const mobilePayment = await processMobileMoneyPayment();
          if (mobilePayment.success) {
            toast.info(mobilePayment.message);
            orderData.transactionId = mobilePayment.transactionId;
            orderData.mobileNetwork = mobileDetails.network;
            response = await axios.post(
              backendUrl + "/api/order/place",
              orderData,
              { headers: { token } }
            );
          } else {
            throw new Error(mobilePayment.message);
          }
          break;

        case "card":
          const cardPayment = await processCardPayment();
          if (cardPayment.success) {
            orderData.transactionId = cardPayment.transactionId;
            response = await axios.post(
              backendUrl + "/api/order/place",
              orderData,
              { headers: { token } }
            );
          } else {
            throw new Error(cardPayment.message);
          }
          break;

        default:
          throw new Error("Invalid payment method");
      }

      if (response.data.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while processing your order"
      );
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [method]: false }));
    }
  };

  // Rest of the component (render) remains the same as previous version
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary mb-16 flex-grow">
        <form onSubmit={onSubmitHandler} className="max-padd-container py-10">
          <div className="flex flex-col xs:flex-row gap-12">
            <div className="flex-1">
              <Title title1={"Delivery"} title2={"Information"} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">First Name*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.firstName} name="firstName" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter your first name" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Last Name*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.lastName} name="lastName" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter your last name" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Email*</label>
                  <input type="email" onChange={onChangeHandler} value={formData.email} name="email" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Phone*</label>
                  <input type="tel" onChange={onChangeHandler} value={formData.phone} name="phone" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter Phone number" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Street Address</label>
                  <input type="text" onChange={onChangeHandler} value={formData.street} name="street" placeholder="Enter Street" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">City*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.city} name="city" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter City" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Region*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.region} name="region" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter Region" />
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Digital Address*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.digitalAddress} name="digitalAddress" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Digital Address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Country*</label>
                  <input type="text" onChange={onChangeHandler} value={formData.country} name="country" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required placeholder="Enter Country" />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <CartTotal />
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6">Payment <span className="text-secondary">Method</span></h3>
                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${method === "card" ? "border-secondary bg-secondary/10" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setMethod("card")}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${method === "card" ? "bg-secondary text-white" : "bg-gray-100"}`}><FaCreditCard /></div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Credit/Debit Card</h4>
                        <div className="flex mt-1 space-x-2">
                          <SiVisa className="text-2xl text-blue-900" />
                          <SiMastercard className="text-2xl text-red-600" />
                          <SiPaypal className="text-2xl text-blue-500" />
                        </div>
                      </div>
                      {method === "card" && (
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                    {method === "card" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                          <input type="text" name="number" value={cardDetails.number} onChange={onCardChange} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required />
                          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card*</label>
                          <input type="text" name="name" value={cardDetails.name} onChange={onCardChange} placeholder="John Doe" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required />
                          {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                            <input type="text" name="expiry" value={cardDetails.expiry} onChange={onCardChange} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required />
                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                            <div className="relative">
                              <input type="text" name="cvv" value={cardDetails.cvv} onChange={onCardChange} placeholder="123" maxLength={4} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required />
                              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Mobile Money Option */}
                  <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${method === "mobile" ? "border-secondary bg-secondary/10" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setMethod("mobile")}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${method === "mobile" ? "bg-secondary text-white" : "bg-gray-100"}`}><FaMobileAlt /></div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Mobile Money</h4>
                        <p className="text-sm text-gray-600 mt-1">Pay via mobile money services</p>
                      </div>
                      {method === "mobile" && (
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                    {method === "mobile" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Network*</label>
                          <select name="network" value={mobileDetails.network} onChange={onMobileChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" required>
                            <option value="">Select Network</option>
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="vodafone">Vodafone Cash</option>
                            <option value="airteltigo">AirtelTigo Money</option>
                          </select>
                          {errors.network && <p className="text-red-500 text-xs mt-1">{errors.network}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number*</label>
                          <input type="tel" value={formData.phone} readOnly className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none" />
                          <p className="text-xs text-gray-500 mt-1">We'll send a payment request to this number</p>
                        </div>
                        {mobileDetails.transactionId && (
                          <p className="text-sm text-green-600">Transaction ID: {mobileDetails.transactionId}</p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Cash on Delivery Option */}
                  <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${method === "cod" ? "border-secondary bg-secondary/10" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setMethod("cod")}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${method === "cod" ? "bg-secondary text-white" : "bg-gray-100"}`}><FaMoneyBillWave /></div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Cash on Delivery</h4>
                        <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                      </div>
                      {method === "cod" && (
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-md flex items-start">
                  <FaLock className="text-secondary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-600">Your payment information is processed securely. We do not store your credit card details.</p>
                </div>

                <motion.button type="submit" className={`w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors ${isFormValid ? "bg-secondary hover:bg-secondary-dark" : "bg-gray-400 cursor-not-allowed"}`} whileHover={isFormValid ? { scale: 1.01 } : {}} whileTap={isFormValid ? { scale: 0.99 } : {}} disabled={!isFormValid || paymentLoading[method]}>
                  {paymentLoading[method] ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Place Order - ${currency}${(getCartAmount() + delivery_charges).toFixed(2)}`
                  )}
                </motion.button>
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