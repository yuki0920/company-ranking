module ApplicationHelper
  def divved_number(number, rank)
    number ? number / rank : nil
  end
end
