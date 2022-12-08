import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { resetModalState } from "../lib/atoms";
import { pattern } from "../constants/constants";

export const ResetModal = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetModal, setResetModal] = useRecoilState(resetModalState);

  // パスワードリセット(forgat password)
  const sendResetEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        alert("送信完了しました");
        setResetModal(false);
        setResetEmail("");
      })
      .catch(() => {
        if (resetEmail === "") {
          alert("メールアドレスが入力されていません");
          return;
        }
        if (!pattern.test(resetEmail)) {
          alert("メールアドレスに不正な値が入力されています");
          return;
        }
        alert("メールを送信できません");
        setResetEmail("");
      });
  };

  const elm: any = useRef();
  useEffect(() => {
    if (resetModal === true) {
      elm.current.classList.add("active");
    }
    if (resetModal === false) {
      elm.current.classList.remove("active");
    }
  }, [resetModal]);

  // modal外側をクリックして閉じる
  const closeModal = (target: any) => {
    if (target.closest("#modalContent") === null) {
      setResetModal(false);
    }
  };

  return (
    <>
      <div
        className="l-modal"
        ref={elm}
        onClick={(event) => closeModal(event.target)}
      >
        <form className="modal" id="modalContent" onSubmit={sendResetEmail}>
          <span className="close-btn" onClick={() => setResetModal(false)}>
            ×閉じる
          </span>
          <label className="text">
            パスワード再設定用のURLをお送りするメールアドレスをご入力ください。
          </label>
          <input
            className="c-input"
            name="email"
            value={resetEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setResetEmail(e.target.value);
            }}
          />
          <button className="c-btn ja">
            <span className="send">送信する</span>
          </button>
        </form>
      </div>
    </>
  );
};
