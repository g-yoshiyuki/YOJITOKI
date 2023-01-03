import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../components/Category';
import { NextSeo } from 'next-seo';
import { archiveSEO } from '../constants/next-seo.config';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/products`).then((response) => response.json());
  return {
    props: {
      products,
    },
  };
};

const Archive: NextPage = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // 【ページネーションで商品を表示するプログラム】
  // ページに表示するアイテムの数
  const itemsPerPage = 8;
  // ページごとの最初の配列番号
  const [itemsOffset, setItemsOffset] = useState(0);
  // ページごとの最後の配列番号
  // (最後の要素プラス1にする。スライス関数は、指定した値のひとつ手前までを取得するため、プラス1の数字を指定する必要がある。)
  const endOffset = itemsOffset + itemsPerPage;
  // 何ページ生成するか。(Math.ceil関数は計算結果を繰り上げる)
  const pageCount = Math.ceil(products.length / itemsPerPage);
  // 1ページに表示するアイテム群
  const currentProducts = products.slice(itemsOffset, endOffset);
  const handlePageClick = (e: { selected: number }) => {
    // e.selectedには、選択したページ番号から1引いた数が入る
    const newOffset = (e.selected * itemsPerPage) % products.length;
    setItemsOffset(newOffset);
  };

  // 【価格順に並び替えるプログラム】
  const [filter, setFilter] = useState<any>('update');
  const [filteredProducts, setFilteredProducts] = useState<any>(currentProducts);
  useEffect(() => {
    const sortProducts = () => {
      switch (filter) {
        case 'height':
          var cloneProducts = Array.from(currentProducts);
          const sortLowArray = cloneProducts.sort((a: any, b: any) => Date.parse(b.prices[0].unit_amount) - Date.parse(a.prices[0].unit_amount));
          setFilteredProducts(sortLowArray);
          break;
        case 'low':
          var cloneProducts = Array.from(currentProducts);
          const sortHeightArray = cloneProducts.sort((a: any, b: any) => Date.parse(a.prices[0].unit_amount) - Date.parse(b.prices[0].unit_amount));
          setFilteredProducts(sortHeightArray);
          break;
        default:
          setFilteredProducts(currentProducts);
      }
    };
    sortProducts();
    // currentProductsはuseStateではなく変数のため、値を変更しても再レンダリングされない。itemsOffsetをuseEffectの対象に含めることでdefaultが実行され、値の変更が反映される。
    // ※currentProductsを対象にすると無限ループしてしまう。
  }, [filter,itemsOffset]);

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
          {/* 追記 */}
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="<"
            nextLabel=">"
            previousClassName="page-item"
            nextClassName="page-item"
          />
        </section>
        <Category />
      </main>
    </>
  );
};
export default Archive;
