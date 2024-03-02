import {
  id = "asia-northeast1/company-ranking-job"
  to = google_cloud_run_v2_job.company_ranking_job
}

import {
  id = "asia-northeast1/destroy-old-documents"
  to = google_cloud_run_v2_job.destroy_old_documents
}

import {
  id = "asia-northeast1/save-document-detail-job"
  to = google_cloud_run_v2_job.save_document_detail_job
}

import {
  id = "asia-northeast1/save-document-summary-daily-job"
  to = google_cloud_run_v2_job.save_document_summary_daily_job
}

import {
  id = "asia-northeast1/save-securities-job"
  to = google_cloud_run_v2_job.save_securities_job
}

resource "google_cloud_run_v2_job" "save_document_detail_job" {
  annotations    = {}
  client         = "gcloud"
  client_version = "463.0.0"
  labels         = {}
  launch_stage   = "GA"
  location       = "asia-northeast1"
  name           = "save-document-detail-job"
  project        = "company-ranking-prod"
  template {
    annotations = {}
    labels      = {}
    parallelism = 0
    task_count  = 1
    template {
      encryption_key        = null
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = ["bin/rake", "save_document_detail:batch"]
        command     = []
        image       = "gcr.io/company-ranking-prod/company-ranking-job:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
        name        = null
        working_dir = null
        env {
          name  = "RAILS_ENV"
          value = "production"
        }
        env {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "enabled"
        }
        env {
          name  = "DATABASE_URL"
          value = null
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
          value = null
          value_source {
            secret_key_ref {
              secret  = "SECRET_KEY_BASE"
              version = "latest"
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}

resource "google_cloud_run_v2_job" "destroy_old_documents" {
  annotations    = {}
  client         = "gcloud"
  client_version = "463.0.0"
  labels         = {}
  launch_stage   = "GA"
  location       = "asia-northeast1"
  name           = "destroy-old-documents"
  project        = "company-ranking-prod"
  template {
    annotations = {}
    labels      = {}
    parallelism = 0
    task_count  = 1
    template {
      encryption_key        = null
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = ["bin/rake", "destroy_old_documents:execute"]
        command     = []
        image       = "gcr.io/company-ranking-prod/company-ranking-job:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
        name        = null
        working_dir = null
        env {
          name  = "RAILS_ENV"
          value = "production"
        }
        env {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "enabled"
        }
        env {
          name  = "DATABASE_URL"
          value = null
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
          value = null
          value_source {
            secret_key_ref {
              secret  = "SECRET_KEY_BASE"
              version = "latest"
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}

resource "google_cloud_run_v2_job" "save_document_summary_daily_job" {
  annotations    = {}
  client         = "gcloud"
  client_version = "463.0.0"
  labels         = {}
  launch_stage   = "GA"
  location       = "asia-northeast1"
  name           = "save-document-summary-daily-job"
  project        = "company-ranking-prod"
  template {
    annotations = {}
    labels      = {}
    parallelism = 0
    task_count  = 1
    template {
      encryption_key        = null
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = ["bin/rake", "save_document_summary:day"]
        command     = []
        image       = "gcr.io/company-ranking-prod/company-ranking-job:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
        name        = null
        working_dir = null
        env {
          name  = "RAILS_ENV"
          value = "production"
        }
        env {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "enabled"
        }
        env {
          name  = "DATABASE_URL"
          value = null
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
          value = null
          value_source {
            secret_key_ref {
              secret  = "SECRET_KEY_BASE"
              version = "latest"
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}

resource "google_cloud_run_v2_job" "company_ranking_job" {
  annotations    = {}
  client         = "gcloud"
  client_version = "463.0.0"
  labels         = {}
  launch_stage   = "GA"
  location       = "asia-northeast1"
  name           = "company-ranking-job"
  project        = "company-ranking-prod"
  template {
    annotations = {}
    labels      = {}
    parallelism = 0
    task_count  = 1
    template {
      encryption_key        = null
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = []
        command     = []
        image       = "gcr.io/company-ranking-prod/company-ranking-job:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
        name        = null
        working_dir = null
        env {
          name  = "RAILS_ENV"
          value = "production"
        }
        env {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "enabled"
        }
        env {
          name  = "DATABASE_URL"
          value = null
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
          value = null
          value_source {
            secret_key_ref {
              secret  = "SECRET_KEY_BASE"
              version = "latest"
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}

resource "google_cloud_run_v2_job" "save_securities_job" {
  annotations    = {}
  client         = "gcloud"
  client_version = "463.0.0"
  labels         = {}
  launch_stage   = "GA"
  location       = "asia-northeast1"
  name           = "save-securities-job"
  project        = "company-ranking-prod"
  template {
    annotations = {}
    labels      = {}
    parallelism = 0
    task_count  = 1
    template {
      encryption_key        = null
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = ["bin/rake", "save_securities:every_2weeks"]
        command     = []
        image       = "gcr.io/company-ranking-prod/company-ranking-job:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
        name        = null
        working_dir = null
        env {
          name  = "RAILS_ENV"
          value = "production"
        }
        env {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "enabled"
        }
        env {
          name  = "DATABASE_URL"
          value = null
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
          value = null
          value_source {
            secret_key_ref {
              secret  = "SECRET_KEY_BASE"
              version = "latest"
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}
