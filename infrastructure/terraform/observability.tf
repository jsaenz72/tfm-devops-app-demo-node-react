# Prometheus
resource "helm_release" "prometheus" {
  depends_on = [kubernetes_namespace.observability]

  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  version    = "55.5.0"
  namespace  = "observability"

  values = [
    <<-EOT
    prometheus:
      prometheusSpec:
        retention: 7d
        storageSpec:
          volumeClaimTemplate:
            spec:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
      
      service:
        type: NodePort
        nodePort: 30090
    
    grafana:
      enabled: true
      adminPassword: "admin"
      service:
        type: NodePort
        nodePort: 30030
      
      datasources:
        datasources.yaml:
          apiVersion: 1
          datasources:
            - name: Prometheus
              type: prometheus
              url: http://prometheus-kube-prometheus-prometheus:9090
              isDefault: true
            - name: Loki
              type: loki
              url: http://loki:3100
    
    alertmanager:
      enabled: true
    EOT
  ]

  timeout = 600
}

# Loki (logs)
resource "helm_release" "loki" {
  depends_on = [kubernetes_namespace.observability]

  name       = "loki"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "loki-stack"
  version    = "2.9.11"
  namespace  = "observability"

  values = [
    <<-EOT
    loki:
      enabled: true
      persistence:
        enabled: true
        size: 10Gi
    
    promtail:
      enabled: true
    
    grafana:
      enabled: false
    EOT
  ]
}

# OpenTelemetry Collector
resource "helm_release" "opentelemetry" {
  depends_on = [kubernetes_namespace.observability]

  name       = "opentelemetry-collector"
  repository = "https://open-telemetry.github.io/opentelemetry-helm-charts"
  chart      = "opentelemetry-collector"
  version    = "0.73.0"
  namespace  = "observability"

  values = [
    <<-EOT
    mode: deployment
    
    config:
      receivers:
        otlp:
          protocols:
            grpc:
              endpoint: 0.0.0.0:4317
            http:
              endpoint: 0.0.0.0:4318
      
      processors:
        batch: {}
      
      exporters:
        prometheus:
          endpoint: "0.0.0.0:8889"
        logging:
          loglevel: debug
      
      service:
        pipelines:
          traces:
            receivers: [otlp]
            processors: [batch]
            exporters: [logging]
          metrics:
            receivers: [otlp]
            processors: [batch]
            exporters: [prometheus]
    EOT
  ]
}