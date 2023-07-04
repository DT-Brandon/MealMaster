import { React, useContext, useRef, useState } from "react";
import axios from "axios";
import "./Registration.css";
import { userContext } from "../../userContext";
import { ReactSession } from "react-client-session";
ReactSession.setStoreType("localStorage");

export default function Registration({ setClose }) {
  const [registerForm, setRegisterForm] = useState(true);
  const { setUserInfo } = useContext(userContext);

  const toogleRegisterForm = () => {
    return setRegisterForm((prevRegisterForm) => !prevRegisterForm);
  };

  /*log In Input */
  const loginEmail = useRef();
  const loginPassword = useRef();
  const [errMessageLogin, setMessageLogin] = useState("");

  const loginSubmit = async (e) => {
    e.preventDefault();
    setMessageLogin("");
    const user = {
      email: loginEmail.current.value,
      password: loginPassword.current.value,
    };
    try {
      await axios.post("/auth/login", user).then((res) => {
        setUserInfo(res.data);
        ReactSession.set("user", JSON.stringify(res.data));
      });

      setClose();
    } catch (err) {
      setMessageLogin(err.response.data);
    }
  };

  /* Sign Up Input */

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const [errMessage, setMessage] = useState("");

  const registerSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (passwordAgain.current.value !== password.current.value) {
      setMessage("Both Passwords are different!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        await axios.post("/auth/register", user).then((res) => {
          setUserInfo(user);
          ReactSession.set("user", JSON.stringify(res.data));
        });
        setClose();
      } catch (err) {
        setMessage(err.response.data);
      }
    }
  };

  /* right-panel-active */
  return (
    <div className="RegisterModal">
      <div className="registration-block">
        <div className="registration">
          <div
            className={
              registerForm ? "container" : "container right-panel-active"
            }
            id="container"
          >
            <div className="form-container sign-up-container">
              <form className="loginBox" onSubmit={registerSubmit}>
                <p className="form-header">
                  Fill The Form below to create an Account
                </p>

                <input
                  placeholder="Username"
                  required
                  ref={username}
                  className="loginInput"
                />
                <input
                  placeholder="Email"
                  required
                  ref={email}
                  className="loginInput"
                  type="email"
                />

                <input
                  placeholder="Password"
                  required
                  ref={password}
                  className="loginInput"
                  type="password"
                  minLength="6"
                />
                <input
                  placeholder="Confirm Password"
                  required
                  ref={passwordAgain}
                  className="loginInput"
                  type="password"
                />
                <p className="errMessage">{errMessage}</p>
                <button className="loginButton" type="submit">
                  Register
                </button>
              </form>
            </div>
            <div className="form-container sign-in-container">
              <form className="loginBox another" onSubmit={loginSubmit}>
                <p className="form-header">Welcome Back! </p>
                <input
                  placeholder="Email"
                  type="email"
                  required
                  className="loginInput"
                  ref={loginEmail}
                />
                <input
                  placeholder="Password"
                  type="password"
                  required
                  minLength="6"
                  className="loginInput"
                  ref={loginPassword}
                />
                <p className="errMessage">{errMessageLogin}</p>
                <button className="loginButton" type="submit">
                  Log In
                </button>
                {/* <span className="loginForgot">Forgot Password?</span> */}
              </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p>Click here to login if you already have an account</p>
                  <button
                    className="ghost loginRegisterButton"
                    id="signIn"
                    onClick={toogleRegisterForm}
                  >
                    Log In
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Hello, Friend!</h1>
                  <p>
                    Not yet Registered? click here to join the World of Meal
                    Master
                  </p>
                  <button
                    className="ghost loginRegisterButton"
                    id="signUp"
                    onClick={toogleRegisterForm}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                className="modal-close-button"
                onClick={() => {
                  setClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
