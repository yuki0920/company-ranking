import {
  id = "destroy-old-documents-weekly"
  to = google_cloud_scheduler_job.destroy_old_documents_weekly
}

import {
  id = "save-document-detail-daily"
  to = google_cloud_scheduler_job.save_document_detail_daily
}

import {
  id = "save-document-summary-daily-job"
  to = google_cloud_scheduler_job.save_document_summary_daily_job
}

import {
  id = "save-securities-job-biweekly"
  to = google_cloud_scheduler_job.save_securities_job_biweekly
}

resource "google_cloud_scheduler_job" "save_document_detail_daily" {
  attempt_deadline = "180s"
  name             = "save-document-detail-daily"
  project          = "company-ranking-prod"
  region           = "asia-northeast1"
  schedule         = "0 3 * * *"
  time_zone        = "Asia/Tokyo"
  http_target {
    http_method = "POST"
    uri         = "https://asia-northeast1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/company-ranking-prod/jobs/save-document-detail-job:run"
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

resource "google_cloud_scheduler_job" "save_document_summary_daily_job" {
  attempt_deadline = "180s"
  name             = "save-document-summary-daily-job"
  project          = "company-ranking-prod"
  region           = "asia-northeast1"
  schedule         = "0 0 * * *"
  time_zone        = "Asia/Tokyo"
  http_target {
    http_method = "POST"
    uri         = "https://asia-northeast1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/company-ranking-prod/jobs/save-document-summary-daily-job:run"
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
