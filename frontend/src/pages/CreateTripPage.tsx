import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RegionResponse, DestinationResponse } from '../types';
import {
  Compass,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  MapPin,
  Sparkles,
  X,
  Building2,
  Mountain,
  Trees,
  Palmtree,
  Landmark,
  CheckCircle2,
  Trash2,
  Loader2,
  Globe2
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/common/UIComponents';
import { getDestinationImageUrl, onCityImageError } from '../utils/imageUtils';

interface CreateTripPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const CreateTripPage: React.FC<CreateTripPageProps> = ({ onNavigate }) => {
  // Wizard Step Control (1: Details, 2: State/UT, 3: Destinations, 4: Review)
  const [step, setStep] = useState<number>(1);

  // Form State - Step 1
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Loaded Data - Regions & Destinations
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [allCuratedDestinations, setAllCuratedDestinations] = useState<DestinationResponse[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Filter & Selection States - Step 2 & 3
  const [regionSearch, setRegionSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionResponse | null>(null);
  const [destinationSearch, setDestinationSearch] = useState('');

  // Selected Destinations across all regions (Map of destId -> DestinationResponse)
  const [selectedDestinationsMap, setSelectedDestinationsMap] = useState<Record<number, DestinationResponse>>({});

  // Submission State - Step 4
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitProgress, setSubmitProgress] = useState<string>('');

  // Initial Fetch of Regions and Curated Catalog on component mount
  useEffect(() => {
    loadRegionsAndDestinations();
  }, []);

  const loadRegionsAndDestinations = async () => {
    try {
      setLoadingData(true);
      setDataError(null);
      const [regionsData, destinationsData] = await Promise.all([
        api.getRegions(),
        api.searchDestinations(undefined, undefined, undefined, undefined, true),
      ]);
      setRegions(regionsData);
      setAllCuratedDestinations(destinationsData);
    } catch (err: any) {
      setDataError('Failed to load regions and destinations catalog. Please check server connection.');
    } finally {
      setLoadingData(false);
    }
  };

  // Step 1 Validation
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError('Trip name is required.');
      return;
    }
    if (!startDate || !endDate) {
      setSubmitError('Start date and end date are required.');
      return;
    }
    if (startDate > endDate) {
      setSubmitError('Start date cannot be after end date.');
      return;
    }

    setStep(2);
  };

  // Toggle Destination Selection
  const toggleDestination = (dest: DestinationResponse) => {
    setSelectedDestinationsMap((prev) => {
      const next = { ...prev };
      if (next[dest.id]) {
        delete next[dest.id];
      } else {
        next[dest.id] = dest;
      }
      return next;
    });
  };

  const selectedDestinationsList: DestinationResponse[] = Object.values(selectedDestinationsMap);

  // Group Selected Destinations by Region
  const groupedSelectedDestinations = selectedDestinationsList.reduce((acc: Record<string, DestinationResponse[]>, dest: DestinationResponse) => {
    const regionName = dest.regionName || dest.region || 'Curated Destinations';
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(dest);
    return acc;
  }, {} as Record<string, DestinationResponse[]>);

  // Count Destinations per Region
  const getDestinationCountForRegion = (region: RegionResponse): number => {
    return allCuratedDestinations.filter(
      (d: DestinationResponse) => d.regionId === region.id || (d.regionName && d.regionName.toLowerCase() === region.name.toLowerCase())
    ).length;
  };

  // Filtered Regions for Step 2
  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(regionSearch.trim().toLowerCase())
  );

  // Destinations for Selected Region (Step 3)
  const regionDestinations = selectedRegion
    ? allCuratedDestinations.filter(
        (d) =>
          d.regionId === selectedRegion.id ||
          (d.regionName && d.regionName.toLowerCase() === selectedRegion.name.toLowerCase())
      )
    : [];

  const filteredRegionDestinations = regionDestinations.filter((d) =>
    d.name.toLowerCase().includes(destinationSearch.trim().toLowerCase())
  );

  // Final Submit Handler (Step 4)
  const handleCreateTrip = async () => {
    if (selectedDestinationsList.length === 0) {
      setSubmitError('Please select at least one destination to create a trip.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitProgress('Creating trip container...');

    try {
      // 1. Create Trip Container
      const newTrip = await api.createTrip({
        name: name.trim(),
        description: description.trim() || undefined,
        startDate,
        endDate,
      });

      // 2. Add Stops for each selected destination
      setSubmitProgress(`Adding ${selectedDestinationsList.length} destination stops...`);
      let stopFailures = 0;

      for (let i = 0; i < selectedDestinationsList.length; i++) {
        const dest = selectedDestinationsList[i];
        try {
          await api.createTripStop(newTrip.id, {
            destinationId: dest.id,
            startDate,
            endDate,
          });
        } catch (stopErr) {
          stopFailures++;
        }
      }

      if (stopFailures > 0) {
        setSubmitError(`Trip created, but failed to attach ${stopFailures} of ${selectedDestinationsList.length} destinations.`);
      }

      // Navigate to Itinerary Builder for the new trip
      onNavigate('builder', newTrip.id);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create trip. Please try again.');
    } finally {
      setSubmitting(false);
      setSubmitProgress('');
    }
  };

  // Helper icon for destination type
  const getDestinationTypeIcon = (type?: string) => {
    switch (type) {
      case 'HILL_STATION':
        return <Mountain size={13} className="text-amber-500" />;
      case 'BEACH':
        return <Palmtree size={13} className="text-cyan-500" />;
      case 'NATIONAL_PARK':
        return <Trees size={13} className="text-emerald-500" />;
      case 'HERITAGE_SITE':
        return <Landmark size={13} className="text-indigo-500" />;
      default:
        return <Building2 size={13} className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-xs">
            <Compass size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create New Trip</h1>
            <p className="text-xs text-slate-500">Plan multi-destination itineraries across India's authentic States & UTs</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('dashboard')}>
          Cancel
        </Button>
      </div>

      {/* Progress Bar Indicator */}
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold mb-2">
          <span className={step >= 1 ? 'text-emerald-600' : 'text-slate-400'}>1. Trip Details</span>
          <span className={step >= 2 ? 'text-emerald-600' : 'text-slate-400'}>2. Choose State/UT</span>
          <span className={step >= 3 ? 'text-emerald-600' : 'text-slate-400'}>3. Destinations</span>
          <span className={step >= 4 ? 'text-emerald-600' : 'text-slate-400'}>4. Review & Build</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Global Error Banner */}
      {(submitError || dataError) && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <span>{submitError || dataError}</span>
          <button onClick={() => { setSubmitError(null); setDataError(null); }} className="text-rose-500 hover:text-rose-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* STEP 1 — Trip Details */}
      {step === 1 && (
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-md">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" /> 1. Trip Name & Travel Dates
            </h2>
            <p className="text-xs text-slate-500 mt-1">Set your trip's title and travel timeframe before picking destinations.</p>
          </div>

          <form onSubmit={handleStep1Next} className="space-y-5">
            <Input
              label="Trip Name *"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Euro Trip or Grand Karnataka Tour 2026"
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief travel goals, family members traveling, or theme..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="End Date *"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <Button type="submit" variant="emerald" size="md" icon={<ArrowRight size={16} />}>
                Continue to Destinations →
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 2 — Choose State / UT (Region) */}
      {step === 2 && (
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe2 size={18} className="text-emerald-600" /> 2. Choose State or Union Territory
              </h2>
              <p className="text-xs text-slate-500 mt-1">Select a State/UT to browse its curated travel destinations.</p>
            </div>
            {selectedDestinationsList.length > 0 && (
              <Badge variant="emerald">
                {selectedDestinationsList.length} destination{selectedDestinationsList.length > 1 ? 's' : ''} selected overall
              </Badge>
            )}
          </div>

          {/* Region Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              placeholder="Search 29 States & Union Territories (e.g. Karnataka, Rajasthan, Kerala)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 transition-all placeholder-slate-400"
            />
          </div>

          {loadingData ? (
            <div className="py-12 flex justify-center items-center text-slate-400 space-x-2 text-sm">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading 29 States & UTs catalog...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
              {filteredRegions.map((region) => {
                const count = getDestinationCountForRegion(region);
                // Check if user has selected destinations in this region
                const selectedInRegion = selectedDestinationsList.filter(
                  (d) => d.regionId === region.id || (d.regionName && d.regionName.toLowerCase() === region.name.toLowerCase())
                ).length;

                return (
                  <div
                    key={region.id}
                    onClick={() => {
                      setSelectedRegion(region);
                      setStep(3);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 relative hover:shadow-md ${
                      selectedInRegion > 0
                        ? 'bg-emerald-50/60 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">{region.name}</h3>
                      {selectedInRegion > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          {selectedInRegion}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {region.description || `${region.country} State Region`}
                    </p>
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>{count} Curated Destination{count !== 1 ? 's' : ''}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="secondary" size="md" icon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>
              Back to Trip Details
            </Button>

            {selectedDestinationsList.length > 0 && (
              <Button variant="emerald" size="md" icon={<ArrowRight size={16} />} onClick={() => setStep(4)}>
                Review ({selectedDestinationsList.length}) Selected →
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* STEP 3 — Choose Destinations for Selected Region */}
      {step === 3 && selectedRegion && (
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-emerald-700 font-bold mb-0.5">
                <span className="cursor-pointer hover:underline" onClick={() => setStep(2)}>States / UTs</span>
                <span>/</span>
                <span>{selectedRegion.name}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Select Destinations in {selectedRegion.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Check one or more destinations to include in your trip.
              </p>
            </div>

            <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />} onClick={() => setStep(2)}>
              Change State/UT
            </Button>
          </div>

          {/* Destination Search Filter */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder={`Search destinations in ${selectedRegion.name}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 transition-all placeholder-slate-400"
            />
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
            {filteredRegionDestinations.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                No curated destinations found matching "{destinationSearch}".
              </div>
            ) : (
              filteredRegionDestinations.map((dest) => {
                const isSelected = !!selectedDestinationsMap[dest.id];
                return (
                  <div
                    key={dest.id}
                    onClick={() => toggleDestination(dest)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex space-x-3.5 items-center hover:shadow-sm ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                      <img
                        src={getDestinationImageUrl(dest.name, dest.imageUrl)}
                        alt={dest.name}
                        onError={onCityImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{dest.name}</h4>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          {getDestinationTypeIcon(dest.destinationType)}
                          {dest.destinationType?.replace('_', ' ') || 'Destination'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selection Bar & Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="secondary" size="md" icon={<ArrowLeft size={16} />} onClick={() => setStep(2)}>
              ← Back to States / UTs
            </Button>

            <Button
              variant="emerald"
              size="md"
              disabled={selectedDestinationsList.length === 0}
              icon={<ArrowRight size={16} />}
              onClick={() => setStep(4)}
            >
              Review ({selectedDestinationsList.length}) Selected →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4 — Review & Confirm Trip */}
      {step === 4 && (
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-md">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> 4. Review & Confirm Trip
            </h2>
            <p className="text-xs text-slate-500 mt-1">Confirm your itinerary stops before building activities.</p>
          </div>

          {/* Summary Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">{name}</h3>
              <Badge variant="emerald">{selectedDestinationsList.length} Destinations</Badge>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {startDate} to {endDate}
              </span>
              {description && <span className="italic text-slate-500 truncate max-w-xs">{description}</span>}
            </div>
          </div>

          {/* Selected Destinations Grouped by State/UT */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Selected Stops ({selectedDestinationsList.length})
            </h3>

            {Object.keys(groupedSelectedDestinations).map((stateName) => (
              <div key={stateName} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-600" /> {stateName}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupedSelectedDestinations[stateName].map((dest) => (
                    <div
                      key={dest.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={getDestinationImageUrl(dest.name, dest.imageUrl)}
                          alt={dest.name}
                          onError={onCityImageError}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{dest.name}</div>
                          <div className="text-[10px] text-slate-500">{dest.destinationType?.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDestination(dest)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove destination"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="secondary" size="md" icon={<ArrowLeft size={16} />} onClick={() => setStep(3)}>
              Add More Destinations
            </Button>

            <Button
              variant="emerald"
              size="md"
              loading={submitting}
              disabled={selectedDestinationsList.length === 0 || submitting}
              icon={<Sparkles size={16} />}
              onClick={handleCreateTrip}
            >
              {submitting ? submitProgress || 'Creating Trip...' : 'Create Trip & Start Itinerary →'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
