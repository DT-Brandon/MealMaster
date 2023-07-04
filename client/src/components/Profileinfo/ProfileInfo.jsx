import React, { useContext } from "react";
import axios from "axios";
import { useState, useRef } from "react";
import { userContext } from "../../userContext";
import { AddAPhoto, Cancel } from "@mui/icons-material";
import { ReactSession } from "react-client-session";
import "./profileinfo.css";

export default function ProfileInfo() {
  const [file, setFile] = useState(null);
  const { userInfo, setUserInfo } = useContext(userContext);
  const [errMessage, setErrMessage] = useState("");
  const username = useRef();
  const password = useRef();
  const email = userInfo?.email;

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrMessage("");
    const user = {
      username: username.current.value,
      email: userInfo?.email,
      password: password.current.value,
      profilePicture: userInfo?.profilePicture,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      user.profilePicture = fileName;

      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.put(`/users/${email}`, user).then((res) => {
        ReactSession.set("user", JSON.stringify(res.data));
        setUserInfo(res.data);
        setFile(null);
        window.location.reload();
      });
    } catch (err) {
      setErrMessage(err.response.data);
    }
  };

  return (
    <div className="profileInfoConatiner">
      <h1 className="profileInfoTitle">Personal Info</h1>

      <form className="profileInfoForm" onSubmit={submitHandler}>
        <span className="profileInfoDesc">
          These details will be used on our website, You can change them
          whenever you want.
        </span>
        <span className="profileInfoLabel">Profile Picture</span>
        <input
          style={{ display: "none" }}
          type="file"
          id="file"
          accept=".png,.jpeg,.jpg"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="profileInfoImgContainer">
          <label htmlFor="file" className="profileInfoLabelConatiner">
            <span className="ProfileInfoCamera">
              <AddAPhoto />
            </span>
          </label>

          <img
            className="profileInfoImg"
            src={
              file
                ? URL.createObjectURL(file)
                : userInfo?.profilePicture
                ? `/images/person/${userInfo.profilePicture}`
                : "/images/person/noAvatar.png"
            }
            alt=""
          />
          {file && (
            <Cancel
              className="profileInfoCancelImg"
              onClick={() => setFile(null)}
            />
          )}
        </div>
        <div className="profileInfoInputConatiner">
          <label htmlFor="username" className="profileInfoLabel">
            Username
          </label>
          <input
            type="text"
            className="profileInfoInput"
            id="username"
            defaultValue={userInfo.username}
            ref={username}
          />
        </div>
        <div className="profileInfoInputConatiner">
          <label htmlFor="username" className="profileInfoLabel">
            Enter your Password to confirm Changes
          </label>
          <input
            type="password"
            className="profileInfoInput"
            id="password"
            name="password"
            ref={password}
            required
          />
        </div>
        <div className="profileInfoInputConatiner">
          <p className="errMessage">{errMessage}</p>
        </div>
        <button type="submiit" className="profileInfoButton">
          Save Changes
        </button>
      </form>
    </div>
  );
}
