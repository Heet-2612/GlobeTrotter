package com.globetrotter.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region regionEntity;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "canonical_name", length = 100)
    private String canonicalName;

    @Column(nullable = false, length = 100)
    private String country = "India";

    @Column(name = "region", length = 100)
    private String legacyRegion;

    @Enumerated(EnumType.STRING)
    @Column(name = "destination_type", nullable = false, length = 50)
    private DestinationType destinationType = DestinationType.CITY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DestinationSource source = DestinationSource.CURATED;

    @Column(name = "is_curated", nullable = false)
    private Boolean isCurated = true;

    @Column(name = "cost_index", nullable = false, columnDefinition = "numeric(5,2)")
    private Double costIndex = 1.0;

    @Column(nullable = false)
    private Integer popularity = 50;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "currency_code", nullable = false, length = 10)
    private String currencyCode = "INR";

    @Column(name = "currency_symbol", nullable = false, length = 10)
    private String currencySymbol = "₹";

    @Column(columnDefinition = "numeric(10,7)")
    private Double latitude;

    @Column(columnDefinition = "numeric(10,7)")
    private Double longitude;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DestinationAlias> aliases = new ArrayList<>();

    public Destination() {
    }

    public Destination(Long id, Region regionEntity, String name, String canonicalName, String country, String legacyRegion, DestinationType destinationType, DestinationSource source, Boolean isCurated, Double costIndex, Integer popularity, String imageUrl, String currencyCode, String currencySymbol, Double latitude, Double longitude) {
        this.id = id;
        this.regionEntity = regionEntity;
        this.name = name;
        this.canonicalName = canonicalName;
        this.country = country != null ? country : "India";
        this.legacyRegion = legacyRegion;
        this.destinationType = destinationType != null ? destinationType : DestinationType.CITY;
        this.source = source != null ? source : DestinationSource.CURATED;
        this.isCurated = isCurated != null ? isCurated : true;
        this.costIndex = costIndex != null ? costIndex : 1.0;
        this.popularity = popularity != null ? popularity : 50;
        this.imageUrl = imageUrl;
        this.currencyCode = currencyCode != null ? currencyCode : "INR";
        this.currencySymbol = currencySymbol != null ? currencySymbol : "₹";
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static DestinationBuilder builder() {
        return new DestinationBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Region getRegionEntity() { return regionEntity; }
    public void setRegionEntity(Region regionEntity) { this.regionEntity = regionEntity; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCanonicalName() { return canonicalName; }
    public void setCanonicalName(String canonicalName) { this.canonicalName = canonicalName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() {
        if (regionEntity != null) {
            return regionEntity.getName();
        }
        return legacyRegion != null ? legacyRegion : "India";
    }

    public void setRegion(String region) {
        this.legacyRegion = region;
    }

    public String getLegacyRegion() { return legacyRegion; }
    public void setLegacyRegion(String legacyRegion) { this.legacyRegion = legacyRegion; }

    public DestinationType getDestinationType() { return destinationType; }
    public void setDestinationType(DestinationType destinationType) { this.destinationType = destinationType; }

    public DestinationSource getSource() { return source; }
    public void setSource(DestinationSource source) { this.source = source; }

    public Boolean getIsCurated() { return isCurated; }
    public void setIsCurated(Boolean isCurated) { this.isCurated = isCurated; }

    public Double getCostIndex() { return costIndex; }
    public void setCostIndex(Double costIndex) { this.costIndex = costIndex; }

    public Integer getPopularity() { return popularity; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<DestinationAlias> getAliases() { return aliases; }
    public void setAliases(List<DestinationAlias> aliases) { this.aliases = aliases; }

    public static class DestinationBuilder {
        private Long id;
        private Region regionEntity;
        private String name;
        private String canonicalName;
        private String country = "India";
        private String legacyRegion;
        private DestinationType destinationType = DestinationType.CITY;
        private DestinationSource source = DestinationSource.CURATED;
        private Boolean isCurated = true;
        private Double costIndex = 1.0;
        private Integer popularity = 50;
        private String imageUrl;
        private String currencyCode = "INR";
        private String currencySymbol = "₹";
        private Double latitude;
        private Double longitude;

        public DestinationBuilder id(Long id) { this.id = id; return this; }
        public DestinationBuilder regionEntity(Region regionEntity) { this.regionEntity = regionEntity; return this; }
        public DestinationBuilder name(String name) { this.name = name; return this; }
        public DestinationBuilder canonicalName(String canonicalName) { this.canonicalName = canonicalName; return this; }
        public DestinationBuilder country(String country) { this.country = country; return this; }
        public DestinationBuilder region(String region) { this.legacyRegion = region; return this; }
        public DestinationBuilder destinationType(DestinationType destinationType) { this.destinationType = destinationType; return this; }
        public DestinationBuilder source(DestinationSource source) { this.source = source; return this; }
        public DestinationBuilder isCurated(Boolean isCurated) { this.isCurated = isCurated; return this; }
        public DestinationBuilder costIndex(Double costIndex) { this.costIndex = costIndex; return this; }
        public DestinationBuilder popularity(Integer popularity) { this.popularity = popularity; return this; }
        public DestinationBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public DestinationBuilder currencyCode(String currencyCode) { this.currencyCode = currencyCode; return this; }
        public DestinationBuilder currencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; return this; }
        public DestinationBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public DestinationBuilder longitude(Double longitude) { this.longitude = longitude; return this; }

        public Destination build() {
            return new Destination(id, regionEntity, name, canonicalName, country, legacyRegion, destinationType, source, isCurated, costIndex, popularity, imageUrl, currencyCode, currencySymbol, latitude, longitude);
        }
    }
}
