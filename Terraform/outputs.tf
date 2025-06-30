output "resource_group_name" {
  value = azurerm_resource_group.voting_dapp_rg.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.voting_dapp_aks.name
}

output "kube_config" {
  value     = azurerm_kubernetes_cluster.voting_dapp_aks.kube_config_raw
  sensitive = true
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}
