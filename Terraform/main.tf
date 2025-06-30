resource "azurerm_resource_group" "voting_dapp_rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_virtual_network" "voting_dapp_vnet" {
  name                = var.vnet_name
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  address_space       = var.vnet_address_space
}

resource "azurerm_subnet" "voting_dapp_subnet" {
  name                 = var.subnet_name
  resource_group_name  = azurerm_resource_group.voting_dapp_rg.name
  virtual_network_name = azurerm_virtual_network.voting_dapp_vnet.name
  address_prefixes     = var.subnet_address_prefix
}

resource "azurerm_kubernetes_cluster" "voting_dapp_aks" {
  name                = "voting-dapp-aks"
  location            = azurerm_resource_group.voting_dapp_rg.location
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  dns_prefix          = "votingdapp"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_B2s"
    vnet_subnet_id = azurerm_subnet.voting_dapp_subnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "azure"

     service_cidr       = "10.2.0.0/16"       # Changed to avoid overlap with subnet 10.0.1.0/24
    dns_service_ip     = "10.2.0.10"         # Inside service CIDR, valid IP
    docker_bridge_cidr = "172.17.0.1/16"     # Default Docker bridge CIDR
  }

  tags = {
    Environment = "Production"
  }
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  sku                 = "Premium"
  admin_enabled       = false
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.voting_dapp_aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                           = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
