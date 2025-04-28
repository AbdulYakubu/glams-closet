import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

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
    region: "",
    digitalAddress: "",
    country: "Ghana",
  });
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!token) {
      toast.error("No token found. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const { firstName, lastName, email, phone, address } = response.data.user;
        setProfileData({ firstName, lastName, email, phone });
        setAddressData(address || {
          street: "",
          city: "",
          region: "",
          digitalAddress: "",
          country: "Ghana",
        });
      } else {
        toast.error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error(error.response?.data?.message || "Error fetching profile");
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("MyAccount re-rendered");
    fetchUserData();
  }, [token, backendUrl]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Account</h2>
            <p className="text-gray-600">
              <span className="font-medium">First Name:</span> {profileData.firstName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Last Name:</span> {profileData.lastName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {profileData.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {profileData.phone || "Not provided"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Address:</span>{" "}
              {addressData.street
                ? `${addressData.street}, ${addressData.city}, ${addressData.region}, ${addressData.country}`
                : "Not provided"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;