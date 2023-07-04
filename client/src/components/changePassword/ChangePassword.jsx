import React, { useContext } from "react";
import axios from "axios";
import { useState, useRef } from "react";
import { userContext } from "../../userContext";
import "./changepassword.css";

export default function ChangePassword() {
  const { userInfo } = useContext(userContext);
  const [errMessage, setErrMessage] = useState("");
  const [succefull, setSuccesfull] = useState(false);
  const oldPassword = useRef();
  const newPassword = useRef();
  const passwordAgain = useRef();
  const email = userInfo?.email;

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrMessage("");

    if (passwordAgain.current.value !== newPassword.current.value) {
      setErrMessage("Password not confirmed!");
    } else {
      const user = {
        email: userInfo?.email,
        password: newPassword.current.value,
        oldPassword: oldPassword.current.value,
      };
      try {
        await axios.put(`/users/changePassword/${email}`, user).then((res) => {
          setSuccesfull(true);
        });
      } catch (err) {
        setErrMessage(err.response.data);
      }
    }
  };

  return (
    <div className="changePasswordConatiner">
      {succefull ? (
        <span className="succesfulUpdate">
          The Password was Updated succesfully
        </span>
      ) : (
        <div className="changePasswordWrapper">
          <h1 className="changePasswordTitle">Modify Your Password</h1>

          <form className="changePasswordForm" onSubmit={submitHandler}>
            <input
              type="password"
              className="changePasswordInput"
              id="username"
              placeholder="Current Password"
              ref={oldPassword}
              required
            />

            <input
              type="password"
              className="changePasswordInput"
              placeholder="New Password"
              ref={newPassword}
              required
            />
            <input
              type="password"
              className="changePasswordInput"
              placeholder="Confirm New Password"
              ref={passwordAgain}
              required
            />

            <p className="errMessage">{errMessage}</p>

            <button type="submiit" className="changePasswordButton">
              Modify Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
