function LibraryFilters({
    statusFilter,
    formatFilter,
    ownershipFilter,
    favoriteFilter,
    searchFilter,
    onSearchChange,
    onStatusChange,
    onFormatChange,
    onOwnershipChange,
    onFavoriteChange,
    onClearFilters,
}) {
  return (
    <div className="library-filters">
        <label className="library-search-filter">
            Buscar
            <input
            type="text"
            value={searchFilter}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Título, autor, categoría o notas"
        />
      </label>
        <label>
            Estado
            <select
                value={statusFilter}
                onChange={(event) => onStatusChange(event.target.value)}
                >
                <option value="todos">Todos</option>
                <option value="quiero_leer">Quiero leer</option>
                <option value="pendiente">Pendiente</option>
                <option value="leyendo">Leyendo</option>
                <option value="terminado">Completado</option>
                <option value="abandonado">Abandonado</option>
                </select>
        </label>

        <label>
            Formato
            <select
            value={formatFilter}
            onChange={(event) => onFormatChange(event.target.value)}
            >
            <option value="todos">Todos</option>
            <option value="papel">Papel</option>
            <option value="digital">Digital</option>
            <option value="audiolibro">Audiolibro</option>
            </select>
        </label>

        <label>
            Propiedad
            <select
            value={ownershipFilter}
            onChange={(event) => onOwnershipChange(event.target.value)}
            >
            <option value="todos">Todos</option>
            <option value="propio">Propio</option>
            <option value="prestado">Prestado</option>
            <option value="no_lo_tengo">Pendiente de comprar</option>
            </select>
        </label>

        <label>
            Favoritos
            <select
                value={favoriteFilter}
                onChange={(event) => onFavoriteChange(event.target.value)}
            >
                <option value="todos">Todos</option>
                <option value="favoritos">Solo favoritos</option>
                <option value="no_favoritos">No favoritos</option>
            </select>
        </label>

        <button
            className="clear-library-filters-button"
            type="button"
            onClick={onClearFilters}
        >
            Limpiar filtros
        </button>
    </div>
  );
}

export default LibraryFilters;