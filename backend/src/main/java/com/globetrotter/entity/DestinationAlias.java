package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "destination_aliases")
public class DestinationAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "alias_name", nullable = false, length = 100)
    private String aliasName;

    @Column(name = "canonical_alias", nullable = false, length = 100)
    private String canonicalAlias;

    public DestinationAlias() {
    }

    public DestinationAlias(Long id, Destination destination, String aliasName, String canonicalAlias) {
        this.id = id;
        this.destination = destination;
        this.aliasName = aliasName;
        this.canonicalAlias = canonicalAlias;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    public String getAliasName() { return aliasName; }
    public void setAliasName(String aliasName) { this.aliasName = aliasName; }

    public String getCanonicalAlias() { return canonicalAlias; }
    public void setCanonicalAlias(String canonicalAlias) { this.canonicalAlias = canonicalAlias; }
}
