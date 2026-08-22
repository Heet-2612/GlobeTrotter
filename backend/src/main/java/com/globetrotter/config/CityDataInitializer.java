package com.globetrotter.config;

import com.globetrotter.entity.City;
import com.globetrotter.repository.CityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CityDataInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;

    public CityDataInitializer(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public void run(String... args) {
        if (cityRepository.count() == 0) {
            cityRepository.saveAll(List.of(
                new City(null, "Mumbai", "India", "Asia", 2.50, 85, "https://images.unsplash.com/photo-1570168007204-dfb528c6958f"),
                new City(null, "Goa", "India", "Asia", 2.00, 90, "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"),
                new City(null, "Bangalore", "India", "Asia", 2.20, 80, "https://images.unsplash.com/photo-1596176530529-78163a4f7af2"),
                new City(null, "Delhi", "India", "Asia", 2.30, 88, "https://images.unsplash.com/photo-1587474260584-136574528ed5"),
                new City(null, "Jaipur", "India", "Asia", 1.80, 82, "https://images.unsplash.com/photo-1477587458883-47145ed94245"),
                new City(null, "Paris", "France", "Europe", 4.20, 98, "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"),
                new City(null, "Rome", "Italy", "Europe", 3.80, 95, "https://images.unsplash.com/photo-1552832230-c0197dd311b5"),
                new City(null, "Tokyo", "Japan", "Asia", 4.50, 96, "https://images.unsplash.com/photo-1503899036084-c55cdd92da26")
            ));
        }
    }
}
