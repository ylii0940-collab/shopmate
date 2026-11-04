// Synthetic, authored relevance judgements. Unlisted items in this 40-product closed pool have grade 0.
// 3 = directly satisfies use case; 2 = useful alternative; 1 = weak but relevant. Not independent human annotation.
export const EVAL_VERSION='shopmate-judgements-v2-catalog40';
export const EVAL_CASES=[
 {id:'q01',text:'100美元以内，适合坐飞机的降噪耳机',market:'US',slice:'出行耳机',grades:{p1:3,p9:3,p10:2,p13:3,p14:2,p17:3,p18:3,p22:2},note:'头戴与耳塞均相关；优先长途佩戴场景，保留多品牌选择。'},
 {id:'q02',text:'Headphones under $100 for travel',market:'US',slice:'英文 / 头戴',grades:{p1:3,p9:3,p13:3,p17:3,p18:3,p19:1},note:'明确headphones，耳塞不是本例目标类型。'},
 {id:'q03',text:'送朋友的礼物，预算50美元',market:'US',slice:'泛需求 / 送礼',grades:{p2:3,p4:2,p6:2,p7:3,p15:2,p16:3,p19:2,p21:2,p25:3,p27:3,p36:2,p39:3},note:'有gift标记的可售商品相关；偏好适合作为独立礼物的灯和音箱。'},
 {id:'q04',text:'想买便携相机，预算S$180',market:'SG',slice:'新加坡 / 相机',grades:{p3:3,p11:2,p29:3,p30:2},note:'两款均符合预算，优先成像规格更完整的口袋相机。'},
 {id:'q05',text:'防水便携音箱，预算50美元',market:'US',slice:'防水 / 音箱',grades:{p2:3,p16:3,p25:3},note:'只保留音箱；防水为硬约束。'},
 {id:'q06',text:'推荐50英镑以内的耳机',market:'UK',slice:'英国 / 预算',grades:{p6:2,p10:3,p19:2,p21:2},note:'按演示固定汇率计算；ANC耳塞可作为升级选择。'},
 {id:'q07',text:'Mau beli speaker, budget Rp1200000',market:'ID',slice:'印尼 / 音箱',grades:{p2:3,p12:2,p16:3,p25:3,p26:3,p27:2},note:'三款均在本地预算内，便携音箱为常规候选。'},
 {id:'q08',text:'旅行快充充电宝，预算60美元',market:'US',slice:'快充 / 数码',grades:{p5:3,p33:3,p34:3},note:'三款符合；比较便携与容量，标注不参考策略分数。'},
 {id:'q09',text:'Sonar headphones under $100',market:'US',slice:'品牌指定',grades:{p13:3,p17:3},note:'明确指定品牌；两款Sonar头戴均满足预算，其他品牌不可替代。'},
 {id:'q10',text:'Headphones under $20',market:'US',slice:'预算无解',grades:{},note:'目录没有符合预算的耳机，应明确无结果。'},
 {id:'q11',text:'防水包，预算50美元',market:'ID',slice:'市场不可达',grades:{},note:'防水包不支持ID市场，不能承诺可售。'},
 {id:'q12',text:'headphons under $100 for travel',market:'US',slice:'拼写归一',grades:{p1:3,p9:3,p13:3,p17:3,p18:3,p19:1},note:'拼写纠正后应与标准headphones查询一致。'}
];
