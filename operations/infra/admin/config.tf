#terraform set up of providers, enable gcp apis, set up storage bucket 

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }

}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "github" {
  token = var.GITHUB_TOKEN
}

#required to store github secrets
data "github_actions_public_key" "public_key" {
  repository = var.project_repo
}

#enables required apis in gcloud 
resource "google_project_service" "apis" {
  for_each = toset(var.apis)
  service  = each.value

  disable_dependent_services = true
}

#google storage bucket for terraform state files
resource "google_storage_bucket" "admin_storage_bucket" {
  name          = local.storage_bucket
  force_destroy = false
  location      = var.region
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

#for first terraform provision run: comment this out
#run "terraform init -backend-config=config.gcs.tfbackend
#in this file provide the storage bucket name and the prefix
#run "terraform apply". terraform will provision the bucket.
#Once provisioned, uncomment and run "terraform apply" again,
#so terraform will move the statefiles into the bucket.
#See operations/README
terraform {
   backend "gcs" {
 }
}