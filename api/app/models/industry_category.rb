# frozen_string_literal: true

class IndustryCategory < ActiveHash::Base
  include ActiveHash::Associations
  has_many :industries

  self.data = [
    { id: 1, name: 'IT・通信系' },
    { id: 2, name: 'メーカー系(食料・繊維・医薬品)' },
    { id: 3, name: 'メーカー系(素材)' },
    { id: 4, name: 'メーカー系(鉄鋼・金属)' },
    { id: 5, name: 'メーカー系(電気・機械)' },
    { id: 6, name: '運輸・物流系' },
    { id: 7, name: '卸売・小売・サービス系' },
    { id: 8, name: '金融系' },
    { id: 9, name: '不動産・建設系' },
    { id: 10, name: 'その他' }
  ]
end
