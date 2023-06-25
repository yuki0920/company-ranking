# frozen_string_literal: true

module ElementUtil
  def calculate_scale(element)
    return nil unless element.respond_to?(:text)

    sign = element.attr('sign') == '-' ? -1 : 1
    scale = element.attr('scale').to_i
    decimals = element.attr('decimals').to_i
    base_number = element.text.delete(',').to_f

    if scale
      sign * base_number * (10**scale)
    elsif decimals
      sign * base_number * (10**(-1 * decimals))
    else
      sign * base_number
    end
  end

  def adjust_salary(number)
    return if number.nil?
    return number / 1_000_000 if number > 5_000_000_000_000
    return number / 1_000 if number > 5_000_000_000

    number
  end
end
