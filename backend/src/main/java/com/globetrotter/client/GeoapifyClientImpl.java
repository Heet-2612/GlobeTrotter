package com.globetrotter.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.DiscoveredPlaceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Geoapify API client implementation for GlobeTrotter V2 live discovery.
 *
 * Core Principle: QUALITY > QUANTITY.
 * GlobeTrotter is a travel planner, NOT Google Maps.
 * Only recommends places that a traveler would genuinely consider adding to an itinerary.
 *
 * Recommendation Output Size:
 *  - Maximum: 10
 *  - Preferred: 5–8
 *  - Minimum: 0 (Returns HTTP 200 with [] when no high-quality places pass)
 */
@Component
public class GeoapifyClientImpl implements GeoapifyClient {

    private static final Logger logger = LoggerFactory.getLogger(GeoapifyClientImpl.class);
    private static final String GEOAPIFY_BASE_URL = "https://api.geoapify.com";
    private static final double MAX_DESTINATION_RADIUS_METERS = 25000.0; // 25 km
    private static final int PREFERRED_MAX_RESULTS = 10;                // Max 10 top results

    // Non-POI map result types to reject
    private static final Set<String> BLOCKED_RESULT_TYPES = Set.of(
            "highway", "road", "street", "route", "locality", "county", "state",
            "country", "postal_code", "suburb"
    );

    // Non-tourist utility keywords
    private static final Pattern NON_TOURIST_KEYWORDS = Pattern.compile(
            "(?i).*\\b(atm|bank|pharmacy|medical|clinic|hospital|police|post office|bus stand|bus stop|"
                    + "petrol pump|gas station|charging station|parking|public toilet|warehouse|factory|"
                    + "industrial|cold storage|car wash|tire|repair|mechanic|courier|xerox|hardware|wholesale)\\b.*"
    );

    // Address line/floor placeholders to reject as POI names
    private static final Pattern ADDRESS_PLACEHOLDER_NAMES = Pattern.compile(
            "(?i)^(1st|2nd|3rd|4th|ground|top)\\s*(floor|level|block).*|^(near|opp|opposite|behind)\\b.*"
    );

    // Minor retail keywords rejected in Shopping
    private static final Pattern MINOR_RETAIL_KEYWORDS = Pattern.compile(
            "(?i).*\\b(boutique|tailor|textile|footwear|opticals|mobiles|electronics|jewelers|jewellery|"
                    + "supermarket|grocery|general store|stationery|recharge|garments|chemist|hardware)\\b.*"
    );

    // Non-tourist markets (vegetable, fish, meat, wholesale) rejected in Shopping
    private static final Pattern NON_TOURIST_MARKETS = Pattern.compile(
            "(?i).*\\b(vegetable|veggie|fruit|fish|meat|poultry|mutton|wholesale|ration|utility)\\s*(market|bazar|bazaar)?\\b.*"
    );

    // Ordinary places of worship rejected in Culture unless historic landmark
    private static final Pattern ORDINARY_RELIGIOUS_KEYWORDS = Pattern.compile(
            "(?i).*\\b(masjid|mosque|gurudwara|church|shrine|dargah|prayer hall|local temple)\\b.*"
    );

    // Minor local parks rejected in Nature/Attractions
    private static final Pattern MINOR_LOCAL_PARK_KEYWORDS = Pattern.compile(
            "(?i).*\\b(basti|council|colony|society|ward|nagar|sector|residential|local park|community garden|manji ka ghat park)\\b.*"
    );

    // Iconic tourist destination keywords that grant high relevance scores
    private static final Pattern ICONIC_TOURIST_KEYWORDS = Pattern.compile(
            "(?i).*\\b(fort|palace|museum|haveli|lake|waterfall|falls|viewpoint|ghat|monument|sanctuary|"
                    + "national park|wildlife|heritage|stepwell|stupa|cave|caves|mahal|bazaar|bazar|handicraft|"
                    + "souvenir|shilpgram|ashram|craft|emporium|saheliyon|jyotirlinga|castle|cenotaph)\\b.*"
    );

    private final String apiKey;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeoapifyClientImpl(
            @Value("${geoapify.api-key:${GEOAPIFY_API_KEY:${VITE_GEOAPIFY_API_KEY:}}}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.restClient = RestClient.builder()
                .baseUrl(GEOAPIFY_BASE_URL)
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    @Override
    public List<DiscoveredPlaceResponse> discoverPlaces(
            Double latitude, Double longitude, String query, String category, Integer radiusMeters) {
        if (!isConfigured()) {
            throw new IllegalStateException("Geoapify Places API key is missing or not configured.");
        }
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude are required for live place discovery.");
        }

        // Search Track → Geocoding API (unrestricted by recommendation threshold)
        if (query != null && !query.trim().isEmpty()) {
            return searchByText(latitude, longitude, query.trim());
        }

        // Recommendation Track → Places API (filtered & category-aware scored)
        return browseByCategory(latitude, longitude, category, radiusMeters);
    }

    /**
     * Search Track: Geoapify Geocoding API /v1/geocode/search
     * Broad text matching; validates boundaries, roads, and map infrastructure.
     */
    private List<DiscoveredPlaceResponse> searchByText(Double lat, Double lon, String query) {
        String bias = String.format(Locale.US, "proximity:%f,%f", lon, lat);
        String filter = String.format(Locale.US, "circle:%f,%f,%d", lon, lat, (int) MAX_DESTINATION_RADIUS_METERS);
        String uri = "/v1/geocode/search?text=" + encodeParam(query)
                + "&bias=" + bias
                + "&filter=" + filter
                + "&lang=en"
                + "&limit=20"
                + "&apiKey=" + apiKey;

        try {
            String jsonResponse = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, resp) -> {
                        logger.warn("Geoapify geocode search returned {}: {}", resp.getStatusCode(), query);
                    })
                    .body(String.class);

            List<DiscoveredPlaceResponse> results = parseGeoapifyResponse(jsonResponse, lat, lon);
            List<DiscoveredPlaceResponse> filtered = deduplicateResults(filterQuality(results, lat, lon, null));

            return rankSearchResults(filtered, query);
        } catch (Exception e) {
            logger.error("Geoapify geocode search failed for query '{}': {}", query, e.getMessage());
            throw new RuntimeException("Place search failed: " + e.getMessage());
        }
    }

    /**
     * Recommendation Track: Geoapify Places API /v2/places
     * Strict category fit & tourist worthiness evaluation.
     */
    private List<DiscoveredPlaceResponse> browseByCategory(
            Double lat, Double lon, String category, Integer radiusMeters) {
        int radius = (radiusMeters != null && radiusMeters > 0) ? radiusMeters : 5000;
        String filter = String.format(Locale.US, "circle:%f,%f,%d", lon, lat, radius);
        String bias   = String.format(Locale.US, "proximity:%f,%f", lon, lat);
        String categoriesParam = resolveGeoapifyCategories(category);

        StringBuilder uri = new StringBuilder("/v2/places?")
                .append("filter=").append(filter)
                .append("&bias=").append(bias)
                .append("&categories=").append(categoriesParam)
                .append("&lang=en")
                .append("&limit=35")
                .append("&apiKey=").append(apiKey);

        logger.info("Geoapify browse: category={} → categories={} | radius={}m", category, categoriesParam, radius);

        try {
            String jsonResponse = restClient.get()
                    .uri(uri.toString())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, resp) -> {
                        logger.error("Geoapify Places API returned {} for categories={}", resp.getStatusCode(), categoriesParam);
                        throw new RuntimeException("Geoapify rejected categories: " + categoriesParam + " (HTTP " + resp.getStatusCode() + ")");
                    })
                    .body(String.class);

            List<DiscoveredPlaceResponse> rawResults = parseGeoapifyResponse(jsonResponse, lat, lon);
            List<DiscoveredPlaceResponse> filtered = filterQuality(rawResults, lat, lon, category);
            List<DiscoveredPlaceResponse> scored = rankAndFilterTouristResults(filtered, lat, lon, category);
            List<DiscoveredPlaceResponse> deduped = deduplicateResults(scored);

            if (category == null || category.isBlank() || "all".equalsIgnoreCase(category.trim())) {
                return assembleAllTab(deduped);
            }

            return deduped.stream().limit(PREFERRED_MAX_RESULTS).collect(Collectors.toList());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Geoapify browse failed for category '{}': {}", category, e.getMessage());
            throw new RuntimeException("Place discovery failed: " + e.getMessage());
        }
    }

    private String resolveGeoapifyCategories(String inputCategory) {
        if (inputCategory == null || inputCategory.isBlank()) {
            return "tourism,catering,commercial,religion,natural,leisure,sport";
        }

        return switch (inputCategory.toLowerCase().trim()) {
            case "attractions" ->
                    "tourism.sights,tourism.attraction,building.historic,building.tourism,natural.water,leisure.park";
            case "nature", "natural" ->
                    "natural,leisure.park,leisure,natural.water";
            case "food", "catering", "restaurant" ->
                    "catering.restaurant,catering.cafe";
            case "shopping", "commercial" ->
                    "commercial.shopping_mall,commercial.marketplace,commercial.gift_and_souvenir,commercial.clothing";
            case "culture", "heritage" ->
                    "tourism.sights,building.historic,religion,religion.place_of_worship,entertainment.culture";
            case "entertainment" ->
                    "entertainment,leisure,sport,entertainment.cinema,entertainment.culture";
            case "all" ->
                    "tourism,catering,commercial,religion,natural,leisure,sport";
            default ->
                    "tourism,catering,commercial,religion,natural,leisure,sport";
        };
    }

    private List<DiscoveredPlaceResponse> assembleAllTab(List<DiscoveredPlaceResponse> results) {
        List<DiscoveredPlaceResponse> attractions = new ArrayList<>();
        List<DiscoveredPlaceResponse> cultureNature = new ArrayList<>();
        List<DiscoveredPlaceResponse> food = new ArrayList<>();
        List<DiscoveredPlaceResponse> shopping = new ArrayList<>();

        for (DiscoveredPlaceResponse item : results) {
            String cat = item.getCategory() != null ? item.getCategory().toUpperCase() : "";
            switch (cat) {
                case "ATTRACTION", "SIGHTSEEING" -> attractions.add(item);
                case "CULTURE", "NATURE" -> cultureNature.add(item);
                case "FOOD" -> food.add(item);
                case "SHOPPING" -> shopping.add(item);
                default -> attractions.add(item);
            }
        }

        List<DiscoveredPlaceResponse> assembled = new ArrayList<>();
        assembled.addAll(attractions.stream().limit(4).collect(Collectors.toList()));
        assembled.addAll(cultureNature.stream().limit(4).collect(Collectors.toList()));
        assembled.addAll(food.stream().limit(3).collect(Collectors.toList()));
        assembled.addAll(shopping.stream().limit(3).collect(Collectors.toList()));

        return deduplicateResults(assembled).stream().limit(PREFERRED_MAX_RESULTS).collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------------
    // Response parsing & Category Labeling
    // ---------------------------------------------------------------------------

    private List<DiscoveredPlaceResponse> parseGeoapifyResponse(String jsonResponse, Double destLat, Double destLon) {
        List<DiscoveredPlaceResponse> results = new ArrayList<>();
        if (jsonResponse == null || jsonResponse.isBlank()) return results;

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode features = root.get("features");
            if (features == null || !features.isArray()) return results;

            for (JsonNode feature : features) {
                JsonNode props = feature.get("properties");
                if (props == null) continue;

                String name = extractEnglishName(props);
                if (name == null) continue;

                if (props.hasNonNull("result_type")) {
                    String resultType = props.get("result_type").asText().toLowerCase();
                    if (BLOCKED_RESULT_TYPES.contains(resultType)) continue;
                }

                String placeId          = props.hasNonNull("place_id") ? props.get("place_id").asText() : null;
                String formattedAddress = props.hasNonNull("formatted") ? props.get("formatted").asText() : "";
                Double lat              = props.hasNonNull("lat") ? props.get("lat").asDouble() : null;
                Double lon              = props.hasNonNull("lon") ? props.get("lon").asDouble() : null;

                String category = "ATTRACTION";
                if (props.has("categories") && props.get("categories").isArray()) {
                    category = mapGeoapifyCategory(props.get("categories"), name);
                } else if (props.hasNonNull("category")) {
                    category = mapGeoapifyCategoryString(props.get("category").asText(), name);
                }

                DiscoveredPlaceResponse place = new DiscoveredPlaceResponse();
                place.setId(placeId);
                place.setExternalId(placeId);
                place.setName(name);
                place.setDescription(formattedAddress);
                place.setAddress(formattedAddress);
                place.setCategory(category);
                place.setLatitude(lat);
                place.setLongitude(lon);
                results.add(place);
            }
        } catch (Exception e) {
            logger.error("Error parsing Geoapify response", e);
        }

        return results;
    }

    private String extractEnglishName(JsonNode props) {
        String name = null;
        if (props.hasNonNull("name")) {
            name = props.get("name").asText().trim();
        }
        if (name == null || name.isBlank()) {
            if (props.hasNonNull("address_line1")) {
                String line1 = props.get("address_line1").asText().trim();
                if (!line1.isBlank() && !looksLikeRoad(line1)) {
                    name = line1;
                }
            }
        }

        if (name == null || name.isBlank()) return null;
        if (!isEnglishOrLatinName(name)) return null;

        return name;
    }

    private boolean isEnglishOrLatinName(String name) {
        if (name == null || name.isBlank()) return false;
        if (name.contains("?") || name.contains("\uFFFD")) return false;

        boolean hasLatinLetter = name.chars().anyMatch(c -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
        if (!hasLatinLetter) return false;

        return name.matches("^[\\p{IsLatin}\\d\\s\\p{Punct}]+$");
    }

    // ---------------------------------------------------------------------------
    // Category Fit & Quality Filters
    // ---------------------------------------------------------------------------

    private List<DiscoveredPlaceResponse> filterQuality(List<DiscoveredPlaceResponse> results, Double destLat, Double destLon, String category) {
        return results.stream()
                .filter(place -> isQualityResult(place, destLat, destLon, category))
                .collect(Collectors.toList());
    }

    private boolean isQualityResult(DiscoveredPlaceResponse place, Double destLat, Double destLon, String category) {
        if (place.getName() == null || place.getName().isBlank()) return false;

        String name = place.getName();
        String cat = category != null ? category.toLowerCase().trim() : "";

        if (looksLikeRoad(name)) return false;
        if (isNonTouristUtility(name)) return false;
        if (ADDRESS_PLACEHOLDER_NAMES.matcher(name).matches()) return false;

        // Culture Rule: Exclude ordinary religious sites unless historic landmark
        if ("culture".equalsIgnoreCase(cat)) {
            if (ORDINARY_RELIGIOUS_KEYWORDS.matcher(name).find() && !ICONIC_TOURIST_KEYWORDS.matcher(name).find()) {
                return false;
            }
        }

        // Nature / Attractions Rule: Reject minor local/colony parks
        if ("nature".equalsIgnoreCase(cat) || "attractions".equalsIgnoreCase(cat)) {
            if (MINOR_LOCAL_PARK_KEYWORDS.matcher(name).find() && !ICONIC_TOURIST_KEYWORDS.matcher(name).find()) {
                return false;
            }
        }

        // Shopping Rule: Reject individual small retail stores AND non-tourist markets (vegetable/fish/meat)
        if ("shopping".equalsIgnoreCase(cat)) {
            if (MINOR_RETAIL_KEYWORDS.matcher(name).find() && !ICONIC_TOURIST_KEYWORDS.matcher(name).find()) {
                return false;
            }
            if (NON_TOURIST_MARKETS.matcher(name).find() && !ICONIC_TOURIST_KEYWORDS.matcher(name).find()) {
                return false;
            }
        }

        // 25km radius boundary check
        if (destLat != null && destLon != null && place.getLatitude() != null && place.getLongitude() != null) {
            double distanceMeters = calculateDistanceMeters(destLat, destLon, place.getLatitude(), place.getLongitude());
            if (distanceMeters > MAX_DESTINATION_RADIUS_METERS) return false;
        }

        return true;
    }

    private boolean looksLikeRoad(String name) {
        if (name == null) return false;
        String n = name.trim().toLowerCase();
        if (n.matches(".*\\b\\d{6}\\b.*")) return true;
        if (n.matches("^(nh|sh|mdr|odr|ah|mh)\\s*\\d+.*")) return true;
        if (n.matches("^(national highway|state highway|district road|main district road).*")) return true;
        if (n.matches("^[a-z0-9 ]{2,}(road|highway|expressway|bypass|avenue|marg|path|lane)$")) return true;
        return false;
    }

    private boolean isNonTouristUtility(String name) {
        if (name == null) return false;
        return NON_TOURIST_KEYWORDS.matcher(name).matches();
    }

    // ---------------------------------------------------------------------------
    // Category-Aware Tourist Relevance Ranking
    // ---------------------------------------------------------------------------

    private List<DiscoveredPlaceResponse> rankAndFilterTouristResults(
            List<DiscoveredPlaceResponse> places, Double destLat, Double destLon, String category) {

        List<Map.Entry<DiscoveredPlaceResponse, Double>> scoredList = new ArrayList<>();
        String selectedCat = category != null ? category.toLowerCase().trim() : "";

        for (DiscoveredPlaceResponse place : places) {
            double score = 30.0;
            String name = place.getName() != null ? place.getName() : "";
            String nLower = name.toLowerCase();
            String cat = place.getCategory() != null ? place.getCategory().toUpperCase() : "";

            // Boost iconic tourist landmark keywords (+40 points)
            if (ICONIC_TOURIST_KEYWORDS.matcher(name).find()) {
                score += 40.0;
            }

            // Category-aware score evaluation
            if ("shopping".equalsIgnoreCase(selectedCat)) {
                if (nLower.contains("bazaar") || nLower.contains("bazar") || nLower.contains("hathi pol") || nLower.contains("bada bazaar") || nLower.contains("chandpol")) {
                    score += 50.0;
                } else if (nLower.contains("mall") || nLower.contains("handicraft") || nLower.contains("emporium") || nLower.contains("souvenir")) {
                    score += 35.0;
                } else if (NON_TOURIST_MARKETS.matcher(name).find()) {
                    score -= 50.0; // Heavily penalize vegetable/fish/meat markets
                }
            } else if ("culture".equalsIgnoreCase(selectedCat)) {
                if (nLower.contains("haveli") || nLower.contains("palace") || nLower.contains("fort") || nLower.contains("museum") || nLower.contains("ashram") || nLower.contains("heritage")) {
                    score += 50.0;
                }
            } else if ("nature".equalsIgnoreCase(selectedCat)) {
                if (nLower.contains("lake") || nLower.contains("waterfall") || nLower.contains("falls") || nLower.contains("sanctuary") || nLower.contains("saheliyon") || nLower.contains("rann")) {
                    score += 50.0;
                }
            } else if ("food".equalsIgnoreCase(selectedCat)) {
                if (nLower.contains("restaurant") || nLower.contains("palace") || nLower.contains("thali") || nLower.contains("dining") || nLower.contains("rooftop") || nLower.contains("lake view")) {
                    score += 40.0;
                }
            } else if ("attractions".equalsIgnoreCase(selectedCat)) {
                if ("ATTRACTION".equals(cat) || "CULTURE".equals(cat) || "NATURE".equals(cat)) {
                    score += 20.0;
                }
            }

            // Proximity penalty (minus 0.5 points per km)
            if (destLat != null && destLon != null && place.getLatitude() != null && place.getLongitude() != null) {
                double distKm = calculateDistanceMeters(destLat, destLon, place.getLatitude(), place.getLongitude()) / 1000.0;
                score -= (distKm * 0.5);
            }

            // Enforce cutoff: Must have positive tourist score (>= 50.0)
            if (score >= 50.0) {
                scoredList.add(Map.entry(place, score));
            }
        }

        scoredList.sort((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()));

        return scoredList.stream()
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371000 * c;
    }

    private List<DiscoveredPlaceResponse> deduplicateResults(List<DiscoveredPlaceResponse> results) {
        Set<String> seen = new LinkedHashSet<>();
        List<DiscoveredPlaceResponse> deduped = new ArrayList<>();
        for (DiscoveredPlaceResponse p : results) {
            String key = p.getExternalId() != null ? p.getExternalId()
                    : (p.getName() != null ? p.getName().trim().toLowerCase() : "");
            if (!key.isBlank() && seen.add(key)) {
                deduped.add(p);
            }
        }
        return deduped;
    }

    private List<DiscoveredPlaceResponse> rankSearchResults(List<DiscoveredPlaceResponse> results, String query) {
        String q = query.toLowerCase().trim();

        results.sort((p1, p2) -> {
            String n1 = p1.getName() != null ? p1.getName().toLowerCase() : "";
            String n2 = p2.getName() != null ? p2.getName().toLowerCase() : "";

            int score1 = getMatchScore(n1, p1.getAddress(), q);
            int score2 = getMatchScore(n2, p2.getAddress(), q);

            return Integer.compare(score2, score1);
        });

        return results;
    }

    private int getMatchScore(String name, String address, String query) {
        if (name.equalsIgnoreCase(query)) return 100;
        if (name.startsWith(query)) return 80;
        if (name.contains(query)) return 60;
        if (address != null && address.toLowerCase().contains(query)) return 40;
        return 10;
    }

    private String mapGeoapifyCategory(JsonNode categoriesArray, String name) {
        String cats = categoriesArray.toString().toLowerCase();
        return mapGeoapifyCategoryString(cats, name);
    }

    private String mapGeoapifyCategoryString(String cats, String name) {
        String n = name != null ? name.toLowerCase() : "";
        String c = cats != null ? cats.toLowerCase() : "";

        if (c.contains("catering") || c.contains("restaurant") || c.contains("cafe") || c.contains("food") || c.contains("bakery") || n.contains("restaurant") || n.contains("cafe")) {
            return "FOOD";
        }
        if (c.contains("commercial") || c.contains("shopping") || c.contains("mall") || c.contains("marketplace") || c.contains("souvenir") || c.contains("clothing") || n.contains("bazaar") || n.contains("market")) {
            return "SHOPPING";
        }
        if (c.contains("religion") || c.contains("place_of_worship") || c.contains("historic") || c.contains("building.historic") || c.contains("entertainment.culture") || n.contains("temple") || n.contains("palace") || n.contains("fort") || n.contains("museum") || n.contains("masjid") || n.contains("haveli")) {
            return "CULTURE";
        }
        if (c.contains("natural") || c.contains("leisure.park") || c.contains("natural.water") || n.contains("lake") || n.contains("park") || n.contains("garden")) {
            return "NATURE";
        }
        if (c.contains("entertainment") || c.contains("cinema") || c.contains("sport") || c.contains("leisure")) {
            return "ENTERTAINMENT";
        }

        return "ATTRACTION";
    }

    private String encodeParam(String val) {
        try {
            return java.net.URLEncoder.encode(val, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            return val;
        }
    }
}
