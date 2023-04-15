resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
  keepers = {
   project = "${var.project_id}"
  }
}

#creation of a Workload Identity Federation Pool and Pool Provider for GitHub Actions
resource "google_iam_workload_identity_pool" "github_actions_pool" {
  project                   = var.project_id
  workload_identity_pool_id = "${ local.WIPool_name_prefix }-${ random_string.suffix.result }"
  display_name              = "GitHub Actions Identity Pool"
  description               = "Workload Identity Federation pool for GitHub Action deployment pipeline authentication"

}

resource "google_iam_workload_identity_pool_provider" "github_actions_pool_provider" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = local.WIProvider_name
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.aud"        = "assertion.aud"
    "attribute.repository" = "assertion.repository"
  }
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "github_actions_secret" "wp_secret" {
  repository       = var.project_repo
  secret_name      = "WORKLOAD_IDENTITY_PROVIDER"
  plaintext_value  = "${google_iam_workload_identity_pool.github_actions_pool.name}/providers/${google_iam_workload_identity_pool_provider.github_actions_pool_provider.workload_identity_pool_provider_id}"
}

#creation of a service account which the pool will act as
resource "google_service_account" "pipeline_service_account" {
  project      = var.project_id
  account_id   = local.pipeline_service_account
  display_name = "Service Account used for pipeline using GitHub Actions and Terraform"
}


resource "github_actions_secret" "sa_secret" {
  repository       = var.project_repo
  secret_name      = "SERVICE_ACCOUNT"
  plaintext_value  = google_service_account.pipeline_service_account.email
}


#granting the service account required access to gcp project services
resource "google_project_iam_member" "GAR_administrator" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${google_service_account.pipeline_service_account.email}"
}

#allow the pool access to the service account 
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.pipeline_service_account.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions_pool.name}/attribute.repository/${var.project_repo}"
}