export interface NormalizedPlace {
  id: string;
  name: string;
  formattedAddress: string;
  lat: number | null;
  lng: number | null;
  category: string;
  rating?: number | null;
  website?: string | null;
  phone?: string | null;
  attribution?: string;
  source: 'geoapify' | 'google' | 'curated';
}

export interface PlaceSearchError {
  type: 'CONFIG_ERROR' | 'AUTH_ERROR' | 'QUOTA_ERROR' | 'NETWORK_ERROR' | 'GENERIC_ERROR';
  message: string;
}

export interface PlaceSearchResponse {
  places: NormalizedPlace[];
  error?: PlaceSearchError;
  attribution?: string;
}

export interface PlaceProvider {
  searchPlaces(query: string, city: string): Promise<PlaceSearchResponse>;
}

export class GeoapifyPlaceProvider implements PlaceProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = (((import.meta as any).env?.VITE_GEOAPIFY_API_KEY) || '').trim();
  }

  public isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  public async searchPlaces(query: string, city: string): Promise<PlaceSearchResponse> {
    if (!this.isConfigured()) {
      return {
        places: [],
        error: {
          type: 'CONFIG_ERROR',
          message: 'Geoapify Places API key is missing. Please set VITE_GEOAPIFY_API_KEY in .env.',
        },
      };
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return { places: [] };
    }

    try {
      const fullSearchText = `${trimmedQuery}, ${city}`;
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        fullSearchText
      )}&limit=10&apiKey=${this.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            places: [],
            error: {
              type: 'AUTH_ERROR',
              message: 'Geoapify API key is invalid or unauthorized (HTTP 401/403).',
            },
          };
        }
        if (response.status === 429) {
          return {
            places: [],
            error: {
              type: 'QUOTA_ERROR',
              message: 'Geoapify API quota or rate limit exceeded (HTTP 429).',
            },
          };
        }
        return {
          places: [],
          error: {
            type: 'GENERIC_ERROR',
            message: `Geoapify API request failed with HTTP ${response.status}.`,
          },
        };
      }

      const data = await response.json();
      const features = data.features || [];

      const places: NormalizedPlace[] = features.map((f: any) => {
        const props = f.properties || {};
        return {
          id: props.place_id || `geoapify-${Math.random()}`,
          name: props.name || props.address_line1 || trimmedQuery,
          formattedAddress: props.formatted || props.address_line2 || city,
          lat: props.lat || null,
          lng: props.lon || null,
          category: mapGeoapifyCategory(props.category),
          attribution: props.datasource?.attribution || '© OpenStreetMap contributors',
          source: 'geoapify',
        };
      });

      return {
        places,
        attribution: 'Powered by Geoapify • © OpenStreetMap contributors',
      };
    } catch (err: any) {
      return {
        places: [],
        error: {
          type: 'NETWORK_ERROR',
          message: 'Unable to connect to Geoapify Places API. Please check your network connection.',
        },
      };
    }
  }
}

function mapGeoapifyCategory(rawCategory?: string): string {
  if (!rawCategory) return 'Sightseeing';
  const cat = rawCategory.toLowerCase();

  if (
    cat.includes('museum') ||
    cat.includes('temple') ||
    cat.includes('church') ||
    cat.includes('monument') ||
    cat.includes('historic') ||
    cat.includes('castle')
  ) {
    return 'Culture';
  }
  if (cat.includes('park') || cat.includes('lake') || cat.includes('garden') || cat.includes('nature') || cat.includes('beach')) {
    return 'Nature';
  }
  if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('catering') || cat.includes('food')) {
    return 'Food';
  }
  if (cat.includes('shopping') || cat.includes('market') || cat.includes('commercial') || cat.includes('mall')) {
    return 'Shopping';
  }
  if (cat.includes('bar') || cat.includes('pub') || cat.includes('nightlife') || cat.includes('entertainment')) {
    return 'Nightlife';
  }
  return 'Sightseeing';
}

export class PlaceSearchService {
  private provider: PlaceProvider;

  constructor(provider?: PlaceProvider) {
    this.provider = provider || new GeoapifyPlaceProvider();
  }

  public async searchPlaces(query: string, city: string): Promise<PlaceSearchResponse> {
    return this.provider.searchPlaces(query, city);
  }
}

export const placeSearchService = new PlaceSearchService();
