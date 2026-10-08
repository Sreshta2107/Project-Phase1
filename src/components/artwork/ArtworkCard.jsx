import { Link } from 'react-router-dom';
import './ArtworkCard.css';
import Button from '../common/Button';
import useGalleryInteractions from '../../hooks/useGalleryInteractions';

function ArtworkCard({ artwork }) {
  const {
    isArtworkLiked,
    isArtworkSaved,
    toggleLikeForArtwork,
    toggleWishlistForArtwork,
    getLikeCount,
  } = useGalleryInteractions();
  const isLiked = isArtworkLiked(artwork.id);
  const isSaved = isArtworkSaved(artwork.id);
  const likeCount = getLikeCount(artwork);

  return (
    <article className="artwork-card card">
      <div className="artwork-card__image-wrap">
        <Link to={`/artwork/${artwork.id}`}>
          <img src={artwork.image} alt={artwork.title} className="artwork-card__image" />
        </Link>
        <button
          type="button"
          className={`artwork-card__like ${isLiked ? 'is-liked' : ''}`}
          aria-label={isLiked ? 'Unlike artwork' : 'Like artwork'}
          aria-pressed={isLiked}
          onClick={() => toggleLikeForArtwork(artwork.id)}
        >
          {isLiked ? '♥' : '♡'} {likeCount}
        </button>
      </div>

      <div className="artwork-card__content">
        <div className="artwork-card__meta">
          <span>{artwork.category}</span>
          <span>${artwork.price}</span>
        </div>

        <h3>{artwork.title}</h3>
        <p>By {artwork.artist || artwork.artistName}</p>

        <div className="artwork-card__actions">
          <button
            type="button"
            className={`artwork-card__mini-button ${isSaved ? 'is-saved' : ''}`}
            aria-pressed={isSaved}
            onClick={() => toggleWishlistForArtwork(artwork.id)}
          >
            {isSaved ? 'Saved' : 'Save to Wishlist'}
          </button>

          <Link to={`/artwork/${artwork.id}`}>
            <Button variant="primary">View Details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCard;
