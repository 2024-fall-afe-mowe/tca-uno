import { useEffect } from 'react';

const useUnoTitle = (pageTitle: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${pageTitle} - TCA Uno Buddy`;
    return () => {
      document.title = originalTitle;
    };
  }, [pageTitle]);
};

export default useUnoTitle;
