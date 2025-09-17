import { useSelector } from "react-redux";
import Navbar from "./Naver";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

 

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome, {user.name} 👋
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
