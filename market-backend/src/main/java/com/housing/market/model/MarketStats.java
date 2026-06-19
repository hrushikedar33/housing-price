package com.housing.market.model;

import java.util.Map;

public record MarketStats(
    long totalListings,
    double minPrice,
    double maxPrice,
    double avgPrice,
    double avgPricePerSqft,
    Map<Integer, Double> avgPriceByBedrooms,
    Map<String, Double> avgPriceByDecade,
    Map<String, Long> priceDistribution
) {}
