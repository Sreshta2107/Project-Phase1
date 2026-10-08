import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Button from './Button';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="Home page">
          ArtGallery
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/auctions">Auctions</Link>
          <Link to="/exhibitions">Exhibitions</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          {currentUser?.role !== 'artist' && <Link to="/artist/dashboard">Artist</Link>}
          {currentUser?.role === 'artist' && (
            <>
              <Link to="/artist/dashboard">Artist Dashboard</Link>
              <Link to="/artist/artworks">My Artworks</Link>
              <Link to="/artist/artworks/new">Upload Artwork</Link>
              <Link to="/artist/profile">Artist Profile</Link>
              <Link to="/artist/inquiries">Buyer Inquiries</Link>
              <Link to="/artist/exhibitions">Exhibitions</Link>
              <Link to="/artist/auctions">Manage Auctions</Link>
              <Link to="/artist/dashboard#sales-analytics">Sales Analytics</Link>
            </>
          )}
          <Link to="/admin">Admin</Link>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="nav-user-name">{currentUser.name}</span>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register">
                <Button variant="primary">Join</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
