# Project CT Operations

# GitHub Action Workflows
GitHub Action workflows are used to impliment CI. When changes to the application are pushed or a PR is made to main branch, relevant application images will be automatically updated. Workflows are configured to push the updated images to a Google Artifact Registry. Authentication to Google Cloud where the images are stored is done through Workload Identity Federation (so no service account key is needed). 

To Authenticate, please ensure:
 * A Workload Identity Pool and Workload Indentity Provider have been configured in Google Cloud to allow GitHub Actions to connect.
 * A service account has been configured in Google Cloud with required access for pushing to the GAR
 * The Workload Identity Pool has been given permission to impersonate the Service Account 
 * Workload Intentity Provider environment variable is set in both build-and-push workflows for api and web 
 * Service Account variable is set in both build-and-push workflows for api and web
 * Registry environment variable is set to the correct location for the Google Artifact Registry in both workflows also.
 For more information, please see [documentation](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines#github-actions_1)

Note, build-and-push-api workflow will require test-units workflow to complete successfully before the api image will be updated in the registry. The test-units workflow runs tests on the production api code. 

# Terraform Deployment
TBD