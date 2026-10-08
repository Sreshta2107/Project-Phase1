import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { featuredArtists, featuredArtworks } from '../data/sampleData';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { formatLocalDate } from '../utils/helpers';
import { getArtistProfile, getExhibitionById, getBuyerById } from '../utils/storage';

function ExhibitionDetailsPage() {
  const { id } = useParams();
  const exhibition = getExhibitionById(id);
  const artistArtworks = useArtistArtworks();

  if (!exhibition) return <><Navbar /><main className="container page-shell"><section className="empty-state card"><h1>Exhibition not found</h1><Link to="/exhibitions">Browse Exhibitions</Link></section></main><Footer /></>;

  const profile = getArtistProfile(exhibition.artistId);
  const account = getBuyerById(exhibition.artistId);
  const artist = featuredArtists.find((item) => String(item.id) === String(exhibition.artistId));
  const artistName = profile?.name || artist?.name || account?.name || 'Gallery Artist';
  const artworks = [...featuredArtworks, ...artistArtworks].filter((artwork) =>
    exhibition.artworkIds.map(String).includes(String(artwork.id))
  );

  return (
    <>
      <Navbar />
      <main className="container page-shell exhibition-detail-page">
        <article className="exhibition-detail card">
          <img src={exhibition.coverImage} alt={exhibition.title} />
          <div className="exhibition-detail__content">
            <p className="eyebrow">Virtual exhibition · {exhibition.status}</p>
            <h1>{exhibition.title}</h1>
            <p>Curated by <Link to={`/artist/${exhibition.artistId}`}>{artistName}</Link></p>
            <p>{exhibition.description}</p>
            <p>{formatLocalDate(exhibition.startDate)} – {formatLocalDate(exhibition.endDate)}</p>
          </div>
        </article>
        <section>
          <div className="page-header"><h2>Exhibition Artworks</h2><p>{artworks.length} selected works.</p></div>
          {artworks.length ? <div className="section-grid">{artworks.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}</div> : <div className="empty-state card"><p>This exhibition has no artworks yet.</p></div>}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ExhibitionDetailsPage;