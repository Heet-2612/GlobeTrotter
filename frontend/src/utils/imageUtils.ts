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

// Normalize a city name for lookup (lowercase, trimmed)
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

export function getCityImageUrl(cityName?: string, fallbackUrl?: string): string {
  // Priority 1: A valid API/backend-provided image URL
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl;
  }
  // Priority 2: Curated Wikimedia Commons image for the city
  if (cityName) {
    const key = normalizeCityKey(cityName);
    if (cityImages[key]) {
      return cityImages[key];
    }
  }
  // Priority 3: Generic travel fallback (never a broken image)
  if (!cityName) return DEFAULT_TRIP_IMAGES[0];
  return DEFAULT_TRIP_IMAGES[Math.abs(hashString(cityName)) % DEFAULT_TRIP_IMAGES.length];
}

/**
 * Use as `onError` on any <img> displaying a city image.
 * Prevents broken-image icons by falling back to the generic travel image.
 */
export function onCityImageError(e: Event): void {
  const img = e.currentTarget as HTMLImageElement;
  // Avoid infinite loop if fallback also fails
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = DEFAULT_TRIP_IMAGES[0];
  }
}


export function getActivityImageUrl(category?: string, fallbackUrl?: string): string {
  // Priority 1: A real image URL provided by the activity/API
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl;
  }
  // Priority 2: Corresponding local category image
  if (category) {
    const key = category.trim().toLowerCase().replace(/[-_\s]/g, '');
    if (CATEGORY_IMAGES[key]) {
      return CATEGORY_IMAGES[key];
    }
  }
  // Priority 3: Generic fallback image
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
