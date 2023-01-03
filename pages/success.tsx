import { collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useShoppingCart } from 'use-shopping-cart';
import { userState } from '../lib/atoms';
import { db } from '../lib/firebase';

const Success: NextPage = () => {
  const { clearCart } = useShoppingCart();
  const user = useRecoilValue(userState);

  // 支払いが完了したら、カートを空にして、cartドキュメントを削除する。
  useEffect(() => {
    (async () => {
      clearCart();
      const collectionRef = collection(db, 'users', user.user.uid, 'cart');
      const q = query(collectionRef);
      const documents = await getDocs(q);
      documents.forEach(async (document: any) => {
        deleteDoc(doc(db, 'users', user.user.uid, 'cart', document.data().productId));
      });
    })();
  }, []);

  return (
    <main>
      <div className="l-completion c-pd">
        <div className="inner">
          <p className="heading">支払いが完了しました</p>
          <Link href="./">
            <a className="c-btn ja">トップへ戻る</a>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Success;
