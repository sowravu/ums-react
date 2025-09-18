import { useSelector ,useDispatch} from "react-redux";
import {  useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
 


const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch=useDispatch()
const navigate=useNavigate()
   
  const HandleLogout=()=>{
    dispatch(logout());
    navigate("/", {replace:true})
  }


  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
    
      <div className="text-xl font-bold text-blue-600">UMS</div>

    
      <div className="flex items-center space-x-4">
      
        {user && (
          <span className="text-gray-700 font-medium">
            {user.name}
          </span>
        )}


        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        onClick={()=>navigate('/profile')}
        >
          Profile
        </button>

        
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" 
         onClick={HandleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
