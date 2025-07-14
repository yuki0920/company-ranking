# Gemini Project Context: company-ranking

This document provides context about the `company-ranking` project for the Gemini AI assistant.

## Project Overview

`company-ranking` is a web application that displays sales and annual salaries of publicly listed companies in Japan in a ranked format. It supports both English and Japanese languages.

The project is a monorepo composed of a Go backend, a Ruby on Rails batch processing system, and a Next.js frontend.

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) (TypeScript) with [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/).
- **Backend (API)**: [Go](https://go.dev/) using `oapi-codegen` for code generation from an OpenAPI specification.
- **Backend (Data Processing)**: [Ruby on Rails](https://rubyonrails.org/) for scraping and processing company data.
- **API Specification**: [OpenAPI](https://www.openapis.org/)
- **Database**: PostgreSQL
- **Infrastructure**:
  - [Docker](https://www.docker.com/) for local development environment.
  - [Terraform](https://www.terraform.io/) for Infrastructure as Code.
  - [Google Cloud](https://cloud.google.com/) for deployment (inferred from Cloud Build and Terraform configurations).

## Directory Structure

- `go/`: Go backend API server.
- `ruby/`: Ruby on Rails application for data processing tasks.
- `typescript/`: Next.js frontend application.
- `openapi/`: Contains the `openapi.yaml` specification file.
- `terraform/`: Terraform configuration for production infrastructure.
- `supabase/`: Contains database schema and seed data.
- `compose.yaml`: Docker Compose configuration for local development.
- `Makefile`: Top-level Makefile with common commands.

## Key Commands

Commands should generally be run from the project root directory.

### Local Development Setup

As per the `README.md`, the setup process is:
1. `cp .env_sample .env`
2. `cp .envrc_sample .envrc`
3. `docker-compose build`
4. `docker-compose run --rm ruby bundle`
5. `docker-compose run --rm ruby bundle exec rails db:setup`
6. `docker-compose run --rm go make install/tools`
7. `cd typescript && npm install && cd ../`
8. `docker-compose up`

### Testing

- **Go**: `make test` (defined in `go/Makefile`)
- **Ruby**: `docker-compose run --rm ruby bundle exec rspec`
- **TypeScript/Next.js**: The project uses ESLint for linting, but a dedicated test script is not present in `typescript/package.json`.

### Linting

- **Go**: `make lint` (defined in `go/Makefile`)
- **Ruby**: `docker-compose run --rm ruby bundle exec rubocop`
- **TypeScript/Next.js**: `cd typescript && npm run lint`

### Building

- **TypeScript/Next.js**: `cd typescript && npm run build`

### Code Generation

- **Go (Server-side from OpenAPI)**: `make go/generate/server`
- **TypeScript (Client-side from OpenAPI)**: `make typescript/generate/client`

### Data Processing (Ruby)

- `bundle exec rake save_securities:all`: Scrapes the security list.
- `bundle exec rake save_document_summary:year`: Fetches document metadata from the EDINET API.
- `bundle exec rake save_document_detail:batch`: Fetches detailed document data from the EDINET API.
