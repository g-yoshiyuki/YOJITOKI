import { useRef } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../components/Category';
import { newsData } from '../constants/newsData';

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
  const elm: any = useRef();

  // キービジアニメーション
  // useEffect(() => {
  //   window.onload = function() {
  //     elm.current.classList.add('__anima');
  //     }
  // }, []);

  return (
    <>
      <main className="inner">
        <div className="l-hero l-kvAnima" id="js-anima" ref={elm}>
          <picture className="hero kvAnima">
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
            {selectProducts.map((product: any) => {
              return (
                <li className="productsItem" key={product.id}>
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
