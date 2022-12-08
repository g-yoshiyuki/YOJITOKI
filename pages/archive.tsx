import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Category } from "../components/Category";
import { NextSeo } from "next-seo";
import { archiveSEO } from "../constants/next-seo.config";
import { InferGetStaticPropsType, GetStaticProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/products`
  ).then((response) => response.json());
  return {
    props: {
      products,
    },
    // revalidate: 1 * 60, // 1分
  };
};

const Archive: NextPage = ({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NextSeo {...archiveSEO} />
      <main className="inner">
        <div className="hero--lower">
          <h2 className="c-title--lower">
            <span className="heading">商品一覧</span>
            <span className="cate en">Catalog Page</span>
          </h2>
        </div>
        <section className="l-products c-pb">
          <div className="l-alignRight">
            <select className="sortButton">
              <option value="update">更新順</option>
              <option value="height">価格：高い順</option>
              <option value="low">価格：安い順</option>
            </select>
          </div>
          <ul className="products">
            {products.map((product: any) => {
              return (
                <li className="productsItem" key={product.id}>
                  <Link href={{ pathname: `/product/${product.id}` }}>
                    <a>
                      <div className="productsItem__img">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={268.45}
                          height={160}
                        />
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
        </section>
        <Category />
      </main>
    </>
  );
};
export default Archive;
