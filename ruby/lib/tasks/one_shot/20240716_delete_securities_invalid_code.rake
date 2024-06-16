# frozen_string_literal: true

INVALID_CODES = %w[
  211
  206
  208
  205
  202
  196
  194
  197
  198
  195
  192
  190
  189
  186
  187
  184
  177
  176
  175
  173
  168
  160
  165
  166
  167
  156
  157
  153
  155
  146
  149
  151
  145
  147
  148
  150
  143
  142
  141
  137
  138
  135
  130
].freeze

namespace :delete_securities do
  task invalid_code: :environment do
    Security.where(code: INVALID_CODES).destroy_all
  end
end
