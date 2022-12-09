import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../../components/Category';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { archiveSEO } from '../../constants/next-seo.config';

export const getServerSideProps: GetServerSideProps = async ({ params }: any) => {
  const cate = params.cate as string;
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/products`).then((response) => response.json());
  const filteringProduct = products.filter((product: any) => product.cate === cate);
  return {
    props: { filteringProduct },
  };
};

const Cate: NextPage = ({ filteringProduct }: any) => {
  const router = useRouter();

  return (
    <>
      <NextSeo {...archiveSEO} />
      <main className="inner">
        <div className="hero--lower">
          <h2 className="c-title--lower">
            <span className="heading">商品一覧</span>
            <span className="cate">
              ｢<span className="strong">{router.query?.name ?? ''}</span>｣の商品一覧
            </span>
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
            {filteringProduct.map((product: any) => {
              return (
                <li className="productsItem" key={product.id}>
                  <Link href={{ pathname: `/product/${product.id}` }}>
                    <a>
                      <div className="productsItem__img">
                        <Image src={product.images[0]} width={268.45} height={160} alt="" />
                      </div>
                      <div className="productsItem__content">
                        <span className="name">{product.name}</span>
                        <span className="price">{product.price}</span>
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
export default Cate;
