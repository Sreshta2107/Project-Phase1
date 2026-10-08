import { useEffect, useState } from 'react';
import { getAuctions, getBids } from '../utils/storage';

function useAuctionData() {
  const [auctions, setAuctions] = useState(() => getAuctions());
  const [bids, setBids] = useState(() => getBids());

  useEffect(() => {
    const refresh = () => {
      setAuctions(getAuctions());
      setBids(getBids());
    };

    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { auctions, bids };
}

export default useAuctionData;