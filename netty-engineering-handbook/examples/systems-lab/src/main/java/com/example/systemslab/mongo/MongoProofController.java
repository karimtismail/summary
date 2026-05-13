package com.example.systemslab.mongo;

import com.mongodb.client.model.Indexes;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mongo/products")
class MongoProofController {

    private final MongoTemplate mongoTemplate;

    MongoProofController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    void ensureIndexes() {
        mongoTemplate.indexOps(ProductDocument.class)
            .ensureIndex(new Index().on("sellerId", Sort.Direction.ASC).on("priceCents", Sort.Direction.ASC));
    }

    @PostMapping("/seed")
    Map<String, Object> seed() {
        mongoTemplate.dropCollection(ProductDocument.class);
        ensureIndexes();
        List<ProductDocument> products = List.of(
            new ProductDocument(null, "seller-a", "keyboard", 1999),
            new ProductDocument(null, "seller-a", "monitor", 12999),
            new ProductDocument(null, "seller-b", "mouse", 999)
        );
        mongoTemplate.insertAll(products);
        return Map.of("inserted", products.size(), "index", Indexes.ascending("sellerId", "priceCents").toString());
    }

    @GetMapping("/search")
    List<ProductDocument> search(@RequestParam(defaultValue = "seller-a") String sellerId, @RequestParam(defaultValue = "1000") int minPriceCents) {
        return mongoTemplate.find(query(sellerId, minPriceCents), ProductDocument.class);
    }

    @GetMapping("/explain")
    String explain(@RequestParam(defaultValue = "seller-a") String sellerId, @RequestParam(defaultValue = "1000") int minPriceCents) {
        Document find = new Document("find", "products")
            .append("filter", new Document("sellerId", sellerId).append("priceCents", new Document("$gte", minPriceCents)))
            .append("sort", new Document("priceCents", 1));
        return mongoTemplate.executeCommand(new Document("explain", find)).toJson();
    }

    private Query query(String sellerId, int minPriceCents) {
        return Query.query(Criteria.where("sellerId").is(sellerId).and("priceCents").gte(minPriceCents))
            .with(Sort.by(Sort.Direction.ASC, "priceCents"));
    }
}
