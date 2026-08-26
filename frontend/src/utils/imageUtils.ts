import adventureImg from '../assets/activities/activity-adventure.jpg';
import cultureImg from '../assets/activities/activity-culture.jpg';
import entertainmentImg from '../assets/activities/activity-entertainment.jpg';
import foodImg from '../assets/activities/activity-food.jpg';
import nightlifeImg from '../assets/activities/activity-nightlife.jpg';
import relaxationImg from '../assets/activities/activity-relaxation.jpg';
import sightseeingImg from '../assets/activities/activity-sightseeing.jpg';
import shoppingImg from '../assets/activities/activity-shopping.jpg';
import spiritualImg from '../assets/activities/activity-spiritual.jpg';

import { cityImages } from '../data/cityImages';

// Curated travel imagery for destinations & activity categories

// Normalize a destination name for lookup (lowercase, trimmed)
function normalizeCityKey(name: string): string {
  return name.trim().toLowerCase();
}

const CATEGORY_IMAGES: Record<string, string> = {
  adventure: adventureImg,
  culture: cultureImg,
  entertainment: entertainmentImg,
  food: foodImg,
  nightlife: nightlifeImg,
  relaxation: relaxationImg,
  sightseeing: sightseeingImg,
  shopping: shoppingImg,
  spiritual: spiritualImg,
};

const DEFAULT_TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-ce74f452899f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
];

export function getDestinationImageUrl(destinationName?: string, fallbackUrl?: string): string {
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl;
  }
  if (destinationName) {
    const key = normalizeCityKey(destinationName);
    if (cityImages[key]) {
      return cityImages[key];
    }
  }
  if (!destinationName) return DEFAULT_TRIP_IMAGES[0];
  return DEFAULT_TRIP_IMAGES[Math.abs(hashString(destinationName)) % DEFAULT_TRIP_IMAGES.length];
}

export function getCityImageUrl(cityName?: string, fallbackUrl?: string): string {
  return getDestinationImageUrl(cityName, fallbackUrl);
}

/**
 * Use as `onError` on any <img> displaying a destination image.
 * Prevents broken-image icons by falling back to the generic travel image.
 */
export function onCityImageError(e: Event): void {
  const img = e.currentTarget as HTMLImageElement;
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = DEFAULT_TRIP_IMAGES[0];
  }
}

export function onDestinationImageError(e: Event): void {
  onCityImageError(e);
}

export function getActivityImageUrl(category?: string, fallbackUrl?: string): string {
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl;
  }
  if (category) {
    const key = category.trim().toLowerCase().replace(/[-_\s]/g, '');
    if (CATEGORY_IMAGES[key]) {
      return CATEGORY_IMAGES[key];
    }
  }
  return CATEGORY_IMAGES['sightseeing'];
}

export function getTripCoverUrl(tripId?: number, coverPhoto?: string): string {
  if (coverPhoto && coverPhoto.startsWith('http')) return coverPhoto;
  const idx = (tripId || 0) % DEFAULT_TRIP_IMAGES.length;
  return DEFAULT_TRIP_IMAGES[idx];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
