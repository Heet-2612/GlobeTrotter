package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "regions")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "canonical_name", nullable = false, length = 100, unique = true)
    private String canonicalName;

    @Column(nullable = false, length = 100)
    private String country = "India";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public Region() {
    }

    public Region(Long id, String name, String canonicalName, String country, String description, String imageUrl) {
        this.id = id;
        this.name = name;
        this.canonicalName = canonicalName;
        this.country = (country != null) ? country : "India";
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public static RegionBuilder builder() {
        return new RegionBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCanonicalName() { return canonicalName; }
    public void setCanonicalName(String canonicalName) { this.canonicalName = canonicalName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public static class RegionBuilder {
        private Long id;
        private String name;
        private String canonicalName;
        private String country = "India";
        private String description;
        private String imageUrl;

        public RegionBuilder id(Long id) { this.id = id; return this; }
        public RegionBuilder name(String name) { this.name = name; return this; }
        public RegionBuilder canonicalName(String canonicalName) { this.canonicalName = canonicalName; return this; }
        public RegionBuilder country(String country) { this.country = country; return this; }
        public RegionBuilder description(String description) { this.description = description; return this; }
        public RegionBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public Region build() {
            return new Region(id, name, canonicalName, country, description, imageUrl);
        }
    }
}
