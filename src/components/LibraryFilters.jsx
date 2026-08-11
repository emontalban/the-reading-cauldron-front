function LibraryFilters({
    statusFilter,
    formatFilter,
    sortFilter,
    searchFilter,
    onSearchChange,
    onStatusChange,
    onFormatChange,
    onSortChange,
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
            Ordenar
            <select
                value={sortFilter}
                onChange={(event) => onSortChange(event.target.value)}
            >
            <option value="fecha_desc">Más recientes</option>
            <option value="titulo_asc">Título A-Z</option>
            <option value="autor_asc">Autor A-Z</option>
            <option value="valoracion_desc">Mejor valorados</option>
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