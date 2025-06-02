# Create a resource group
resource "azurerm_resource_group" "voting_dapp_rg" {
  name     = var.resource_group_name
  location = var.location
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "voting_dapp_vnet" {
  name                = var.vnet_name
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  address_space       = var.vnet_address_space
}

# Create a subnet within the virtual network
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
    #vm_size    = "Standard_D2_v2"
    vm_size    = "Standard_B2s"

  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
  }
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name //must be globally unique
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  sku                 = "Premium"
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.voting_dapp_aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
