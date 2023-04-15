output "workload_identity_provider" {
  value = "${google_iam_workload_identity_pool.github_actions_pool.name}/providers/${google_iam_workload_identity_pool_provider.github_actions_pool_provider.workload_identity_pool_provider_id}"
}

output "service_account" {
  value = "${google_service_account.pipeline_service_account.email}"
}

output "registry" {
   value = "${local.GAR_location}${ local.GAR_name}/"
}
