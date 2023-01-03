import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { contactSEO } from '../constants/next-seo.config';
import { useRef } from 'react';
import router from 'next/router';

const Contact: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = {
      // currentの後ろに？をつけることでnullでないときだけvalueを読み込んでくれる
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      message: messageRef.current?.value,
    };
    await fetch('/api/mail', {
      method: 'POST',
      headers: {
        Accept: 'application/json,text/plain',
        'Content-Type': 'application/json',
      },
      // jsonにすることで軽量化できる
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        
        router.push('./mailSuccess');
      }
    })
    .catch((error) => {
      alert(error);
    });
  };

  return (
    <>
      <NextSeo {...contactSEO} />
      <main className="l-form">
        <form className="" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <span className="formTitle">CONTACT</span>
          <p className="c-text text-center mb15">
            YOJITOKI OnlineShopをご覧いただき<span className="ib">誠にありがとうございます。</span>
            <br />
            ご質問などは下記より<span className="ib">お問い合わせください。</span>
          </p>
          <ul className="form">
            <li className="form-item">
              <label>Name</label>
              <input name="name" type="text" ref={nameRef} required />
            </li>
            <li className="form-item">
              <label>Email Address</label>
              <input name="email" type="email" ref={emailRef} required />
            </li>
            <li className="form-item">
              <label>Message</label>
              <textarea name="message" ref={messageRef} required></textarea>
            </li>
          </ul>
          <button className="c-btn submit" type="submit">
            <span className="mail">SEND</span>
          </button>
        </form>
      </main>
    </>
  );
};
export default Contact;
