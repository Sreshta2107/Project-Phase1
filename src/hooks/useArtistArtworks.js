import { useEffect, useState } from 'react';
import { getAllArtistArtworks } from '../utils/storage';

function useArtistArtworks() {
  const [artworks, setArtworks] = useState(() => getAllArtistArtworks());

  useEffect(() => {
    const refresh = () => setArtworks(getAllArtistArtworks());
    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return artworks;
}

export default useArtistArtworks;