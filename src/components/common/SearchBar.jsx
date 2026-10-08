import './SearchBar.css';

function SearchBar({ placeholder = 'Search artwork or artist', value, onChange }) {
  return (
    <label className="search-bar" aria-label="Search">
      <span className="search-bar__icon">⌕</span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default SearchBar;
