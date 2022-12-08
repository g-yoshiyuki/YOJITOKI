import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Favorite: NextPage = () => {
  return (
    <>
      <main className="inner">
        <div className="hero--lower">
          <h2 className="c-title--lower">
            <span className="heading">お気に入り商品</span>
            <span className="cate en">Favorite Product</span>
          </h2>
        </div>
        <section className="l-products c-pb">
          <ul className="products">
            <li className="productsItem soldout">
              <Link href="./single">
                <a>
                  <span className="deleteIcon">
                    <img src="img/delete.svg" alt="" />
                  </span>
                  <div className="productsItem__img">
                    <img src="img/product1.jpg" alt="" />
                  </div>
                  <div className="productsItem__content">
                    <span className="name">商品名が入ります</span>
                    <span className="price">¥0,000</span>
                  </div>
                </a>
              </Link>
            </li>
            <li className="productsItem">
              <a>
                <span className="deleteIcon">
                  <img src="img/delete.svg" alt="" />
                </span>
                <div className="productsItem__img">
                  <img src="img/product2.jpg" alt="" />
                </div>
                <div className="productsItem__content">
                  <span className="name">商品名が入ります</span>
                  <span className="price">¥0,000</span>
                </div>
              </a>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
};
export default Favorite;
