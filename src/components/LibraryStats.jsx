function LibraryStats({
  stats,
  ownershipFilter,
  favoriteFilter,
  onOwnershipFilterChange,
  onFavoriteFilterChange,
}) {
  return (
    <div className="library-stats">
      <button
        className={
            ownershipFilter === "todos" && favoriteFilter === "todos"
                ? "library-stat-card library-stat-card-active"
                : "library-stat-card"
            }
            type="button"
            onClick={() => {
            onOwnershipFilterChange("todos");
            onFavoriteFilterChange("todos");
            }}
        >
            <span>Todos</span>
            <strong>{stats.total}</strong>
        </button>

        <button
            className={
            ownershipFilter === "propio"
                ? "library-stat-card library-stat-card-active"
                : "library-stat-card"
            }
            type="button"
            onClick={() => {
            onOwnershipFilterChange("propio");
            onFavoriteFilterChange("todos");
            }}
        >
            <span>Propios</span>
            <strong>{stats.owned}</strong>
        </button>

        <button
            className={
            ownershipFilter === "prestado"
                ? "library-stat-card library-stat-card-active"
                : "library-stat-card"
            }
            type="button"
            onClick={() => {
            onOwnershipFilterChange("prestado");
            onFavoriteFilterChange("todos");
            }}
        >
            <span>Prestados</span>
            <strong>{stats.borrowed}</strong>
        </button>

        <button
            className={
            ownershipFilter === "no_lo_tengo"
                ? "library-stat-card library-stat-card-active"
                : "library-stat-card"
            }
            type="button"
            onClick={() => {
            onOwnershipFilterChange("no_lo_tengo");
            onFavoriteFilterChange("todos");
            }}
        >
            <span>Pendientes de comprar</span>
            <strong>{stats.notOwned}</strong>
        </button>

        <button
            className={
            favoriteFilter === "favoritos"
                ? "library-stat-card library-stat-card-active"
                : "library-stat-card"
            }
            type="button"
            onClick={() => {
            onOwnershipFilterChange("todos");
            onFavoriteFilterChange("favoritos");
            }}
        >
            <span>Favoritos</span>
            <strong>{stats.favorites}</strong>
        </button>
    </div>
  );
}

export default LibraryStats;