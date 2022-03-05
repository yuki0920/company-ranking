# frozen_string_literal: true

namespace :destroy_old_documents do
  desc '古いDocumentを削除する'

  task execute: :environment do
    Document.group(:security_code).count.each do |code, count|
      next unless count > 1

      old_document = Document.where(security_code: code).order(:id).first
      puts "Deleting id: #{old_document.id} security_code: #{old_document.security_code} name: #{old_document.filer_name}"
      old_document.destroy!
    end
  end
end
