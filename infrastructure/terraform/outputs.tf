output "cluster_name" {
  description = "Nombre del clúster k3d"
  value       = var.cluster_name
}

output "argocd_url" {
  description = "URL de Argo CD"
  value       = "http://localhost:30080"
}

output "grafana_url" {
  description = "URL de Grafana"
  value       = "http://localhost:30030"
}

output "prometheus_url" {
  description = "URL de Prometheus"
  value       = "http://localhost:30090"
}

output "argo_rollouts_dashboard" {
  description = "URL del dashboard de Argo Rollouts"
  value       = "http://localhost:31000"
}

output "kubeconfig_command" {
  description = "Comando para configurar kubectl"
  value       = "k3d kubeconfig merge ${var.cluster_name} --kubeconfig-switch-context"
}