import React, { useState } from "react";

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

interface Errors {
  email?: string;
  password?: string;
}

const CustomerLogin: React.FC = () => {
  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Validate form
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error while typing
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ✅ Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setMessage("");

    try {
      // 🔗 Replace with your backend API
      const res = await fakeLoginAPI(data);

      if (res.success) {
        setMessage("✅ Login successful!");
        console.log("User:", res.user);
      } else {
        setMessage("❌ Invalid email or password");
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ReserveX Customer Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <div style={{ display: "flex" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.showBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span style={styles.error}>{errors.password}</span>
            )}
          </div>

          {/* Remember */}
          <div style={styles.remember}>
            <input
              type="checkbox"
              name="remember"
              checked={data.remember}
              onChange={handleChange}
            />
            <label style={{ marginLeft: 5 }}>Remember me</label>
          </div>

          {/* Button */}
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

// 🔹 Fake API (replace with real backend)
const fakeLoginAPI = async (data: LoginData) => {
  await new Promise((res) => setTimeout(res, 1500));

  if (data.email === "test@gmail.com" && data.password === "123456") {
    return {
      success: true,
      user: { name: "Test User", email: data.email },
    };
  }

  return { success: false };
};

// 🔹 Simple styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  card: {
    padding: 30,
    borderRadius: 10,
    background: "#fff",
    width: 300,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  remember: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  showBtn: {
    padding: "0 10px",
    background: "#ddd",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: 15,
    textAlign: "center",
  },
};

export default CustomerLogin;