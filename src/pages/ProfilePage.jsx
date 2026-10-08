import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { featuredArtists } from '../data/sampleData';
import useAuth from '../hooks/useAuth';
import useGalleryInteractions from '../hooks/useGalleryInteractions';
import useAuctionData from '../hooks/useAuctionData';

function ProfilePage() {
  const { currentUser } = useAuth();
  const { followedArtistIds, getFollowerCount, toggleFollowForArtist } = useGalleryInteractions();
  const { auctions, bids } = useAuctionData();
  const followedArtists = featuredArtists.filter((artist) => followedArtistIds.includes(String(artist.id)));
  const myBidsByAuction = bids
    .filter((bid) => String(bid.userId) === String(currentUser.id))
    .reduce((groupedBids, bid) => {
      const existing = groupedBids.get(String(bid.auctionId)) ?? [];
      groupedBids.set(String(bid.auctionId), [...existing, bid]);
      return groupedBids;
    }, new Map());

  return (
    <>
      <Navbar />
      <main className="container page-shell profile-page">
        <section className="profile-account card">
          <img src={currentUser.profileImage} alt={`${currentUser.name}'s profile`} />
          <div className="profile-account__details">
            <p className="eyebrow">Your account</p>
            <h1>{currentUser.name}</h1>
            <dl>
              <div><dt>Email</dt><dd>{currentUser.email}</dd></div>
              <div><dt>Role</dt><dd>{currentUser.role}</dd></div>
              <div><dt>About</dt><dd>{currentUser.bio || 'No bio added yet.'}</dd></div>
              <div><dt>Member since</dt><dd>{new Date(currentUser.createdAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </section>

        <section className="followed-artists-section">
          <div className="page-header">
            <h2>Followed Artists</h2>
            <p>Artists you are following in the gallery.</p>
          </div>
          {followedArtists.length ? (
            <div className="followed-artists-grid">
              {followedArtists.map((artist) => (
                <article key={artist.id} className="followed-artist-card card">
                  <img src={artist.profileImage} alt={artist.name} />
                  <div className="followed-artist-card__body">
                    <h3>{artist.name}</h3>
                    <p>{artist.specialty}</p>
                    <p>{getFollowerCount(artist).toLocaleString()} followers</p>
                  </div>
                  <div className="followed-artist-card__actions">
                    <Link to={`/artist/${artist.id}`}><Button variant="secondary">View Profile</Button></Link>
                    <button type="button" className="detail-button" onClick={() => toggleFollowForArtist(artist.id)}>Unfollow</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <p>You are not following any artists yet. Explore artist profiles to find your favorites.</p>
              <Link to="/browse"><Button>Explore the Gallery</Button></Link>
            </div>
          )}
        </section>

        <section className="profile-bids-section">
          <div className="page-header">
            <h2>My Bids</h2>
            <p>Auctions where you have placed a bid.</p>
          </div>
          {myBidsByAuction.size ? (
            <div className="profile-bids-list">
              {[...myBidsByAuction.entries()].map(([auctionId, userBids]) => {
                const auction = auctions.find((item) => String(item.id) === auctionId);
                if (!auction) return null;
                const highestUserBid = Math.max(...userBids.map((bid) => Number(bid.amount)));
                const isWinning = String(auction.highestBidderId) === String(currentUser.id);
                const resultLabel = auction.status === 'Ended'
                  ? (isWinning ? 'Won' : 'Outbid')
                  : (isWinning ? 'Winning' : 'Outbid');

                return (
                  <article className="profile-bid-card card" key={auctionId}>
                    <img src={auction.artworkImage} alt={auction.artworkTitle} />
                    <div className="profile-bid-card__info">
                      <h3>{auction.artworkTitle}</h3>
                      <p>Current bid: <strong>${Number(auction.currentBid).toLocaleString()}</strong></p>
                      <p>Your highest bid: <strong>${highestUserBid.toLocaleString()}</strong></p>
                    </div>
                    <div className="profile-bid-card__state">
                      <span className={`auction-status auction-status--${auction.status.toLowerCase()}`}>{auction.status}</span>
                      <strong className={isWinning ? 'bid-result--winning' : 'bid-result--outbid'}>{resultLabel}</strong>
                    </div>
                    <Link to={`/auctions/${auction.id}`}><Button variant="secondary">View Auction</Button></Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state card">
              <p>You have not placed any bids yet.</p>
              <Link to="/auctions"><Button>Explore Auctions</Button></Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProfilePage;