import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footerWrapper">
        <div className="footerPart">
          <h1 className="footerPartTitle">Learn More</h1>
          <ul className="footerPartList">
            <li className="footerPartListItem">About Us</li>
            <li className="footerPartListItem">Contact Us</li>
          </ul>
        </div>
        <div className="footerPart footerMid">
          <h1 className="footerPartTitle">Advertise</h1>
          <ul className="footerPartList">
            <li className="footerPartListItem">Advertise</li>
            <li className="footerPartListItem">Sponsor</li>
          </ul>
        </div>
        <div className="footerPart">
          <h1 className="footerPartTitle">Connect</h1>
          <ul className="footerPartList">
            <li className="footerPartListItem">facebook</li>
            <li className="footerPartListItem">twitter</li>
            <li className="footerPartListItem">Instagram</li>
            <li className="footerPartListItem">Linked In</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
