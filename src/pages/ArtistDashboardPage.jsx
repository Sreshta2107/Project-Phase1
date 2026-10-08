import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useArtistArtworks from '../hooks/useArtistArtworks';
import {
  getArtistFollowerCount,
  getArtistProfile,
  getArtworkLikeCount,
  getArtworkViewCount,
  getArtworkWishlistCount,
  getBuyerById,
  getOrders,
} from '../utils/storage';

function ArtistDashboardPage() {
  const { currentUser } = useAuth();
  const artistArtworks = useArtistArtworks().filter(
    (artwork) => String(artwork.artistId) === String(currentUser.id)
  );
  const artistProfile = getArtistProfile(currentUser.id);
  const artworkIds = new Set(artistArtworks.map((artwork) => String(artwork.id)));
  const artistOrders = getOrders()
    .filter((order) => artworkIds.has(String(order.artworkId)))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalRevenue = artistOrders.reduce((total, order) => total + Number(order.amount), 0);
  const completedOrders = artistOrders.filter((order) => order.status === 'Completed').length;
  const processingOrders = artistOrders.filter((order) => order.status !== 'Completed').length;
  const averageSale = artistOrders.length ? totalRevenue / artistOrders.length : 0;
  const totalLikes = artistArtworks.reduce(
    (total, artwork) => total + getArtworkLikeCount(artwork.id, artwork.likes),
    0
  );
  const totalViews = artistArtworks.reduce((total, artwork) => total + getArtworkViewCount(artwork.id), 0);
  const totalWishlistSaves = artistArtworks.reduce((total, artwork) => total + getArtworkWishlistCount(artwork.id), 0);
  const totalFollowers = getArtistFollowerCount(currentUser.id);
  const stats = [
    { label: 'Total Artworks', value: artistArtworks.length },
    { label: 'Published Artworks', value: artistArtworks.filter((artwork) => artwork.status === 'Published').length },
    { label: 'Total Likes', value: totalLikes.toLocaleString() },
    { label: 'Total Followers', value: totalFollowers.toLocaleString() },
    { label: 'Total Sales', value: artistOrders.length },
    { label: 'Total Earnings', value: `$${totalRevenue.toLocaleString()}` },
  ];
  const saleStats = [
    { label: 'Total Sales', value: artistOrders.length },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
    { label: 'Completed Orders', value: completedOrders },
    { label: 'Pending / Processing', value: processingOrders },
    { label: 'Average Sale Value', value: `$${averageSale.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
  ];
  const salesByArtwork = artistOrders.reduce((totals, order) => {
    const id = String(order.artworkId);
    totals.set(id, (totals.get(id) ?? 0) + 1);
    return totals;
  }, new Map());
  const topArtworks = artistArtworks.map((artwork) => {
    const views = getArtworkViewCount(artwork.id);
    const saves = getArtworkWishlistCount(artwork.id);
    const likes = getArtworkLikeCount(artwork.id, artwork.likes);
    const sales = salesByArtwork.get(String(artwork.id)) ?? 0;
    return { artwork, views, likes, sales, score: views + saves + likes + sales };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="container page-shell artist-dashboard-page">
        <section className="page-header artist-dashboard-heading">
          <div>
            <p className="eyebrow">Artist workspace</p>
            <h1>Welcome, {artistProfile?.name || currentUser.name}</h1>
            <p>Your artwork, audience, and sales at a glance.</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/artist/artworks/new"><Button>Upload Artwork</Button></Link>
            <Link to="/artist/profile"><Button variant="secondary">Manage Profile</Button></Link>
          </div>
        </section>

        <section className="artist-stats-grid" aria-label="Artist performance overview">
          {stats.map((stat) => (
            <article className="artist-stat card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section id="sales-analytics" className="artist-analytics-section">
          <div className="page-header"><h2>Sales Analytics</h2><p>Sales are calculated from orders containing your artwork.</p></div>
          <div className="artist-stats-grid artist-stats-grid--sales">
            {saleStats.map((stat) => <article className="artist-stat card" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></article>)}
          </div>
          <div className="recent-sales card">
            <h3>Recent Sales</h3>
            {artistOrders.length ? (
              <div className="recent-sales__list">
                {artistOrders.slice(0, 6).map((order) => (
                  <article className="recent-sale-row" key={order.id}>
                    <strong>{order.artworkTitle}</strong>
                    <span>{getBuyerById(order.userId)?.name ?? 'Gallery buyer'}</span>
                    <span>${Number(order.amount).toLocaleString()}</span>
                    <span>{order.purchaseType}</span>
                    <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString()}</time>
                    <span className="order-status">{order.status}</span>
                  </article>
                ))}
              </div>
            ) : <p>No sales yet. Orders for your artwork will appear here.</p>}
          </div>
        </section>

        <section id="gallery-performance" className="artist-analytics-section">
          <div className="page-header"><h2>Gallery Performance</h2><p>Engagement across your published artwork.</p></div>
          <div className="artist-stats-grid">
            <article className="artist-stat card"><span>Artwork Views</span><strong>{totalViews.toLocaleString()}</strong></article>
            <article className="artist-stat card"><span>Total Likes</span><strong>{totalLikes.toLocaleString()}</strong></article>
            <article className="artist-stat card"><span>Total Followers</span><strong>{totalFollowers.toLocaleString()}</strong></article>
            <article className="artist-stat card"><span>Wishlist Saves</span><strong>{totalWishlistSaves.toLocaleString()}</strong></article>
            <article className="artist-stat card"><span>Total Sales</span><strong>{artistOrders.length}</strong></article>
            <article className="artist-stat card"><span>Total Revenue</span><strong>${totalRevenue.toLocaleString()}</strong></article>
          </div>
        </section>

        <section className="top-artworks-section">
          <div className="page-header"><h2>Top Performing Artworks</h2><p>Ranked by views, likes, saves, and sales.</p></div>
          {topArtworks.length ? (
            <div className="top-artworks-list">
              {topArtworks.map(({ artwork, views, likes, sales }, index) => (
                <article className="top-artwork-row card" key={artwork.id}>
                  <span className="top-artwork-row__rank">{index + 1}</span>
                  <img src={artwork.image} alt={artwork.title} />
                  <strong>{artwork.title}</strong>
                  <span>{likes} likes</span><span>{views} views</span><span>{sales} sales</span>
                </article>
              ))}
            </div>
          ) : <div className="empty-state card"><p>Upload artwork to see performance here.</p></div>}
        </section>

        <section className="artist-dashboard-footer">
          <div><h2>Your collection</h2><p>Review and manage your published pieces.</p></div>
          <Link to="/artist/artworks"><Button variant="outline">View My Artworks</Button></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ArtistDashboardPage;
