import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { getOrdersForUser } from '../utils/storage';

function OrdersPage() {
  const { currentUser } = useAuth();
  const orders = getOrdersForUser(currentUser.id);

  return (
    <>
      <Navbar />
      <main className="container page-shell orders-page">
        <section className="page-header">
          <h1>Purchase History</h1>
          <p>Your confirmed artwork purchases.</p>
        </section>

        {orders.length ? (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card card" key={order.id}>
                <Link to={`/artwork/${order.artworkId}`} className="order-card__image-link">
                  <img src={order.artworkImage} alt={order.artworkTitle} />
                </Link>
                <div className="order-card__details">
                  <h2><Link to={`/artwork/${order.artworkId}`}>{order.artworkTitle}</Link></h2>
                  <p>By {order.artistName}</p>
                  <dl>
                    <div><dt>Amount</dt><dd>${Number(order.amount).toLocaleString()}</dd></div>
                    <div><dt>Purchase type</dt><dd>{order.purchaseType}</dd></div>
                    <div><dt>Order date</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div>
                    <div><dt>Status</dt><dd><span className="order-status">{order.status}</span></dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state card">
            <h2>You have no purchases yet.</h2>
            <p>Your purchases will appear here after checkout.</p>
            <Link to="/browse"><Button>Browse Artworks</Button></Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default OrdersPage;