import React, { useEffect, useState } from 'react';
import { TripResponse, TripStopResponse, TripActivityResponse } from '../types';
import { api } from '../services/api';
import { Calendar, DollarSign, Globe, Lock, Edit3, Eye, Clock, Share2, MapPin } from 'lucide-react';
import { Button, Card, Badge, LoadingState } from '../components/common/UIComponents';
import { useCurrency } from '../context/CurrencyContext';
import { getTripCoverUrl, getCityImageUrl, onCityImageError } from '../utils/imageUtils';
import ActivityImage from '../components/common/ActivityImage';


interface ItineraryViewPageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ItineraryViewPage: React.FC<ItineraryViewPageProps> = ({ tripId, onNavigate }) => {
  const { formatDual } = useCurrency();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [stops, setStops] = useState<TripStopResponse[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<number, TripActivityResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripData = await api.getTripById(tripId);
      setTrip(tripData);

      const stopsData = await api.getTripStops(tripId);
      setStops(stopsData);

      const map: Record<number, TripActivityResponse[]> = {};
      for (const stop of stopsData) {
        try {
          const acts = await api.getTripActivities(tripId, stop.id);
          map[stop.id] = acts;
        } catch {
          map[stop.id] = [];
        }
      }
      setActivitiesMap(map);
    } catch (err: any) {
      setError(err.message || 'Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading itinerary..." />;
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Trip not found.'}
        </div>
      </div>
    );
  }

  const coverUrl = getTripCoverUrl(trip.id, trip.coverPhoto);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Presentation Header Hero (Light Mode) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 p-8 sm:p-10 shadow-md bg-white space-y-6">
        <img src={coverUrl} alt={trip.name} className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Badge variant="emerald">Read-Only Travel Guide</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">{trip.name}</h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">{trip.description || 'No description provided.'}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={<Edit3 size={14} />} onClick={() => onNavigate('builder', tripId)}>
              Builder
            </Button>
            <Button variant="emerald" size="sm" icon={<Eye size={14} />} onClick={() => onNavigate('view', tripId)}>
              Read View
            </Button>
            <Button variant="secondary" size="sm" icon={<DollarSign size={14} />} onClick={() => onNavigate('budget', tripId)}>
              Budget
            </Button>
            <Button variant="secondary" size="sm" icon={<Clock size={14} />} onClick={() => onNavigate('timeline', tripId)}>
              Timeline
            </Button>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-slate-200 flex flex-wrap gap-6 text-sm text-slate-700">
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase">TRIP DATES</span>
            <span className="font-semibold text-slate-900 flex items-center space-x-1 mt-0.5">
              <Calendar size={14} className="text-emerald-600" />
              <span>{trip.startDate} to {trip.endDate}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase">TARGET BUDGET</span>
            <span className="font-extrabold text-emerald-700 flex items-center space-x-1 mt-0.5">
              <span>{formatDual(trip.budget)}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase">VISIBILITY</span>
            <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5 text-xs">
              {trip.isPublic ? (
                <>
                  <Globe size={13} className="text-emerald-700" />
                  <span className="text-emerald-700">Public Shared</span>
                </>
              ) : (
                <>
                  <Lock size={13} className="text-slate-400" />
                  <span>Private</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Stops Timeline View */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">Trip Destinations ({stops.length})</h2>

        {stops.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 bg-white border border-slate-200">
            No city stops added to this trip yet.
          </Card>
        ) : (
          stops.map((stop, idx) => {
            const cityImg = getCityImageUrl(stop.city.name, stop.city.imageUrl);
            const stopActivities = activitiesMap[stop.id] || [];

            return (
              <Card key={stop.id} className="p-6 space-y-4 shadow-xs bg-white border border-slate-200">
                <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative border border-slate-200">
                    <img src={cityImg} alt={stop.city.name} loading="lazy" onError={onCityImageError} className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-slate-900/30"></div>
                    <span className="absolute inset-0 flex items-center justify-center font-extrabold text-white text-base">
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {stop.city.name}, <span className="text-slate-500 text-base font-normal">{stop.city.country}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📅 {stop.startDate} - {stop.endDate} {stop.notes && `• ${stop.notes}`}
                    </p>
                  </div>
                </div>

                {/* Scheduled Activities */}
                <div className="space-y-3 pl-2 sm:pl-4">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Scheduled Activities</h4>
                  {stopActivities.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No activities added for this stop yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stopActivities.map((act) => {
                        return (
                          <div key={act.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex space-x-3 items-center">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                              <ActivityImage
                                imageUrl={act.activity?.imageUrl}
                                subcategoryId={act.activity?.subcategoryId}
                                category={act.activity?.category}
                                alt={act.activity.name}
                                className="w-full h-full rounded-none"
                                iconSize={20}
                              />
                            </div>
                            <div className="flex-1 space-y-0.5 text-xs">
                              <h5 className="font-bold text-slate-900 line-clamp-1">{act.activity.name}</h5>
                              <p className="text-slate-500">📅 {act.scheduledDate} {act.startTime && `• ⏰ ${act.startTime}`}</p>
                              <p className="font-extrabold text-emerald-700">
                                {formatDual(act.customCost ?? act.activity?.estimatedCost, act.activity?.currency)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
