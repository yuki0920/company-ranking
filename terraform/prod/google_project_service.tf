resource "google_project_service" "artifactregistry_googleapis_com" {
  project = "company-ranking-prod"
  service = "artifactregistry.googleapis.com"
}

resource "google_project_service" "secretmanager_googleapis_com" {
  project = "company-ranking-prod"
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "cloudasset_googleapis_com" {
  project = "company-ranking-prod"
  service = "cloudasset.googleapis.com"
}

resource "google_project_service" "run_googleapis_com" {
  project = "company-ranking-prod"
  service = "run.googleapis.com"
}

resource "google_project_service" "storage_api_googleapis_com" {
  project = "company-ranking-prod"
  service = "storage-api.googleapis.com"
}

resource "google_project_service" "logging_googleapis_com" {
  project = "company-ranking-prod"
  service = "logging.googleapis.com"
}

resource "google_project_service" "containeranalysis_googleapis_com" {
  project = "company-ranking-prod"
  service = "containeranalysis.googleapis.com"
}

resource "google_project_service" "iamcredentials_googleapis_com" {
  project = "company-ranking-prod"
  service = "iamcredentials.googleapis.com"
}

resource "google_project_service" "containerregistry_googleapis_com" {
  project = "company-ranking-prod"
  service = "containerregistry.googleapis.com"
}

resource "google_project_service" "cloudscheduler_googleapis_com" {
  project = "company-ranking-prod"
  service = "cloudscheduler.googleapis.com"
}

resource "google_project_service" "cloudbuild_googleapis_com" {
  project = "company-ranking-prod"
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "iam_googleapis_com" {
  project = "company-ranking-prod"
  service = "iam.googleapis.com"
}

resource "google_project_service" "pubsub_googleapis_com" {
  project = "company-ranking-prod"
  service = "pubsub.googleapis.com"
}

resource "google_project_service" "storage_component_googleapis_com" {
  project = "company-ranking-prod"
  service = "storage-component.googleapis.com"
}

resource "google_project_service" "cloudtrace_googleapis_com" {
  project = "company-ranking-prod"
  service = "cloudtrace.googleapis.com"
}

import {
  id = "company-ranking-prod/artifactregistry.googleapis.com"
  to = google_project_service.artifactregistry_googleapis_com
}

import {
  id = "company-ranking-prod/secretmanager.googleapis.com"
  to = google_project_service.secretmanager_googleapis_com
}

import {
  id = "company-ranking-prod/cloudasset.googleapis.com"
  to = google_project_service.cloudasset_googleapis_com
}

import {
  id = "company-ranking-prod/run.googleapis.com"
  to = google_project_service.run_googleapis_com
}

import {
  id = "company-ranking-prod/storage-api.googleapis.com"
  to = google_project_service.storage_api_googleapis_com
}

import {
  id = "company-ranking-prod/logging.googleapis.com"
  to = google_project_service.logging_googleapis_com
}

import {
  id = "company-ranking-prod/containeranalysis.googleapis.com"
  to = google_project_service.containeranalysis_googleapis_com
}

import {
  id = "company-ranking-prod/iamcredentials.googleapis.com"
  to = google_project_service.iamcredentials_googleapis_com
}

import {
  id = "company-ranking-prod/containerregistry.googleapis.com"
  to = google_project_service.containerregistry_googleapis_com
}

import {
  id = "company-ranking-prod/cloudscheduler.googleapis.com"
  to = google_project_service.cloudscheduler_googleapis_com
}

import {
  id = "company-ranking-prod/cloudbuild.googleapis.com"
  to = google_project_service.cloudbuild_googleapis_com
}

import {
  id = "company-ranking-prod/iam.googleapis.com"
  to = google_project_service.iam_googleapis_com
}

import {
  id = "company-ranking-prod/pubsub.googleapis.com"
  to = google_project_service.pubsub_googleapis_com
}

import {
  id = "company-ranking-prod/storage-component.googleapis.com"
  to = google_project_service.storage_component_googleapis_com
}

import {
  id = "company-ranking-prod/cloudtrace.googleapis.com"
  to = google_project_service.cloudtrace_googleapis_com
}
