import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { Layout } from '../components/Layout';
import { DefaultSeo } from 'next-seo';
import { defaultSEO } from '../constants/next-seo.config';
import { CartProvider, useShoppingCart } from 'use-shopping-cart';
import Head from 'next/head';
import { useEffect } from 'react';
import { pageLoadingState, paymentsDataState, userDocState, userState } from '../lib/atoms';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';

function AppInit() {
  const { clearCart } = useShoppingCart();
  const user = useRecoilValue(userState);
  const setUserDoc = useSetRecoilState<any>(userDocState);
  const setPaymentsData = useSetRecoilState<any>(paymentsDataState);

  // router.eventsでページ遷移イベントを取得してpageLoadingStateの値を変更する
  const router = useRouter();
  const setPageLoading = useSetRecoilState<any>(pageLoadingState);
  const handleStart = (url: any) => url !== router.asPath && setPageLoading('start');
  const handleComplete = () => setPageLoading('complete');
  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  // ユーザーに変更があった時、ユーザーのdocumentを取得してマイページに反映させる。
  useEffect(() => {
    (async () => {
      if (user === null) {
        clearCart();
        setUserDoc([]);
        setPaymentsData([]);
      } else {
        const documentRef = doc(db, 'users', user.user.uid);
        const document = await getDoc(documentRef);
        setUserDoc(document.data());
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
