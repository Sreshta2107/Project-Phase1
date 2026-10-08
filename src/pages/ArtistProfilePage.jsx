import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { featuredArtists, featuredArtworks } from '../data/sampleData';
import useGalleryInteractions from '../hooks/useGalleryInteractions';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { getArtistProfile, getBuyerById } from '../utils/storage';

function ArtistProfilePage() {
  const { id } = useParams();
  const artistArtworks = useArtistArtworks();
  const savedProfile = getArtistProfile(id);
  const artistAccount = getBuyerById(id);
  const artistArtwork = artistArtworks.find((item) => String(item.artistId) === String(id));
  const artist = featuredArtists.find((item) => String(item.id) === String(id))
    ?? {
      id,
      name: savedProfile?.name || artistAccount?.name || artistArtwork?.artistName || 'Gallery Artist',
      specialty: savedProfile?.specialization || 'Independent Artist',
      bio: savedProfile?.bio || artistAccount?.bio || 'Artist on the Online Art Gallery.',
      profileImage: savedProfile?.profileImage || artistAccount?.profileImage || artistArtwork?.image,
      location: savedProfile?.location || 'Online',
      followers: 0,
    };
  const { isArtistFollowed, toggleFollowForArtist, getFollowerCount } = useGalleryInteractions();
  const followed = isArtistFollowed(artist.id);
  const portfolio = [...featuredArtworks, ...artistArtworks].filter(
    (artwork) => String(artwork.artistId) === String(artist.id)
  );

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="profile-header card">
          <img className="profile-avatar" src={artist.profileImage} alt={artist.name} />
          <div>
            <p className="eyebrow">Featured artist</p>
            <h1>{artist.name}</h1>
            <p>{artist.specialty}</p>
            <p>{artist.location}</p>
            <p>{getFollowerCount(artist).toLocaleString()} followers</p>
            <div className="detail-actions">
              <button
                type="button"
                className={`detail-button ${followed ? 'detail-button--active' : ''}`}
                aria-pressed={followed}
                onClick={() => toggleFollowForArtist(artist.id)}
              >
                {followed ? 'Following' : 'Follow Artist'}
              </button>
            </div>
          </div>
        </section>

        <section className="page-shell compact-shell">
          <h2>Artist portfolio</h2>
          <div className="section-grid">
            {portfolio.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ArtistProfilePage;
