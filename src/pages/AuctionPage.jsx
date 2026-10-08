import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import useAuctionData from '../hooks/useAuctionData';

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function AuctionPage() {
  const { auctions } = useAuctionData();

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <SectionTitle title="Art Auctions" subtitle="Discover one-of-a-kind works and follow the bidding." />

        <div className="auction-grid">
          {auctions.map((auction) => (
            <article className="auction-card card" key={auction.id}>
              <Link to={`/auctions/${auction.id}`} className="auction-card__image-link">
                <img src={auction.artworkImage} alt={auction.artworkTitle} />
              </Link>
              <div className="auction-card__body">
                <div className="auction-card__heading">
                  <div>
                    <h2>{auction.artworkTitle}</h2>
                    <p>By {auction.artistName}</p>
                  </div>
                  <span className={`auction-status auction-status--${auction.status.toLowerCase()}`}>{auction.status}</span>
                </div>
                <dl className="auction-card__facts">
                  <div><dt>Starting bid</dt><dd>${auction.startingBid.toLocaleString()}</dd></div>
                  <div><dt>Current bid</dt><dd>${auction.currentBid.toLocaleString()}</dd></div>
                  <div><dt>Starts</dt><dd>{formatDate(auction.startTime)}</dd></div>
                  <div><dt>Ends</dt><dd>{formatDate(auction.endTime)}</dd></div>
                </dl>
                <Link to={`/auctions/${auction.id}`}>
                  <Button variant="primary">View Auction</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AuctionPage;
