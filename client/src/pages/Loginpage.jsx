import { createContext, useState } from "react";
import "../css/Loginpage.css";
import Login from "../components/Login";

export const ThemeContext = createContext(null);
const Loginpage = () => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((cur) => (cur === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="login">
        <div className="login-form">
          <img
            src="https://pomofocus.io/images/brandlogo-white.png"
            alt="logo"
          ></img>
          <div className="login-form-text">Login</div>
          <div className="login-form-input">
            <div className="login-form-space">
              <div className="spacing"></div>
              <div className="spacing"></div>
            </div>
            <Login />
          </div>
          <div style={{ marginTop: "6px", marginBottom: 0 }}>
            <span
              style={{ color: "white", fontWeight: "bold" }}
              wrapperCol={{ offset: 8, span: 16 }}
            >
              Chưa có tài khoản
            </span>
          </div>
          <div>
            <a
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
              wrapperCol={{ offset: 8, span: 16 }}
              href="/register"
            >
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Loginpage;
