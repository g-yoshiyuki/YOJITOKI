import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!.toLocaleLowerCase() !== 'post') {
    return res.status(405).end();
  }
  try {
    // cart.tsxからpost送信されたリクエストのbodyを展開して
    // その内容でCheckoutセッションを作成。
    const { price, quantity, items } = req.body;
    const lineItems = items
      ? items.map((item: any) => ({
          price: item.id,
          quantity: item.quantity,
          adjustable_quantity: {
            enabled: true,
          },
        }))
      : [
          {
            price,
            quantity,

            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          },
        ];

    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
      maxNetworkRetries: 3,
    });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    if (!items) return res.redirect(301, session.url!);
    res.status(200).json({
      url: session.url,
    });
  } catch (e: any) {
    console.log(e);
    res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
}
