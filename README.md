# Norte4j API

## Observabilidade

A API expõe métricas Prometheus em `GET /api/metrics`. O endpoint inclui métricas padrão do processo Node.js e as métricas HTTP abaixo:

O endpoint exige a variável `METRICS_API_KEY` e aceita a credencial por `Authorization: ApiKey <chave>` ou `X-API-Key: <chave>`. Não existe fallback sem autenticação; sem configuração, o endpoint responde `503`.

- `norte4j_http_requests_total`
- `norte4j_http_request_duration_seconds`
- `norte4j_http_requests_in_flight`
- `norte4j_http_response_size_bytes`

As métricas HTTP usam somente as labels `method`, `route` e `status_code`; a rota é o template do endpoint, evitando cardinalidade causada por IDs e slugs.

O site envia eventos públicos para `POST /api/analytics/events`. As métricas incluem visitas únicas diárias, page views, sessões, cliques etiquetados, origem, dispositivo, profundidade de rolagem e tempo de engajamento. O identificador anônimo é transformado em HMAC no backend usando `ANALYTICS_SALT` (com `JWT_SECRET` como fallback) e nunca é exposto como label Prometheus.

API NestJS com MySQL, TypeORM e autenticação JWT para o site e CMS Norte4j.

## V2 em Spring Boot (em migração)

A reescrita em Spring Boot ([#2](https://github.com/norte4j/norte4j-api/issues/2)) convive com o NestJS na mesma raiz até o cutover ([#16](https://github.com/norte4j/norte4j-api/issues/16)). Decisões em [`docs/adr/0001-bootstrap-spring-boot.md`](docs/adr/0001-bootstrap-spring-boot.md).

Requisitos: JDK 25 e Docker (usado pelo Testcontainers nos testes e pelo `bootTestRun`).

```bash
./gradlew bootRun        # profile local; lê o .env (DB_*) e sobe em http://localhost:3001
./gradlew bootTestRun    # sobe a API com um MySQL temporário via Testcontainers
./gradlew test           # testes (exige Docker)
./gradlew spotlessApply  # formata o código
./gradlew check          # Spotless, PMD e testes
```

Profiles: `local` (padrão do `bootRun`), `test` e `production`. O `production` não tem defaults: se faltar `DB_HOST`, `DB_DATABASE`, `DB_USERNAME` ou `DB_PASSWORD`, a aplicação falha na subida indicando a variável. A API V2 usa a porta `API_V2_PORT` (padrão `3001`) para rodar ao lado do NestJS. O health fica em `GET /actuator/health`; as demais rotas ficam negadas até a [#8](https://github.com/norte4j/norte4j-api/issues/8).

## Configuração (NestJS)

1. Crie o banco: `CREATE DATABASE norte4j CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.
2. Copie `.env.example` para `.env` e configure MySQL, segredo JWT e credenciais iniciais do administrador.
3. Execute `npm install`, `npm run migration:run` e `npm run start:dev`.
4. No frontend, configure `VITE_API_URL=http://localhost:3000/api`.

Para desenvolvimento, o MySQL também pode ser iniciado com `docker compose up -d mysql`. As credenciais desse Compose são `norte4j` / `norte4j_dev`.

O `synchronize` permanece sempre desativado. O schema é controlado pelas migrations em `src/database/migrations`.

## Migrations

```bash
# Exibir migrations e seus estados
npm run migration:show

# Executar migrations pendentes
npm run migration:run

# Reverter a última migration
npm run migration:revert

# Gerar uma migration a partir de alterações nas entidades
npm run migration:generate

# Gerar com um nome específico
npm run typeorm -- migration:generate src/database/migrations/NomeDaAlteracao
```

Defina `DB_MIGRATIONS_RUN=true` apenas se quiser que a aplicação execute automaticamente as migrations pendentes durante a inicialização. Para produção, normalmente é preferível executar `npm run migration:run` como uma etapa separada do deploy.

O administrador de `ADMIN_EMAIL`/`ADMIN_PASSWORD` é criado na primeira inicialização. As senhas usam bcrypt e nunca são retornadas pela API. Conteúdos ficam em `content_resources`; usuários administrativos ficam em `users`.

Os arquivos são gravados no diretório definido por `UPLOAD_DIR` e publicados em `/uploads`. Em produção, monte esse diretório em volume persistente ou substitua o serviço por armazenamento S3 compatível.
## Upload de imagens no CMS

Para eventos, workshops e parceiros, envie a imagem autenticada como multipart/form-data no campo file para POST /api/uploads/images (até 10 MB). A resposta contém url, path e 	ype; salve url no campo image, imageUrl ou src do recurso. O endpoint genérico POST /api/uploads continua aceitando imagens e vídeos de até 50 MB.
