import { useState, useEffect, useContext } from "react";
   import axios from "axios";
   import { toast } from "react-toastify";
   import { ShopContext } from "../context/ShopContext";
   import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiGlobe } from "react-icons/fi";
   import Title from "../components/Title";

   const MyAccount = () => {
     const { token, navigate, backendUrl } = useContext(ShopContext);
     const [profileData, setProfileData] = useState({
       firstName: "",
       lastName: "",
       email: "",
       phone: "",
     });
     const [addressData, setAddressData] = useState({
       street: "",
       city: "",
       state: "",
       digitalAddress: "",
       country: "Ghana",
     });
     const [loading, setLoading] = useState(false);
     const [editing, setEditing] = useState(false);
     const [formErrors, setFormErrors] = useState({});

     useEffect(() => {
       console.log("MyAccount initialized, token:", token); // Debug
       if (!token) {
         toast.error("Please login to view your account");
         navigate("/login");
       }
     }, [token, navigate]);

     const fetchUserData = async () => {
       if (!token) {
         toast.error("Please login to view your account");
         navigate("/login");
         return;
       }

       setLoading(true);
       try {
         {/*console.log("Fetching profile with token:", token); // Debug*/}
         const response = await axios.get(`${backendUrl}/api/user/profile`, {
           headers: { Authorization: `Bearer ${token}` },
         });

         if (response.data.success) {
           const { firstName, lastName, email, phone, address } = response.data.user;
           setProfileData({ firstName, lastName, email, phone });
           setAddressData(address || {
             street: "",
             city: "",
             state: "",
             digitalAddress: "",
             country: "Ghana",
           });
           {/*console.log("Profile fetched:", response.data.user);*/ }
         } else {
           toast.error(response.data.message || "Failed to fetch profile");
         }
       } catch (error) {
         console.error("Fetch Profile Error:", error, "URL:", `${backendUrl}/api/user/profile`);
         const message = error.response?.data?.message || `Error fetching profile: ${error.message}`;
         toast.error(message);
         if (error.response?.status === 401) {
           navigate("/login");
         }
       } finally {
         setLoading(false);
       }
     };

     const validateForm = () => {
       const errors = {};
       if (!profileData.firstName.trim()) errors.firstName = "First name is required";
       if (!profileData.lastName.trim()) errors.lastName = "Last name is required";
       if (!profileData.email.trim()) errors.email = "Email is required";
       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) errors.email = "Invalid email format";
       if (!addressData.street.trim()) errors.street = "Street address is required";
       if (!addressData.city.trim()) errors.city = "City is required";
       if (!addressData.state.trim()) errors.state = "State/Region is required";
       if (profileData.phone && !/^\+?\d{10,15}$/.test(profileData.phone)) errors.phone = "Invalid phone number";

       setFormErrors(errors);
       return Object.keys(errors).length === 0;
     };

     const handleProfileChange = (e) => {
       const { name, value } = e.target;
       setProfileData(prev => ({ ...prev, [name]: value }));
       if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
     };

     const handleAddressChange = (e) => {
       const { name, value } = e.target;
       setAddressData(prev => ({ ...prev, [name]: value }));
       if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       if (!validateForm()) return;

       setLoading(true);
       try {
         {/*console.log("Updating profile with token:", token); */ }
         const response = await axios.put(
           `${backendUrl}/api/user/profile`,
           { ...profileData, address: addressData },
           { headers: { Authorization: `Bearer ${token}` } }
         );

         if (response.data.success) {
           toast.success("Profile updated successfully");
           setEditing(false);
           fetchUserData();
         } else {
           setFormErrors({ api: response.data.message || "Failed to update profile" });
         }
       } catch (error) {
         console.error("Update Profile Error:", error, "URL:", `${backendUrl}/api/user/profile`);
         setFormErrors({ api: error.response?.data?.message || `Error updating profile: ${error.message}` });
         if (error.response?.status === 401) {
           navigate("/login");
         }
       } finally {
         setLoading(false);
       }
     };

     useEffect(() => {
       if (token) fetchUserData();
     }, [token]);

     const formatAddress = () => {
       const { street, city, state, country } = addressData;
       return [street, city, state, country].filter(Boolean).join(", ");
     };

     return (
       <div className="min-h-screen bg-primary dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-5xl mx-auto">
           <Title
             title1="My"
             title2="Account"
             title1Styles="text-3xl font-light text-gray-700 dark:text-gray-300"
             title2Styles="text-3xl font-semibold text-indigo-600 dark:text-indigo-400"
           />

           {loading && !editing ? (
             <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
               <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
               ))}
             </div>
           ) : (
             <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
               <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                 <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                   Personal Information
                 </h3>
                 {!editing ? (
                   <button
                     onClick={() => setEditing(true)}
                     className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                   >
                     <FiEdit /> Edit
                   </button>
                 ) : (
                   <button
                     onClick={() => setEditing(false)}
                     className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                   >
                     <FiX /> Cancel
                   </button>
                 )}
               </div>

               {editing ? (
                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
                   {formErrors.api && (
                     <p className="text-red-600 dark:text-red-400">{formErrors.api}</p>
                   )}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {/* Profile Fields */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                         <FiUser /> Personal Details
                       </h4>
                       <div>
                         <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           First Name *
                         </label>
                         <input
                           type="text"
                           id="firstName"
                           name="firstName"
                           value={profileData.firstName}
                           onChange={handleProfileChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.firstName && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Last Name *
                         </label>
                         <input
                           type="text"
                           id="lastName"
                           name="lastName"
                           value={profileData.lastName}
                           onChange={handleProfileChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.lastName && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Email *
                         </label>
                         <input
                           type="email"
                           id="email"
                           name="email"
                           value={profileData.email}
                           onChange={handleProfileChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.email && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.email}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Phone
                         </label>
                         <input
                           type="text"
                           id="phone"
                           name="phone"
                           value={profileData.phone}
                           onChange={handleProfileChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.phone && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.phone}</p>
                         )}
                       </div>
                     </div>
                     {/* Address Fields */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                         <FiMapPin /> Address Details
                       </h4>
                       <div>
                         <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Street Address *
                         </label>
                         <input
                           type="text"
                           id="street"
                           name="street"
                           value={addressData.street}
                           onChange={handleAddressChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.street ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.street && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.street}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           City *
                         </label>
                         <input
                           type="text"
                           id="city"
                           name="city"
                           value={addressData.city}
                           onChange={handleAddressChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.city ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.city && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.city}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           State/Region *
                         </label>
                         <input
                           type="text"
                           id="state"
                           name="state"
                           value={addressData.state}
                           onChange={handleAddressChange}
                           className={`w-full px-4 py-2 border rounded-md ${
                             formErrors.state ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                         />
                         {formErrors.state && (
                           <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.state}</p>
                         )}
                       </div>
                       <div>
                         <label htmlFor="digitalAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Digital Address
                         </label>
                         <input
                           type="text"
                           id="digitalAddress"
                           name="digitalAddress"
                           value={addressData.digitalAddress}
                           onChange={handleAddressChange}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                       </div>
                       <div>
                         <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Country
                         </label>
                         <input
                           type="text"
                           id="country"
                           name="country"
                           value={addressData.country}
                           onChange={handleAddressChange}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           disabled
                         />
                       </div>
                     </div>
                   </div>
                   <div className="flex justify-end gap-4">
                     <button
                       type="button"
                       onClick={() => setEditing(false)}
                       className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       disabled={loading}
                       className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                     >
                       <FiSave /> {loading ? "Saving..." : "Save Changes"}
                     </button>
                   </div>
                 </form>
               ) : (
                 <div className="p-6 space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                         <FiUser /> Personal Details
                       </h4>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiUser className="text-indigo-600 dark:text-indigo-400" />
                         {profileData.firstName} {profileData.lastName}
                       </p>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiMail className="text-indigo-600 dark:text-indigo-400" />
                         {profileData.email}
                       </p>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiPhone className="text-indigo-600 dark:text-indigo-400" />
                         {profileData.phone || "Not provided"}
                       </p>
                     </div>
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                         <FiMapPin /> Address Details
                       </h4>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiHome className="text-indigo-600 dark:text-indigo-400" />
                         {formatAddress() || "Not provided"}
                       </p>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiMapPin className="text-indigo-600 dark:text-indigo-400" />
                         {addressData.digitalAddress || "Not provided"}
                       </p>
                       <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                         <FiGlobe className="text-indigo-600 dark:text-indigo-400" />
                         {addressData.country}
                       </p>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           )}
         </div>
       </div>
     );
   };

   export default MyAccount;