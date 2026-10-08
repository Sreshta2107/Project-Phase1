import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { featuredArtworks } from '../data/sampleData';

function CartPage() {
  const cartItems = featuredArtworks.slice(0, 2);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <h1>Your cart</h1>
          <p>Ready for checkout when you are.</p>
        </section>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item card">
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.artist}</p>
                  <strong>${item.price}</strong>
                </div>
              </div>
            ))}
          </div>

          <aside className="checkout-summary card">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>$0</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>${subtotal}</strong>
            </div>
            <Button>Proceed to Checkout</Button>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CartPage;
