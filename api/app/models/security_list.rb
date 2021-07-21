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

      return if latest_security_list && latest_security_list.file_title == title

      agent.download(src_path, dest_path)
      create!(file_title: title, downloaded_at: Time.now)
    end

    def latest_security_list
      SecurityList.order(downloaded_at: :desc).last
    end

    def dest_path
      Rails.root.join('lib/security_lists/data.xls').to_s
    end
  end
end
