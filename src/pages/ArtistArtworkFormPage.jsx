import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { createArtistArtwork, getArtistProfile, getOwnedArtistArtwork, updateOwnedArtistArtwork } from '../utils/storage';

const categories = ['Painting', 'Digital Art', 'Photography', 'Sculpture', 'Abstract Art', 'Traditional Art'];

function ArtistArtworkFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const existingArtwork = id ? getOwnedArtistArtwork(currentUser.id, id) : null;
  const artistProfile = getArtistProfile(currentUser.id);
  const [form, setForm] = useState(() => existingArtwork ? ({
    ...existingArtwork,
    tags: Array.isArray(existingArtwork.tags) ? existingArtwork.tags.join(', ') : existingArtwork.tags ?? '',
  }) : ({
    title: '', description: '', image: '', price: '', category: 'Painting',
    medium: '', dimensions: '', yearCreated: '', tags: '',
  }));
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  const updateField = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const image = form.image.trim();
    const price = Number(form.price);
    if (!title || !description || !image || !form.category || !Number.isFinite(price) || price <= 0) {
      setError('Complete all required fields and enter a valid price.');
      return;
    }

    const artworkData = {
      title,
      description,
      image,
      price,
      category: form.category,
      artistName: artistProfile?.name || currentUser.name,
      medium: form.medium.trim(),
      dimensions: form.dimensions.trim(),
      yearCreated: form.yearCreated ? Number(form.yearCreated) : '',
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    if (isEditing) {
      const updated = updateOwnedArtistArtwork(currentUser.id, id, artworkData);
      if (!updated) {
        setError('This artwork was not found or does not belong to your account.');
        return;
      }
    } else {
      createArtistArtwork(currentUser.id, {
        id: `artist-${currentUser.id}-${Date.now()}`,
        ...artworkData,
        likes: 0,
        createdAt: new Date().toISOString(),
        status: 'Published',
      });
    }

    navigate('/artist/artworks');
  };

  if (isEditing && !existingArtwork) {
    return (
      <>
        <Navbar />
        <main className="container page-shell"><section className="empty-state card"><h1>Artwork unavailable</h1><p>This artwork does not belong to your account.</p><Link to="/artist/artworks"><Button>Back to My Artworks</Button></Link></section></main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <p className="eyebrow">Artist workspace</p>
          <h1>{isEditing ? 'Edit Artwork' : 'Upload Artwork'}</h1>
          <p>{isEditing ? 'Update the details of your artwork.' : 'Add a new piece to the public gallery.'}</p>
        </section>

        <form className="artist-artwork-form card" onSubmit={handleSubmit}>
          <div className="artist-form-grid">
            <label>Artwork Title *<input name="title" value={form.title} onChange={updateField} required /></label>
            <label>Image URL *<input name="image" type="url" value={form.image} onChange={updateField} required /></label>
            <label>Price *<input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} required /></label>
            <label>Category *<select name="category" value={form.category} onChange={updateField} required>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Medium<input name="medium" value={form.medium} onChange={updateField} placeholder="e.g. Oil on canvas" /></label>
            <label>Dimensions<input name="dimensions" value={form.dimensions} onChange={updateField} placeholder="e.g. 60 x 80 cm" /></label>
            <label>Year Created<input name="yearCreated" type="number" min="0" max="2100" value={form.yearCreated} onChange={updateField} /></label>
            <label>Tags<input name="tags" value={form.tags} onChange={updateField} placeholder="landscape, blue, original" /></label>
            <label className="artist-form-grid__wide">Artwork Description *<textarea name="description" value={form.description} onChange={updateField} rows="6" required /></label>
          </div>
          {error && <p className="form-message form-message--error" role="alert">{error}</p>}
          <div className="dashboard-actions">
            <Button type="submit">{isEditing ? 'Save Changes' : 'Upload Artwork'}</Button>
            <Link to="/artist/artworks"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default ArtistArtworkFormPage;