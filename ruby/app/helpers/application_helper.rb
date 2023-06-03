# frozen_string_literal: true

module ApplicationHelper
  def divved_number(number, rank)
    number ? number / rank : nil
  end

  def format_ratio(number)
    return nil if number.nil? || number > 1

    (number * 100).round(1)
  end
end
