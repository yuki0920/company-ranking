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

import {
  id = "company-ranking-prod/DATABASE_URL"
  to = google_secret_manager_secret.database_url
}
import {
  id = "company-ranking-prod/SECRET_KEY_BASE"
  to = google_secret_manager_secret.secret_key_base
}
