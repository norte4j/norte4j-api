package com.norte4j.api.config;

import java.util.List;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Profiles;

/**
 * Falha na subida, nomeando as variáveis, quando falta configuração obrigatória em produção.
 * Sem isso o Spring deixa o placeholder literal e o erro só aparece como falha de conexão.
 */
public class RequiredConfigValidator implements EnvironmentPostProcessor {

    static final List<String> REQUIRED = List.of("DB_HOST", "DB_DATABASE", "DB_USERNAME", "DB_PASSWORD");

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (!environment.acceptsProfiles(Profiles.of("production"))) {
            return;
        }
        List<String> missing = REQUIRED.stream()
                .filter(name -> {
                    String value = environment.getProperty(name);
                    return value == null || value.isBlank();
                })
                .toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException("Configuração obrigatória ausente no profile production: " + missing);
        }
    }
}
