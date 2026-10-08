import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { getArtistProfile, saveArtistProfile } from '../utils/storage';

function ArtistProfileManagementPage() {
  const { currentUser } = useAuth();
  const savedProfile = getArtistProfile(currentUser.id);
  const [profile, setProfile] = useState(() => savedProfile ?? ({
    name: currentUser.name,
    profileImage: currentUser.profileImage,
    bio: currentUser.bio ?? '',
    email: currentUser.email,
    location: '',
    website: '',
    specialization: '',
  }));
  const [editing, setEditing] = useState(!savedProfile);
  const [message, setMessage] = useState('');

  const updateField = (event) => {
    setProfile((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveArtistProfile(currentUser.id, {
      ...profile,
      name: profile.name.trim(),
      bio: profile.bio.trim(),
      location: profile.location.trim(),
      website: profile.website.trim(),
      specialization: profile.specialization.trim(),
    });
    setEditing(false);
    setMessage('Artist profile saved.');
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <p className="eyebrow">Artist workspace</p>
          <h1>Artist Profile</h1>
          <p>Keep your gallery profile current for collectors and visitors.</p>
        </section>

        <form className="artist-profile-form card" onSubmit={handleSubmit}>
          <div className="artist-profile-form__preview"><img src={profile.profileImage} alt="Artist profile preview" /></div>
          <div className="artist-profile-form__fields">
            <div className="artist-form-grid">
              <label>Artist Name<input name="name" value={profile.name} onChange={updateField} disabled={!editing} required /></label>
              <label>Email<input name="email" type="email" value={profile.email} onChange={updateField} disabled={!editing} required /></label>
              <label>Profile Image URL<input name="profileImage" type="url" value={profile.profileImage} onChange={updateField} disabled={!editing} required /></label>
              <label>Location<input name="location" value={profile.location} onChange={updateField} disabled={!editing} placeholder="City, Country" /></label>
              <label>Website<input name="website" type="url" value={profile.website} onChange={updateField} disabled={!editing} placeholder="https://example.com" /></label>
              <label>Art Specialization<input name="specialization" value={profile.specialization} onChange={updateField} disabled={!editing} placeholder="e.g. Abstract painting" /></label>
              <label className="artist-form-grid__wide">Biography<textarea name="bio" value={profile.bio} onChange={updateField} disabled={!editing} rows="5" required /></label>
            </div>
            <div className="dashboard-actions">
              <Button type="button" variant="secondary" onClick={() => { setEditing(true); setMessage(''); }}>Edit Profile</Button>
              <Button type="submit" disabled={!editing}>Save Profile</Button>
              {message && <p className="form-message form-message--success" role="status">{message}</p>}
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default ArtistProfileManagementPage;