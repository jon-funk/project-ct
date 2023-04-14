variable "project_id" { }

variable "project_repo" { }

variable "region" {
  default = "northamerica-northeast2"
}

variable "zone" {
  default = "northamerica-northeast2-a"
}

locals {
  GAR_name = "${ var.project_id }-gar"
  GAR_location = "${ var.region }-docker.pkg.dev/${ var.project_id }/" #${ var.GAR_name }/"
  WIPool_name_prefix = "${ var.project_id }-wipool"
  WIProvider_name = "${ var.project_id }-wiprovider"
  pipeline_service_account = "${ var.project_id }-sa"
  storage_bucket = "${ var.project_id }-admin-sb"
}

variable "database_connection_name" { }

variable "apis" {
  description = "List of apis to enable"
  type        = list(string)
  default = [
    "artifactregistry.googleapis.com",
    #"sqladmin.googleapis.com",
    "run.googleapis.com",
    #"compute.googleapis.com",
    "cloudresourcemanager.googleapis.com", //needed by terraform
    "storage.googleapis.com"
  ]
}