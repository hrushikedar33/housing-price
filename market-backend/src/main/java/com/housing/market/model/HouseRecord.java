package com.housing.market.model;

public record HouseRecord(
    Long id,
    Double squareFootage,
    Integer bedrooms,
    Double bathrooms,
    Integer yearBuilt,
    Double lotSize,
    Double distanceToCityCenter,
    Double schoolRating,
    Double price
) {}
