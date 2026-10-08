import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { createExhibition, getExhibitionById, updateOwnedExhibition } from '../utils/storage';

function ArtistExhibitionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const artworks = useArtistArtworks().filter((artwork) => String(artwork.artistId) === String(currentUser.id));
  const loadedExhibition = id ? getExhibitionById(id) : null;
  const exhibition = loadedExhibition && String(loadedExhibition.artistId) === String(currentUser.id) ? loadedExhibition : null;
  const [form, setForm] = useState(() => exhibition ? ({
    title: exhibition.title,
    description: exhibition.description,
    coverImage: exhibition.coverImage,
    startDate: exhibition.startDate.slice(0, 10),
    endDate: exhibition.endDate.slice(0, 10),
    artworkIds: exhibition.artworkIds.map(String),
  }) : ({ title: '', description: '', coverImage: '', startDate: '', endDate: '', artworkIds: [] }));
  const [error, setError] = useState('');

  const update = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const toggleArtwork = (artworkId) => setForm((previous) => ({
    ...previous,
    artworkIds: previous.artworkIds.includes(String(artworkId))
      ? previous.artworkIds.filter((currentId) => currentId !== String(artworkId))
      : [...previous.artworkIds, String(artworkId)],
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const start = new Date(`${form.startDate}T00:00:00`).getTime();
    const end = new Date(`${form.endDate}T23:59:59`).getTime();
    if (!form.title.trim() || !form.description.trim() || !form.coverImage.trim() || !form.startDate || !form.endDate || end < start) {
      setError('Complete all required fields and choose a valid date range.');
      return;
    }

    const validArtworkIds = form.artworkIds.filter((artworkId) => artworks.some((artwork) => String(artwork.id) === artworkId));
    const exhibitionData = {
      title: form.title.trim(),
      description: form.description.trim(),
      coverImage: form.coverImage.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      artworkIds: validArtworkIds,
    };

    if (exhibition) updateOwnedExhibition(currentUser.id, exhibition.id, exhibitionData);
    else createExhibition(currentUser.id, exhibitionData);
    navigate('/artist/exhibitions');
  };

  if (id && !exhibition) {
    return <><Navbar /><main className="container page-shell"><section className="empty-state card"><h1>Exhibition unavailable</h1><p>This exhibition does not belong to your account.</p><Link to="/artist/exhibitions"><Button>Back to Exhibitions</Button></Link></section></main><Footer /></>;
  }

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header"><p className="eyebrow">Artist workspace</p><h1>{exhibition ? 'Edit Exhibition' : 'Create Exhibition'}</h1><p>Build a virtual exhibition from your published artwork.</p></section>
        <form className="artist-artwork-form card" onSubmit={handleSubmit}>
          <div className="artist-form-grid">
            <label>Exhibition Title *<input name="title" value={form.title} onChange={update} required /></label>
            <label>Cover Image URL *<input type="url" name="coverImage" value={form.coverImage} onChange={update} required /></label>
            <label>Start Date *<input type="date" name="startDate" value={form.startDate} onChange={update} required /></label>
            <label>End Date *<input type="date" name="endDate" value={form.endDate} onChange={update} required /></label>
            <label className="artist-form-grid__wide">Description *<textarea name="description" value={form.description} onChange={update} rows="5" required /></label>
            <fieldset className="artwork-picker artist-form-grid__wide">
              <legend>Select Artworks</legend>
              {artworks.length ? artworks.map((artwork) => (
                <label className="artwork-picker__item" key={artwork.id}>
                  <input type="checkbox" checked={form.artworkIds.includes(String(artwork.id))} onChange={() => toggleArtwork(artwork.id)} />
                  <img src={artwork.image} alt="" />
                  <span>{artwork.title}</span>
                </label>
              )) : <p>Upload artwork before creating an exhibition.</p>}
            </fieldset>
          </div>
          {error && <p className="form-message form-message--error" role="alert">{error}</p>}
          <div className="dashboard-actions"><Button type="submit">{exhibition ? 'Save Exhibition' : 'Create Exhibition'}</Button><Link to="/artist/exhibitions"><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default ArtistExhibitionFormPage;