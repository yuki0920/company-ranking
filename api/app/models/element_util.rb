# frozen_string_literal: true

module ElementUtil
  def calculate_scale(element)
    return nil unless element.respond_to?(:text)

    sign = element.attr('sign') == '-' ? -1 : 1
    scale = element.attr('scale').to_i
    base_number = element.text.delete(',').to_f
    sign * base_number * (10**scale)
  end
end
