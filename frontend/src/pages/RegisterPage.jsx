import { useState } from "react";
import { registerUser } from "../api/userAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register Data:", formData);
    try {
      const res = await registerUser(formData)
      if(res.data.success){
          toast.success(res.data.msg)
          navigate('/')
      }else{
          toast.error(res.data.msg)
      }
    } catch (error) {
      console.error("Registration error:", error)
      console.error("Backend response:", error.response?.data)
      const errorMsg = error.response?.data?.msg || error.message || "Registration failed"
      toast.error(errorMsg)
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center">
              <h4>Register</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;