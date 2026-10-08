import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import SectionTitle from '../components/common/SectionTitle';
import ArtworkCard from '../components/artwork/ArtworkCard';
import ArtistCard from '../components/user/ArtistCard';
import Button from '../components/common/Button';
import { featuredArtworks, featuredArtists, categories } from '../data/sampleData';

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="container hero-layout">
            <div className="hero-copy-block">
              <p className="eyebrow">Curated global art collection</p>
              <h1>Discover Art. Inspire Creativity.</h1>
              <p className="hero-copy">
                Discover captivating original works, connect with visionary artists, and build a collection
                that reflects your taste, passion, and story.
              </p>

              <div className="hero-actions">
                <Link to="/browse">
                  <Button>Explore Gallery</Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">Join as Artist</Button>
                </Link>
              </div>
            </div>

            <div className="hero-visual card">
              <img
                src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80"
                alt="Featured gallery artwork"
              />
            </div>
          </div>
        </section>

        <section className="container page-shell">
          <SearchBar />
        </section>

        <section className="container page-shell">
          <SectionTitle title="Featured Artworks" subtitle="Handpicked works turning everyday spaces into inspiring stories." />
          <div className="section-grid artworks-grid">
            {featuredArtworks.slice(0, 6).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>

        <section className="container page-shell">
          <SectionTitle title="Popular Categories" subtitle="Explore art across a wide range of styles, mediums, and movements." />
          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.id} className="category-card card">
                <img src={category.image} alt={category.name} className="category-card__image" />
                <div className="category-card__content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container page-shell">
          <SectionTitle title="Featured Artists" subtitle="Meet the creative minds shaping the next generation of visual storytelling." />
          <div className="section-grid artists-grid">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        <section className="container page-shell">
          <div className="exhibition-banner card">
            <div>
              <p className="eyebrow">Featured exhibition</p>
              <h2>Beyond the Canvas</h2>
              <p>
                A virtual showcase of modern expression, immersive installations, and bold new voices in
                contemporary art.
              </p>
              <div className="exhibition-meta">
                <span>Date: 15 Nov 2026</span>
                <span>Online</span>
              </div>
            </div>

            <Link to="/browse">
              <Button>Explore Exhibition</Button>
            </Link>
          </div>
        </section>

        <section className="container page-shell">
          <div className="cta-panel card">
            <div>
              <p className="eyebrow">For artists</p>
              <h2>Showcase Your Art to the World</h2>
            </div>
            <Link to="/register">
              <Button variant="primary">Start Creating</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
