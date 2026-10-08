import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <div>
          <h3>ArtGallery</h3>
          <p>Discover meaningful art from creators around the world.</p>
        </div>

        <div className="footer-links">
          <a href="/browse">Browse</a>
          <a href="/auctions">Auctions</a>
          <a href="/login">Login</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
