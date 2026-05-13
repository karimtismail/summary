package com.example.systemslab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SystemsLabApplication {

    public static void main(String[] args) {
        SpringApplication.run(SystemsLabApplication.class, args);
    }
}
