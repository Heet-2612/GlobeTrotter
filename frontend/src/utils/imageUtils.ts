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
import { stateImages } from '../data/stateImages';

// Curated travel imagery for destinations & activity categories

function normalizeKey(name: string): string {
  return name.trim().toLowerCase();
}

const CATEGORY_IMAGES: Record<string, string> = {
  attraction: sightseeingImg,
  sightseeing: sightseeingImg,
  nature: relaxationImg,
  food: foodImg,
  shopping: shoppingImg,
  culture: cultureImg,
  entertainment: entertainmentImg,
  pilgrimage: spiritualImg,
  relaxation: relaxationImg,
  adventure: adventureImg,
  nightlife: nightlifeImg,
  spiritual: spiritualImg,
};

const DEFAULT_TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-ce74f452899f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
];

/**
 * Reliable fallback hierarchy:
 * 1. Provided explicit fallbackUrl (if valid)
 * 2. Destination-specific landmark image (cityImages)
 * 3. State/Region-specific landscape image (stateImages)
 * 4. General travel fallback
 */
export function getDestinationImageUrl(destinationName?: string, stateName?: string, fallbackUrl?: string): string {
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl;
  }

  // 1. Destination-specific image check
  if (destinationName) {
    const cityKey = normalizeKey(destinationName);
    if (cityImages[cityKey]) {
      return cityImages[cityKey];
    }
  }

  // 2. State-specific image check
  if (stateName) {
    const stateKey = normalizeKey(stateName);
    if (stateImages[stateKey]) {
      return stateImages[stateKey].imageUrl;
    }
  }

  // 3. General fallback
  if (!destinationName) return DEFAULT_TRIP_IMAGES[0];
  return DEFAULT_TRIP_IMAGES[Math.abs(hashString(destinationName)) % DEFAULT_TRIP_IMAGES.length];
}

export function getCityImageUrl(cityName?: string, stateName?: string, fallbackUrl?: string): string {
  return getDestinationImageUrl(cityName, stateName, fallbackUrl);
}

/**
 * Use as `onError` on any <img> displaying a destination image.
 * Prevents broken-image icons by falling back to the generic travel image.
 */
export function onCityImageError(e: any): void {
  const img = e.currentTarget || e.target;
  if (img && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = DEFAULT_TRIP_IMAGES[0];
  }
}

export function onDestinationImageError(e: any): void {
  onCityImageError(e);
}

/**
 * Category-based fallback system for activities.
 * Categories: ATTRACTION, NATURE, FOOD, SHOPPING, CULTURE, ENTERTAINMENT, PILGRIMAGE, RELAXATION
 */
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
  return CATEGORY_IMAGES['attraction'];
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
