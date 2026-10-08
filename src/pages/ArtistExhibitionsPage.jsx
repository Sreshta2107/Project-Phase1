import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { formatLocalDate } from '../utils/helpers';
import { deleteOwnedExhibition, getExhibitionsForArtist } from '../utils/storage';

function ArtistExhibitionsPage() {
  const { currentUser } = useAuth();
  const [exhibitions, setExhibitions] = useState(() => getExhibitionsForArtist(currentUser.id));

  useEffect(() => {
    const refresh = () => setExhibitions(getExhibitionsForArtist(currentUser.id));
    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [currentUser.id]);

  const handleDelete = (exhibition) => {
    if (!window.confirm('Delete this exhibition?')) return;
    deleteOwnedExhibition(currentUser.id, exhibition.id);
    setExhibitions(getExhibitionsForArtist(currentUser.id));
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="artist-artworks-heading">
          <div className="page-header"><p className="eyebrow">Artist workspace</p><h1>My Exhibitions</h1><p>Create virtual shows featuring your artwork.</p></div>
          <Link to="/artist/exhibitions/new"><Button>Create Exhibition</Button></Link>
        </section>

        {exhibitions.length ? (
          <div className="exhibition-grid">
            {exhibitions.map((exhibition) => (
              <article className="exhibition-card card" key={exhibition.id}>
                <Link to={`/exhibitions/${exhibition.id}`}><img src={exhibition.coverImage} alt={exhibition.title} /></Link>
                <div className="exhibition-card__body">
                  <div className="exhibition-card__heading"><h2>{exhibition.title}</h2><span className={`exhibition-status exhibition-status--${exhibition.status.toLowerCase()}`}>{exhibition.status}</span></div>
                  <p>{exhibition.description}</p>
                  <div className="exhibition-card__dates"><span>{formatLocalDate(exhibition.startDate)}</span><span>to</span><span>{formatLocalDate(exhibition.endDate)}</span></div>
                  <span>{exhibition.artworkIds.length} artworks</span>
                  <div className="exhibition-card__actions">
                    <Link to={`/exhibitions/${exhibition.id}`}><Button variant="outline">View</Button></Link>
                    <Link to={`/artist/exhibitions/edit/${exhibition.id}`}><Button variant="secondary">Edit</Button></Link>
                    <Button variant="outline" onClick={() => handleDelete(exhibition)}>Delete</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state card"><h2>Your first virtual exhibition starts here.</h2><p>Select your artwork and create a public show.</p><Link to="/artist/exhibitions/new"><Button>Create Exhibition</Button></Link></section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ArtistExhibitionsPage;