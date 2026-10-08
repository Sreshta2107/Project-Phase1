import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { deleteOwnedArtistArtwork, getArtworkLikeCount } from '../utils/storage';

function ArtistArtworksPage() {
  const { currentUser } = useAuth();
  const artworks = useArtistArtworks().filter(
    (artwork) => String(artwork.artistId) === String(currentUser.id)
  );

  const handleDelete = (artwork) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    deleteOwnedArtistArtwork(currentUser.id, artwork.id);
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="artist-artworks-heading">
          <div className="page-header">
            <p className="eyebrow">Artist workspace</p>
            <h1>My Artworks</h1>
            <p>Manage the pieces you have shared with the gallery.</p>
          </div>
          <Link to="/artist/artworks/new"><Button>Upload Artwork</Button></Link>
        </section>

        {artworks.length ? (
          <div className="artist-artworks-grid">
            {artworks.map((artwork) => (
              <article className="artist-work-card card" key={artwork.id}>
                <Link to={`/artwork/${artwork.id}`} className="artist-work-card__image-link"><img src={artwork.image} alt={artwork.title} /></Link>
                <div className="artist-work-card__body">
                  <div className="artist-work-card__title-row">
                    <div><h2>{artwork.title}</h2><p>{artwork.category}</p></div>
                    <span className="order-status">{artwork.status}</span>
                  </div>
                  <div className="artist-work-card__meta"><strong>${Number(artwork.price).toLocaleString()}</strong><span>♥ {getArtworkLikeCount(artwork.id, artwork.likes)}</span></div>
                  <div className="artist-work-card__actions">
                    <Link to={`/artwork/${artwork.id}`}><Button variant="outline">View</Button></Link>
                    <Link to={`/artist/artworks/edit/${artwork.id}`}><Button variant="secondary">Edit</Button></Link>
                    <Button variant="outline" onClick={() => handleDelete(artwork)}>Delete</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state card">
            <h2>Your gallery is ready for its first artwork.</h2>
            <p>Upload a piece to share it with visitors and collectors.</p>
            <Link to="/artist/artworks/new"><Button>Upload Artwork</Button></Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ArtistArtworksPage;