package com.example.systemslab.redis;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redis/products")
class ProductCacheController {

    private final ProductCacheService cacheService;

    ProductCacheController(ProductCacheService cacheService) {
        this.cacheService = cacheService;
    }

    @GetMapping("/{id}")
    ProductRead read(@PathVariable String id) {
        return cacheService.readProduct(id);
    }

    @DeleteMapping("/{id}")
    CacheEviction evict(@PathVariable String id) {
        return cacheService.evictProduct(id);
    }
}
