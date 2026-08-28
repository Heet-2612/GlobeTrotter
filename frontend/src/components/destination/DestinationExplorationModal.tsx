import React, { useState, useEffect } from 'react';
import {
  TripStopResponse,
  ActivityResponse,
  DiscoveredPlaceResponse,
  TripActivityResponse
} from '../../types';
import { api } from '../../services/api';
import {
  X,
  Sparkles,
  Search,
  Check,
  Plus,
  Loader2,
  MapPin,
  Clock,
  Compass,
  Utensils,
  ShoppingBag,
  Trees,
  Landmark,
  Film
} from 'lucide-react';
import { Button, Card, Badge } from '../common/UIComponents';
import { getDestinationImageUrl, getActivityImageUrl, onCityImageError } from '../../utils/imageUtils';

interface DestinationExplorationModalProps {
  tripId: number;
  stop: TripStopResponse;
  existingTripActivities: TripActivityResponse[];
  onClose: () => void;
  onActivitiesUpdated: () => void;
}

const CATEGORY_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Attractions', value: 'attractions', icon: Landmark },
  { label: 'Nature', value: 'nature', icon: Trees },
  { label: 'Food', value: 'food', icon: Utensils },
  { label: 'Shopping', value: 'shopping', icon: ShoppingBag },
  { label: 'Culture', value: 'culture', icon: Compass },
  { label: 'Entertainment', value: 'entertainment', icon: Film },
];

export const DestinationExplorationModal: React.FC<DestinationExplorationModalProps> = ({
  tripId,
  stop,
  existingTripActivities,
  onClose,
  onActivitiesUpdated
}) => {
  const destination = stop.destination || stop.city;
  const destinationId = destination.id;

  // Curated Highlights State
  const [curatedActivities, setCuratedActivities] = useState<ActivityResponse[]>([]);
  const [loadingCurated, setLoadingCurated] = useState(true);
  const [curatedError, setCuratedError] = useState<string | null>(null);

  // Discover More State
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [discoveredPlaces, setDiscoveredPlaces] = useState<DiscoveredPlaceResponse[]>([]);
  const [hasDiscovered, setHasDiscovered] = useState(false);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);

  // Added Tracking State
  const [addedActivityIds, setAddedActivityIds] = useState<Set<number>>(new Set());
  const [addedDiscoveredExternalIds, setAddedDiscoveredExternalIds] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | number | null>(null);

  // Sync existing trip activities into local added tracking
  useEffect(() => {
    const actIds = new Set<number>();
    const extIds = new Set<string>();

    existingTripActivities.forEach((ta) => {
      if (ta.activity) {
        actIds.add(ta.activity.id);
        if (ta.activity.externalId) {
          extIds.add(ta.activity.externalId);
        }
      }
    });

    setAddedActivityIds(actIds);
    setAddedDiscoveredExternalIds(extIds);
  }, [existingTripActivities]);

  // Automatically load Curated Highlights on open
  useEffect(() => {
    loadCuratedHighlights();
  }, [destinationId]);

  const loadCuratedHighlights = async () => {
    try {
      setLoadingCurated(true);
      setCuratedError(null);
      let data = await api.getCuratedActivitiesByDestination(destinationId);
      if (!data || data.length === 0) {
        // Fallback to searching activities by destinationId
        data = await api.searchActivities(undefined, undefined, undefined, destinationId);
      }
      setCuratedActivities(data || []);
    } catch (err: any) {
      setCuratedError('Failed to load curated highlights. Please try again.');
    } finally {
      setLoadingCurated(false);
    }
  };

  // Active search query snapshot (for no-results label)
  const [activeQuery, setActiveQuery] = useState('');

  // Discover More Search Handler
  const handleSearchDiscover = async (categoryFilter?: string) => {
    const cat = categoryFilter !== undefined ? categoryFilter : selectedCategory;
    const q = discoverQuery.trim();
    try {
      setLoadingDiscover(true);
      setDiscoverError(null);
      setHasDiscovered(true);
      setDiscoveredPlaces([]); // Clear stale results immediately
      setActiveQuery(q);

      const places = await api.discoverPlacesByDestination(
        destinationId,
        q || undefined,
        cat || undefined
      );

      setDiscoveredPlaces(places || []);
    } catch (err: any) {
      setDiscoverError("Couldn't load more places right now. Try again.");
    } finally {
      setLoadingDiscover(false);
    }
  };

  // Add Curated Activity to Trip
  const handleAddCurated = async (activity: ActivityResponse) => {
    try {
      setAddingId(activity.id);
      await api.createTripActivity(tripId, stop.id, {
        activityId: activity.id,
        scheduledDate: stop.startDate || new Date().toISOString().split('T')[0],
      });

      setAddedActivityIds((prev) => new Set(prev).add(activity.id));
      if (activity.externalId) {
        setAddedDiscoveredExternalIds((prev) => new Set(prev).add(activity.externalId!));
      }
      onActivitiesUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to add activity to trip.');
    } finally {
      setAddingId(null);
    }
  };

  // Add Discovered Place to Trip
  const handleAddDiscovered = async (place: DiscoveredPlaceResponse) => {
    const extId = place.externalId || place.id;
    try {
      setAddingId(extId);
      await api.addDiscoveredActivityToStop(tripId, stop.id, {
        externalId: extId,
        name: place.name,
        description: place.description || place.address || `${place.category || 'Attraction'} in ${destination.name}`,
        category: place.category || 'Sightseeing',
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address,
        imageUrl: place.imageUrl,
        scheduledDate: stop.startDate || new Date().toISOString().split('T')[0],
      });

      setAddedDiscoveredExternalIds((prev) => new Set(prev).add(extId));
      onActivitiesUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to add discovered place to trip.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-0 shadow-2xl bg-white border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden rounded-2xl">
        {/* Destination Header Banner */}
        <div className="relative h-44 shrink-0 bg-slate-900 overflow-hidden">
          <img
            src={getDestinationImageUrl(destination.name, destination.regionName || destination.region, destination.imageUrl)}
            alt={destination.name}
            onError={onCityImageError}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Header Info Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <MapPin size={13} />
              <span>{destination.regionName || destination.region || destination.country || 'India'}</span>
              {destination.destinationType && (
                <>
                  <span>•</span>
                  <span>{destination.destinationType.replace('_', ' ')}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white">{destination.name}</h2>
            <p className="text-xs text-slate-300">Explore handpicked highlights or discover live attractions around {destination.name}</p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* SECTION 1: CURATED HIGHLIGHTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600" /> Curated Highlights
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top recommended authentic attractions & experiences</p>
              </div>
              <Badge variant="emerald">{curatedActivities.length} Highlights</Badge>
            </div>

            {loadingCurated ? (
              <div className="py-8 flex items-center justify-center text-slate-400 space-x-2 text-xs">
                <Loader2 className="animate-spin text-emerald-600" size={18} />
                <span>Loading curated highlights for {destination.name}...</span>
              </div>
            ) : curatedError ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex justify-between items-center">
                <span>{curatedError}</span>
                <Button size="sm" variant="outline" onClick={loadCuratedHighlights}>Retry</Button>
              </div>
            ) : curatedActivities.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs italic">
                No curated highlights available for {destination.name} yet. Use Discover More below!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {curatedActivities.map((act) => {
                  const isAdded = addedActivityIds.has(act.id) || (act.externalId && addedDiscoveredExternalIds.has(act.externalId));
                  const isAdding = addingId === act.id;

                  return (
                    <div
                      key={act.id}
                      className={`p-3.5 rounded-xl border flex space-x-3 transition-all ${
                        isAdded ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={getActivityImageUrl(act.category, act.imageUrl)}
                        alt={act.name}
                        onError={onCityImageError}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{act.name}</h4>
                          <span className="text-[10px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {act.category || 'Highlight'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{act.description || 'Authentic attraction'}</p>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock size={11} /> {act.estimatedDurationMinutes || 60} mins
                          </span>

                          {isAdded ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              <Check size={12} /> Added
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="emerald"
                              loading={isAdding}
                              disabled={isAdding}
                              icon={<Plus size={13} />}
                              onClick={() => handleAddCurated(act)}
                            >
                              Add to Trip
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: DISCOVER MORE */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Compass size={18} className="text-indigo-600" /> Discover More
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Find more places, attractions, food and experiences around {destination.name}</p>
            </div>

            {/* Search Input & Action */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchDiscover();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  placeholder={`Search places in ${destination.name}...`}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-indigo-600 transition-all placeholder-slate-400"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" loading={loadingDiscover} icon={<Search size={14} />}>
                Search
              </Button>
            </form>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      handleSearchDiscover(cat.value);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {IconComponent && <IconComponent size={12} />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Discover Results Display */}
            {loadingDiscover ? (
              <div className="py-8 flex items-center justify-center text-slate-400 space-x-2 text-xs">
                <Loader2 className="animate-spin text-indigo-600" size={18} />
                <span>Searching places in {destination.name}...</span>
              </div>
            ) : discoverError ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                ⚠️ {discoverError}
              </div>
            ) : hasDiscovered && discoveredPlaces.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-200">
                {activeQuery
                  ? `No places found for "${activeQuery}".`
                  : selectedCategory
                  ? `No ${CATEGORY_FILTERS.find((c) => c.value === selectedCategory)?.label.toLowerCase() || ''} places found around ${destination.name}.`
                  : `No places found around ${destination.name}.`}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {discoveredPlaces.map((place) => {
                  const extId = place.externalId || place.id;
                  const isAdded = addedDiscoveredExternalIds.has(extId);
                  const isAdding = addingId === extId;

                  return (
                    <div
                      key={extId}
                      className={`p-3.5 rounded-xl border flex space-x-3 transition-all ${
                        isAdded ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={getDestinationImageUrl(place.name, place.imageUrl)}
                        alt={place.name}
                        onError={onCityImageError}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{place.name}</h4>
                          <span className="text-[10px] text-indigo-700 font-semibold uppercase bg-indigo-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {place.category || 'Place'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{place.address || place.description || 'Attraction'}</p>

                        <div className="pt-1 flex items-center justify-end">
                          {isAdded ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              <Check size={12} /> Added
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              loading={isAdding}
                              disabled={isAdding}
                              icon={<Plus size={13} />}
                              onClick={() => handleAddDiscovered(place)}
                            >
                              Add to Trip
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
