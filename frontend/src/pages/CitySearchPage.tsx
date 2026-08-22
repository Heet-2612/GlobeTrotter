import React, { useEffect, useState } from 'react';
import { CityResponse } from '../types';
import { api } from '../services/api';

interface CitySearchPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const CitySearchPage: React.FC<CitySearchPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async (query?: string, countryFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.searchCities(query, countryFilter);
      setCities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search cities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCities(search, country);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore Destination Cities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse world travel destinations, popularity indices, and relative cost metrics
          </p>
        </div>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city name (e.g. Paris, Tokyo)..."
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Filter by country (e.g. France, Japan)..."
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow transition-colors"
        >
          🔍 Search Cities
        </button>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Searching cities...</span>
        </div>
      ) : error ? (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      ) : cities.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No cities found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div
              key={city.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow hover:border-blue-500/50 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {city.region || 'Worldwide'}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    ⭐ Popularity #{city.popularity ?? 'N/A'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">{city.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{city.country}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Cost Index: <strong className="text-emerald-400">{city.costIndex ?? 1.0}x</strong></span>
                <button
                  onClick={() => onNavigate('create-trip')}
                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  + Plan Trip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
