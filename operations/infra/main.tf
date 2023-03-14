terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}

resource "google_cloud_run_service" "default" {
  name     = "cloudrun-srv"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "docker.io/cmcaughren/nextjs:dev" 
      }
    }
  }

}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "default" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

resource "google_sql_database_instance" "test-db-instance" {
  name              = "test-db-instance"
  database_version  = "POSTGRES_14"
  region            = var.region
 
  settings {
    tier = "db-f1-micro"
  }

}

resource "google_sql_database" "database" {
  name      = "test-db"
  instance  = "${google_sql_database_instance.test-db-instance.name}"
}

resource "google_sql_user" "users" {
  instance  = "${google_sql_database_instance.test-db-instance.name}"
  name      = var.db_user
  password  = var.db_user_password
}