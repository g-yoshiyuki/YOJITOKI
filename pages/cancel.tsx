import { NextPage } from "next";
import Link from "next/link";

const Cancel: NextPage = () => {
  return (
    <main>
      <div className="l-completion">
        <div className="inner">
          <p className="heading">支払いが失敗しました</p>
          <Link href="./">
            <a className="c-btn ja">トップへ戻る</a>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Cancel;
