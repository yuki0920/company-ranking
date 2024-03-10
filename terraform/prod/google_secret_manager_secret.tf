resource "google_secret_manager_secret" "database_url" {
  project = "company-ranking-prod"
  replication {
    auto {}
  }
  secret_id = "DATABASE_URL"
}

resource "google_secret_manager_secret" "secret_key_base" {
  project = "company-ranking-prod"
  replication {
    auto {}
  }
  secret_id = "SECRET_KEY_BASE"
}
