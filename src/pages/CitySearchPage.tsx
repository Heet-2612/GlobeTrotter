import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, DollarSign, Star, Bookmark, 
  Plus, Compass, ArrowRight, Sparkles, Filter, Check,
  Globe2, Building2, Layers
} from 'lucide-react';
import { cityService } from '../services/cityService';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { City, Country } from '../types';

interface CitySearchPageProps {
  onSelectTab: (tab: string) => void;
  onQuickAddCityToTrip: (cityId: number) => void;
  onFilterActivitiesByCity?: (cityId: number) => void;
}

const REGIONS = ['ALL', 'Europe', 'Asia', 'Americas', 'Oceania', 'Africa', 'Middle East'];

export const CitySearchPage: React.FC<CitySearchPageProps> = ({ 
  onSelectTab, onQuickAddCityToTrip, onFilterActivitiesByCity 
}) => {
  const { savedDestinations, toggleSaveDestination } = useAuth();
  const { activeTrip } = useTrip();

  const [viewMode, setViewMode] = useState<'cities' | 'countries'>('cities');
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [maxCostIndex, setMaxCostIndex] = useState<number>(5);
  const [sortBy, setSortBy] = useState<'popularity' | 'cost'>('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cityService.getCountries().then(res => setCountries(res));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (viewMode === 'cities') {
      cityService.getCities({
        query: searchQuery,
        country: selectedCountryFilter !== 'ALL' ? selectedCountryFilter : undefined,
        region: selectedRegion !== 'ALL' ? selectedRegion : undefined,
        maxCostIndex,
      }).then(res => {
        let sorted = [...res];
        if (sortBy === 'popularity') {
          sorted.sort((a, b) => b.popularity - a.popularity);
        } else {
          sorted.sort((a, b) => a.costIndex - b.costIndex);
        }
        setCities(sorted);
      }).finally(() => setLoading(false));
    } else {
      cityService.getCountries({
        search: searchQuery,
        region: selectedRegion !== 'ALL' ? selectedRegion : undefined,
      }).then(res => {
        setCountries(res);
      }).finally(() => setLoading(false));
    }
  }, [viewMode, searchQuery, selectedRegion, selectedCountryFilter, maxCostIndex, sortBy]);

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountryFilter(countryName);
    setViewMode('cities');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <Globe2 className="w-3 h-3 text-emerald-700" />
            <span>Global Countries & Cities Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Explore Worldwide Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse worldwide destinations across 6 continents, review cost ratings, bookmark favorites, and schedule trip stops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTrip && (
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Active Trip:</span>
              <span className="font-bold text-emerald-900 truncate max-w-[140px]">{activeTrip.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setViewMode('cities')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            viewMode === 'cities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Cities Catalog ({cities.length})</span>
        </button>

        <button
          onClick={() => setViewMode('countries')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            viewMode === 'countries'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Countries Directory ({countries.length})</span>
        </button>

        {selectedCountryFilter !== 'ALL' && (
          <div className="ml-auto flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
            <span>Filtered by: <strong>{selectedCountryFilter}</strong></span>
            <button 
              onClick={() => setSelectedCountryFilter('ALL')}
              className="text-emerald-700 hover:text-emerald-950 font-bold ml-1 text-xs"
            >
              ✕ Clear
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Text Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={viewMode === 'cities' ? "Search city name or country (e.g., Paris, Japan, Rome)..." : "Search country or capital (e.g., France, Japan, Rome)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Country Selector for Cities */}
          {viewMode === 'cities' && (
            <div className="sm:col-span-3">
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              >
                <option value="ALL">All Countries</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>{c.flagEmoji} {c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Selector */}
          {viewMode === 'cities' ? (
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              >
                <option value="popularity">Sort: Most Popular First</option>
                <option value="cost">Sort: Budget-Friendly (Lowest Cost)</option>
              </select>
            </div>
          ) : (
            <div className="sm:col-span-6 flex items-center justify-end text-xs text-slate-500">
              <span>Showing {countries.length} international destinations</span>
            </div>
          )}

          {/* Cost Slider */}
          {viewMode === 'cities' && (
            <div className="sm:col-span-12 flex items-center space-x-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">Max Cost Index:</span>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={maxCostIndex}
                onChange={(e) => setMaxCostIndex(Number(e.target.value))}
                className="w-48 accent-emerald-600"
              />
              <span className="text-xs font-bold text-slate-800 w-12">
                {maxCostIndex} / 5★
              </span>
            </div>
          )}
        </div>

        {/* Region Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Region:</span>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedRegion === region
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {region === 'ALL' ? 'All Continents' : region}
            </button>
          ))}
        </div>
      </div>

      {/* Countries Directory View */}
      {viewMode === 'countries' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {countries.map((country) => (
              <motion.div
                key={country.code}
                layout
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img
                    src={country.featuredImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold">
                    {country.region}
                  </span>

                  <span className="absolute top-3 right-3 text-2xl drop-shadow-md">
                    {country.flagEmoji}
                  </span>

                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="text-lg font-extrabold font-['Outfit'] flex items-center space-x-1.5">
                      <span>{country.name}</span>
                      <span className="text-xs text-emerald-300 font-mono font-normal">({country.code})</span>
                    </h3>
                    <p className="text-xs text-slate-300">Capital: <strong>{country.capital}</strong></p>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {country.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Currency</span>
                      <p className="font-bold text-slate-800 mt-0.5 truncate">{country.currency}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Language</span>
                      <p className="font-bold text-slate-800 mt-0.5 truncate">{country.language}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCountrySelect(country.name)}
                    className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <span>View Cities in {country.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* City Results Grid */}
      {viewMode === 'cities' && (
        cities.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-['Outfit']">No Destinations Match Your Query</h3>
            <p className="text-xs text-slate-500">Try broadening your search keyword, resetting country filters, or increasing the max cost rating.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cities.map((city) => {
              const isSaved = savedDestinations.some(s => s.id === city.id);
              return (
                <motion.div
                  key={city.id}
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Image & Overlay */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaveDestination(city.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                        isSaved ? 'bg-amber-500 text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isSaved ? 'Saved to Profile' : 'Bookmark Destination'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Region Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold">
                      {city.region}
                    </span>

                    {/* City & Country */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <h3 className="text-lg font-bold font-['Outfit'] truncate">{city.name}</h3>
                      <p className="text-xs text-slate-300 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{city.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {city.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Cost Rating</span>
                        <p className="font-extrabold text-slate-800 mt-0.5">
                          {'★'.repeat(Math.round(city.costIndex))} <span className="text-[10px] font-normal text-slate-500">({city.costIndex}/5)</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Popularity</span>
                        <p className="font-extrabold text-emerald-600 mt-0.5">
                          {city.popularity} <span className="text-[10px] font-normal text-slate-500">/ 100</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      {activeTrip ? (
                        <button
                          onClick={() => onQuickAddCityToTrip(city.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectTab('my-trips')}
                          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                        >
                          Select Trip
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (onFilterActivitiesByCity) onFilterActivitiesByCity(city.id);
                          onSelectTab('activity-search');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                        title="View Activities"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
};

