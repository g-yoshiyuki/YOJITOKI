export const defaultSEO = {
  defaultTitle: 'YOJITOKI OnlineShop',
  description: 'YOJITOKIのオンラインショップです。かわいいものから上品なものまで、普段づかいにぴったりなうつわが見つかります。',
  canonical: process.env.NEXT_PUBLIC_BASE_URL,
  openGraph: {
    type: 'website',
    title: 'YOJITOKI OnlineShop',
    description: 'YOJITOKIのオンラインショップです。かわいいものから上品なものまで、普段づかいにぴったりなうつわが見つかります。',
    site_name: 'YOJITOKI OnlineShop',
    url: '',
    images: [
      {
        url: '/img/ogp.jpg',
        width: 1000,
        height: 410,
        alt: 'YOJITOKI OnlineShop',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    // handle: "@handle",
    // site: "@site",
    cardType: 'summary_large_image',
  },
};

export const archiveSEO = {
  title: '商品一覧 | YOJITOKI OnlineShop',
  description: 'YOJITOKIの商品一覧ページです。',
  canonical: `${process.env.NEXT_PUBLIC_BASE_URL}archive`,
  openGraph: {
    url: '',
    title: '商品一覧 | YOJITOKI OnlineShop',
    description: 'YOJITOKIの商品一覧ページです。',
  },
};
export const productSEO = {
  title: '商品詳細 | YOJITOKI OnlineShop',
  description: 'YOJITOKIの商品詳細ページです。',
  canonical: `${process.env.NEXT_PUBLIC_BASE_URL}product`,
  openGraph: {
    url: '',
    title: '商品一覧 | YOJITOKI OnlineShop',
    description: 'YOJITOKIの商品詳細ページです。',
  },
};
export const contactSEO = {
  title: 'お問い合わせ | YOJITOKI OnlineShop',
  description: 'YOJITOKIのお問い合わせページです。',
  canonical: `${process.env.NEXT_PUBLIC_BASE_URL}contact`,
  openGraph: {
    url: '',
    title: 'お問い合わせ | YOJITOKI OnlineShop',
    description: 'YOJITOKIのお問い合わせページです。',
  },
};
