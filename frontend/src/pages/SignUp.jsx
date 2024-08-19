import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    setPasswordMatchError(null);

    try {
      setLoading(true);
      const res = await fetch("api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        toast.error("Registration failed");
        setLoading(false);
        setError(data.message);
        return;
      }
      toast.success("Account created successfully");
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      toast.error("Registration failed");
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          className="border p-3 rounded-lg"
          id="confirmPassword"
          onChange={handleChange}
          required
        />
        {passwordMatchError && (
          <p className="text-red-500">{passwordMatchError}</p>
        )}

        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor: waitdisabled:cursor-wait"
          disabled={loading}
        >
          {loading ? "Signing Up" : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?
          <Link to="/sign-in">
            <span className="text-blue-700 ml-1">Sign In</span>
          </Link>
        </p>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
