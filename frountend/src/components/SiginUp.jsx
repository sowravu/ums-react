import { useState,useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { siginup } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const navigate = useNavigate();
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");
   
 
useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]); 

 

 
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};


    if (!Name.trim()) {
      newErrors.Name = "Name is required";
    }


    if (!Phone.trim()) {
      newErrors.Phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(Phone)) {
      newErrors.Phone = "Phone must be 10 digits only";
    }


    if (!Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.Email = "Enter a valid email";
    }


    if (!Password.trim()) {
      newErrors.Password = "Password is required";
    } else if (Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(siginup({ Name, Email, Phone, Password }))
        .unwrap()
        .then(() => {
          navigate("/home", { replace: true });
        })
        .catch((err) => alert(err.message || "siginup faild"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={Name}
              onChange={(e) => {
                setName(e.target.value),
                  setErrors((prev) => ({ ...prev, Name: "" }));
              }}
            />
            {errors.Name && (
              <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="Enter your Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                setPhone(e.target.value),
                  setErrors((prev) => ({ ...prev, Phone: "" }));
              }}
              value={Phone}
            />
            {errors.Phone && (
              <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                setEmail(e.target.value),
                  setErrors((prev) => ({ ...prev, Email: "" }));
              }}
              value={Email}
            />
            {errors.Email && (
              <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                setPassword(e.target.value),
                  setErrors((prev) => ({ ...prev, Password: "" }));
              }}
              value={Password}
            />
            {errors.Password && (
              <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Navigate to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
