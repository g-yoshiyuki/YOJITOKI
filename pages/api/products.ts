import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_API_KEY: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY: string;
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET以外のリクエストを許可しない
  if (req.method!.toLocaleLowerCase() !== 'get') {
    return res.status(405).end();
  }

  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2022-11-15',
    maxNetworkRetries: 3,
  });

  //stripeに登録した商品一覧を取得(料金情報は含まれない)
  const products = await stripe.products.list();

  //商品データが０件だった場合に空の配列を返す
  if (!products.data || products.data.length < 1) {
    return res.status(200).json([]);
  }

  const response = await Promise.all(
    products.data.map(async (product, i) => {
      // 該当商品の料金情報を取得
      const prices = await stripe.prices.list({
        product: product.id,
      });
      return {
        id: product.id,
        description: product.description,
        name: product.name,
        images: product.images,
        unit_label: product.unit_label,
        cate: product.metadata.cate,
        thum1: product.metadata.thum1,
        thum2: product.metadata.thum2,
        thum3: product.metadata.thum3,
        // 料金は複数設定されている可能性があるのでmapで展開する
        prices: prices.data.map((price) => {
          return {
            id: price.id,
            currency: price.currency,
            transform_quantity: price.transform_quantity,
            unit_amount: price.unit_amount,
          };
        }),
      };
    })
  );
  res.status(200).json(response);
}
