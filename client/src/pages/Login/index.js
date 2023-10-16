import "./style.css";
import FormLogin from "../../components/antdsgn/form";

const Login = () => {
  return (
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
          <FormLogin />
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
  );
};

export default Login;
