import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PageTitle } from '../components/PageTitle';
import { userState } from '../lib/atoms';
import { db } from '../lib/firebase';

const Favorite: NextPage = () => {
  const user = useRecoilValue(userState);
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    const collectionRef = collection(db, 'users', user.user.uid, 'favorite');
    const q = query(collectionRef);

    // onSnapshotでqueryで指定したコレクションに変化があるたびにリアルタイムに実行する
    const unSub = onSnapshot(q, (snapshot) => {
      setProducts(
        // snapshot.docsで、postsの中にあるドキュメントをすべて取得
        snapshot.docs.map((doc) => ({
          id: doc.data().id,
          description: doc.data().description,
          name: doc.data().name,
          images: doc.data().images,
          unit_label: doc.data().unit_label,
          cate: doc.data().cate,
          thum1: doc.data().thum1,
          thum2: doc.data().thum2,
          thum3: doc.data().thum3,
          prices: doc.data().prices.map((price: any) => {
            return {
              id: price.id,
              currency: price.currency,
              transform_quantity: price.transform_quantity,
              unit_amount: price.unit_amount,
            };
          }),
        }))
      );
    });
    return () => {
      unSub();
    };
  }, []);

  const deleteFavoriteProduct = (targetId: any) => {
    deleteDoc(doc(db, 'users', user.user.uid, 'favorite', targetId));
  };

  return (
    <>
      <main className="inner">
        <PageTitle ja={'お気に入り商品'} en={'Favorite Product'} />
        <section className="l-products c-pb">
          {products.length !== 0 ? (
            <>
              <ul className="products">
                {products.map((product: any) => {
                  return (
                    <li className="productsItem" key={product.id}>
                      <span
                        className="deleteIcon"
                        onClick={() => {
                          deleteFavoriteProduct(product.id);
                        }}
                      >
                        <img src="img/delete.svg" alt="" />
                      </span>
                      <Link href={{ pathname: `/product/${product.id}` }}>
                        <a>
                          <div className="productsItem__img">
                            <Image src={product.images[0]} alt={product.name} width={268.45} height={160} />
                          </div>
                          <div className="productsItem__content">
                            <span className="name">{product.name}</span>
                            {product.prices.map((price: any) => {
                              return (
                                <span className="price" key={price.id}>
                                  ￥{price.unit_amount.toLocaleString()}
                                </span>
                              );
                            })}
                          </div>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <p className="text-center">※お気に入りの商品はありません</p>
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
export default Favorite;
