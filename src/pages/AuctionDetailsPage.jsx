import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useAuctionData from '../hooks/useAuctionData';
import { createOrder, placeBid } from '../utils/storage';

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { auctions, bids } = useAuctionData();
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState({ type: '', text: '' });
  const auction = auctions.find((item) => String(item.id) === String(id));
  const bidHistory = bids
    .filter((bid) => String(bid.auctionId) === String(id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!auction) {
    return (
      <>
        <Navbar />
        <main className="container page-shell"><section className="empty-state card"><h1>Auction not found</h1><Link to="/auctions"><Button>Browse Auctions</Button></Link></section></main>
        <Footer />
      </>
    );
  }

  const minimumBid = Number(auction.currentBid) + Number(auction.minimumIncrement);
  const isWinner = currentUser && String(auction.highestBidderId) === String(currentUser.id);

  const handleBidSubmit = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/auctions/${auction.id}` } } });
      return;
    }

    const result = placeBid({ auctionId: auction.id, user: currentUser, amount: bidAmount });
    if (!result.success) {
      setBidMessage({ type: 'error', text: result.error });
      return;
    }

    setBidAmount('');
    setBidMessage({ type: 'success', text: 'Your bid has been placed.' });
  };

  const handleAuctionPurchase = () => {
    createOrder({
      userId: currentUser.id,
      artworkId: auction.artworkId,
      artworkTitle: auction.artworkTitle,
      artworkImage: auction.artworkImage,
      artistName: auction.artistName,
      amount: auction.currentBid,
      purchaseType: 'Auction',
      status: 'Confirmed',
    });
    navigate('/orders');
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell auction-detail-page">
        <article className="auction-detail card">
          <img src={auction.artworkImage} alt={auction.artworkTitle} className="auction-detail__image" />
          <div className="auction-detail__content">
            <div className="auction-detail__title-row">
              <div>
                <p className="eyebrow">Art auction</p>
                <h1>{auction.artworkTitle}</h1>
              </div>
              <span className={`auction-status auction-status--${auction.status.toLowerCase()}`}>{auction.status}</span>
            </div>
            <p className="auction-detail__artist">By <Link to={`/artist/${auction.artistId}`}>{auction.artistName}</Link></p>
            <p className="auction-detail__description">{auction.description}</p>

            <dl className="auction-detail__facts">
              <div><dt>Starting bid</dt><dd>${auction.startingBid.toLocaleString()}</dd></div>
              <div><dt>Current bid</dt><dd>${auction.currentBid.toLocaleString()}</dd></div>
              <div><dt>Minimum increment</dt><dd>${auction.minimumIncrement.toLocaleString()}</dd></div>
              <div><dt>Highest bidder</dt><dd>{auction.highestBidderName || 'No bids yet'}</dd></div>
              <div><dt>Starts</dt><dd>{formatDate(auction.startTime)}</dd></div>
              <div><dt>Ends</dt><dd>{formatDate(auction.endTime)}</dd></div>
            </dl>

            {auction.status === 'Live' && (
              <form className="bid-form" onSubmit={handleBidSubmit}>
                <label htmlFor="bid-amount">Your bid (minimum ${minimumBid.toLocaleString()})</label>
                <div className="bid-form__controls">
                  <input
                    id="bid-amount"
                    type="number"
                    step="0.01"
                    value={bidAmount}
                    onChange={(event) => { setBidAmount(event.target.value); setBidMessage({ type: '', text: '' }); }}
                    placeholder={minimumBid.toFixed(2)}
                    required
                  />
                  <Button type="submit">Place Bid</Button>
                </div>
                {bidMessage.text && <p className={`form-message form-message--${bidMessage.type}`} role="status">{bidMessage.text}</p>}
              </form>
            )}

            {auction.status === 'Upcoming' && <p className="auction-notice">Bidding opens at {formatDate(auction.startTime)}.</p>}

            {auction.status === 'Ended' && (
              <section className="auction-ended" aria-live="polite">
                <h2>Auction Ended</h2>
                <p>Winning bidder: <strong>{auction.highestBidderName || 'No bids'}</strong></p>
                <p>Winning bid: <strong>${Number(auction.currentBid).toLocaleString()}</strong></p>
                {isWinner ? (
                  <>
                    <p className="auction-win-message">You won this auction!</p>
                    <Button onClick={handleAuctionPurchase}>Proceed to Purchase</Button>
                  </>
                ) : (
                  <p className="auction-loss-message">Auction won by another bidder.</p>
                )}
              </section>
            )}
          </div>
        </article>

        <section className="bid-history card">
          <div className="page-header"><h2>Bid History</h2><p>Recent bids for this artwork, newest first.</p></div>
          {bidHistory.length ? (
            <div className="bid-history__list">
              {bidHistory.map((bid) => (
                <article key={bid.id} className="bid-history__row">
                  <strong>{bid.userName}</strong>
                  <span>${Number(bid.amount).toLocaleString()}</span>
                  <time dateTime={bid.createdAt}>{formatDate(bid.createdAt)}</time>
                </article>
              ))}
            </div>
          ) : <p>No bids have been placed yet.</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AuctionDetailsPage;