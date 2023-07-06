#Virtual Private Cloud (VPC) Network 

data "google_compute_network" "default" {
  name = "default"
}

#Private ip address for Database instance. Allocates an IP address range.
resource "google_compute_global_address" "private_ip_address" {
  provider = google-beta

  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = data.google_compute_network.default.id
}

#Creates a private connection
resource "google_service_networking_connection" "private_vpc_connection" {
  provider = google-beta

  network                 = data.google_compute_network.default.id 
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

#Serverless VPC Access connector
resource "google_vpc_access_connector" "connector" {
  provider = google

  name = "vpc-con"
  region = var.region
  ip_cidr_range = "10.8.0.0/28"
  network = data.google_compute_network.default.id 
  machine_type = "f1-micro"
  min_instances = 2
  max_instances = 3
}