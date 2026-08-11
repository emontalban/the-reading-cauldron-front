function LibraryStats({ stats }) {
    return (
        <div className="library-stats">
            <div className="library-stat-card">
                <span>Total</span>
                <strong>{stats.total}</strong>
            </div>

            <div className="library-stat-card">
                <span>Quiero leer</span>
                <strong>{stats.wantToRead}</strong>
            </div>

            <div className="library-stat-card">
                <span>Leyendo</span>
                <strong>{stats.reading}</strong>
            </div>

            <div className="library-stat-card">
                <span>Terminados</span>
                <strong>{stats.finished}</strong>
            </div>

            <div className="library-stat-card">
                <span>Favoritos</span>
                <strong>{stats.favorites}</strong>
            </div>
        </div>
    );
}

export default LibraryStats;