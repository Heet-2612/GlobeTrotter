import { cityImages } from '../data/cityImages';
import { stateImages } from '../data/stateImages';

// Curated travel imagery for destinations & trip covers only.
// Activity images use the 72-concept registry + SVG icon placeholder fallback.

function normalizeKey(name: string): string {
  return name.trim().toLowerCase();
}

const DEFAULT_TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-ce74f452899f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
];

/**
 * Reliable fallback hierarchy for DESTINATION images:
 * 1. Provided explicit fallbackUrl (if valid)
 * 2. Destination-specific landmark image (cityImages)
 * 3. State/Region-specific landscape image (stateImages)
 * 4. General travel fallback
 *
 * NOTE: This is NOT used for activity images. Activities use ActivityImage component.
 */
export function getDestinationImageUrl(destinationName?: string, stateName?: string, fallbackUrl?: string): string {
  // If the 2nd argument is an HTTP/HTTPS image URL string, treat it as fallbackUrl if fallbackUrl is omitted
  let resolvedUrl = fallbackUrl;
  if (!resolvedUrl && stateName && (stateName.startsWith('http://') || stateName.startsWith('https://'))) {
    resolvedUrl = stateName;
  }

  // Priority 1: Valid dynamic API/database image URL
  if (resolvedUrl && typeof resolvedUrl === 'string' && resolvedUrl.trim().length > 0 && resolvedUrl !== 'null' && resolvedUrl !== 'undefined') {
    return resolvedUrl.trim();
  }

  // Priority 2: Destination-specific static fallback (cityImages.ts)
  if (destinationName) {
    const cityKey = normalizeKey(destinationName);
    if (cityImages[cityKey]) {
      return cityImages[cityKey];
    }
  }

  // Priority 3: State-specific static fallback (stateImages.ts)
  if (stateName && !stateName.startsWith('http')) {
    const stateKey = normalizeKey(stateName);
    if (stateImages[stateKey]) {
      return stateImages[stateKey].imageUrl;
    }
  }

  // Priority 4: Generic trip fallback
  if (!destinationName) return DEFAULT_TRIP_IMAGES[0];
  return DEFAULT_TRIP_IMAGES[Math.abs(hashString(destinationName)) % DEFAULT_TRIP_IMAGES.length];
}

export function getCityImageUrl(cityName?: string, stateName?: string, fallbackUrl?: string): string {
  return getDestinationImageUrl(cityName, stateName, fallbackUrl);
}

/**
 * Use as `onError` on any <img> displaying a DESTINATION image.
 * Prevents broken-image icons by falling back to the generic travel image.
 *
 * NOTE: Do NOT use this for activity images. Use ActivityImage component instead.
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
 * Returns the curated/registry image URL for an activity, or null if none exists.
 * When this returns null, the caller should render an ActivityIconPlaceholder instead.
 */
export function getActivityImageUrl(_category?: string, fallbackUrl?: string | null): string | null {
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim().length > 0 && fallbackUrl !== 'null' && fallbackUrl !== 'undefined') {
    return fallbackUrl.trim();
  }
  // No generic photo fallback — caller should render SVG icon placeholder
  return null;
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
