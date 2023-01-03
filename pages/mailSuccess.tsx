
import { NextPage } from 'next';
import Link from 'next/link';
const MailSuccess: NextPage = () => {
  return (
    <main>
      <div className="l-completion c-pd">
        <div className="inner">
          <p className="heading">メールの送信が<span className="ib">完了しました</span></p>
          <p className="c-text text-center mb15">
            お問い合わせいただき<span className="ib">誠にありがとうございます。</span>
            <br />
            折返しご連絡を差し上げますので<span className="ib">今しばらくお待ち下さい。</span>
          </p>
          <Link href="./">
            <a className="c-btn ja">トップへ戻る</a>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default MailSuccess;
