locals {
  jobs = {
    save-document-detail-job = {
      args = ["bin/rake", "save_document_detail:batch"]
    },
    destroy-old-documents = {
      args = ["bin/rake", "destroy_old_documents:execute"]
    },
    save-document-summary-daily-job = {
      args = ["bin/rake", "save_document_summary:day"]
    },
    company-ranking-job = {
      args = []
    },
    save-securities-job = {
      args = ["bin/rake", "save_securities:every_2weeks"]
    }
  }
}

resource "google_cloud_run_v2_job" "job" {
  for_each = local.jobs

  location = "asia-northeast1"
  name     = each.key
  project  = "company-ranking-prod"
  template {
    task_count  = 1
    template {
      execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
      max_retries           = 1
      service_account       = "1026927710795-compute@developer.gserviceaccount.com"
      timeout               = "600s"
      containers {
        args        = each.value.args
        command     = []
        image       = ""
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
          value_source {
            secret_key_ref {
              secret  = "DATABASE_URL"
              version = "latest"
            }
          }
        }
        env {
          name  = "SECRET_KEY_BASE"
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
  lifecycle {
    ignore_changes = [
      client,
      client_version,
      template.0.template.0.containers.0.image
    ]
  }
}
