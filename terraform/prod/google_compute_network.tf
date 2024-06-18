resource "google_compute_network" "default" {
  name                                      = "default"
  auto_create_subnetworks                   = true
  description                               = "Default network for the project"
  network_firewall_policy_enforcement_order = "AFTER_CLASSIC_FIREWALL"
  project                                   = "company-ranking-prod"
  routing_mode                              = "REGIONAL"
}

import {
  id = "company-ranking-prod/default"
  to = google_compute_network.default
}
