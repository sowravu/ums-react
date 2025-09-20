import { useSelector } from "react-redux";
import Navbar from "./Naver";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeData, loginApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
const Home = () => {

const user = useSelector((state) => state.auth.user);
const token = useSelector((state) => state.auth.token);
const navigate = useNavigate();
const dispatch=useDispatch();

 useEffect(() => {
  if (!user || !token) {
    navigate("/login");
    return;
  }

  if (user.isAdmin === 1) {
    navigate("/dashboard");
    return;
  }

  if (user.isBlocked === 1) {
    console.log("isblocked worked");
    dispatch(logout());
    navigate("/login");
    return;
  }

  getHomeData()
    .then((res) => {
      const updateuser=res.data.user;
      dispatch()
      console.log(res.data.user);
    })
    .catch((err) => {
      console.error("Auth error:", err);
        dispatch(logout());
        navigate("/login", { replace: true });
    });
}, [user, token, navigate]);




//   useEffect(() => {
//       if(user.isAdmin==1){
//     navigate("/dashboard")
//     return
//    }
    
//    if(user.isBlocked==1){
//   console.log("isblocked worked")
//   dispatch(logout());
//   navigate('/login')
// }
// console.log("user.isBlocked",user.isBlocked)

//     if (!token ) {
//       console.log("workd the the the ")
//       navigate("/login");
//       return;
//     }

//   getHomeData()
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.error("Auth error:", err);
//         navigate("/login");
//       });
//   }, [token, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
               Welcome, {user ? user.name : ""}
            </h1>
            <p className="text-gray-600">Good to see you back!</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <p className="text-gray-800 font-medium">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
