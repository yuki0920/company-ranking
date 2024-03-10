import {
  id = "destroy-old-documents-weekly"
  to = google_cloud_scheduler_job.destroy_old_documents_weekly
}

import {
  id = "save-securities-job-biweekly"
  to = google_cloud_scheduler_job.save_securities_job_biweekly
}

resource "google_cloud_scheduler_job" "destroy_old_documents_weekly" {
  attempt_deadline = "180s"
  name             = "destroy-old-documents-weekly"
  project          = "company-ranking-prod"
  region           = "asia-northeast1"
  schedule         = "0 5 * * 0"
  time_zone        = "Asia/Tokyo"
  http_target {
    http_method = "POST"
    uri         = "https://asia-northeast1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/company-ranking-prod/jobs/destroy-old-documents:run"
    oauth_token {
      scope                 = "https://www.googleapis.com/auth/cloud-platform"
      service_account_email = "1026927710795-compute@developer.gserviceaccount.com"
    }
  }
  retry_config {
    max_backoff_duration = "3600s"
    max_doublings        = 5
    max_retry_duration   = "0s"
    min_backoff_duration = "5s"
    retry_count          = 0
  }
}

resource "google_cloud_scheduler_job" "save_securities_job_biweekly" {
  attempt_deadline = "180s"
  name             = "save-securities-job-biweekly"
  project          = "company-ranking-prod"
  region           = "asia-northeast1"
  schedule         = "0 1 10,25 * *"
  time_zone        = "Asia/Tokyo"
  http_target {
    http_method = "POST"
    uri         = "https://asia-northeast1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/company-ranking-prod/jobs/save-securities-job:run"
    oauth_token {
      scope                 = "https://www.googleapis.com/auth/cloud-platform"
      service_account_email = "1026927710795-compute@developer.gserviceaccount.com"
    }
  }
  retry_config {
    max_backoff_duration = "3600s"
    max_doublings        = 5
    max_retry_duration   = "0s"
    min_backoff_duration = "5s"
    retry_count          = 0
  }
}

resource "google_cloud_scheduler_job" "save_documents_daily" {
  attempt_deadline = "180s"
  name             = "save-documents-daily"
  project          = "company-ranking-prod"
  region           = "asia-northeast1"
  schedule         = "0 0 * * *"
  time_zone        = "Asia/Tokyo"
  http_target {
    uri         = "https://workflowexecutions.googleapis.com/v1/projects/company-ranking-prod/locations/asia-northeast1/workflows/save-documents/executions"
    http_method = "POST"
    oauth_token {
      scope                 = "https://www.googleapis.com/auth/cloud-platform"
      service_account_email = "1026927710795-compute@developer.gserviceaccount.com"
    }
  }
  retry_config {
    max_backoff_duration = "3600s"
    max_doublings        = 5
    max_retry_duration   = "0s"
    min_backoff_duration = "5s"
    retry_count          = 0
  }
}
