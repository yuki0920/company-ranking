resource "google_storage_bucket" "company_ranking_prod_cloudbuild" {
  force_destroy            = false
  location                 = "US"
  name                     = "company-ranking-prod_cloudbuild"
  project                  = "company-ranking-prod"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}

resource "google_storage_bucket" "company_ranking_prod_terraform" {
  force_destroy = false
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 10
      with_state         = "ARCHIVED"
    }
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      days_since_noncurrent_time = 3
      with_state                 = "ANY"
    }
  }
  location                    = "ASIA-NORTHEAST1"
  name                        = "company-ranking-prod-terraform"
  project                     = "company-ranking-prod"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}
