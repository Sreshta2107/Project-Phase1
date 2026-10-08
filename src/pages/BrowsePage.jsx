import { useMemo, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import SectionTitle from '../components/common/SectionTitle';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { galleryArtworks } from '../data/sampleData';
import useGalleryInteractions from '../hooks/useGalleryInteractions';
import useArtistArtworks from '../hooks/useArtistArtworks';

const categoryOptions = ['All', 'Paintings', 'Digital Art', 'Photography', 'Sculpture', 'Abstract Art', 'Traditional Art'];

function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const { getLikeCount } = useGalleryInteractions();
  const artistArtworks = useArtistArtworks();
  const allArtworks = useMemo(() => [...galleryArtworks, ...artistArtworks], [artistArtworks]);

  const filteredArtworks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let results = allArtworks.filter((artwork) => {
      const artistName = artwork.artist ?? artwork.artistName ?? '';
      const matchesSearch =
        !term ||
        artwork.title.toLowerCase().includes(term) ||
        artistName.toLowerCase().includes(term) ||
        artwork.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === 'All'
        || artwork.category === selectedCategory
        || (selectedCategory === 'Paintings' && artwork.category === 'Painting');

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'Price: Low to High':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'Most Popular':
        results.sort((a, b) => getLikeCount(b) - getLikeCount(a));
        break;
      case 'Newest':
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return results;
  }, [allArtworks, searchTerm, selectedCategory, sortBy, getLikeCount]);

  return (
    <>
      <Navbar />

      <main className="container page-shell browse-page">
        <section className="page-header">
          <h1>Browse collections</h1>
          <p>Discover artwork by style, mood, and medium.</p>
        </section>

        <div className="browse-toolbar">
          <SearchBar
            placeholder="Search by title, artist, or category"
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <label className="sort-control">
            <span>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </label>
        </div>

        <div className="category-pills" aria-label="Categories">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip ${selectedCategory === category ? 'chip--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <SectionTitle title={selectedCategory === 'All' ? 'All Artwork' : selectedCategory} subtitle="A curated mix of styles and mediums." />

        <div className="section-grid browse-grid">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="empty-state card">
            <h3>No artworks match your search.</h3>
            <p>Try another keyword or reset the category filter.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default BrowsePage;
