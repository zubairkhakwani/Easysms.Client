import { toast, Slide } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SmsContext } from "../../context/SmsContext";

import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/Auth/AuthService";
import { connectSignalR } from "../../services/SignalR/SignalRService";
import "./Login.css";

export default function Login() {
  var navigate = useNavigate();

  const { login } = useContext(AuthContext);
  const { addSms } = useContext(SmsContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await loginUser(formData);

      var responseMessage = response.message;

      if (response.isSuccess) {
        await connectSignalR(response.data.userId, addSms);
        login(response.data.token);
        navigate("/get-number");
      } else {
        toast.error(responseMessage, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-tagline">Login to manage your SMS verifications.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loging in..." : "Login →"}
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account?
          <Link to="/register">
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
