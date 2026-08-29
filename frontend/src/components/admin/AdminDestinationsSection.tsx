import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  AdminDestinationListItemResponse,
  AdminDestinationDetailResponse,
  AdminDestinationListPageResponse,
} from '../../types';
import { Card, Button } from '../common/UIComponents';
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Compass,
  Sparkles,
  Layers,
  Globe,
  Tag,
  Hash,
  X,
  ExternalLink,
  Coins,
  TrendingUp,
} from 'lucide-react';

const DESTINATION_TYPES = [
  'ALL',
  'CITY',
  'HILL_STATION',
  'BEACH',
  'HERITAGE_SITE',
  'PILGRIMAGE',
  'NATIONAL_PARK',
  'ISLAND',
  'ARCHIPELAGO',
  'ISLAND_ARCHIPELAGO',
  'REGION_CLUSTER',
  'TOWN',
  'CIRCUIT',
  'OTHER',
];

export const AdminDestinationsSection: React.FC = () => {
  const [destinations, setDestinations] = useState<AdminDestinationListItemResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(15);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCurated, setSelectedCurated] = useState<string>('ALL');

  // Available Regions
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);

  // Selected Destination for Detail Drawer
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [destinationDetail, setDestinationDetail] = useState<AdminDestinationDetailResponse | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Load available regions once
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regions = await api.getAdminDestinationRegions();
        setAvailableRegions(regions || []);
      } catch (e) {
        console.error('Failed to load regions for admin dropdown:', e);
      }
    };
    fetchRegions();
  }, []);

  // Fetch destinations on filter/page change
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);

      const isCuratedParam =
        selectedCurated === 'CURATED' ? true : selectedCurated === 'COMMUNITY' ? false : undefined;

      const res: AdminDestinationListPageResponse = await api.getAdminDestinations({
        page,
        size: pageSize,
        search: activeSearch || undefined,
        region: selectedRegion !== 'ALL' ? selectedRegion : undefined,
        type: selectedType !== 'ALL' ? selectedType : undefined,
        isCurated: isCuratedParam,
      });

      setDestinations(res.content || []);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load destination directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [page, activeSearch, selectedRegion, selectedType, selectedCurated]);

  // Load detail when selected
  useEffect(() => {
    if (!selectedDestinationId) {
      setDestinationDetail(null);
      setDetailError(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);
        const data = await api.getAdminDestinationDetail(selectedDestinationId);
        setDestinationDetail(data);
      } catch (err: any) {
        setDetailError(err.message || 'Failed to load destination details.');
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedDestinationId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setSelectedRegion('ALL');
    setSelectedType('ALL');
    setSelectedCurated('ALL');
    setPage(0);
  };

  const formatTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MapPin className="text-emerald-700" size={20} />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Destination & Region Catalog
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
              {totalElements} Total Catalog Items
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Read-only platform inspection of destinations, territory taxonomy, and activity counts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(activeSearch || selectedRegion !== 'ALL' || selectedType !== 'ALL' || selectedCurated !== 'ALL') && (
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={handleResetFilters}
              className="text-xs text-slate-600"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* 2. Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search destination name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-slate-800"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setActiveSearch('');
                  setPage(0);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-800"
            >
              <option value="ALL">All Regions & States</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-800"
            >
              {DESTINATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Destination Types' : formatTypeLabel(t)}
                </option>
              ))}
            </select>
          </div>

          {/* Curation Filter */}
          <div>
            <select
              value={selectedCurated}
              onChange={(e) => {
                setSelectedCurated(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-800"
            >
              <option value="ALL">All Curation Sources</option>
              <option value="CURATED">Curated Destinations</option>
              <option value="COMMUNITY">Community / Custom</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 3. Destination Table / Content */}
      <Card className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading destination catalog...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchDestinations}>
              Retry
            </Button>
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <MapPin size={22} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No destinations found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No destinations match your current filters. Try searching for a different name or
              resetting active filters.
            </p>
            <Button size="sm" variant="outline" icon={<RotateCcw size={12} />} onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Region / State</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Cost / Pop</th>
                  <th className="py-3 px-4 text-center">Activities</th>
                  <th className="py-3 px-4 text-center">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {destinations.map((dest) => (
                  <tr
                    key={dest.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedDestinationId(dest.id)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80">
                          {dest.imageUrl ? (
                            <img
                              src={dest.imageUrl}
                              alt={dest.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <MapPin size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-1.5">
                            <span>{dest.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">#{dest.id}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {dest.canonicalName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md text-[11px] border border-slate-200">
                        <Globe size={11} className="text-slate-500" />
                        <span>{dest.region || 'India'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {formatTypeLabel(dest.destinationType)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-2 text-[11px]">
                        <span className="text-slate-700 font-bold" title="Cost Index">
                          {dest.costIndex ? `${dest.costIndex}x` : '1.0x'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-bold" title="Popularity Score">
                          ★ {dest.popularity || 50}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] border border-blue-200">
                        <Sparkles size={11} />
                        <span>{dest.activityCount}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {dest.isCurated ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Curated
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Community
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Eye size={13} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDestinationId(dest.id);
                        }}
                        className="text-xs text-slate-600 hover:text-slate-900"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Pagination */}
        {!loading && destinations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{page * pageSize + 1}</span> to{' '}
              <span className="font-bold text-slate-900">
                {Math.min((page + 1) * pageSize, totalElements)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{totalElements}</span> destinations
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                icon={<ChevronLeft size={13} />}
                className="text-xs"
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-700 px-2">
                Page {page + 1} of {Math.max(1, totalPages)}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                icon={<ChevronRight size={13} />}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 5. Destination Details Drawer / Modal */}
      {selectedDestinationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8">
            {detailLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Loading destination details...</p>
              </div>
            ) : detailError || !destinationDetail ? (
              <div className="text-center space-y-4 py-8">
                <p className="text-sm font-semibold text-rose-600">
                  {detailError || 'Failed to load details.'}
                </p>
                <Button size="sm" variant="outline" onClick={() => setSelectedDestinationId(null)}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {formatTypeLabel(destinationDetail.destinationType)}
                      </span>
                      {destinationDetail.isCurated && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                          Curated
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {destinationDetail.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Slug: {destinationDetail.canonicalName} • ID #{destinationDetail.id}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDestinationId(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Destination Image Preview */}
                {destinationDetail.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56 relative bg-slate-100">
                    <img
                      src={destinationDetail.imageUrl}
                      alt={destinationDetail.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Stats & Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <Sparkles size={11} className="text-emerald-600" />
                      <span>Activities</span>
                    </span>
                    <p className="text-lg font-black text-slate-900">
                      {destinationDetail.activityCount}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <Coins size={11} className="text-emerald-600" />
                      <span>Cost Index</span>
                    </span>
                    <p className="text-lg font-black text-slate-900">
                      {destinationDetail.costIndex ? `${destinationDetail.costIndex}x` : '1.0x'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <TrendingUp size={11} className="text-amber-500" />
                      <span>Popularity</span>
                    </span>
                    <p className="text-lg font-black text-slate-900">
                      {destinationDetail.popularity || 50}/100
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <Globe size={11} className="text-blue-500" />
                      <span>Currency</span>
                    </span>
                    <p className="text-lg font-black text-slate-900">
                      {destinationDetail.currencySymbol} {destinationDetail.currencyCode}
                    </p>
                  </div>
                </div>

                {/* Geography & Territory Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Geographic & Territorial Context
                  </h4>
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-medium">Territory / State Region:</span>
                      <span className="font-bold text-slate-900">
                        {destinationDetail.region || 'India'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-medium">Sovereign Nation:</span>
                      <span className="font-bold text-slate-900">{destinationDetail.country}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">GPS Coordinates:</span>
                      <span className="font-mono text-slate-800">
                        {destinationDetail.latitude && destinationDetail.longitude
                          ? `${destinationDetail.latitude.toFixed(4)}° N, ${destinationDetail.longitude.toFixed(4)}° E`
                          : 'Not Calibrated'}
                      </span>
                    </div>

                    {destinationDetail.regionDescription && (
                      <div className="pt-2 text-xs text-slate-600 border-t border-slate-200/60 italic">
                        "{destinationDetail.regionDescription}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Canonical Aliases */}
                {destinationDetail.aliases && destinationDetail.aliases.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Recognized Name Aliases & Historical Spellings
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {destinationDetail.aliases.map((alias, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDestinationId(null)}>
                    Done
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
