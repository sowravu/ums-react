import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../../store/slices/authSlice";
import { profileApi } from "../api/authApi";
import axios from "axios";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const dispatch=useDispatch()

 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

  profileApi()
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Auth error:", err);
        
      });
  }, [token, navigate]);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, image: file }); // keep file
  }
};

const handleSave = () => {
  const form = new FormData();
  form.append("name", formData.name);
  form.append("email", formData.email);
  form.append("phone", formData.phone);

  if (formData.image instanceof File) {
    form.append("image", formData.image); 
  }

  dispatch(editProfile(form))
    .unwrap()
    .then(() => {
      setIsEditing(false);
    })
    .catch((err) => {
      alert(err);
    });
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          My Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.image || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-3 text-sm"
            />
          )}
  
          {!isEditing ? (
            <h3 className="mt-4 text-xl font-semibold text-gray-700">
              {formData.name}
            </h3>
          ) : (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-4 text-xl font-semibold text-gray-700 text-center border rounded-lg px-3 py-1"
            />
          )}
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            {!isEditing ? (
              <p className="text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {formData.email}
              </p>
            ) : (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Phone Number
            </label>
            {!isEditing ? (
              <p className="text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {formData.phone}
              </p>
            ) : (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
