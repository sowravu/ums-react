import { Link } from "react-router-dom";

import { Navigate,useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../../store/slices/authSlice";
const Login = () => {
  const token = useSelector((state) => state.auth.token);
const dispatch=useDispatch()
const navigate=useNavigate()


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Errors,setErrors]=useState({});


    if (token) {
    return <Navigate to="/home" replace />;
  }


  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password.trim()) {
      newErrors.password = "password is required";
    }
   setErrors(newErrors)

   return Object.keys(newErrors).length===0

  };


  const handleLogin = (e) => {
    e.preventDefault();
        
    if(validateForm()){
         dispatch(login({email,password})).unwrap()
        .then(() => {
          navigate("/home", { replace: true });
        })
        .catch((err) => alert(err.message || "login faild"));
       

    }


  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                setEmail(e.target.value);
                
               setErrors((prev)=>({...prev,email:""}))
              }}
            />
            {Errors.email && (
              <p className="text-red-500 text-sm mt-1">{Errors.email}</p>
            )} 
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {setPassword(e.target.value);
                setErrors((prev)=>({...prev,password:""}))
              }}
            />

               {Errors.password && (
              <p className="text-red-500 text-sm mt-1">{Errors.password}</p>
            )} 
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sigin up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
