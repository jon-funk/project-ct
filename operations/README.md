# Project CT Operations

Required Tools:
* gcloud CLI

# GitHub Action Workflows
GitHub Action workflows are used to impliment CI. When changes to the application are pushed or 
a PR is made to main branch, relevant application images will be automatically updated. 
Workflows are configured to push the updated images to a Google Artifact Registry. 
Authentication to Google Cloud where the images are stored is done through Workload Identity 
Federation (so no service account key is needed). 
For more information about Workload Identity Federation, please see 
[documentation](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines#github-actions_1)

Note, build-and-push-api workflow will require test-units workflow to complete successfully 
before the api image will be updated in the registry. The test-units workflow runs tests on 
the production api code. 

# Terraform Deployment

## Terraform admin
This terraform set up will provision all the infrastructure needed in the gcloud account for the 
github action workflows to authenticate using workload identity federation, so it can push updated 
images to the gcloud artifact registry. To run this amd provision the project and repository, 
administrative gcloud privledges will be needed. The admin should authenticate to gcloud via 
CLI before running this terraform. 

It will provision: 
 * A Workload Identity Pool and Workload Identity Provider in Google Cloud to allow GitHub 
   Actions to connect.
 * A service account in Google Cloud with required access for pushing to the GAR
 * Assign the Workload Identity Pool the required permission to impersonate the Service Account 
 * Sets required secrets in GitHub for use in the build-and-push workflows for api and web 

It will require variables which can be provided via ENV variable or in a "terraform.tfvars" file
(which should not be added to VCS). 
The following variables will be required:
 * project_id
 * project_repo_owner
 * project_repo
 * GITHUB_TOKEN (with sufficient access for secrets, and read write repo privledges)

It will also require variables for the storage bucket. In ENV variables or in 
"config.gcs.tfbackend" file (which should not be checked into VCS), the following variables 
are required:
 * bucket (storage bucket name)
 * prefix (this should be "terraform/state")
See below for more details.

### First 'terraform apply'
For the initial provision run of this terraform set up, please follow these steps to provision 
the storage bucket, then move the terraform state files into the bucket. 
1. In config.tf, comment out the "terraform backend "gcs" section at the bottom of the file
(otherwise, terraform will try to access a non existant bucket for its state files, before the 
bucket has been made). 
2. Run "terraform init", "terraform plan" and "terraform apply". This will provision all 
needed resources including the bucket.
2. Ensure required variables for "bucket" and "prefix" are filled in, in either ENV variables or 
in "config.gcs.tfbackend".
3. Uncomment-out the "terraform backend gcs" section in config.tf. 
4. Run "terraform init" if using ENV variables, or "terraform init -backend-config=config.gcs.tfbackend"
if providing variables in that file, followed by "terraform plan" and "terraform apply".
Terraform should move the state files to the storage bucket.
