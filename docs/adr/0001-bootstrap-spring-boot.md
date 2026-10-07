# ADR 0001: Bootstrap do Spring Boot

Status: aceito. Issue: [#3](https://github.com/norte4j/norte4j-api/issues/3).

## Decisões

1. **Gradle na raiz, ao lado do NestJS** até o cutover ([#16](https://github.com/norte4j/norte4j-api/issues/16)). O `dependabot.yml` já aponta Gradle em `/`. O Gradle usa `src/main/java`; o `tsc` só compila `.ts`.
2. **Monólito modular por domínio** em `com.norte4j.api.<dominio>` (`content`, `contact`, `config`, `auth`, `upload`, `analytics`). Dentro de cada módulo, `web`, `application`, `domain` e `infrastructure` quando houver código. Hoje só existe `config`.
3. **Um `application.yml` multi-profile** (`local`, `test`, `production`). As variáveis mantêm os nomes do `.env` atual (`DB_*`), então o cutover não renomeia segredos. Sem defaults de banco em produção: a falta de configuração falha na subida.
4. **Flyway desligado fora do profile `test`** até a [#4](https://github.com/norte4j/norte4j-api/issues/4). O banco atual tem schema TypeORM sem tabela de histórico do Flyway.
5. **Segurança fecha tudo, exceto `/actuator/health`**, até a [#8](https://github.com/norte4j/norte4j-api/issues/8) trazer JWT. Não há usuário em memória, então nenhuma senha é gerada no log.
6. **Porta 3001** (`API_V2_PORT`) para coexistir com o NestJS na 3000.
7. **Spotless (palantir-java-format) e PMD (quickstart)** para formatação e análise estática locais. A CI fica na [#15](https://github.com/norte4j/norte4j-api/issues/15).
8. **Testes com Testcontainers** em `mysql:8.4` (versão fixa).
