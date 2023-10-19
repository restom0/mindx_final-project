import Register from "../components/Register";
import "../css/Register.css";
const Registerpage = () => {
  return (
    <div className="register">
      <div className="register-form">
        <img
          src="https://pomofocus.io/images/brandlogo-white.png"
          alt="logo"
        ></img>
        <div className="register-form-text">Đăng ký</div>
        <div className="register-form-input">
          <div className="register-form-space">
            <div className="spacing"></div>
            <div className="spacing"></div>
          </div>
          <Register />
        </div>
        <div className="register-form-bottom">
          <span>
            <b>Đã có tài khoản ?</b>
          </span>
          <a style={{ color: "white", fontWeight: "bold" }} href="/login">
            Đăng nhập.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;
