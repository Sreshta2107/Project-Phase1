import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import ArtworkCard from '../components/artwork/ArtworkCard';
import SectionTitle from '../components/common/SectionTitle';
import { artworkReviews, featuredArtworks, featuredArtists } from '../data/sampleData';
import useGalleryInteractions from '../hooks/useGalleryInteractions';
import useAuth from '../hooks/useAuth';
import { createInquiry, createOrder, recordArtworkView } from '../utils/storage';
import useArtistArtworks from '../hooks/useArtistArtworks';
import { getArtistProfile, getBuyerById } from '../utils/storage';

function ArtworkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const artistArtworks = useArtistArtworks();
  const artwork = [...featuredArtworks, ...artistArtworks]
    .find((item) => String(item.id) === String(id)) ?? featuredArtworks[0];
  const savedArtistProfile = getArtistProfile(artwork.artistId);
  const artistAccount = getBuyerById(artwork.artistId);
  const artistArtwork = artistArtworks.find((item) => String(item.artistId) === String(artwork.artistId));
  const artist = featuredArtists.find((item) => String(item.id) === String(artwork.artistId))
    ?? {
      id: artwork.artistId,
      name: savedArtistProfile?.name || artistAccount?.name || artistArtwork?.artistName || artwork.artistName || artwork.artist || 'Gallery Artist',
      specialty: savedArtistProfile?.specialization || 'Independent Artist',
      bio: savedArtistProfile?.bio || artistAccount?.bio || 'Artist on the Online Art Gallery.',
      profileImage: savedArtistProfile?.profileImage || artistAccount?.profileImage || artwork.image,
      followers: 0,
    };

  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const lastRecordedView = useRef(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryForm, setInquiryForm] = useState({ name: currentUser?.name ?? '', email: currentUser?.email ?? '', message: '' });
  const [reviewList, setReviewList] = useState(artworkReviews[artwork.id] ?? []);
  const [newReview, setNewReview] = useState({ reviewer: '', rating: 5, comment: '' });
  const {
    isArtworkLiked,
    isArtworkSaved,
    isArtistFollowed,
    toggleLikeForArtwork,
    toggleWishlistForArtwork,
    toggleFollowForArtist,
    getLikeCount,
    getFollowerCount,
  } = useGalleryInteractions();
  const liked = isArtworkLiked(artwork.id);
  const saved = isArtworkSaved(artwork.id);
  const followed = isArtistFollowed(artist.id);

  useEffect(() => {
    const viewKey = `${artwork.id}:${currentUser?.id ?? 'guest'}`;
    if (lastRecordedView.current === viewKey) return;
    lastRecordedView.current = viewKey;
    recordArtworkView(artwork.id, currentUser?.id, artwork.artistId);
  }, [artwork.id, artwork.artistId, currentUser?.id]);

  const relatedArtworks = [...featuredArtworks, ...artistArtworks].filter(
    (item) => item.category === artwork.category && item.id !== artwork.id
  ).slice(0, 4);

  const averageRating = useMemo(() => {
    if (!reviewList.length) return 0;
    return reviewList.reduce((total, review) => total + review.rating, 0) / reviewList.length;
  }, [reviewList]);

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!newReview.reviewer.trim() || !newReview.comment.trim()) {
      return;
    }

    const nextReview = {
      id: Date.now(),
      reviewer: newReview.reviewer.trim(),
      rating: Number(newReview.rating),
      comment: newReview.comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    setReviewList((previous) => [nextReview, ...previous]);
    setNewReview({ reviewer: '', rating: 5, comment: '' });
  };

  const handleDirectPurchase = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/artwork/${artwork.id}` } } });
      return;
    }

    createOrder({
      userId: currentUser.id,
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artworkImage: artwork.image,
      artistName: artwork.artist || artwork.artistName || artist.name,
      amount: artwork.price,
      purchaseType: 'Direct Purchase',
      status: 'Confirmed',
    });
    setPurchaseComplete(true);
  };

  const handleContactArtist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/artwork/${artwork.id}` } } });
      return;
    }
    if (currentUser.role !== 'visitor') {
      setInquiryMessage('Only signed-in visitors can contact artists.');
      return;
    }
    setInquiryForm((previous) => ({
      ...previous,
      name: previous.name || currentUser.name,
      email: previous.email || currentUser.email,
    }));
    setShowInquiryForm(true);
    setInquiryMessage('');
  };

  const handleInquirySubmit = (event) => {
    event.preventDefault();
    if (currentUser.role !== 'visitor') {
      setInquiryMessage('Only signed-in visitors can contact artists.');
      return;
    }
    if (!inquiryForm.message.trim()) {
      setInquiryMessage('Please enter a message before submitting.');
      return;
    }
    createInquiry({
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artistId: artwork.artistId,
      buyerId: currentUser.id,
      buyerName: inquiryForm.name.trim(),
      buyerEmail: inquiryForm.email.trim(),
      message: inquiryForm.message.trim(),
    });
    setInquiryForm((previous) => ({ ...previous, message: '' }));
    setShowInquiryForm(false);
    setInquiryMessage('Inquiry sent successfully.');
  };

  const likeCount = getLikeCount(artwork);

  return (
    <>
      <Navbar />

      <main className="container page-shell detail-page">
        <article className="artwork-detail card">
          <div className="detail-visual">
            <img src={artwork.image} alt={artwork.title} className="detail-image" />
          </div>

          <div className="detail-content">
            <p className="eyebrow">{artwork.category}</p>
            <h1>{artwork.title}</h1>

            <div className="meta-line">
              <span>By <Link to={`/artist/${artwork.artistId}`}>{artwork.artist || artwork.artistName || artist.name}</Link></span>
              <span>{artwork.createdAt}</span>
            </div>

            <div className="meta-line meta-line--accent">
              <span className="detail-price">${artwork.price}</span>
              <span className="detail-likes">♥ {likeCount}</span>
            </div>

            <p className="detail-description">{artwork.description}</p>

            <div className="detail-actions">
              <button
                type="button"
                className={`detail-button ${liked ? 'detail-button--active' : ''}`}
                aria-pressed={liked}
                onClick={() => toggleLikeForArtwork(artwork.id)}
              >
                {liked ? 'Liked' : 'Like'}
              </button>

              <button
                type="button"
                className={`detail-button ${saved ? 'detail-button--saved' : ''}`}
                aria-pressed={saved}
                onClick={() => toggleWishlistForArtwork(artwork.id)}
              >
                {saved ? 'Saved' : 'Save to Wishlist'}
              </button>

              <button type="button" className="detail-button detail-button--primary" onClick={handleDirectPurchase} disabled={purchaseComplete}>
                {purchaseComplete ? 'Purchased' : 'Purchase Artwork'}
              </button>
              <button type="button" className="detail-button" onClick={handleContactArtist}>Contact Artist</button>
            </div>

            {inquiryMessage && <p className="form-message form-message--success" role="status">{inquiryMessage}</p>}

            {showInquiryForm && (
              <form className="contact-artist-form" onSubmit={handleInquirySubmit}>
                <h2>Contact {artist.name}</h2>
                <label>Name<input value={inquiryForm.name} onChange={(event) => setInquiryForm((previous) => ({ ...previous, name: event.target.value }))} required /></label>
                <label>Email<input type="email" value={inquiryForm.email} onChange={(event) => setInquiryForm((previous) => ({ ...previous, email: event.target.value }))} required /></label>
                <label>Message<textarea value={inquiryForm.message} onChange={(event) => setInquiryForm((previous) => ({ ...previous, message: event.target.value }))} rows="4" required /></label>
                <div className="dashboard-actions"><Button type="submit">Send Inquiry</Button><Button type="button" variant="outline" onClick={() => setShowInquiryForm(false)}>Cancel</Button></div>
              </form>
            )}

            {purchaseComplete && (
              <div className="purchase-success" aria-live="polite">
                <strong>Purchase Successful</strong>
                <span>{artwork.title} — ${artwork.price}</span>
                <Link to="/orders">View Purchase History</Link>
              </div>
            )}
          </div>
        </article>

        <section className="artist-panel card">
          <div className="artist-profile">
            <img src={artist.profileImage} alt={artist.name} className="artist-profile__image" />
            <div>
              <p className="eyebrow">Artist</p>
              <h2>{artist.name}</h2>
              <p>{artist.specialty}</p>
              <p>{getFollowerCount(artist).toLocaleString()} followers</p>
            </div>
          </div>

          <p className="artist-bio">{artist.bio}</p>

          <div className="detail-actions detail-actions--compact">
            <button type="button" className={`detail-button ${followed ? 'detail-button--active' : ''}`} aria-pressed={followed} onClick={() => toggleFollowForArtist(artist.id)}>
              {followed ? 'Following' : 'Follow Artist'}
            </button>

            <Link to={`/artist/${artist.id}`}>
              <button type="button" className="detail-button">View Artist Profile</button>
            </Link>
          </div>
        </section>

        <section className="reviews-panel card">
          <div className="review-header">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2>{averageRating ? averageRating.toFixed(1) : '0.0'} / 5</h2>
            </div>
            <span>{reviewList.length} reviews</span>
          </div>

          <div className="stars" aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}>
            {'★'.repeat(Math.round(averageRating || 0))}
            {'☆'.repeat(5 - Math.round(averageRating || 0))}
          </div>

          <div className="review-list">
            {reviewList.map((review) => (
              <article key={review.id} className="review-item">
                <div className="review-topline">
                  <strong>{review.reviewer}</strong>
                  <span>{review.date}</span>
                </div>
                <div className="stars stars--small">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>

          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Add a review</h3>

            <label>
              Your name
              <input
                type="text"
                value={newReview.reviewer}
                onChange={(event) => setNewReview((previous) => ({ ...previous, reviewer: event.target.value }))}
                placeholder="Enter your name"
              />
            </label>

            <label>
              Your rating
              <select
                value={newReview.rating}
                onChange={(event) => setNewReview((previous) => ({ ...previous, rating: Number(event.target.value) }))}
              >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </label>

            <label>
              Your review
              <textarea
                value={newReview.comment}
                onChange={(event) => setNewReview((previous) => ({ ...previous, comment: event.target.value }))}
                rows="4"
                placeholder="Share your thoughts about this piece"
              />
            </label>

            <Button type="submit">Submit Review</Button>
          </form>
        </section>

        <section className="related-section">
          <SectionTitle title="Related Artworks" subtitle={`More from the ${artwork.category} collection.`} />
          <div className="section-grid related-grid">
            {relatedArtworks.map((item) => (
              <ArtworkCard key={item.id} artwork={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ArtworkDetailsPage;
