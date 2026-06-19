package com.housing.market.service;

import com.housing.market.model.HouseRecord;
import com.housing.market.model.MarketStats;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataService {

    @Value("${app.data.file-path}")
    private String dataFilePath;

    private List<HouseRecord> records = new ArrayList<>();

    @PostConstruct
    public void init() throws Exception {
        // Strip UTF-8 BOM if present and parse with explicit header detection
        FileInputStream fis = new FileInputStream(Paths.get(dataFilePath).toFile());
        // Skip BOM bytes if present (EF BB BF)
        byte[] bom = fis.readNBytes(3);
        if (!(bom[0] == (byte)0xEF && bom[1] == (byte)0xBB && bom[2] == (byte)0xBF)) {
            fis.close();
            fis = new FileInputStream(Paths.get(dataFilePath).toFile());
        }
        Reader in = new InputStreamReader(fis, StandardCharsets.UTF_8);
        Iterable<CSVRecord> csvRecords = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setIgnoreSurroundingSpaces(true)
            .build().parse(in);
        for (CSVRecord record : csvRecords) {
            records.add(new HouseRecord(
                Long.parseLong(record.get("id")),
                Double.parseDouble(record.get("square_footage")),
                Integer.parseInt(record.get("bedrooms")),
                Double.parseDouble(record.get("bathrooms")),
                Integer.parseInt(record.get("year_built")),
                Double.parseDouble(record.get("lot_size")),
                Double.parseDouble(record.get("distance_to_city_center")),
                Double.parseDouble(record.get("school_rating")),
                Double.parseDouble(record.get("price"))
            ));
        }
    }

    public List<HouseRecord> getAllListings() {
        return records;
    }

    @Cacheable("marketStats")
    public MarketStats getMarketStats() {
        if (records.isEmpty()) {
            return new MarketStats(0, 0, 0, 0, 0, Map.of(), Map.of(), Map.of());
        }

        long total = records.size();
        double minPrice = records.stream().mapToDouble(HouseRecord::price).min().orElse(0);
        double maxPrice = records.stream().mapToDouble(HouseRecord::price).max().orElse(0);
        double avgPrice = records.stream().mapToDouble(HouseRecord::price).average().orElse(0);
        
        double avgPriceSqft = records.stream()
            .filter(r -> r.squareFootage() > 0)
            .mapToDouble(r -> r.price() / r.squareFootage())
            .average().orElse(0);

        Map<Integer, Double> byBeds = records.stream()
            .collect(Collectors.groupingBy(
                HouseRecord::bedrooms,
                Collectors.averagingDouble(HouseRecord::price)
            ));

        Map<String, Double> byDecade = records.stream()
            .collect(Collectors.groupingBy(
                r -> (r.yearBuilt() / 10 * 10) + "s",
                Collectors.averagingDouble(HouseRecord::price)
            ));

        Map<String, Long> distribution = records.stream()
            .collect(Collectors.groupingBy(
                r -> {
                    double p = r.price();
                    if (p < 200000) return "<200k";
                    if (p < 400000) return "200k-400k";
                    if (p < 600000) return "400k-600k";
                    if (p < 800000) return "600k-800k";
                    return "800k+";
                },
                Collectors.counting()
            ));

        return new MarketStats(total, minPrice, maxPrice, avgPrice, avgPriceSqft, byBeds, byDecade, distribution);
    }
}
