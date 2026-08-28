import React, { useEffect, useState } from 'react';
import { CityResponse } from '../types';
import { api } from '../services/api';
import { Search, MapPin, Sparkles, Globe2, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card, CityCard, LoadingState, EmptyState, Badge } from '../components/common/UIComponents';

interface CitySearchPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const CitySearchPage: React.FC<CitySearchPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [curatedOnly, setCuratedOnly] = useState(true);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCities(search, country, curatedOnly);
  }, [curatedOnly]);

  const fetchCities = async (query?: string, countryFilter?: string, isCurated?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.searchCities(query, countryFilter, undefined, isCurated);
      setCities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCities(search, country, curatedOnly);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>Curated Travel Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Destinations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse our authoritative 165-destination catalog across states and UTs in India
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="emerald" className="px-3 py-1 text-xs">
            {cities.length} Destinations
          </Badge>
        </div>
      </div>

      {/* Catalog Filter Toggle Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setCuratedOnly(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              curatedOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>165 Master Curated Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setCuratedOnly(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !curatedOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Globe2 size={14} />
            <span>All Destinations (246)</span>
          </button>
        </div>

        {/* Search Input Form */}
        <Card className="p-4 bg-white border border-slate-200 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination (e.g. Jaipur, Agra, Varanasi)..."
            />
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Filter by state/country (e.g. Rajasthan, Kerala)..."
            />
            <Button type="submit" variant="emerald" size="md" icon={<Search size={16} />}>
              Search Destinations
            </Button>
          </form>
        </Card>
      </div>

      {/* Results Section */}
      {loading ? (
        <LoadingState message="Loading curated destinations..." />
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error}
        </div>
      ) : cities.length === 0 ? (
        <EmptyState title="No destinations found" description="Try broadening your search query or region filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
