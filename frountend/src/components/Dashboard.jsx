import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getdashboarddata, editUser, toggleBlock } from "../api/authApi";

import {  useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", image: null });

  const fetchUsers = () => {
    getdashboarddata()
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => {
        console.error("Auth error:", err);
        navigate("/login");
      });
  };

  useEffect(() => {
    if (user.isAdmin === 0) {
      navigate("/home");
      return;
    }
    fetchUsers();
  }, []);

  const handleEditClick = (u) => {
    setEditingUser(u._id);
    setFormData({ name: u.name, email: u.email, phone: u.phone, image: null });
  };

  const handleEditSubmit = async (id) => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    if (formData.image) fd.append("image", formData.image);

    await editUser(id, fd);
    fetchUsers();
    setEditingUser(null);
  };

  const handleBlockToggle = async (id) => {
    await toggleBlock(id);
    fetchUsers();
  };




  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Add User
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        onClick={()=>{dispatch(logout());navigate('/login',{replace:true})}}>
          Logout
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <img
                    src={`http://localhost:5000${u.image}`}
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                </td>

                {editingUser === u._id ? (
                  <>
                    <td className="p-4">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="mt-2"
                      />
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(u._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-gray-700">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4 text-gray-600">{u.phone}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleBlockToggle(u._id)}
                        className={`${
                          u.isBlocked ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"
                        } text-white px-3 py-1 rounded-lg`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
