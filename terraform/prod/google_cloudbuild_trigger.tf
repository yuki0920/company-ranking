import {
  id = "company-ranking-job-deploy"
  to = google_cloudbuild_trigger.company_ranking_job_deploy
}

import {
  id = "company-ranking-server-deploy"
  to = google_cloudbuild_trigger.company_ranking_server_deploy
}

resource "google_cloudbuild_trigger" "company_ranking_job_deploy" {
  filename           = "ruby/cloudbuild.yaml"
  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
  included_files     = ["ruby/**"]
  location           = "global"
  name               = "company-ranking-job-deploy"
  project            = "company-ranking-prod"
  github {
    name  = "company-ranking"
    owner = "yuki0920"
    push {
      branch = "^main$"
    }
  }
}


resource "google_cloudbuild_trigger" "company_ranking_server_deploy" {
  filename           = "go/cloudbuild.yaml"
  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
  included_files     = ["go/**"]
  location           = "global"
  name               = "company-ranking-server-deploy"
  project            = "company-ranking-prod"
  github {
    enterprise_config_resource_name = null
    name                            = "company-ranking"
    owner                           = "yuki0920"
    push {
      branch = "^main$"
    }
  }
}
