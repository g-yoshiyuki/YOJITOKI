import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { userDocState, userState } from '../lib/atoms';
import { useRecoilValue } from 'recoil';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const MypageEdit: NextPage = () => {
  const user = useRecoilValue(userState);
  const userDoc = useRecoilValue<any>(userDocState);
  const [name, setName] = useState(userDoc.name);
  const [email, setEmail] = useState(userDoc.email);
  const [postCode, setPostCode] = useState(userDoc.postCode);
  const [address, setAddress] = useState(userDoc.address);
  const [phoneNumber, setPhoneNumber] = useState(userDoc.phoneNumber);
  const [dob, setDob] = useState(userDoc.dob);
  const router = useRouter();

  const newMemberInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const changeDoc = doc(db, "users", docId);
    const documentRef = doc(db, 'users', user.user.uid);
    await updateDoc(documentRef, {
      name: name,
      email: email,
      postCode: postCode,
      address: address,
      phoneNumber: phoneNumber,
      dob: dob,
    })
      .then(() => {
        alert('会員情報を保存しました');
        router.push('./mypage');
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <main className="l-form l-mypage">
        <h2 className="formTitle">MYPAGE</h2>
        <form className="" onSubmit={newMemberInfo}>
          <div className="l-row-btn">
            <div className="c-btn ja reverse" onClick={() => router.back()}>
              キャンセル
            </div>
            <button className="c-btn ja">会員情報保存</button>
          </div>
          <ul className="form ja">
            <li className="form-item">
              <label>お名前</label>
              <input name="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus={true} />
            </li>
            <li className="form-item">
              <label>メールアドレス</label>
              <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </li>
            <li className="form-item">
              <label>郵便番号</label>
              <input name="postCode" value={postCode} onChange={(e) => setPostCode(e.target.value)} />
            </li>
            <li className="form-item">
              <label>住所</label>
              <input name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </li>
            <li className="form-item">
              <label>電話番号</label>
              <input name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </li>
            <li className="form-item">
              <label>生年月日</label>
              <input name="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
            </li>
          </ul>
        </form>
      </main>
    </>
  );
};
export default MypageEdit;
