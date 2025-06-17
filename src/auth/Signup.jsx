import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleSignup = async () => {
    setError(null);

    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(inputs.email, inputs.password);
      await login(inputs.email, inputs.password);
            navigate("/chat");

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input-style bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-style bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-500 dark:text-gray-300 text-sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter Password"
          className="input-style bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
          value={inputs.confirmPassword}
          onChange={(e) =>
            setInputs({ ...inputs, confirmPassword: e.target.value })
          }
        />
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4 text-sm"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </>
  );
};

export default Signup;
