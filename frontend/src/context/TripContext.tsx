import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Trip, TripStop, TripActivity, TripBudgetSummary, ItineraryViewResponse } from '../types';
import { tripService } from '../services/tripService';
import { useAuth } from './AuthContext';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  loading: boolean;
  loadTrips: () => Promise<void>;
  setActiveTripId: (tripId: number | null) => Promise<void>;
  refreshActiveTrip: () => Promise<void>;
  createTrip: (data: { name: string; description?: string; startDate: string; endDate: string; coverPhoto?: string; budgetThreshold?: number }) => Promise<Trip>;
  updateTrip: (tripId: number, updates: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (tripId: number) => Promise<void>;
  addStop: (tripId: number, stopData: { cityId: number; startDate: string; endDate: string; notes?: string }) => Promise<TripStop>;
  updateStop: (tripId: number, stopId: number, updates: { startDate?: string; endDate?: string; notes?: string }) => Promise<TripStop>;
  deleteStop: (tripId: number, stopId: number) => Promise<void>;
  reorderStops: (tripId: number, stopIds: number[]) => Promise<TripStop[]>;
  assignActivity: (tripId: number, stopId: number, data: { activityId: number; activityDate: string; startTime?: string; estimatedCost?: number; notes?: string }) => Promise<TripActivity>;
  deleteTripActivity: (tripId: number, tripActivityId: number) => Promise<void>;
  getItinerary: (tripId: number) => Promise<ItineraryViewResponse>;
  getBudget: (tripId: number) => Promise<TripBudgetSummary>;
  copyTrip: (shareToken: string) => Promise<Trip>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTrips = useCallback(async () => {
    if (!user) {
      setTrips([]);
      setActiveTrip(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await tripService.getTrips();
      setTrips(data);
      if (data.length > 0 && !activeTrip) {
        const first = await tripService.getTripById(data[0].id);
        setActiveTrip(first);
      }
    } catch (e) {
      console.error('Failed to load trips', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const setActiveTripId = async (tripId: number | null) => {
    if (!tripId) {
      setActiveTrip(null);
      return;
    }
    const trip = await tripService.getTripById(tripId);
    setActiveTrip(trip);
  };

  const refreshActiveTrip = async () => {
    if (activeTrip) {
      const refreshed = await tripService.getTripById(activeTrip.id);
      setActiveTrip(refreshed);
      const updatedList = await tripService.getTrips();
      setTrips(updatedList);
    }
  };

  const createTrip = async (data: { name: string; description?: string; startDate: string; endDate: string; coverPhoto?: string; budgetThreshold?: number }) => {
    const created = await tripService.createTrip(data);
    await loadTrips();
    setActiveTrip(created);
    return created;
  };

  const updateTrip = async (tripId: number, updates: Partial<Trip>) => {
    const updated = await tripService.updateTrip(tripId, updates);
    await refreshActiveTrip();
    return updated;
  };

  const deleteTrip = async (tripId: number) => {
    await tripService.deleteTrip(tripId);
    if (activeTrip?.id === tripId) {
      setActiveTrip(null);
    }
    await loadTrips();
  };

  const addStop = async (tripId: number, stopData: { cityId: number; startDate: string; endDate: string; notes?: string }) => {
    const stop = await tripService.addStop(tripId, stopData);
    await refreshActiveTrip();
    return stop;
  };

  const updateStop = async (tripId: number, stopId: number, updates: { startDate?: string; endDate?: string; notes?: string }) => {
    const stop = await tripService.updateStop(tripId, stopId, updates);
    await refreshActiveTrip();
    return stop;
  };

  const deleteStop = async (tripId: number, stopId: number) => {
    await tripService.deleteStop(tripId, stopId);
    await refreshActiveTrip();
  };

  const reorderStops = async (tripId: number, stopIds: number[]) => {
    const stops = await tripService.reorderStops(tripId, stopIds);
    await refreshActiveTrip();
    return stops;
  };

  const assignActivity = async (tripId: number, stopId: number, data: { activityId: number; activityDate: string; startTime?: string; estimatedCost?: number; notes?: string }) => {
    const act = await tripService.assignActivity(tripId, stopId, data);
    await refreshActiveTrip();
    return act;
  };

  const deleteTripActivity = async (tripId: number, tripActivityId: number) => {
    await tripService.deleteTripActivity(tripId, tripActivityId);
    await refreshActiveTrip();
  };

  const getItinerary = async (tripId: number) => {
    return tripService.getItinerary(tripId);
  };

  const getBudget = async (tripId: number) => {
    return tripService.getBudget(tripId);
  };

  const copyTrip = async (shareToken: string) => {
    const cloned = await tripService.copySharedTrip(shareToken);
    await loadTrips();
    setActiveTrip(cloned);
    return cloned;
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        loading,
        loadTrips,
        setActiveTripId,
        refreshActiveTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addStop,
        updateStop,
        deleteStop,
        reorderStops,
        assignActivity,
        deleteTripActivity,
        getItinerary,
        getBudget,
        copyTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
