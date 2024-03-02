import {
  id = "asia-northeast1/company-ranking-server"
  to = google_cloud_run_v2_service.company_ranking_server
}

resource "google_cloud_run_v2_service" "company_ranking_server" {
  annotations      = {}
  client           = "gcloud"
  client_version   = "463.0.0"
  custom_audiences = []
  description      = null
  ingress          = "INGRESS_TRAFFIC_ALL"
  labels           = {}
  launch_stage     = "GA"
  location         = "asia-northeast1"
  name             = "company-ranking-server"
  project          = "company-ranking-prod"
  template {
    annotations                      = {}
    encryption_key                   = null
    execution_environment            = null
    labels                           = {}
    max_instance_request_concurrency = 80
    revision                         = null
    service_account                  = "1026927710795-compute@developer.gserviceaccount.com"
    session_affinity                 = false
    timeout                          = "300s"
    containers {
      args        = []
      command     = []
      depends_on  = []
      image       = "gcr.io/company-ranking-prod/company-ranking-server:51bf85a5d2d829bde391dc67198af7b5d4b529d6"
      name        = "company-ranking-server-1"
      working_dir = null
      env {
        name  = "FRONT_URL"
        value = "company-ranking.net"
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
      ports {
        container_port = 8080
        name           = "http1"
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }
      startup_probe {
        failure_threshold     = 1
        initial_delay_seconds = 0
        period_seconds        = 240
        timeout_seconds       = 240
        tcp_socket {
          port = 8080
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
  }
  traffic {
    percent  = 100
    revision = null
    tag      = null
    type     = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}
