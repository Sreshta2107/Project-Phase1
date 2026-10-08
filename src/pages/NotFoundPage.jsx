import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="container page-shell not-found">
        <div className="card not-found-card">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NotFoundPage;
