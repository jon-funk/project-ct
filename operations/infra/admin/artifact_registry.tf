resource "google_artifact_registry_repository" "GAR" {

  location      = var.region
  repository_id = local.GAR_name
  description   = "Google Artifact Registry, Docker image repository"
  format        = "DOCKER"

  depends_on = [
    google_project_service.apis["artifactregistry.googleapis.com"],
  ]
}

resource "github_actions_secret" "GAR_secret" {
  repository       = var.project_repo
  secret_name      = "ARTIFACT_REGISTRY"
  plaintext_value  = "${local.GAR_location}${ local.GAR_name}/"
}
