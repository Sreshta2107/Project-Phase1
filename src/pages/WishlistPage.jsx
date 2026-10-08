import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ArtworkCard from '../components/artwork/ArtworkCard';
import Button from '../components/common/Button';
import { galleryArtworks } from '../data/sampleData';
import useGalleryInteractions from '../hooks/useGalleryInteractions';

function WishlistPage() {
  const { wishlistIds } = useGalleryInteractions();
  const savedArtworks = galleryArtworks.filter((artwork) => wishlistIds.includes(String(artwork.id)));

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <h1>Wishlist</h1>
          <p>Your saved artworks and favorites.</p>
        </section>

        {savedArtworks.length > 0 ? (
          <div className="section-grid">
            {savedArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <section className="empty-state card">
            <h2>Your wishlist is waiting for inspiration.</h2>
            <p>Save artworks you love and they will appear here.</p>
            <Link to="/browse"><Button>Browse Artworks</Button></Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default WishlistPage;
