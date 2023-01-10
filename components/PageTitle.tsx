// HTML文字列をHTMLに変換
import parse from 'html-react-parser';
type Props = {
  ja:string
  en:string
};
export const PageTitle = (props: Props) => {
  const { ja,en } = props;
  return (
    <>
      <div className="hero--lower">
        <h2 className="c-title--lower">
          <span className="heading">{parse(ja)}</span>
          <span className="cate en">{en}</span>
        </h2>
      </div>
    </>
  );
};
