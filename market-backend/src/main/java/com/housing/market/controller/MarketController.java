package com.housing.market.controller;

import com.housing.market.model.HouseRecord;
import com.housing.market.model.MarketStats;
import com.housing.market.model.WhatIfRequest;
import com.housing.market.service.DataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final DataService dataService;
    private final RestTemplate restTemplate;

    @Value("${app.ml.url}")
    private String mlApiUrl;

    public MarketController(DataService dataService) {
        this.dataService = dataService;
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/stats")
    public MarketStats getStats() {
        return dataService.getMarketStats();
    }

    @GetMapping("/listings")
    public List<HouseRecord> getListings() {
        return dataService.getAllListings();
    }

    @PostMapping("/what-if")
    public ResponseEntity<?> whatIf(@RequestBody WhatIfRequest request) {
        try {
            String url = mlApiUrl + "/predict";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("error", "Could not connect to ML API"));
        }
    }
}
