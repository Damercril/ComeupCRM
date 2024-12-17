// ... (début du fichier inchangé)

return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Statistiques par Opérateur</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('calls')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              view === 'calls'
                ? 'glass-button active'
                : 'glass-button'
            }`}
          >
            Appels
          </button>
          <button
            onClick={() => setView('revenue')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              view === 'revenue'
                ? 'glass-button active'
                : 'glass-button'
            }`}
          >
            CA Généré
          </button>
        </div>
      </div>
      
      // ... (reste du composant inchangé)
    </div>
  );