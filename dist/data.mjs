import {CATALOG_EXTRA} from './catalog-extra.mjs';
export const MARKETS = {
  US:{name:'美国',en:'United States',flag:'🇺🇸',currency:'USD',symbol:'$',rate:1,locale:'en-US',region:'North America'},
  UK:{name:'英国',en:'United Kingdom',flag:'🇬🇧',currency:'GBP',symbol:'£',rate:.78,locale:'en-GB',region:'Europe'},
  SG:{name:'新加坡',en:'Singapore',flag:'🇸🇬',currency:'SGD',symbol:'S$',rate:1.34,locale:'en-SG',region:'Southeast Asia'},
  ID:{name:'印度尼西亚',en:'Indonesia',flag:'🇮🇩',currency:'IDR',symbol:'Rp',rate:15700,locale:'id-ID',region:'Southeast Asia'}
};
const BASE_PRODUCTS = [
 {id:'p1',name:'Aero ANC Headphones',zh:'Aero 主动降噪耳机',category:'audio',kind:'headphones',price:79,rating:4.7,stock:42,days:{US:2,UK:3,SG:4,ID:5},markets:['US','UK','SG','ID'],tags:['noise','travel','comfort','battery'],color:'#e3e7e9',description:'40h battery · Active noise cancellation',policy:'30-day returns · 12-month warranty'},
 {id:'p2',name:'Pulse Mini Speaker',zh:'Pulse 迷你蓝牙音箱',category:'audio',kind:'speaker',price:39,rating:4.5,stock:86,days:{US:2,UK:2,SG:3,ID:3},markets:['US','UK','SG','ID'],tags:['portable','waterproof','gift'],color:'#c5e8db',description:'IPX7 waterproof · 12h playtime',policy:'30-day returns · 12-month warranty'},
 {id:'p3',name:'Vista Pocket Camera',zh:'Vista 口袋相机',category:'camera',kind:'camera',price:129,rating:4.6,stock:12,days:{US:3,UK:4,SG:2,ID:4},markets:['US','UK','SG','ID'],tags:['travel','video','portable','gift'],color:'#d7cdbd',description:'4K capture · Pocket-sized design',policy:'30-day returns · 12-month warranty'},
 {id:'p4',name:'Flow Everyday Tote',zh:'Flow 日常托特包',category:'bag',kind:'bag',price:29,rating:4.8,stock:103,days:{US:2,UK:3,SG:2,ID:2},markets:['US','UK','SG','ID'],tags:['travel','portable','gift'],color:'#e5d9c4',description:'Recycled canvas · 16L everyday carry',policy:'30-day returns · 6-month warranty'},
 {id:'p5',name:'Volt 20K Power Bank',zh:'Volt 20K 移动电源',category:'charger',kind:'charger',price:49,rating:4.6,stock:28,days:{US:2,UK:3,SG:2,ID:3},markets:['US','UK','SG','ID'],tags:['battery','travel','portable','fast'],color:'#b3bccb',description:'20,000mAh · 30W USB-C fast charging',policy:'30-day returns · 12-month warranty'},
 {id:'p6',name:'Aero Lite Earbuds',zh:'Aero Lite 真无线耳机',category:'audio',kind:'earbuds',price:45,rating:4.4,stock:65,days:{US:1,UK:2,SG:2,ID:2},markets:['US','UK','SG','ID'],tags:['portable','comfort','battery','gift'],color:'#edd1c3',description:'24h with case · Lightweight comfort',policy:'30-day returns · 12-month warranty'},
 {id:'p7',name:'Luma Desk Light',zh:'Luma 桌面氛围灯',category:'home',kind:'lamp',price:35,rating:4.5,stock:7,days:{US:3,UK:3,SG:2,ID:3},markets:['US','UK','SG','ID'],tags:['gift','comfort','light'],color:'#ced6ee',description:'Warm-to-cool light · Touch controls',policy:'30-day returns · 12-month warranty'},
 {id:'p8',name:'Aero Studio Pro',zh:'Aero Studio Pro 耳机',category:'audio',kind:'headphones',price:159,rating:4.9,stock:0,days:{US:3,UK:3,SG:4,ID:5},markets:['US','UK','SG','ID'],tags:['noise','comfort','battery'],color:'#4c5158',description:'Studio-grade sound · Adaptive ANC',policy:'30-day returns · 24-month warranty'}
];

const EXTRA_PRODUCTS = [
 {id:'p9',name:'Aero Travel Headphones',zh:'Aero Travel 旅行耳机',category:'audio',kind:'headphones',price:99,rating:4.6,stock:24,days:{US:2,UK:2,SG:3,ID:4},markets:['US','UK','SG','ID'],tags:['noise','travel','battery','comfort'],color:'#9cafa9',description:'48h battery · Foldable ANC design',policy:'30-day returns · 12-month warranty'},
 {id:'p10',name:'Aero ANC Buds',zh:'Aero ANC 降噪耳塞',category:'audio',kind:'earbuds',price:59,rating:4.5,stock:38,days:{US:1,UK:2,SG:2,ID:3},markets:['US','UK','SG','ID'],tags:['noise','travel','battery','portable'],color:'#c6b8d2',description:'30h with case · Active noise cancellation',policy:'30-day returns · 12-month warranty'},
 {id:'p11',name:'Vista Clip Camera',zh:'Vista Clip 随身相机',category:'camera',kind:'camera',price:89,rating:4.3,stock:18,days:{US:3,UK:3,SG:2,ID:3},markets:['US','UK','SG','ID'],tags:['video','portable','gift'],color:'#d5b7a8',description:'1080p video · 85g clip-on camera',policy:'30-day returns · 12-month warranty'},
 {id:'p12',name:'Pulse Home Speaker',zh:'Pulse Home 家用音箱',category:'audio',kind:'speaker',price:69,rating:4.7,stock:20,days:{US:2,UK:3,SG:3,ID:4},markets:['US','UK','SG','ID'],tags:['gift','battery'],color:'#b4b9c5',description:'20h battery · Rich room-filling sound',policy:'30-day returns · 12-month warranty'},
 {id:'p13',name:'Sonar Air Headphones',zh:'Sonar Air 轻量降噪耳机',category:'audio',kind:'headphones',price:85,rating:4.6,stock:25,days:{US:3,UK:3,SG:3,ID:4},markets:['US','UK','SG','ID'],tags:['noise','travel','portable','battery'],color:'#b6c7d8',description:'36h battery · Lightweight ANC',policy:'30-day returns · 12-month warranty'},
 {id:'p14',name:'Melo Travel Buds',zh:'Melo 旅行降噪耳塞',category:'audio',kind:'earbuds',price:69,rating:4.3,stock:56,days:{US:2,UK:2,SG:2,ID:3},markets:['US','UK','SG','ID'],tags:['noise','travel','portable','battery'],color:'#e1c4b1',description:'28h with case · Travel ANC buds',policy:'30-day returns · 12-month warranty'},
 {id:'p15',name:'Orbit Carry Bag',zh:'Orbit 便携出行包',category:'bag',kind:'bag',price:39,rating:4.5,stock:32,days:{US:3,UK:3,SG:2,ID:3},markets:['US','UK','SG'],tags:['travel','portable','gift','waterproof'],color:'#a7b8a1',description:'12L carry · Water-resistant shell',policy:'30-day returns · 6-month warranty'},
 {id:'p16',name:'Trail Mini Speaker',zh:'Trail 便携防水音箱',category:'audio',kind:'speaker',price:45,rating:4.6,stock:38,days:{US:2,UK:2,SG:3,ID:3},markets:['US','UK','SG','ID'],tags:['portable','waterproof','gift','travel'],color:'#d3be85',description:'IPX7 waterproof · 15h playtime',policy:'30-day returns · 12-month warranty'}
];
const SPECS={p1:{battery:40,weight:245},p2:{battery:12,weight:310},p3:{battery:2,weight:180},p4:{weight:360},p5:{weight:340,capacity:20000},p6:{battery:24,weight:48},p7:{weight:520},p8:{battery:60,weight:285},p9:{battery:48,weight:225},p10:{battery:30,weight:55},p11:{battery:1.5,weight:85},p12:{battery:20,weight:620},p13:{battery:36,weight:190},p14:{battery:28,weight:50},p15:{weight:290},p16:{battery:15,weight:280}};
const EXPANDED_PRODUCTS=[
  {
    "id": "p17",
    "name": "Sonar Quiet Headphones",
    "zh": "Sonar 静享降噪耳机",
    "category": "audio",
    "kind": "headphones",
    "price": 65,
    "rating": 4.4,
    "stock": 18,
    "days": {
      "US": 4,
      "UK": 6,
      "SG": 1,
      "ID": 3
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "noise",
      "travel",
      "comfort",
      "battery"
    ],
    "color": "#e1c4b1",
    "description": "32h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 220,
      "battery": 32
    }
  },
  {
    "id": "p18",
    "name": "Melo Flight Headphones",
    "zh": "Melo 飞行降噪耳机",
    "category": "audio",
    "kind": "headphones",
    "price": 95,
    "rating": 4.8,
    "stock": 4,
    "days": {
      "US": 5,
      "UK": 7,
      "SG": 2,
      "ID": 4
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "noise",
      "travel",
      "comfort",
      "battery"
    ],
    "color": "#a7b8a1",
    "description": "50h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 260,
      "battery": 50
    }
  },
  {
    "id": "p19",
    "name": "Aero Essential Headphones",
    "zh": "Aero 基础头戴耳机",
    "category": "audio",
    "kind": "headphones",
    "price": 35,
    "rating": 4.2,
    "stock": 70,
    "days": {
      "US": 6,
      "UK": 1,
      "SG": 3,
      "ID": 5
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "comfort",
      "battery",
      "gift"
    ],
    "color": "#ced6ee",
    "description": "25h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 210,
      "battery": 25
    }
  },
  {
    "id": "p20",
    "name": "Sonar Studio Headphones",
    "zh": "Sonar 录音室耳机",
    "category": "audio",
    "kind": "headphones",
    "price": 129,
    "rating": 4.9,
    "stock": 15,
    "days": {
      "US": 7,
      "UK": 2,
      "SG": 4,
      "ID": 6
    },
    "markets": [
      "US",
      "UK",
      "SG"
    ],
    "tags": [
      "noise",
      "comfort",
      "battery"
    ],
    "color": "#b6c7d8",
    "description": "55h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 300,
      "battery": 55
    }
  },
  {
    "id": "p21",
    "name": "Melo Pocket Buds",
    "zh": "Melo 口袋耳塞",
    "category": "audio",
    "kind": "earbuds",
    "price": 29,
    "rating": 4.1,
    "stock": 60,
    "days": {
      "US": 1,
      "UK": 3,
      "SG": 5,
      "ID": 7
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "portable",
      "battery",
      "gift"
    ],
    "color": "#e1c4b1",
    "description": "18h with case · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 42,
      "battery": 18
    }
  },
  {
    "id": "p22",
    "name": "Sonar ANC Buds",
    "zh": "Sonar 降噪耳塞",
    "category": "audio",
    "kind": "earbuds",
    "price": 49,
    "rating": 4.3,
    "stock": 22,
    "days": {
      "US": 2,
      "UK": 4,
      "SG": 6,
      "ID": 1
    },
    "markets": [
      "US",
      "SG",
      "ID"
    ],
    "tags": [
      "noise",
      "travel",
      "portable",
      "battery"
    ],
    "color": "#a7b8a1",
    "description": "26h with case · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 48,
      "battery": 26
    }
  },
  {
    "id": "p23",
    "name": "Aero Premium Buds",
    "zh": "Aero 旗舰耳塞",
    "category": "audio",
    "kind": "earbuds",
    "price": 119,
    "rating": 4.8,
    "stock": 8,
    "days": {
      "US": 3,
      "UK": 5,
      "SG": 7,
      "ID": 2
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "noise",
      "comfort",
      "portable",
      "battery"
    ],
    "color": "#ced6ee",
    "description": "36h with case · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 58,
      "battery": 36
    }
  },
  {
    "id": "p24",
    "name": "Melo Sport Buds",
    "zh": "Melo 运动耳塞",
    "category": "audio",
    "kind": "earbuds",
    "price": 55,
    "rating": 4.5,
    "stock": 0,
    "days": {
      "US": 4,
      "UK": 6,
      "SG": 1,
      "ID": 3
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "waterproof",
      "portable",
      "battery"
    ],
    "color": "#b6c7d8",
    "description": "24h with case · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 45,
      "battery": 24
    }
  },
  {
    "id": "p25",
    "name": "Trail Nano Speaker",
    "zh": "Trail 迷你随行音箱",
    "category": "audio",
    "kind": "speaker",
    "price": 25,
    "rating": 4.2,
    "stock": 50,
    "days": {
      "US": 5,
      "UK": 7,
      "SG": 2,
      "ID": 4
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "waterproof",
      "portable",
      "gift",
      "travel"
    ],
    "color": "#e1c4b1",
    "description": "8h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 190,
      "battery": 8
    }
  },
  {
    "id": "p26",
    "name": "Pulse Outdoor Speaker",
    "zh": "Pulse 户外音箱",
    "category": "audio",
    "kind": "speaker",
    "price": 59,
    "rating": 4.7,
    "stock": 16,
    "days": {
      "US": 6,
      "UK": 1,
      "SG": 3,
      "ID": 5
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "waterproof",
      "portable",
      "battery",
      "travel"
    ],
    "color": "#a7b8a1",
    "description": "24h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 450,
      "battery": 24
    }
  },
  {
    "id": "p27",
    "name": "Sonar Desk Speaker",
    "zh": "Sonar 桌面音箱",
    "category": "audio",
    "kind": "speaker",
    "price": 49,
    "rating": 4.6,
    "stock": 35,
    "days": {
      "US": 7,
      "UK": 2,
      "SG": 4,
      "ID": 6
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "gift",
      "battery"
    ],
    "color": "#ced6ee",
    "description": "18h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 680,
      "battery": 18
    }
  },
  {
    "id": "p28",
    "name": "Trail Party Speaker",
    "zh": "Trail 聚会音箱",
    "category": "audio",
    "kind": "speaker",
    "price": 89,
    "rating": 4.8,
    "stock": 6,
    "days": {
      "US": 1,
      "UK": 3,
      "SG": 5,
      "ID": 7
    },
    "markets": [
      "US",
      "UK",
      "SG"
    ],
    "tags": [
      "waterproof",
      "battery",
      "gift"
    ],
    "color": "#b6c7d8",
    "description": "30h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 1200,
      "battery": 30
    }
  },
  {
    "id": "p29",
    "name": "Vista Go Camera",
    "zh": "Vista 轻旅行相机",
    "category": "camera",
    "kind": "camera",
    "price": 109,
    "rating": 4.4,
    "stock": 20,
    "days": {
      "US": 2,
      "UK": 4,
      "SG": 6,
      "ID": 1
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "travel",
      "video",
      "portable",
      "gift"
    ],
    "color": "#e1c4b1",
    "description": "2h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 150,
      "battery": 2
    }
  },
  {
    "id": "p30",
    "name": "Orbit Mini Camera",
    "zh": "Orbit 迷你相机",
    "category": "camera",
    "kind": "camera",
    "price": 79,
    "rating": 4.1,
    "stock": 30,
    "days": {
      "US": 3,
      "UK": 5,
      "SG": 7,
      "ID": 2
    },
    "markets": [
      "US",
      "SG",
      "ID"
    ],
    "tags": [
      "video",
      "portable",
      "gift"
    ],
    "color": "#a7b8a1",
    "description": "1.5h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 95,
      "battery": 1.5
    }
  },
  {
    "id": "p31",
    "name": "Vista Action Camera",
    "zh": "Vista 运动相机",
    "category": "camera",
    "kind": "camera",
    "price": 149,
    "rating": 4.7,
    "stock": 10,
    "days": {
      "US": 4,
      "UK": 6,
      "SG": 1,
      "ID": 3
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "waterproof",
      "travel",
      "video",
      "portable"
    ],
    "color": "#ced6ee",
    "description": "2.5h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 160,
      "battery": 2.5
    }
  },
  {
    "id": "p32",
    "name": "Orbit Pro Camera",
    "zh": "Orbit 专业便携相机",
    "category": "camera",
    "kind": "camera",
    "price": 199,
    "rating": 4.8,
    "stock": 0,
    "days": {
      "US": 5,
      "UK": 7,
      "SG": 2,
      "ID": 4
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "travel",
      "video",
      "portable"
    ],
    "color": "#b6c7d8",
    "description": "3h battery · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 240,
      "battery": 3
    }
  },
  {
    "id": "p33",
    "name": "Volt Slim Power Bank",
    "zh": "Volt 轻薄移动电源",
    "category": "charger",
    "kind": "charger",
    "price": 29,
    "rating": 4.3,
    "stock": 55,
    "days": {
      "US": 6,
      "UK": 1,
      "SG": 3,
      "ID": 5
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "battery",
      "travel",
      "portable",
      "fast"
    ],
    "color": "#e1c4b1",
    "description": "180g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 180,
      "capacity": 10000
    }
  },
  {
    "id": "p34",
    "name": "Pulse Travel Power Bank",
    "zh": "Pulse 旅行移动电源",
    "category": "charger",
    "kind": "charger",
    "price": 39,
    "rating": 4.5,
    "stock": 14,
    "days": {
      "US": 7,
      "UK": 2,
      "SG": 4,
      "ID": 6
    },
    "markets": [
      "US",
      "SG",
      "ID"
    ],
    "tags": [
      "battery",
      "travel",
      "portable",
      "fast"
    ],
    "color": "#a7b8a1",
    "description": "240g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 240,
      "capacity": 15000
    }
  },
  {
    "id": "p35",
    "name": "Volt Pro Power Bank",
    "zh": "Volt 大容量移动电源",
    "category": "charger",
    "kind": "charger",
    "price": 79,
    "rating": 4.8,
    "stock": 9,
    "days": {
      "US": 1,
      "UK": 3,
      "SG": 5,
      "ID": 7
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "battery",
      "fast"
    ],
    "color": "#ced6ee",
    "description": "520g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 520,
      "capacity": 30000
    }
  },
  {
    "id": "p36",
    "name": "Flow Compact Bag",
    "zh": "Flow 轻便出行包",
    "category": "bag",
    "kind": "bag",
    "price": 19,
    "rating": 4.3,
    "stock": 80,
    "days": {
      "US": 2,
      "UK": 4,
      "SG": 6,
      "ID": 1
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "travel",
      "portable",
      "gift"
    ],
    "color": "#b6c7d8",
    "description": "220g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 220
    }
  },
  {
    "id": "p37",
    "name": "Orbit Rain Bag",
    "zh": "Orbit 防雨旅行包",
    "category": "bag",
    "kind": "bag",
    "price": 49,
    "rating": 4.7,
    "stock": 12,
    "days": {
      "US": 3,
      "UK": 5,
      "SG": 7,
      "ID": 2
    },
    "markets": [
      "US",
      "UK",
      "SG"
    ],
    "tags": [
      "travel",
      "portable",
      "waterproof"
    ],
    "color": "#e1c4b1",
    "description": "410g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 410
    }
  },
  {
    "id": "p38",
    "name": "Flow Weekender Bag",
    "zh": "Flow 周末旅行包",
    "category": "bag",
    "kind": "bag",
    "price": 59,
    "rating": 4.6,
    "stock": 25,
    "days": {
      "US": 4,
      "UK": 6,
      "SG": 1,
      "ID": 3
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "travel",
      "gift"
    ],
    "color": "#a7b8a1",
    "description": "650g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 650
    }
  },
  {
    "id": "p39",
    "name": "Luma Mini Light",
    "zh": "Luma 迷你桌灯",
    "category": "home",
    "kind": "lamp",
    "price": 25,
    "rating": 4.3,
    "stock": 40,
    "days": {
      "US": 5,
      "UK": 7,
      "SG": 2,
      "ID": 4
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "gift",
      "comfort",
      "light",
      "portable"
    ],
    "color": "#ced6ee",
    "description": "300g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 300
    }
  },
  {
    "id": "p40",
    "name": "Luma Reading Light",
    "zh": "Luma 阅读桌灯",
    "category": "home",
    "kind": "lamp",
    "price": 55,
    "rating": 4.8,
    "stock": 5,
    "days": {
      "US": 6,
      "UK": 1,
      "SG": 3,
      "ID": 5
    },
    "markets": [
      "US",
      "UK",
      "SG",
      "ID"
    ],
    "tags": [
      "comfort",
      "light"
    ],
    "color": "#b6c7d8",
    "description": "700g · Synthetic demo product",
    "policy": "30-day returns · 12-month warranty",
    "specs": {
      "weight": 700
    }
  }
];
export const PRODUCTS=[...BASE_PRODUCTS,...EXTRA_PRODUCTS,...EXPANDED_PRODUCTS,...CATALOG_EXTRA].map(p=>({...p,brand:p.name.split(' ')[0],specs:p.specs||SPECS[p.id],variants:['bag','camera'].includes(p.kind)?[{id:p.id+'-sand',name:'Sand',zh:'沙色',color:'#cdbb9e'},{id:p.id+'-black',name:'Black',zh:'黑色',color:'#31363c'}]:[{id:p.id+'-black',name:'Black',zh:'黑色',color:'#31363c'},{id:p.id+'-silver',name:'Silver',zh:'银色',color:'#b8bdc3'}]}));
export const EXAMPLES=[
 {zh:'100 美元以内，适合坐飞机的降噪耳机',en:'Noise cancelling headphones under $100 for a flight',market:'US'},
 {zh:'送朋友的礼物，预算 50 美元',en:'A gift for a friend, budget $50',market:'US'},
 {zh:'想买便携相机，预算 S$180',en:'A portable camera, budget S$180',market:'SG'},
 {zh:'旅行快充充电宝，预算60美元',en:'Portable fast charging power bank under $60 for travel',market:'US'},
 {zh:'防水出行包，预算50美元',en:'Waterproof travel bag under $50',market:'US'},
 {zh:'便携桌灯，预算40美元',en:'Portable lamp under $40',market:'US'},
 {zh:'Mau beli speaker, budget Rp1200000',en:'Mau beli speaker, budget Rp1200000',market:'ID'}
];
