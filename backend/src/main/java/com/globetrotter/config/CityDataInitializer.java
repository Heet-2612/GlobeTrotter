package com.globetrotter.config;

import com.globetrotter.entity.Activity;
import com.globetrotter.entity.Destination;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.DestinationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class CityDataInitializer implements CommandLineRunner {

    private final DestinationRepository destinationRepository;
    private final ActivityRepository activityRepository;

    public CityDataInitializer(DestinationRepository destinationRepository, ActivityRepository activityRepository) {
        this.destinationRepository = destinationRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public void run(String... args) {
        if (destinationRepository.count() == 0) {
            destinationRepository.saveAll(List.of(
                Destination.builder().name("Mumbai").country("India").region("Asia").costIndex(2.50).popularity(85).imageUrl("https://images.unsplash.com/photo-1570168007204-dfb528c6958f").build(),
                Destination.builder().name("Goa").country("India").region("Asia").costIndex(2.00).popularity(90).imageUrl("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2").build(),
                Destination.builder().name("Bangalore").country("India").region("Asia").costIndex(2.20).popularity(80).imageUrl("https://images.unsplash.com/photo-1596176530529-78163a4f7af2").build(),
                Destination.builder().name("Delhi").country("India").region("Asia").costIndex(2.30).popularity(88).imageUrl("https://images.unsplash.com/photo-1587474260584-136574528ed5").build(),
                Destination.builder().name("Jaipur").country("India").region("Asia").costIndex(1.80).popularity(82).imageUrl("https://images.unsplash.com/photo-1477587458883-47145ed94245").build()
            ));
        }

        if (activityRepository.count() == 0) {
            Map<String, Destination> destinationMap = destinationRepository.findAll().stream()
                    .collect(Collectors.toMap(Destination::getName, Function.identity(), (a, b) -> a));

            Destination goa = destinationMap.get("Goa");
            Destination mumbai = destinationMap.get("Mumbai");
            Destination bangalore = destinationMap.get("Bangalore");

            if (goa != null) {
                activityRepository.saveAll(List.of(
                    new Activity(null, goa, "Baga Beach Sunset & Watersports", "Relax on golden sands and try parasailing.", "RELAXATION", 180, 25.00, "USD", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"),
                    new Activity(null, goa, "Fort Aguada Exploration", "17th-century Portuguese lighthouse and fort overlooking the Arabian Sea.", "CULTURE", 120, 5.00, "USD", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2")
                ));
            }

            if (mumbai != null) {
                activityRepository.saveAll(List.of(
                    new Activity(null, mumbai, "Gateway of India & Taj Hotel Walk", "Iconic basalt arch monument erected during the British Raj.", "SIGHTSEEING", 90, 0.00, "USD", "https://images.unsplash.com/photo-1570168007204-dfb528c6958f")
                ));
            }

            if (bangalore != null) {
                activityRepository.saveAll(List.of(
                    new Activity(null, bangalore, "Bangalore Palace Tour", "Tudor-style royal palace featuring ornate wooden carvings and gardens.", "CULTURE", 120, 8.00, "USD", "https://images.unsplash.com/photo-1596176530529-78163a4f7af2")
                ));
            }
        }
    }
}
