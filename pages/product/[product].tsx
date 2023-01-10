import { InferGetServerSidePropsType, NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Category } from '../../components/Category';
import { NextSeo } from 'next-seo';
import { productSEO } from '../../constants/next-seo.config';
import { useShoppingCart } from 'use-shopping-cart';
import { LoginModal } from '../../components/LoginModal';
import { loginModalState, userState, buttonClickState, pageLoadingState } from '../../lib/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { GetServerSideProps } from 'next';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { loading } from '../../lib/loading';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // params.productには[product]のqueryが入る。
  const id = params!.product as string;
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/products`).then((response) => response.json());
  const filteringProduct = products.filter((product: any) => product.id === id);
  return {
    props: { filteringProduct },
  };
};

// mapを使用していないため配列の0番目を指定
const Product: NextPage = ({ filteringProduct }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = useRecoilValue(userState);
  const [quantity, setQuantity] = useState<number>(1);
  const [favorite, setFavorite] = useState(false);
  const setLoginModal = useSetRecoilState(loginModalState);
  const setButtonClick = useSetRecoilState(buttonClickState);
  const { addItem, cartDetails } = useShoppingCart();
  const pageLoading = useRecoilValue(pageLoadingState);
  //【商品をカートに追加した時、データベースにdocumentを作成する。】
  useEffect(() => {
    (async () => {
      const productId = await filteringProduct[0].id;
      // Object.entriesは配列を返す
      // cartDetailsはオブジェクト。キーがpriceIdで、値が商品情報が入ったオブジェクト。
      const cartContents = Object.entries(cartDetails!).map(([priceId, detail]) => ({
        id: priceId,
        productId: detail.productId,
        name: detail.name,
        price: detail.price,
        currency: detail.currency,
        image: detail.image,
        quantity: detail.quantity,
      }));
      // cartDetailの中からカートに入れた商品のオブジェクトを取得。
      const targetCartContent = cartContents.filter((cartContent) => cartContent.productId === productId);
      // useEffectがマウント毎に実行されるため、空のdocumentを生成しないようにreturnする
      if (targetCartContent.length === 0) return;
      // setDocの引数にオブジェクトしか渡せない為、オブジェクトに変換する。
      // 配列の0番目を指定することで、キー無しのオブジェクトのみを返すことができる。
      const cartObject = Object.assign({}, targetCartContent[0]);
      //商品IDのdocumentを作成
      const documentRef = doc(db, 'users', user.user.uid, 'cart', productId);
      await setDoc(documentRef, cartObject);
    })();
  }, [cartDetails]);

  //【商品をお気に入りに追加した時、データベースにdocumentを作成する。】
  useEffect(() => {
    (async () => {
      if (favorite === false) return;
      try {
        const productObject = {
          id: filteringProduct[0].id,
          description: filteringProduct[0].description,
          name: filteringProduct[0].name,
          images: filteringProduct[0].images,
          unit_label: filteringProduct[0].unit_label,
          cate: filteringProduct[0].cate,
          thum1: filteringProduct[0].thum1,
          thum2: filteringProduct[0].thum2,
          thum3: filteringProduct[0].thum3,
          prices: filteringProduct[0].prices.map((price: any) => {
            return {
              id: price.id,
              currency: price.currency,
              transform_quantity: price.transform_quantity,
              unit_amount: price.unit_amount,
            };
          }),
        };
        const documentRef = doc(db, 'users', user.user.uid, 'favorite', productObject.id);
        await setDoc(documentRef, productObject);
        setFavorite(false);
        alert('お気に入りに追加しました');
      } catch (err) {
        setFavorite(false);
        alert(err);
      }
    })();
  }, [favorite]);

  // 商品画像のスケルトンスクリーン
  const galleryRef: any = useRef([]);
  useEffect(() => {
    if (galleryRef.current.length === 0) return;
    console.log(galleryRef);
    console.log(pageLoading);
    if (pageLoading === 'default' || 'complete') {
      loading(galleryRef, pageLoading);
    }
  }, [galleryRef, pageLoading]);

  return (
    <>
      <NextSeo {...productSEO} canonical={`${process.env.NEXT_PUBLIC_BASE_URL}product/${filteringProduct[0].id}`} />
      <main className="inner">
        <section className="l-single c-pb">
          <div className="single">
            <div className="gallery loading" ref={galleryRef}>
              <div className="galleryItem">
                <input type="radio" id="img-1" defaultChecked name="gallery" className="galleryItem__selector" />
                <Image className="galleryItem__img" src={filteringProduct[0].images[0]} width={743.4} height={400} alt="" />
                <label htmlFor="img-1" className="galleryItem__thumb">
                  <Image src={filteringProduct[0].images[0]} width={237.88} height={120} className="thumb" alt="" />
                </label>
              </div>
              <div className="galleryItem">
                <input type="radio" id="img-2" name="gallery" className="galleryItem__selector" />
                <Image className="galleryItem__img" src={filteringProduct[0].thum1} width={743.4} height={400} alt="" />
                <label htmlFor="img-2" className="galleryItem__thumb">
                  <Image src={filteringProduct[0].thum1} width={237.88} height={120} className="thumb" alt="" />
                </label>
              </div>
              <div className="galleryItem">
                <input type="radio" id="img-3" name="gallery" className="galleryItem__selector" />
                <Image className="galleryItem__img" src={filteringProduct[0].thum2} width={743.4} height={400} alt="" />
                <label htmlFor="img-3" className="galleryItem__thumb">
                  <Image src={filteringProduct[0].thum2} width={237.88} height={120} className="thumb" alt="" />
                </label>
              </div>
            </div>
            <div className="single-content">
              {filteringProduct[0].prices.map((price: any) => {
                return (
                  <div key={price.id}>
                    <h2 className="c-title--single">
                      <span className="label">商品名</span>
                      <span className="name">{filteringProduct[0].name}</span>
                    </h2>
                    <div className="l-number">
                      <span className="price">￥{price.unit_amount.toLocaleString()}</span>
                      <div className="l-input--number">
                        <label htmlFor="number">購入数</label>
                        <div className="input--number">
                          <input type="button" className="decrement" value="−" onClick={() => setQuantity((quantity) => (quantity <= 1 ? 1 : quantity - 1))} />
                          <input
                            type="number"
                            id="number"
                            name="number"
                            className="number"
                            value={quantity}
                            // undefinedを、falseに変換
                            readOnly={!!quantity}
                          />
                          <input
                            type="button"
                            className="increment"
                            value="＋"
                            onClick={() =>
                              // setQuantity((quantity) =>
                              //   quantity <= 8 ? quantity + 1 : 9
                              // )
                              setQuantity((quantity) => quantity + 1)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* 在庫が3点以下になると表示。 */}
                    {filteringProduct[0].stock <= 3 ? <span className="cautionText">※残り商品{filteringProduct[0].stock}点</span> : null}
                    <div className="l-btn">
                      <button
                        className="c-btn ja"
                        onClick={() => {
                          if (quantity > filteringProduct[0].stock) {
                            alert('在庫がありません');
                            return;
                          }

                          // ヘッダーカートアイコンのアニメーション
                          setButtonClick(true);
                          user !== null
                            ? // CartDetailの内容に追加
                              // 購入数の数だけaddItemする
                              [...Array(quantity)].map(() => {
                                addItem({
                                  id: price.id,
                                  productId: filteringProduct[0].id,
                                  name: filteringProduct[0].name,
                                  price: price.unit_amount,
                                  currency: price.currency,
                                  image: filteringProduct[0].images[0],
                                  stock: filteringProduct[0].stock,
                                });
                              })
                            : setLoginModal(true);
                        }}
                      >
                        <span className="cart">カートに入れる</span>
                      </button>

                      <button
                        className="c-btn ja reverse"
                        onClick={() => {
                          user !== null ? setFavorite(true) : setLoginModal(true);
                        }}
                      >
                        <span className="favorite">お気に入りに追加</span>
                      </button>
                    </div>
                    <ul className="detail">
                      <li className="detail-text">■サイズ（高×幅）：72mm×88mm</li>
                      <li className="detail-text">■重さ：186g</li>
                      <li className="detail-text">■容量：250cc</li>
                    </ul>
                    <p className="annotation">
                      <span> ※商品は一点一点手作りのため、形・色・大きさ、模様、風合いなど異なります。 </span>
                      <span> ※釉薬のムラやピンホール（小さな穴）、焼ムラ、貫入など個体差が出ますので予めご了承の上でご購入をお願いします。 </span>
                      <span> ※ご利用の環境状況により、実際の画像の色と多少異なる場合がございます。 </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <Category />
      </main>
      <LoginModal />
    </>
  );
};
export default Product;
