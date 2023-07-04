import "./topbar.css";
import { Search } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { userContext } from "../../userContext";
import { ReactSession } from "react-client-session";
import Registration from "../../pages/Registration/Registration";

export default function Topbar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { userInfo, logout, setUserInfo } = useContext(userContext);
  const navigate = useNavigate();
  const navigateTo = (route) => {
    navigate(route);
  };
  if (ReactSession.get("user") !== "" && !userInfo) {
    setUserInfo(JSON.parse(ReactSession.get("user")));
  }
  const location = useLocation();

  return (
    <div className="topBarWrapperAll">
      <div className="topbarContainer">
        <div className="topbarLeft">
          <img
            src="/images/logo.png"
            alt=""
            className="logoImg"
            onClick={() => {
              return navigateTo("/");
            }}
          />
        </div>
        <div className="topbarCenter"></div>
        <div className="topbarRight">
          <div className="searchbar">
            <Search className="searchIcon" />
            <span
              className={
                location.pathname === "/search"
                  ? "topbarLink searchLink  active"
                  : "  topbarLink"
              }
              onClick={() => {
                navigateTo("/search");
              }}
            >
              Search
            </span>
          </div>
          <div className="topbarLinks">
            <span
              className={
                location.pathname === "/" ? "topbarLink active" : "topbarLink"
              }
              onClick={() => {
                navigateTo("/");
              }}
            >
              home
            </span>

            {userInfo ? (
              <span
                className={
                  location.pathname === "/profile"
                    ? "topbarLink active"
                    : "topbarLink"
                }
                onClick={() => {
                  navigateTo("/profile");
                }}
              >
                {userInfo.username}
              </span>
            ) : (
              <span
                className="topbarLink"
                onClick={() => {
                  handleShow();
                }}
              >
                login
              </span>
            )}

            {userInfo && (
              <span
                className={
                  location.pathname === "/add"
                    ? "topbarLink active"
                    : "topbarLink"
                }
                onClick={() => {
                  navigateTo("/add");
                }}
              >
                Add a Recipe
              </span>
            )}
            {userInfo && (
              <span
                className="topbarLink"
                onClick={() => {
                  logout();
                  navigateTo("/");
                }}
              >
                Log-out
              </span>
            )}
          </div>

          <img
            src={
              userInfo?.profilePicture
                ? `/images/person/${userInfo.profilePicture}`
                : "/images/person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </div>
      </div>
      {show && (
        <div className="RegisterModal">
          <Registration setClose={handleClose} />
        </div>
      )}
    </div>
  );
}
