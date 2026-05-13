package com.example.systemslab.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public record ProductDocument(@Id String id, String sellerId, String name, int priceCents) {
}
