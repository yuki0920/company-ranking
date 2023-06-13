# frozen_string_literal: true

class SecurityList < ApplicationRecord
  validates :file_title, uniqueness: true, presence: true
  validates :downloaded_at, presence: true

  class << self
    def download
      agent = Mechanize.new
      page = agent.get('https://www.jpx.co.jp/markets/statistics-equities/misc/01.html')
      element = page.at('.component-file')
      title = element.at('th').inner_text
      src_path = element.at('a').get_attribute('href')
      return if same(title)

      agent.download(src_path, dest_path)
      create!(file_title: title, downloaded_at: Time.zone.now)
    end

    def same(title)
      SecurityList.find_by(file_title: title)
    end

    def dest_path
      Rails.root.join('lib/security_lists/data.xls').to_s
    end
  end
end
