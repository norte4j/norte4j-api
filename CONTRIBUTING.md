# Contribuindo com a Norte4j API

Obrigado por contribuir! Este repositório está migrando de NestJS/Node.js para Spring Boot. Mudanças devem preservar os contratos usados pelo site e pelo CMS até que uma quebra seja explicitamente aprovada.

## Antes de começar

1. Procure uma issue existente ou abra uma usando os formulários do repositório.
2. Comente na issue antes de iniciar mudanças grandes.
3. Faça um fork e crie uma branch curta a partir de `master`.
4. Nunca publique segredos, dados pessoais ou credenciais reais.

## Ambiente proposto para a V2

- Java LTS e Spring Boot
- Gradle Kotlin DSL e Gradle Wrapper
- MySQL, Spring Data JPA e Flyway
- Spring Security com JWT
- Testcontainers, Actuator, Micrometer/Prometheus e OpenAPI

Enquanto a migração estiver em andamento, siga também as instruções do README para o backend NestJS atual.

## Convenções

- Prefira um monólito modular organizado por domínio.
- Mantenha controllers finos e regras de negócio testáveis fora da camada web.
- Use migrations Flyway; não dependa de criação automática de schema em produção.
- Preserve `resource`, `slug` e `data` JSON de `content_resources` na primeira fase.
- Não exponha stack traces, tokens, senhas, payloads sensíveis ou identificadores de analytics em logs.
- Commits e PRs devem ser pequenos, coesos e escritos com contexto suficiente.

## Validação antes da PR

- Execute formatação, análise estática, testes e build com o Gradle Wrapper.
- Para mudanças de banco, teste as migrations em MySQL via Testcontainers.
- Para mudanças de API, atualize OpenAPI e testes de contrato.
- Para mudanças visíveis, inclua evidências ou exemplos de requisição/resposta.

## Pull requests

Preencha todo o template, vincule a issue, descreva riscos e plano de rollback. PRs devem manter compatibilidade ou destacar claramente qualquer quebra. Ao contribuir, você concorda em seguir o CODE_OF_CONDUCT.md.
