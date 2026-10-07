package com.norte4j.api.config;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.mock.env.MockEnvironment;

class RequiredConfigValidatorTests {

    private final RequiredConfigValidator validator = new RequiredConfigValidator();
    private final SpringApplication application = new SpringApplication();

    @Test
    void producaoSemConfiguracaoFalhaNomeandoAsVariaveis() {
        MockEnvironment env = new MockEnvironment().withProperty("DB_HOST", "db");
        env.setActiveProfiles("production");

        assertThatThrownBy(() -> validator.postProcessEnvironment(env, application))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("DB_DATABASE")
                .hasMessageContaining("DB_USERNAME")
                .hasMessageContaining("DB_PASSWORD");
    }

    @Test
    void producaoComConfiguracaoCompletaPassa() {
        MockEnvironment env = new MockEnvironment()
                .withProperty("DB_HOST", "db")
                .withProperty("DB_DATABASE", "norte4j")
                .withProperty("DB_USERNAME", "app")
                .withProperty("DB_PASSWORD", "secret");
        env.setActiveProfiles("production");

        assertThatCode(() -> validator.postProcessEnvironment(env, application)).doesNotThrowAnyException();
    }

    @Test
    void outrosProfilesNaoSaoValidados() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("local");

        assertThatCode(() -> validator.postProcessEnvironment(env, application)).doesNotThrowAnyException();
    }
}
