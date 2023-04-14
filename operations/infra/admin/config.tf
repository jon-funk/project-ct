terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}


provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

#enables required apis in gcloud 
resource "google_project_service" "apis" {
  for_each = toset(var.apis)
  service  = each.value

  disable_dependent_services = true
}

#
resource "google_storage_bucket" "admin_storage_bucket" {
  name          = local.storage_bucket
  force_destroy = false
  location      = var.region
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

#terraform {
#   backend "gcs" {
# }
#}