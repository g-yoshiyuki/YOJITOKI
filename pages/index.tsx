import { createRef, useEffect, useRef } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../components/Category';
import { newsData } from '../constants/newsData';
import { loading } from '../lib/loading';
import { useRecoilValue } from 'recoil';
import { pageLoadingState } from '../lib/atoms';

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/products`).then((response) => response.json());
  return {
    props: {
      products,
    },
  };
};

const Home: NextPage = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const selectProducts = products.slice(0, 8);
  const pageLoading = useRecoilValue(pageLoadingState);

  // キービジュアルのスケルトンスクリーン
  const kvRef: any = useRef([]);
  useEffect(() => {
    if (kvRef.current.length === 0) return;
    if (pageLoading === 'default' || 'complete') {
      loading(kvRef, pageLoading);
    }
  }, [kvRef, pageLoading]);

  // 商品画像のスケルトンスクリーン
  const loadingItemRef: any = useRef([]);
  // // 表示する商品の数だけrefを生成する
  selectProducts.forEach((_: any, i: number) => {
    loadingItemRef.current[i] = createRef();
  });
  useEffect(() => {
    if (loadingItemRef.current.length === 0) return;
    if (pageLoading === 'default' || 'complete') {
      loading(loadingItemRef.current, pageLoading);
    }
  }, [loadingItemRef, pageLoading]);

  return (
    <>
      <main className="inner">
        <div className="l-hero l-kvAnima loading" ref={kvRef}>
          <picture className="hero">
            <source media="(min-width: 769px)" srcSet="img/hero.jpg" id="hero1" width="2100" height="860" />
            <source media="(max-width: 768px)" srcSet="img/hero_sp.jpg" id="hero2" width="675" height="600" />
            <img src="img/hero.jpg" alt="" width="2100" height="860" />
          </picture>
        </div>
        <section className="l-products c-pd">
          <h2 className="c-title">
            商品一覧<span>Products</span>
          </h2>
          <ul className="products">
            {selectProducts.map((product: any, i: number) => {
              return (
                <li className="productsItem loading" key={product.id} ref={loadingItemRef.current[i]}>
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
                              {product.stock <= 0 ? <span className="soldOutLabel">SOLD OUT</span> : null}
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
          <Link href="/archive">
            <a className="c-btn">VIEW MORE</a>
          </Link>
        </section>

        <Category />

        <section className="l-news">
          <h2 className="c-title--center">
            <span>News</span>お知らせ
          </h2>
          <ul className="news">
            {newsData.map((news: any) => {
              return (
                <li className="newsItem" key={news.id}>
                  <time>{news.time}</time>
                  <p>{news.text}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
};
export default Home;
