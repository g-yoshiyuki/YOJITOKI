import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import { memo } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { loginModalState, userState, buttonClickState } from "../lib/atoms";
import { LoginModal } from "./LoginModal";
import { useShoppingCart } from "use-shopping-cart";

export const Header = () => {
  const user = useRecoilValue(userState);
  const setLoginModal = useSetRecoilState(loginModalState);
  const router = useRouter();
  const { cartCount } = useShoppingCart();
  const elm: any = useRef();
  const [buttonClick, setButtonClick] = useRecoilState(buttonClickState);

  // カートアイコンアニメーション
  useEffect(() => {
    cartCount !== 0
      ? elm.current.classList.add("active")
      : elm.current.classList.remove("active");

    if (buttonClick) {
      elm.current.classList.add("anima");
      setButtonClick(false);
      setTimeout(() => {
        elm.current.classList.remove("anima");
      }, 500);
    }
  }, [cartCount, buttonClick]);

  const memberBranch = () => {
    if (user !== null) {
      router.push("/mypage");
    }
    if (user === null) {
      router.push("/login");
    }
  };
  const favoriteBranch = () => {
    if (user !== null) {
      router.push("/favorite");
    }
    if (user === null) {
      setLoginModal(true);
    }
  };
  const cartBranch = () => {
    if (user !== null) {
      router.push("/cart");
    }
    if (user === null) {
      setLoginModal(true);
    }
  };

  return (
    <>
      <div className="l-header">
        <header className="header">
          <div className="inner">
            <h1 className="header-logo">
              <Link href="/">
                <a>YOJITOKI</a>
              </Link>
            </h1>
            <ul className="header-icons">
              <li onClick={() => memberBranch()}>
                <img src="/img/ico_member.svg" alt="" />
              </li>
              <li onClick={() => favoriteBranch()}>
                <img src="/img/ico_favorite.svg" alt="" />
              </li>
              <li onClick={() => cartBranch()}>
                <span className="cartCount" ref={elm}>
                  {cartCount}
                </span>
                <img src="/img/ico_cart.svg" alt="" />
              </li>
            </ul>
          </div>
        </header>
      </div>
      <LoginModal />
    </>
  );
};
