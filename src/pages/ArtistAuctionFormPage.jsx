import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { createArtistAuction, getArtistProfile, getAuctionById, updateArtistAuction } from '../utils/storage';

function localDateTime(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function ArtistAuctionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const artworks = useArtistArtworks().filter((artwork) => String(artwork.artistId) === String(currentUser.id));
  const loadedAuction = id ? getAuctionById(id) : null;
  const auction = loadedAuction && String(loadedAuction.artistId) === String(currentUser.id) && loadedAuction.status === 'Upcoming' ? loadedAuction : null;
  const [form, setForm] = useState(() => auction ? ({
    artworkId: String(auction.artworkId),
    startingBid: String(auction.startingBid),
    minimumIncrement: String(auction.minimumIncrement),
    startTime: localDateTime(auction.startTime),
    endTime: localDateTime(auction.endTime),
  }) : ({ artworkId: '', startingBid: '', minimumIncrement: '25', startTime: '', endTime: '' }));
  const [error, setError] = useState('');

  const update = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const artwork = artworks.find((item) => String(item.id) === String(form.artworkId));
    const startingBid = Number(form.startingBid);
    const minimumIncrement = Number(form.minimumIncrement);
    const startTime = new Date(form.startTime);
    const endTime = new Date(form.endTime);
    if (!artwork || !Number.isFinite(startingBid) || startingBid <= 0 || !Number.isFinite(minimumIncrement) || minimumIncrement <= 0 || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || startTime <= new Date() || endTime <= startTime) {
      setError('Choose your artwork, enter valid bid amounts, and set a future end time after the start.');
      return;
    }

    const artistProfile = getArtistProfile(currentUser.id);
    const auctionData = {
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artworkImage: artwork.image,
      artistId: currentUser.id,
      artistName: artistProfile?.name || currentUser.name,
      description: artwork.description,
      startingBid,
      currentBid: auction ? Math.max(startingBid, Number(auction.currentBid)) : startingBid,
      minimumIncrement,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: startTime > new Date() ? 'Upcoming' : 'Live',
      highestBidderId: auction?.highestBidderId ?? null,
      highestBidderName: auction?.highestBidderName ?? '',
    };

    if (auction) {
      const updated = updateArtistAuction(currentUser.id, auction.id, auctionData);
      if (!updated) {
        setError('This auction has already started or does not belong to your account.');
        return;
      }
    } else {
      createArtistAuction(currentUser.id, auctionData);
    }
    navigate('/artist/auctions');
  };

  if (id && !auction) {
    return <><Navbar /><main className="container page-shell"><section className="empty-state card"><h1>Auction unavailable</h1><p>Only your upcoming auctions can be edited.</p><Link to="/artist/auctions"><Button>Back to My Auctions</Button></Link></section></main><Footer /></>;
  }

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header"><p className="eyebrow">Artist workspace</p><h1>{auction ? 'Edit Auction' : 'Create Auction'}</h1><p>Set bidding terms for one of your artworks.</p></section>
        <form className="artist-artwork-form card" onSubmit={handleSubmit}>
          <div className="artist-form-grid">
            <label className="artist-form-grid__wide">Select Artwork *<select name="artworkId" value={form.artworkId} onChange={update} required><option value="">Choose your artwork</option>{artworks.map((artwork) => <option key={artwork.id} value={artwork.id}>{artwork.title}</option>)}</select></label>
            <label>Starting Bid *<input name="startingBid" type="number" min="0.01" step="0.01" value={form.startingBid} onChange={update} required /></label>
            <label>Minimum Bid Increment *<input name="minimumIncrement" type="number" min="0.01" step="0.01" value={form.minimumIncrement} onChange={update} required /></label>
            <label>Start Date/Time *<input name="startTime" type="datetime-local" value={form.startTime} onChange={update} required /></label>
            <label>End Date/Time *<input name="endTime" type="datetime-local" value={form.endTime} onChange={update} required /></label>
          </div>
          {error && <p className="form-message form-message--error" role="alert">{error}</p>}
          <div className="dashboard-actions"><Button type="submit">{auction ? 'Save Auction' : 'Create Auction'}</Button><Link to="/artist/auctions"><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default ArtistAuctionFormPage;