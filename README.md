<p align="center">
  <img align="center" alt="isi logo" src="docs/assets/logo.png">
</p>

<h3 align="center">inSight planning tool</h3>

<p align="center">A bachelor project at NTNU in collaboration with iSi.</p>

<div align="center">
  <a href="#project-structure">Project structure</a> •
  <a href="#getting-started">Getting started</a>
</div>

## Project structure

### Overall structure

```bash
.
├── apps
│   ├── backend
│   ├── frontend
│   └── init # init container (migrations)
├── infrastructure # ansible scripts & Helm chart
└── packages
    └── client # spring http interfaces & generated typescript definitions
```

### Code organizing

Generally, code is organized into features.
For Java code this means, namespacing using packages.

```bash
.
└── no.isi.insight.planning
    ├── capture
    │   ├── controller
    │   └── service
    ├── project
    │   ├── controller
    │   └── service
    └── vehicle
        └── ...
```

For TypeScript code, code is organized into feature folders.
Inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react).

```bash
.
├── components # global components
├── features
│   ├── projects
│   │   ├── api
│   │   ├── components
│   │   └── routes
│   └── vehicles
│       ├── api
│       ├── components
│       └── routes
├── lib
└── router # global router
```

## Getting started

- [Environment variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

### Environment variables

| Variable                           | Description                                             | Required |
| ---------------------------------- | ------------------------------------------------------- | -------- |
| `POSTGRES_HOST`                    | address/hostname of the pg database                     | yes      |
| `POSTGRES_PORT`                    | port of the pg database                                 | yes      |
| `POSTGRES_DB`                      | name of the pg database                                 | yes      |
| `POSTGRES_USER`                    | username for the pg database                            | yes      |
| `POSTGRES_PASSWORD`                | password for the pg database                            | yes      |
| `AUTH_TOKEN_ISSUER`                | issuer of auth tokens, defaults to `isi-insight`        | no       |
| `AUTH_ACCESS_TOKEN_SECRET`         | secret for access tokens                                | yes      |
| `AUTH_ACCESS_TOKEN_EXPIRATION_MS`  | expiration time of access tokens, defaults to 5 minutes | no       |
| `AUTH_REFRESH_TOKEN_SECRET`        | secret for refresh tokens                               | yes      |
| `AUTH_REFRESH_TOKEN_EXPIRATION_MS` | expiration time of refresh tokens, defaults to 30 days  | no       |
| `MINIO_URL`                        | URL to the MinIO/S3-compatible API                      | yes      |
| `MINIO_ACCESS_KEY`                 | access key to authenticate with MinIO/S3                | yes      |
| `MINIO_SECRET_KEY`                 | secret key to authenticate with MinIO/S3                | yes      |
| `MAIL_ENABLED`                     | whether or not to send or attempt to connect over SMTP  | yes      |
| `MAIL_HOST`                        | address of the SMTP server for sending mails            | no       |
| `MAIL_USERNAME`                    | username for authenticating against the SMTP server     | no       |
| `MAIL_PASSWORD`                    | password for authenticating against the SMTP server     | no       |

### Development

To get started with development, the following software is prerequisite:

- Java 21 (LTS)
- Docker
- PNPM 9
- Node.js 20 (LTS)

With the above installed, you can start developing by:

1. Cloning the repository
2. Set up a run/debug config
3. Run the backend using either of these options

   a) Starting `PlanningApplicationDevelopment`, this will also run required containers using Testcontainers

   b) Starting `PlanningApplication`, with environment variables defined in a `.env` file in the backend folder, using [this reference](#environment-variables). This will also require you to start docker containers manually (`docker compose up -d`)

   c) Running in CLI using Gradle (`./gradlew :apps:backend:bootRun`), this also requires you to start containers as described in b)

4. Install PNPM dependencies (`pnpm install`)
5. Start the frontend (`pnpm dev`)

We use Prettier to format TypeScript code, and the provided `eclipse-formatter.xml` file to format Java code.
Make sure to configure your IDE to use these prior to contributing.

### Deployment

In order to deploy the application, you can run the following commands from the root of the repository:

```bash
./gradlew updateVersion -DnewVersion="0.2.0"
git push
git push --tags
```

This will start the deployment pipeline, releasing artifacts to GitHub and deploying new versions to the demo environment.

Details on how environments are configured can be found in the [infrastructure](infrastructure) folder.

The application can be deployed to other environments using the published container images, just make sure to set the required environment variables for the backend service.
