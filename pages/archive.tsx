import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../components/Category';
import { NextSeo } from 'next-seo';
import { archiveSEO } from '../constants/next-seo.config';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/products`).then((response) => response.json());
  return {
    props: {
      products,
    },
  };
};

const Archive: NextPage = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filter, setFilter] = useState<any>('update');
  const [filteredProducts, setFilteredProducts] = useState<any>(products);

  useEffect(() => {
    const sortProducts = () => {
      switch (filter) {
        case 'height':
          var cloneProducts = Array.from(products);
          const sortLowArray = cloneProducts.sort((a: any, b: any) => Date.parse(b.prices[0].unit_amount) - Date.parse(a.prices[0].unit_amount));
          setFilteredProducts(sortLowArray);
          break;
        case 'low':
          var cloneProducts = Array.from(products);
          const sortHeightArray = cloneProducts.sort((a: any, b: any) => Date.parse(a.prices[0].unit_amount) - Date.parse(b.prices[0].unit_amount));
          setFilteredProducts(sortHeightArray);

          break;
        default:
          setFilteredProducts(products);
      }
    };
    sortProducts();
  }, [filter]);

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
            <select className="sortButton" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="update">更新順</option>
              <option value="height">価格：高い順</option>
              <option value="low">価格：低い順</option>
            </select>
          </div>
          <ul className="products">
            {filteredProducts.map((product: any) => {
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
        </section>
        <Category />
      </main>
    </>
  );
};
export default Archive;
