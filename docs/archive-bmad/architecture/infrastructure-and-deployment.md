# **Infrastructure and Deployment**

The primary method for local development and basic deployment will be Docker Compose.

**docker-compose.yml**

version: '3.8'

services:

  web:

    build:

      context: .

      dockerfile: ./apps/web/Dockerfile

    ports:

      - '3000:3000'

    volumes:

      - .:/app

    environment:

      - DATABASE\_URL=file:/app/packages/db/prisma/dev.db

      - NEXTAUTH\_URL=http://localhost:3000

      - NEXTAUTH\_SECRET= # GENERATE a secret for this

      # Add other SSO provider secrets here

    networks:

      - app-network

  jobs:

    build:

      context: .

      dockerfile: ./apps/jobs/Dockerfile

    volumes:

      - .:/app

    environment:

      - DATABASE\_URL=file:/app/packages/db/prisma/dev.db

    depends\_on:

      - web

    networks:

      - app-network

networks:

  app-network:

    driver: bridge
