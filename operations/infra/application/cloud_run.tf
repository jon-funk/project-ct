#provision cloudrun services to deploy application

resource "random_id" "suffix" {
  byte_length = 4
}

#Google CloudSQL database configuration
resource "google_sql_database_instance" "db-instance" {
  provider = google-beta

  name              = "${local.POSTGRES_DB}-instance-${random_id.suffix.hex}"
  database_version  = "POSTGRES_14"
  region            = var.region
  deletion_protection = true
 
  depends_on = [google_service_networking_connection.private_vpc_connection]
  
  settings {
    tier = "db-f1-micro"
    backup_configuration {
      enabled    = true
      start_time = "09:00" # 9am UTC
    }
    ip_configuration {
      ipv4_enabled     = false
      private_network  = data.google_compute_network.default.id
      enable_private_path_for_google_cloud_services = true
    }
  }
}

# Medical database
resource "google_sql_database" "database" {
  name      = local.POSTGRES_DB
  instance  = "${google_sql_database_instance.db-instance.name}"
}

# Medical db user
resource "google_sql_user" "users" {
  instance  = "${google_sql_database_instance.db-instance.name}"
  name      = local.POSTGRES_USER
  password  = var.POSTGRES_PASSWORD
}

# Sanctuary database
resource "google_sql_database" "sanctuary_database" {
  name      = local.POSTGRES_SANCTUARY_DB
  instance  = "${google_sql_database_instance.db-instance.name}"
}

# Sanctuary db user
resource "google_sql_user" "sanctuary_user" {
  instance  = "${google_sql_database_instance.db-instance.name}"
  name      = local.POSTGRES_SANCTUARY_USER
  password  = var.POSTGRES_SANCTUARY_PASSWORD
}

#cloudrun service for the web container
resource "google_cloud_run_service" "web" {
  name     = "project-ct"
  location = var.region

  template {
    spec {
      containers {
        image = "${local.GAR_location}${local.GAR_name}/web:${local.ARTIFACT_TAG}"
        
        ports {
          container_port = 3000
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}


resource "google_cloud_run_service" "api" {
  name     = "cloudrun-service-api"
  location = var.region

  template {
    spec {
      containers {
        image = "${local.GAR_location}${local.GAR_name}/api:${local.ARTIFACT_TAG}"

        ports {
          container_port = 5000
        }
        env {
          name  = "POSTGRES_USER"
          value = local.POSTGRES_USER
        }
        env {
          name  = "POSTGRES_SANCTUARY_USER"
          value = local.POSTGRES_SANCTUARY_USER
        }
        env {
          name = "POSTGRES_PASSWORD"
          value = var.POSTGRES_PASSWORD
        }
        env {
          name = "POSTGRES_SANCTUARY_PASSWORD"
          value = var.POSTGRES_SANCTUARY_PASSWORD
        }
        env {
          name = "POSTGRES_HOST"
          value = var.POSTGRES_HOST
        }
        env {
          name = "POSTGRES_DB"
          value = local.POSTGRES_DB 
        }
        env {
          name = "POSTGRES_SANCTUARY_DB"
          value = local.POSTGRES_SANCTUARY_DB 
        } 
        env {
          name  = "POSTGRES_PORT"
          value = var.POSTGRES_PORT
        }
        env {
          name = "SECRET_KEY"
          value = var.SECRET_KEY
        }
        env {
          name = "MIN_PASSWORD_LEN"
          value = var.MIN_PASSWORD_LEN
        }
        env {
          name = "MAX_PASSWORD_LEN"
          value = var.MAX_PASSWORD_LEN 
        } 
        env {
          name = "FRONTEND_ORIGIN"
          value = var.FRONTEND_ORIGIN
        }
        env {
          name = "PROTOCOL"
          value = var.PROTOCOL
        }
        env {
          name = "API_PREFIX"
          value = var.API_PREFIX
        } 
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/client-name" = "terraform"
        "autoscaling.knative.dev/maxScale" = "5"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.db-instance.connection_name
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
      }
    }
  }
  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  autogenerate_revision_name = true
  #depends_on  = [ 
  #  google_project_service.apis["run.googleapis.com"],
  #  google_project_service.apis["sqladmin.googleapis.com"],
  #]
}

# Create public access policy for the cloud run service
data "google_iam_policy" "public" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}
# Enable public access on web Cloud Run services
resource "google_cloud_run_service_iam_policy" "web_policy" {
  location    = google_cloud_run_service.web.location
  project     = google_cloud_run_service.web.project
  service     = google_cloud_run_service.web.name
  policy_data = data.google_iam_policy.public.policy_data
}

resource "google_cloud_run_service_iam_policy" "api_policy" {
  location = google_cloud_run_service.api.location
  project  = google_cloud_run_service.api.project
  service  = google_cloud_run_service.api.name
  policy_data = data.google_iam_policy.public.policy_data
}