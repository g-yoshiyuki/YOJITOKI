import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { Layout } from '../components/Layout';
import { DefaultSeo } from 'next-seo';
import { defaultSEO } from '../constants/next-seo.config';
import { CartProvider, useShoppingCart } from 'use-shopping-cart';
import Head from 'next/head';
import { useEffect } from 'react';
import { userState } from '../lib/atoms';

function AppInit() {
  const { clearCart } = useShoppingCart();
  const user = useRecoilValue(userState);
  useEffect(() => {
    (async () => {
      if (user === null) {
        clearCart();
      }
    })();
  }, [user]);
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY}
      currency="JPY"
      successUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/success`}
      cancelUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/cancel`}
      // 追記。無いとエラーになった。カートの中身を他のページで共有できる
      shouldPersist={true}
    >
      <RecoilRoot>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <DefaultSeo {...defaultSEO} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AppInit />
      </RecoilRoot>
    </CartProvider>
  );
}
export default MyApp;
