resource "google_workflows_workflow" "save_documents" {
  name            = "save-documents"
  source_contents = file("${path.module}/workflows/save_documents.yaml")
}
