import { memo } from "react";

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="inner">
          <div className="footerLeft">
            <a className="footerLeft-logo"> YOJITOKI </a>
            <span className="copy">© 2022 YOJITOKI All Rights Reserved.</span>
          </div>
          <div className="footerRight">
            <div className="l-sns">
              <span className="ttl">Follow Us</span>
              <ul className="sns">
                <li className="sns-item">
                  <a>
                    <img src="/img/ico_facebook.svg" alt="" />
                  </a>
                </li>
                <li className="sns-item">
                  <a>
                    <img src="/img/ico_instagram.svg" alt="" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
