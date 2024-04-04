{{- define "chart.labels" -}}
chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
{{- end -}}

{{- define "backend.name" -}}
{{- printf "%s-backend" .Chart.Name -}}
{{- end -}}

{{- define "backend.port" -}}
{{- 8080 -}}
{{- end -}}

{{- define "frontend.name" -}}
{{- printf "%s-frontend" .Chart.Name -}}
{{- end -}} 

{{- define "frontend.port" -}}
{{- 80 -}}
{{- end -}}

{{- define "postgres.name" -}}
{{- printf "%s-postgres" .Chart.Name -}}
{{- end -}}

{{- define "postgres.port" -}}
{{- 5432 -}}
{{- end -}}

{{- define "postgres.database" -}}
{{- printf "idata" -}}
{{- end -}}

{{- define "minio.name" -}}
{{ printf "%s-minio" .Chart.Name }}
{{- end -}}

{{- define "minio.port.api" -}}
{{- 9000 -}}
{{- end -}}

{{- define "minio.port.ui" -}}
{{- 9001 -}}
{{- end -}}
