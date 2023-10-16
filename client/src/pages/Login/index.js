import "./style.css"
import FormLogin from "../../components/antdsgn/form"

const Login = () =>{
    return <div className="login">
        <div className="login-form">
            <img src="https://pomofocus.io/images/brandlogo-white.png" alt="logo"></img>
            <div className="login-form-text">Login</div>
            <div className="login-form-input">
                <button>
                    <img src="https://pomofocus.io/icons/g-logo.png" alt=""></img>
                    Login with Google
                </button>
                <div className="login-form-space">
                    <div className="spacing"></div>
                    <div className="spacing-text">or</div>
                    <div className="spacing"></div>
                </div>
                <FormLogin />
            </div>
        </div>

    </div>
}

export default Login