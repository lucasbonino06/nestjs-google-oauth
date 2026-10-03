# NestJS Google OAuth2

Backend de registro y autenticación con NestJS, Google OAuth2, Prisma ORM (PostgreSQL) y JWT.

## Requisitos

- Node.js v18 o superior
- PostgreSQL (local o en Docker)
- Credenciales de Google Cloud Console (Client ID y Client Secret)

## Configuración de Google Cloud

1. Crear un proyecto en https://console.cloud.google.com/
2. Configurar la pantalla de consentimiento (OAuth consent screen) como **External** y agregar tu email como *Test user*.
3. Crear credenciales: **OAuth client ID** de tipo **Web application**.
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/redirect`
4. Copiar el Client ID y el Client Secret.

## Instalación

```bash
git clone <URL_DEL_REPOSITORIO>
cd nestjs-google-oauth
npm install
```

## Variables de entorno

Copiar el archivo de ejemplo y completar los valores:

```bash
cp .env.example .env
```

En Windows (CMD): `copy .env.example .env`

| Variable | Descripción |
| :--- | :--- |
| `PORT` | Puerto del servidor |
| `DATABASE_URL` | URL de conexión a PostgreSQL (`postgresql://usuario:password@host:5432/base?schema=public`) |
| `GOOGLE_CLIENT_ID` | Client ID de Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google Cloud |
| `GOOGLE_CALLBACK_URL` | `http://localhost:3000/auth/google/redirect` |
| `JWT_SECRET` | Secreto para firmar los JWT |
| `JWT_EXPIRES_IN` | Duración del token (ej. `1d`) |

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Base de datos

Crear una base de datos vacía con el nombre usado en `DATABASE_URL`:

```sql
CREATE DATABASE nestjs_oauth;
```

Generar el cliente de Prisma y crear las tablas:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Ejecución

```bash
npm run start:dev
```

El servidor queda en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| GET | `/auth/google` | Redirige al login de Google |
| GET | `/auth/google/redirect` | Callback de Google; responde `{ "token": "<JWT>" }` |

## Estructura

```
src/
├── auth/       # Estrategia de Google, AuthService, AuthController
├── users/      # UsersService
└── prisma/     # PrismaService (conexión a PostgreSQL)
prisma/
└── schema.prisma   # Modelo User (local + Google)
```