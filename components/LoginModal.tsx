import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { loginModalState } from "../lib/atoms";
import { useRouter } from "next/router";

export const LoginModal = () => {
  const [loginModal, setLoginModal] = useRecoilState(loginModalState);
  const router = useRouter();

  const elm: any = useRef();
  useEffect(() => {
    if (loginModal === true) {
      elm.current.classList.add("active");
    }
    if (loginModal === false) {
      elm.current.classList.remove("active");
    }
  }, [loginModal]);

  // modal外側をクリックして閉じる
  const closeModal = (target: any) => {
    if (target.closest("#modalContent") === null) {
      setLoginModal(false);
    }
  };

  return (
    <>
      <div
        className="l-modal"
        ref={elm}
        onClick={(event) => closeModal(event.target)}
      >
        <div className="modal" id="modalContent">
          <span className="close-btn" onClick={() => setLoginModal(false)}>
            ×閉じる
          </span>

          <p className="text">
            こちらの機能を利用するには
            <br />
            ログインをしてください。
          </p>
          <div className="l-btn">
            <button
              className="c-btn ja"
              onClick={() => {
                setLoginModal(false);
                router.push("/register");
              }}
            >
              新規会員登録
            </button>
            <button
              className="c-btn ja reverse"
              onClick={() => {
                setLoginModal(false);
                router.push("/login");
              }}
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
