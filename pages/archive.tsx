import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../components/Category';
import { NextSeo } from 'next-seo';
import { archiveSEO } from '../constants/next-seo.config';
import { createRef, useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { PageTitle } from '../components/PageTitle';
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
    // ページネーションをクリックした時に遷移前のページと商品数が異なる為、一旦、Refを空にする。
    loadingItemRef.current = []
    // e.selectedには、選択したページ番号から1引いた数が入る
    const newOffset = (e.selected * itemsPerPage) % products.length;
    setItemsOffset(newOffset);
  };

  // 【価格順に並び替えるプログラム】
  const [filter, setFilter] = useState<any>('update');
  const [filteredProducts, setFilteredProducts] = useState<any>(currentProducts);
  const pageLoading = useRecoilValue(pageLoadingState);
  const [isReady, setIsReady] = useState<boolean>(false);
  const loadingItemRef: any = useRef([]);

  useEffect(() => {
    const sortProducts = () => {
      switch (filter) {
        case 'height':
          const cloneProductsHeight = Array.from(currentProducts);
          const sortLowArray = cloneProductsHeight.sort((a: any, b: any) => Date.parse(b.prices[0].unit_amount) - Date.parse(a.prices[0].unit_amount));
          setFilteredProducts(sortLowArray);
          break;
        case 'low':
          const cloneProductsLow = Array.from(currentProducts);
          const sortHeightArray = cloneProductsLow.sort((a: any, b: any) => Date.parse(a.prices[0].unit_amount) - Date.parse(b.prices[0].unit_amount));
          setFilteredProducts(sortHeightArray);
          break;
        default:
          setFilteredProducts(currentProducts);
      }
    };
    sortProducts();
    // currentProductsはuseStateではなく変数のため、値を変更しても再レンダリングされない。itemsOffsetをuseEffectの対象に含めることでdefaultが実行され、値の変更が反映される。
    // ※currentProductsを対象にすると無限ループしてしまう。
  }, [filter, itemsOffset]);

  // 商品画像のスケルトンスクリーン
  useEffect(() => {
    if (currentProducts) {
      currentProducts.forEach((_: any, i: number) => {
        loadingItemRef.current[i] = createRef();
      });
    }
    setIsReady(true);
  }, [products,itemsOffset]);

  useEffect(() => {
    if (isReady) {
      if (pageLoading === 'default' || pageLoading === 'complete') {
        loading(loadingItemRef.current, pageLoading);
        setIsReady(false);
      }
    }
  }, [pageLoading, isReady]);

  return (
    <>
      <NextSeo {...archiveSEO} />
      <main className="inner">
        <PageTitle ja={'商品一覧'} en={'Catalog Page'} />
        <section className="l-products c-pb">
          <div className="l-alignRight">
            <select className="sortButton" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="update">更新順</option>
              <option value="height">価格：高い順</option>
              <option value="low">価格：低い順</option>
            </select>
          </div>
          <ul className="products">
            {filteredProducts.map((product: any, i: number) => {
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
