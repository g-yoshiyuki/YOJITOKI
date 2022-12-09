import Link from 'next/link';
import Image from 'next/image';
import { categoriesData } from '../constants/categoriesData';

export const Category = () => {
  return (
    <>
      <section className="l-category c-pd">
        <h2 className="c-title">
          形から選ぶ<span>Category</span>
        </h2>
        <ul className="category">
          {categoriesData.map((categoryData: any) => {
            // userの情報
            const cateProps = {
              name: categoryData.name,
              cate: categoryData.cate,
            };
            return (
              <li className="categoryItem" key={categoryData.name}>
                <Link href={{ pathname: categoryData.link, query: cateProps }} as={categoryData.link}>
                  <a>
                    <div className="categoryItem__img">
                      <Image src={categoryData.img} width={129.41} height={85} alt="" />
                    </div>
                    <div className="categoryItem__content">
                      <span className="name">{categoryData.name}</span>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
