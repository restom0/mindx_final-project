
import FormRegister from "../../components/antdsgn/formRes"
import "./style.css"


const Register = () =>{
    return <div className="register">
        <div className="register-form">
            <img src="https://pomofocus.io/images/brandlogo-white.png" alt="logo"></img>
            <div className="register-form-text">Đăng ký tài khoản</div>
            <div className="register-form-input">
                <button>
                    <img src="https://pomofocus.io/icons/g-logo.png" alt=""></img>
                    Đăng ký với Google
                </button>
                <div className="register-form-space">
                    <div className="spacing"></div>
                    <div className="spacing-text">or</div>
                    <div className="spacing"></div>
                </div>
                <FormRegister />
            </div>
            <div className="register-form-bottom">
                <p>Đã có tài khoản ?</p>
                <p>Đăng nhập.</p>
            </div>
        </div>

    </div>
}

export default Register
