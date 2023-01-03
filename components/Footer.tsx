// import { memo } from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="inner">
          <div className="footerLeft">
            <Link href="/">
              <a className="footerLeft-logo"> YOJITOKI </a>
            </Link>
            <span className="copy">© 2022 YOJITOKI All Rights Reserved.</span>
          </div>
          <div className="footerRight">
            <div className="l-icoMenu">
              <span className="ttl">Contact</span>
              <ul className="icoMenu">
                <li className="icoMenu-item">
                  <Link href="/contact">
                    <a>
                      <img src="/img/ico_contact.svg" alt="" />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="l-icoMenu">
              <span className="ttl">Follow Us</span>
              <ul className="icoMenu">
                <li className="icoMenu-item">
                  <a>
                    <img src="/img/ico_facebook.svg" alt="" />
                  </a>
                </li>
                <li className="icoMenu-item">
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
