export default function FilterChips({ categories, activeCategory, onSelect }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide px-4">
      <div className="flex gap-2 min-w-max pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-sm"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
