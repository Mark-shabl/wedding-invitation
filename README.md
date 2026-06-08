# Wedding Invitations

Monorepo для свадебных приглашений: публичная страница для гостей и админ-панель.

## Стек

- **frontend-public** (:3000) — Next.js 14, shadcn/ui, TanStack Query, Framer Motion
- **frontend-admin** (:3001) — Next.js 14, shadcn/ui, TanStack Query
- **backend** (:8080) — Go, Gin, GORM, JWT, Redis, Prometheus, Swagger
- **PostgreSQL**, **Redis** — только внутри Docker-сети (без конфликта портов на сервере)

## Быстрый старт (Docker + hot-reload)

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

> Если Docker ругается на имя проекта (путь с кириллицей), добавьте `-p wedding`.

| Сервис | URL |
|--------|-----|
| Приглашение | http://localhost:3000/invite/{token} |
| Админка | http://localhost:3001/login |
| API | http://localhost:8080/api/v1 |
| Swagger | http://localhost:8080/swagger/index.html |
| Metrics | http://localhost:8080/metrics |

**Логин админки:** `admin` / `admin123` (из `.env`)

> PostgreSQL и Redis **не пробрасываются** на хост по умолчанию — backend подключается по именам `postgres` / `redis` внутри сети Docker. Это избегает ошибки `port is already allocated`, если на сервере уже запущен Redis (6379) или PostgreSQL (5432).
>
> Для локальной отладки БД в dev-режиме порты доступны через override: PostgreSQL **5433**, Redis **6380** (можно переопределить через `POSTGRES_HOST_PORT` / `REDIS_HOST_PORT` в `.env`).

## Локальная разработка без Docker

### Backend

```bash
cd backend
# PostgreSQL и Redis должны быть запущены
export DB_DSN="postgres://wedding:wedding_secret@localhost:5432/wedding_invites?sslmode=disable"
export REDIS_URL="redis://localhost:6379/0"
export JWT_SECRET="dev-secret"
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123
export PUBLIC_URL=http://localhost:3000
export ADMIN_URL=http://localhost:3001
go run ./cmd/server
```

Hot-reload: `air -c .air.toml`

### Frontend Public

```bash
cd frontend-public
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

### Frontend Admin

```bash
cd frontend-admin
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000 npm run dev -- -p 3001
```

## Seed-данные

При первом запуске API создаёт:

- Админ из env
- Настройки: **Никита & Полина**, 25 июня 2026
- Программа из 4 пунктов
- FAQ с дресс-кодом
- 3 тестовых гостя с токенами

Ссылки на гостей смотрите в админке → **Гости** → «Копировать ссылку».

## Production (сервер)

**На сервере используйте только prod-режим — без `docker-compose.dev.yml`!**

Dev-режим монтирует `node_modules` с хоста и часто падает с `input/output error` на overlay2.

```bash
cp .env.example .env
# отредактируйте .env: JWT_SECRET, ADMIN_PASSWORD, PUBLIC_URL, ADMIN_URL, CORS_ORIGINS

sudo docker compose down
sudo docker compose up --build -d
sudo docker compose ps
```

Если были ошибки I/O — очистите Docker и пересоберите:

```bash
sudo docker compose down -v
sudo docker system prune -af
sudo docker compose up --build -d
```

Проверьте место на диске: `df -h`

**Минимум ~5 GB свободного места** для сборки всех образов (Go + 2× Next.js).

Если сборка падает с `no space left on device`:

```bash
df -h
sudo docker system df
sudo docker system prune -af --volumes
df -h
sudo docker compose up --build -d
```

`docker system prune -af --volumes` удалит неиспользуемые образы и volumes. **Данные PostgreSQL будут удалены**, если volume не нужен — после этого seed создаст данные заново.

| Сервис | Порт |
|--------|------|
| Приглашение | 3000 |
| Админка | 3001 |
| API | 8080 |

## Локальная разработка (hot-reload)

Только для локальной машины разработчика:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
