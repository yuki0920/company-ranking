# Cloud Run service is deployed by gcloud command using cloudbuild
# So, we don't need to deploy Cloud Run service by Terraform to avoid conflict
removed {
  from = google_cloud_run_v2_service.company_ranking_server
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_cloud_run_v2_service.company_ranking_test_server
  lifecycle {
    destroy = false
  }
}

# resource "google_cloud_run_v2_service" "company_ranking_server" {
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   location = "asia-northeast1"
#   name     = "company-ranking-server"
#   project  = "company-ranking-prod"
#   template {
#     max_instance_request_concurrency = 80
#     service_account                  = "1026927710795-compute@developer.gserviceaccount.com"
#     timeout                          = "300s"
#     containers {
#       image = "gcr.io/company-ranking-prod/company-ranking-server:latest"
#       name  = "company-ranking-server-1"
#       env {
#         name  = "FRONT_URL"
#         value = "company-ranking.net"
#       }
#       env {
#         name = "DATABASE_URL"
#         value_source {
#           secret_key_ref {
#             secret  = "DATABASE_URL"
#             version = "latest"
#           }
#         }
#       }
#       ports {
#         container_port = 8080
#         name           = "http1"
#       }
#       resources {
#         cpu_idle = true
#         limits = {
#           cpu    = "1000m"
#           memory = "512Mi"
#         }
#         startup_cpu_boost = true
#       }
#       startup_probe {
#         failure_threshold = 1
#         period_seconds    = 240
#         timeout_seconds   = 240
#         tcp_socket {
#           port = 8080
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#   }

#   lifecycle {
#     ignore_changes = [
#       client,
#       client_version,
#     ]
#   }
# }

# resource "google_cloud_run_v2_service" "company_ranking_test_server" {
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   location = "asia-northeast1"
#   name     = "company-ranking-test-server"
#   project  = "company-ranking-prod"
#   template {
#     max_instance_request_concurrency = 80
#     service_account                  = "1026927710795-compute@developer.gserviceaccount.com"
#     timeout                          = "300s"
#     containers {
#       image = "gcr.io/company-ranking-prod/company-ranking-server:latest"
#       name  = "company-ranking-server-1"
#       env {
#         name  = "FRONT_URL"
#         value = "company-ranking.net"
#       }
#       env {
#         name = "DATABASE_URL"
#         value_source {
#           secret_key_ref {
#             secret  = "DATABASE_TEST_URL"
#             version = "latest"
#           }
#         }
#       }
#       ports {
#         container_port = 8080
#         name           = "http1"
#       }
#       resources {
#         cpu_idle = true
#         limits = {
#           cpu    = "1000m"
#           memory = "512Mi"
#         }
#       }
#       startup_probe {
#         failure_threshold = 1
#         period_seconds    = 240
#         timeout_seconds   = 240
#         tcp_socket {
#           port = 8080
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#   }

#   lifecycle {
#     ignore_changes = [
#       client,
#       client_version,
#     ]
#   }
# }
