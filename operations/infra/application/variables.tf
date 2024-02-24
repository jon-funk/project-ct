variable "project_id" { }

variable "region" {
  default = "northamerica-northeast2"
}

variable "zone" {
  default = "northamerica-northeast2-a"
}

locals {
  storage_bucket = "${var.project_id}-app-sb"
  GAR_name = "${ var.project_id }-gar"
  GAR_location = "${ var.region }-docker.pkg.dev/${ var.project_id }/"
  service_account = "${ var.project_id }-deploy-sa"
  POSTGRES_DB = "${var.project_id}-db"
  POSTGRES_SANCTUARY_DB = "${var.project_id}-sanctuary-db"
  POSTGRES_USER = "${var.project_id}-db-user"
  POSTGRES_SANCTUARY_USER = "${var.project_id}-sanctuary-db-user"
  ARTIFACT_TAG = "prod"
}
variable "POSTGRES_PASSWORD" {}
variable "POSTGRES_SANCTUARY_PASSWORD" {}
variable "POSTGRES_HOST" {}
variable "POSTGRES_PORT" {}
variable "SECRET_KEY" {}
variable "MIN_PASSWORD_LEN" {}
variable "MAX_PASSWORD_LEN" {}
variable "FRONTEND_ORIGIN" {}
variable "PROTOCOL" {}
variable "API_PREFIX" {}