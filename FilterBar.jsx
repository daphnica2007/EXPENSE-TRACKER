const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];

export default function FilterBar({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="search"
        placeholder="Search by title..."
        value={filters.search}
        onChange={handleChange}
        className="filter-search"
      />

      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input type="date" name="from" value={filters.from} onChange={handleChange} title="From date" />
      <input type="date" name="to" value={filters.to} onChange={handleChange} title="To date" />
    </div>
  );
}
