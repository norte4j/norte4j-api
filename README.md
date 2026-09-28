# Norte4j API

API NestJS com MySQL, TypeORM e autenticação JWT para o site e CMS Norte4j.

## Configuração

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

Para eventos, workshops e parceiros, envie a imagem autenticada como multipart/form-data no campo ile para POST /api/uploads/images (at� 10 MB). A resposta cont�m url, path e 	ype; salve url no campo image, imageUrl ou src do recurso. O endpoint gen�rico POST /api/uploads continua aceitando imagens e v�deos de at� 50 MB.
