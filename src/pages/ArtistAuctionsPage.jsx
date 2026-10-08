import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useAuctionData from '../hooks/useAuctionData';
import { cancelArtistAuction } from '../utils/storage';

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function ArtistAuctionsPage() {
  const { currentUser } = useAuth();
  const { auctions } = useAuctionData();
  const artistAuctions = auctions.filter((auction) => String(auction.artistId) === String(currentUser.id));
  const [, setRefresh] = useState(0);

  useEffect(() => {
    const refresh = () => setRefresh((previous) => previous + 1);
    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleCancel = (auction) => {
    if (!window.confirm('Cancel this auction?')) return;
    cancelArtistAuction(currentUser.id, auction.id);
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="artist-artworks-heading">
          <div className="page-header"><p className="eyebrow">Artist workspace</p><h1>My Auctions</h1><p>Manage auctions for your artwork.</p></div>
          <Link to="/artist/auctions/new"><Button>Create Auction</Button></Link>
        </section>
        {artistAuctions.length ? (
          <div className="artist-auctions-table-wrap card">
            <table className="artist-auctions-table">
              <thead><tr><th>Artwork</th><th>Starting Bid</th><th>Current Bid</th><th>Highest Bidder</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {artistAuctions.map((auction) => (
                  <tr key={auction.id}>
                    <td><div className="auction-table-artwork"><img src={auction.artworkImage} alt="" /><span>{auction.artworkTitle}</span></div></td>
                    <td>${Number(auction.startingBid).toLocaleString()}</td>
                    <td>${Number(auction.currentBid).toLocaleString()}</td>
                    <td>{auction.highestBidderName || 'No bids'}</td>
                    <td>{formatDate(auction.startTime)}</td>
                    <td>{formatDate(auction.endTime)}</td>
                    <td><span className={`auction-status auction-status--${auction.status.toLowerCase()}`}>{auction.status}</span></td>
                    <td><div className="artist-auction-actions"><Link to={`/auctions/${auction.id}`}><Button variant="outline">View</Button></Link>{auction.status === 'Upcoming' && <><Link to={`/artist/auctions/edit/${auction.id}`}><Button variant="secondary">Edit</Button></Link><Button variant="outline" onClick={() => handleCancel(auction)}>Cancel</Button></>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <section className="empty-state card"><h2>No artist auctions yet.</h2><p>Create an auction for one of your artworks.</p><Link to="/artist/auctions/new"><Button>Create Auction</Button></Link></section>}
      </main>
      <Footer />
    </>
  );
}

export default ArtistAuctionsPage;