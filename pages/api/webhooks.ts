import Stripe from "stripe";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";

type Object = {
  payment_status: any;
  id: string;
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    // bodyParser
    // メッセージボディを解析してプログラムで参照しやすいオブジェクトに変換
    bodyParser: false,
  },
};

//Stripe以外からAPIを呼び出した場合に、エラーを返す
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    // throw new は例外発生時の処理を書く
    if (!sig) throw new Error("No signature provided");
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret!);
  } catch (e) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // 注文内容を取得
  const data = event.data.object as Object;
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return res.status(200).end();
  }
  /**
   * 支払いが完全に完了している場合のみ処理する
   **/
  if (data.payment_status === "paid") {
    const item = await stripe.checkout.sessions.listLineItems(data.id);
    console.log(item);
    /**
     * カートの中身の情報を利用して、発送業務などのシステムを呼び出す
     **/
  }

  return res.status(200).end();
}
