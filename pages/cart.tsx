import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buttonClickState, userState } from '../lib/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useShoppingCart } from 'use-shopping-cart';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PageTitle } from '../components/PageTitle';

const Cart: NextPage = () => {
  const user = useRecoilValue(userState);
  const { cartDetails, removeItem, formattedTotalPrice, cartCount, incrementItem, decrementItem } = useShoppingCart();
  const setButtonClick = useSetRecoilState(buttonClickState);
  const [targetPriceId, setTargetPriceId] = useState<any>(null);

  useEffect(() => {
    (async () => {
      // マウント時に実行しない。
      if (targetPriceId) {
        const cartContents = Object.entries(cartDetails!).map(([priceId, detail]) => ({
          id: priceId,
          productId: detail.productId,
          name: detail.name,
          price: detail.price,
          currency: detail.currency,
          image: detail.image,
          quantity: detail.quantity,
        }));
        // 個数を変更した商品のオブジェクトを取得。
        const targetCartContent = cartContents.filter((cartContent) => cartContent.id === targetPriceId);

        // カートから削除した場合。
        if (targetCartContent.length == 0) {
          const collectionRef = collection(db, 'users', user.user.uid, 'cart');
          const q = query(collectionRef);
          const documents = await getDocs(q);
          documents.forEach(async (document: any) => {
            const documentId = document.data().productId;
            document.data().id === targetPriceId && deleteDoc(doc(db, 'users', user.user.uid, 'cart', documentId));
          });
          // カートに入れる個数を変更した場合。
        } else {
          const cartObject = Object.assign({}, targetCartContent[0]);
          const documentRef = doc(db, 'users', user.user.uid, 'cart', cartObject.productId);
          await setDoc(documentRef, cartObject);
          setTargetPriceId(null);
        }
      }
    })();
  }, [cartDetails]);
  return (
    <>
      <main className="inner">
        <PageTitle ja={'ショッピング<span className="ib">カート</span>'} en={'Shopping Cart'} />
        <section className="l-cart c-pb">
          {cartCount !== 0 ? (
            <>
              <ul className="products">
                {/* Object.entries()メソッドは、引数のオブジェクトが所有する、文字列をキーとした列挙可能なプロパティの組 [key, value] からなる配列を返す */}
                {Object.entries(cartDetails!).map(([priceId, detail]) => {
                  return (
                    <li className="productsItem" key={priceId}>
                      <span
                        className="deleteIcon"
                        onClick={() => {
                          setTargetPriceId(priceId);
                          removeItem(priceId);
                        }}
                      >
                        <img src="img/delete.svg" alt="" />
                      </span>
                      <Link href={{ pathname: `/product/${detail.productId}` }}>
                        <a>
                          <div className="productsItem__img">
                            <Image src={detail.image!} alt={detail.name} width={268.45} height={160} />
                          </div>
                          <div className="productsItem__content">
                            <span className="name">{detail.name}</span>
                            <span className="price">{detail.formattedPrice}</span>
                          </div>
                        </a>
                      </Link>
                      <div className="l-alignRight">
                        <div className="l-input--number">
                          <label htmlFor="number">購入数</label>
                          <div className="input--number">
                            <input
                              type="button"
                              className="decrement"
                              value="−"
                              onClick={() => {
                                // ヘッダーカートアイコンのアニメーション
                                setButtonClick(true);
                                setTargetPriceId(priceId);
                                decrementItem(priceId);
                                // updateQuantity(priceId);
                              }}
                            />
                            <input type="number" id="number" name="number" className="number" value={detail.quantity} readOnly={!!detail.quantity} />
                            <input
                              type="button"
                              className="increment"
                              value="＋"
                              onClick={() => {
                                if (detail.quantity + 1 > detail.stock) {
                                  alert('在庫がありません');
                                  return;
                                }
                                // ヘッダーカートアイコンのアニメーション
                                setButtonClick(true);
                                setTargetPriceId(priceId);
                                incrementItem(priceId);
                                // updateQuantity(priceId);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="l-totalAmount">
                <div className="totalAmount">
                  <span className="label">合計金額</span>
                  <span className="price">{formattedTotalPrice}</span>
                </div>
              </div>
              <div className="l-row-btn">
                <Link href="./">
                  <a className="c-btn ja reverse">買い物を続ける</a>
                </Link>
                <button
                  className="c-btn ja cv"
                  onClick={async () => {
                    try {
                      const session = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout_session`, {
                        // POSTで送信
                        method: 'POST',
                        // メタデータ
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        // 中身
                        // カートの商品ひとつづつ取り出して情報をcheckout_sessionにpost送信。
                        body: JSON.stringify({
                          userId: user.user.uid,
                          items: Object.entries(cartDetails!).map(([_id, detail]) => ({
                            id: detail.id,
                            quantity: detail.quantity,
                          })),
                        }),
                      }).then((response) => response.json());
                      window.open(session.url);
                    } catch (e: any) {
                      window.alert(e.message);
                    }
                  }}
                >
                  <span className="checkout">ご購入手続きへ</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-center">※カートの中身はありません</p>
              <Link href="./">
                <a className="c-btn ja reverse mt60">買い物を続ける</a>
              </Link>
            </>
          )}
        </section>
      </main>
    </>
  );
};
export default Cart;
