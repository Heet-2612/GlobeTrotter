import React, { useEffect, useState } from 'react';
import { ActivityResponse } from '../types';
import { api } from '../services/api';

interface ActivitySearchPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ActivitySearchPage: React.FC<ActivitySearchPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (query?: string, categoryFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.searchActivities(undefined, query, categoryFilter);
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActivities(search, category);
  };

  const categories = ['All', 'SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'NIGHTLIFE', 'SHOPPING'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Discover Activities & Attractions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search curated tours, landmark visits, dining experiences, and outdoor adventures
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities (e.g. Eiffel Tower, Wine Tasting, Museum)..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow transition-colors"
          >
            🔍 Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const selectedCat = cat === 'All' ? '' : cat;
                setCategory(selectedCat);
                fetchActivities(search, selectedCat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Searching activities...</span>
        </div>
      ) : error ? (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No activities found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow hover:border-blue-500/50 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {act.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">
                    📍 {act.cityName || 'City Destination'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{act.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {act.description || 'No description available.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>⏱️ {act.estimatedDurationMinutes ? `${act.estimatedDurationMinutes} mins` : 'Flexible'}</span>
                <span className="font-bold text-emerald-400 text-sm">${act.estimatedCost || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
