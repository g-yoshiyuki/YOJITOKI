import { NextPage } from 'next';
import Link from 'next/link';

const Success: NextPage = () => {
  return (
    <main>
      <div className="l-completion c-pd">
        <div className="inner">
          <p className="heading">支払いが完了しました</p>
          <Link href="./">
            <a className="c-btn ja">トップへ戻る</a>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Success;
