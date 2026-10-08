import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './ArtistCard.css';

function ArtistCard({ artist }) {
  return (
    <article className="artist-card card">
      <div className="artist-card__header">
        <img src={artist.profileImage} alt={artist.name} className="artist-card__image" />
        <div className="artist-card__body">
          <h3>{artist.name}</h3>
          <p>{artist.specialty}</p>
          <small>{artist.location}</small>
        </div>
      </div>

      <p className="artist-card__bio">{artist.bio}</p>

      <div className="artist-card__actions">
        <button type="button" className="artwork-card__mini-button">
          Follow
        </button>
        <Link to={`/artist/${artist.id}`}>
          <Button variant="secondary">Profile</Button>
        </Link>
      </div>
    </article>
  );
}

export default ArtistCard;
