resource "google_cloud_run_v2_service" "company_ranking_server" {
  ingress  = "INGRESS_TRAFFIC_ALL"
  location = "asia-northeast1"
  name     = "company-ranking-server"
  project  = "company-ranking-prod"
  template {
    max_instance_request_concurrency = 80
    revision                         = null
    service_account                  = "1026927710795-compute@developer.gserviceaccount.com"
    timeout                          = "300s"
    containers {
      args    = []
      command = []
      image   = ""
      name    = "company-ranking-server-1"
      env {
        name  = "FRONT_URL"
        value = "company-ranking.net"
      }
      env {
        name = "DATABASE_URL"
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
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  lifecycle {
    ignore_changes = [
      client,
      client_version,
      template.0.containers.0.image
    ]
  }
}
