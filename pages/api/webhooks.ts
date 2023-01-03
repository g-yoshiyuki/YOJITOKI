import Stripe from 'stripe';
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

type Object = {
  payment_status: any;
  id: string;
  metadata: any;
};
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2022-11-15',
});
export const config = {
  api: {
    bodyParser: false,
  },
};

// ここからAPI
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //Stripe以外からAPIを呼び出した場合に、エラーを返す
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;
  try {
    if (!sig) throw new Error('No signature provided');
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret!);
  } catch (e) {
    const err = e instanceof Error ? e : new Error('Bad Request');
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // dataオブジェクトの中身はstripe管理画面のイベントデータで確認。
  // 複数商品を決済した場合は合算したデータが格納されている
  // listLineItemsの引数にdata.idを渡すことで、カートに入っていた個々の商品情報が出力できる
  const data = event.data.object as Object;

  // 支払い完了かつ支払い成功ではない時
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return res.status(200).end();
  }

  // 支払いが完全に完了している場合
  if (data.payment_status === 'paid') {
    const item: any = await stripe.checkout.sessions.listLineItems(data.id);
    console.log(item);
    // ユーザーのdocumentにpaymentコレクションを作成して、
    // 決済完了した商品情報を追加。
    if (event.type === 'checkout.session.completed') {
      const userId = data.metadata.userId;
      const documentRef = doc(db, 'users', userId, 'payment', data.id);
      await setDoc(documentRef, item);
      await updateDoc(documentRef, { timestamp: serverTimestamp() });

      // 商品IDを使って、stripe管理画面から登録したメタデータのstock(在庫)の値を-1する
      // ※APIキーにproductの書き込み権限を付与する
      item.data.map(async (data: any) => {
        const productId = await data.price.product;
        // 購入した数
        const boughtQuantity = data.quantity;
        const product = await stripe.products.retrieve(productId);
        // 商品の在庫数
        const stock: any = product.metadata.stock;

        await stripe.products.update(productId, { metadata: { stock: stock - boughtQuantity } });
      });
    }
  }

  return res.status(200).end();
}
