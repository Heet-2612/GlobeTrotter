package com.globetrotter;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.repository.*;
import com.globetrotter.service.ActivityImageRegistry;
import com.globetrotter.service.ActivityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ActivityImageArchitectureIntegrationTest {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivityImageRegistry activityImageRegistry;

    private Destination testDest;

    @BeforeEach
    void setUp() {
        testDest = destinationRepository.save(
                Destination.builder()
                        .name("Test City")
                        .country("India")
                        .region("Rajasthan")
                        .canonicalName("test-city")
                        .build()
        );
    }

    @Test
    @DisplayName("Verify that activities can be saved with subcategory and imageStrategy mappings")
    void testActivitySubcategoryPersistence() {
        Activity act = activityRepository.save(
                Activity.builder()
                        .destination(testDest)
                        .name("Amber Fort Hilltop Tour")
                        .description("Historic hill fort tour")
                        .category("FORTS_PALACES")
                        .subcategoryId("HILL_FORT")
                        .imageStrategy("UNIQUE")
                        .estimatedDurationMinutes(120)
                        .estimatedCost(500.0)
                        .currency("INR")
                        .build()
        );

        Activity retrieved = activityRepository.findById(act.getId()).orElse(null);
        assertThat(retrieved).isNotNull();
        assertThat(retrieved.getSubcategoryId()).isEqualTo("HILL_FORT");
        assertThat(retrieved.getImageStrategy()).isEqualTo("UNIQUE");
    }

    @Test
    @DisplayName("Verify NO_IMAGE activities resolve imageUrl to NULL via ActivityResponse and ActivityImageRegistry")
    void testNoImageActivitiesReturnNull() {
        Activity noImgAct = activityRepository.save(
                Activity.builder()
                        .destination(testDest)
                        .name("Local Thali Dinner")
                        .description("Traditional thali dining")
                        .category("FOOD_CULINARY")
                        .subcategoryId("TRADITIONAL_FOOD_THALI")
                        .imageStrategy("NO_IMAGE")
                        .estimatedDurationMinutes(60)
                        .estimatedCost(300.0)
                        .currency("INR")
                        .build()
        );

        ActivityResponse response = ActivityResponse.fromEntity(noImgAct, activityImageRegistry);
        assertThat(response.getImageStrategy()).isEqualTo("NO_IMAGE");
        assertThat(response.getImageUrl()).isNull();
    }

    @Test
    @DisplayName("Verify deterministic image resolution logic uses Math.floorMod for consistent slot selection")
    void testDeterministicImageResolution() {
        Activity act1 = Activity.builder()
                .id(12345L)
                .name("Sample Tiger Safari 1")
                .category("WILDLIFE_SAFARI")
                .subcategoryId("TIGER_SAFARI")
                .imageStrategy("SHARED_IMAGE_POOL")
                .build();

        Activity act2 = Activity.builder()
                .id(12345L)
                .name("Sample Tiger Safari 1 Duplicate")
                .category("WILDLIFE_SAFARI")
                .subcategoryId("TIGER_SAFARI")
                .imageStrategy("SHARED_IMAGE_POOL")
                .build();

        String resolved1 = activityImageRegistry.resolveImageUrl(act1);
        String resolved2 = activityImageRegistry.resolveImageUrl(act2);

        assertThat(resolved1).isEqualTo(resolved2);
    }

    @Test
    @DisplayName("Verify ActivityImageRegistry contains all 72 defined visual concepts")
    void testRegistryContainsAll72Concepts() {
        assertThat(activityImageRegistry.getAllConcepts()).hasSize(72);

        ActivityImageRegistry.SubcategoryConcept stepwell = activityImageRegistry.getConcept("STEPWELL_VAV");
        assertThat(stepwell).isNotNull();
        assertThat(stepwell.getParentCategoryId()).isEqualTo("HERITAGE_ARCHITECTURE");
        assertThat(stepwell.getStrategy()).isEqualTo("UNIQUE");
    }
}
