package com.norte4j.api;

import org.springframework.boot.SpringApplication;

public class TestNorte4jApiApplication {

    public static void main(String[] args) {
        SpringApplication.from(Norte4jApiApplication::main)
                .with(TestcontainersConfiguration.class)
                .run(args);
    }
}
