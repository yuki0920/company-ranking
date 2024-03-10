resource "google_artifact_registry_repository" "cloud_run_source_deploy" {
  description   = "Cloud Run Source Deployments"
  format        = "DOCKER"
  location      = "asia-northeast1"
  project       = "company-ranking-prod"
  repository_id = "cloud-run-source-deploy"
}

resource "google_artifact_registry_repository" "gcr_io" {
  format        = "DOCKER"
  location      = "us"
  project       = "company-ranking-prod"
  repository_id = "gcr.io"

  cleanup_policies {
    action = "KEEP"
    id     = "deletion-policy"

    most_recent_versions {
      keep_count = 2
    }
  }
}
