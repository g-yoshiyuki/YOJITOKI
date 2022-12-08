import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClickState } from "../lib/atoms";
import { useSetRecoilState } from "recoil";
import { useShoppingCart } from "use-shopping-cart";

const Cart: NextPage = () => {
  const {
    cartDetails,
    removeItem,
    formattedTotalPrice,
    cartCount,
    incrementItem,
    decrementItem,
  } = useShoppingCart();
  const setButtonClick = useSetRecoilState(buttonClickState);

  return (
    <>
      <main className="inner">
        <div className="hero--lower">
          <h2 className="c-title--lower">
            <span className="heading">
              ショッピング<span className="ib">カート</span>
            </span>
            <span className="cate en">Shopping Cart</span>
          </h2>
        </div>
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
                        onClick={() => removeItem(priceId)}
                      >
                        <img src="img/delete.svg" alt="" />
                      </span>
                      <Link href={{ pathname: `/product/${detail.productId}` }}>
                        <a>
                          <div className="productsItem__img">
                            <Image
                              src={detail.image!}
                              alt={detail.name}
                              width={268.45}
                              height={160}
                            />
                          </div>
                          <div className="productsItem__content">
                            <span className="name">{detail.name}</span>
                            <span className="price">
                              {detail.formattedPrice}
                            </span>
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
                                decrementItem(priceId);
                              }}
                            />
                            <input
                              type="number"
                              id="number"
                              name="number"
                              className="number"
                              value={detail.quantity}
                              readOnly={!!detail.quantity}
                            />
                            <input
                              type="button"
                              className="increment"
                              value="＋"
                              onClick={() => {
                                // ヘッダーカートアイコンのアニメーション
                                setButtonClick(true);
                                incrementItem(priceId);
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
                  className="c-btn ja"
                  onClick={async () => {
                    try {
                      const session = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout_session`,
                        {
                          // POSTで送信
                          method: "POST",
                          // メタデータ
                          headers: {
                            "Content-Type": "application/json",
                          },
                          // 中身
                          // カートの商品ひとつづつ取り出して情報をcheckout_sessionにpost送信。
                          body: JSON.stringify({
                            items: Object.entries(cartDetails!).map(
                              ([_id, detail]) => ({
                                id: detail.id,
                                quantity: detail.quantity,
                              })
                            ),
                          }),
                        }
                      ).then((response) => response.json());
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
