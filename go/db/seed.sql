--- markets
INSERT INTO markets (name, created_at, updated_at) VALUES ('プライム', current_timestamp, current_timestamp);
INSERT INTO markets (name, created_at, updated_at) VALUES ('スタンダード', current_timestamp, current_timestamp);
INSERT INTO markets (name, created_at, updated_at) VALUES ('グロース', current_timestamp, current_timestamp);

--- industry_categories
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (1, 'IT・通信系', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (2, 'メーカー系(食料・繊維・医薬品)', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (3, 'メーカー系(素材)', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (4, 'メーカー系(鉄鋼・金属)', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (5, 'メーカー系(電気・機械)', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (6, '運輸・物流系', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (7, '卸売・小売・サービス系', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (8, '金融系', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (9, '不動産・建設系', current_timestamp, current_timestamp);
INSERT INTO industry_categories (id, name, created_at, updated_at) VALUES (10, 'その他', current_timestamp, current_timestamp);

--- industries
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('水産・農林業', 50, 10, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('鉱業', 1050, 10, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('建設業', 2050, 9, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('食料品', 3050, 2, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('繊維製品', 3100, 2, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('パルプ・紙', 3150, 2, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('化学', 3200, 2, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('医薬品', 3250, 2, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('石油・石炭製品', 3300, 3, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('ゴム製品', 3350, 3, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('ガラス・土石製品', 3400, 3, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('鉄鋼', 3450, 4, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('非鉄金属', 3500, 4, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('金属製品', 3550, 4, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('機械', 3600, 5, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('電気機器', 3650, 5, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('輸送用機器', 3700, 5, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('精密機器', 3750, 5, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('その他製品', 3800, 5, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('電気・ガス業', 4050, 10, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('陸運業', 5050, 6, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('海運業', 5100, 6, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('空運業', 5150, 6, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('倉庫・運輸関連業', 5200, 6, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('情報・通信業', 5250, 1, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('卸売業', 6050, 7, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('小売業', 6100, 7, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('銀行業', 7050, 8, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('証券、商品先物取引業', 7100, 8, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('保険業', 7150, 8, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('その他金融業', 7200, 8, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('不動産業', 8050, 9, current_timestamp, current_timestamp);
INSERT INTO industries (name, code, industry_category_id, created_at, updated_at) VALUES ('サービス業', 9050, 7, current_timestamp, current_timestamp);
