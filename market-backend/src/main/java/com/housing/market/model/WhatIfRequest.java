package com.housing.market.model;

public record WhatIfRequest(
    Double square_footage,
    Integer bedrooms,
    Double bathrooms,
    Integer year_built,
    Double lot_size,
    Double distance_to_city_center,
    Double school_rating
) {}
