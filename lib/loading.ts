export const loading = (loadingItems: any, loadingState: any) => {
  const hideLoading = (loadingItems: any, className: any) => {
    loadingItems.forEach((loadingItem: any) => {
      loadingItem?.current.classList.add(className);
    });
  };
  // 初回アクセス時に実行
  window.addEventListener('load', () => {
    // currentが配列に格納されていたら
    if (Array.isArray(loadingItems)) {
      // setTimeout(() => {
        hideLoading(loadingItems, 'loadingComplete');
      // }, 3000);
    } else {
      // setTimeout(() => {
        loadingItems.current.classList.add('loadingComplete');
      // }, 3000);
    }
    return;
  });

  // ページ遷移時に実行
  if (loadingState === 'complete') {
    if (Array.isArray(loadingItems)) {
      // setTimeout(() => {
        hideLoading(loadingItems, 'loadingComplete');
      // }, 1000);
    } else {
      // setTimeout(() => {
        loadingItems.current.classList.add('loadingComplete');
      // }, 1000);
    }
  }
};
