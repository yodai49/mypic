////////////////////
/* 　フィールド関連  */
////////////////////
const walkCol = [ //歩ける色のリスト 全フィールド共通
    [0,0,0]
]
const homposx=120,homposy=160,homposworld=0;
const fieldbackdata=[ //フィールドの背景の長方形データをすべて格納（主に歩ける部分）
    [["fieldbackobj0"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],
    [["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],
    [["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj2"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],
    [["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],[["fieldbackobj4"]],
    [["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]],[["fieldbackobj5"]]
]
const fielddata=[ //フィールドの画像データが全て格納されている
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド0~9
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド10~19
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド20~29
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド30~39
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],//フィールド40~49
]
const fieldenemy=[ //フィールドごとに出会うモンスターのタイプセット番号
    0,0,0,0,0,0,0,0,0,0, //0
    1,1,1,1,2,2,2,3,2,0, //10
    4,4,5,4,5,6,5,5,0,0, //20
    7,7,7,8,8,9,8,0,0,0, //30
    10,10,11,11,12,11,11,0,0,0 //40
]
const fieldenemyDataSet=[ //出会う敵の確率 [Num,odds]の形で格納 oddsの総和はなんでもよい
    [], //敵が出ないゾーン
    [[9,6],[10,5],[11,3],[12,3],[13,1],[14,1],[15,1]],//森１　手前(20)
    [[9,2],[10,2],[11,3],[12,3],[13,3],[14,3],[15,3],[16,1]],//森２　奥(20)
    [[11,5],[12,5],[13,25],[14,25],[15,25],[16,10],[17,5],[18,4]],//森３　崖レアゾーン(99)
    [[19,6],[20,5],[21,3],[22,3],[23,1],[24,1],[25,1]],//洞窟１　手前(20)
    [[19,2],[20,2],[21,3],[22,3],[23,3],[24,3],[25,3],[26,1]],//洞窟２(20)　奥 _//////////////    5
    [[21,5],[22,5],[23,25],[24,25],[25,25],[26,10],[27,5],[28,4]],//洞窟３　レアゾーン
    [[29,6],[30,5],[31,3],[32,3],[33,1],[34,1],[35,1]],//都市１　手前
    [[29,2],[30,2],[31,3],[32,3],[33,3],[34,3],[35,3],[36,1]],//都市２　奥
    [[31,5],[32,5],[33,25],[34,25],[35,25],[36,10],[37,5],[38,4]],//都市３　レアゾーン
    [[49,6],[40,5],[41,3],[42,3],[43,1],[44,1],[45,1]],//砂漠１　手前               _//////////////    10
    [[29,2],[30,2],[31,3],[32,3],[33,3],[34,3],[35,3],[36,1]],//砂漠２　奥
    [[41,5],[42,5],[43,25],[44,25],[45,25],[46,10],[47,5],[48,4]],//砂漠３　レアゾーン
]
const fieldwarpobj=[
    [[693,461,64,14,1,716,109]],//フィールドのワープ場所のデータ　[x,y,width,height,jmpWorld,jmpx,jmpy]
    [[691,86,67,12,0,693,396],[0,0,20,540,2,910,270],[945,0,15,540,4,40,270]],
    [[945,0,15,540,1,40,270],[221,0,300,15,3,480,480],[0,0,20,540,10,900,270]],
    [[0,525,960,15,2,360,40]],
    [[0,0,20,540,1,900,270],[0,0,960,15,40,480,480],[945,0,15,540,30,40,270]],
    [],[],[],[],[],//0-9
    [[0,0,880,15,11,480,480],[945,0,15,540,2,40,270],[400,473,169,15,20,480,70]],
    [[0,525,770,15,10,400,40],[945,0,15,540,12,40,270]],[[0,0,15,540,11,900,270],[0,0,960,15,13,480,480],[945,0,15,540,14,40,270]],//-12
    [[0,525,596,15,12,450,40],[663,525,300,15,14,116,40]],[[0,0,15,540,12,900,270],[47,0,160,15,13,892,474],[0,525,960,15,15,450,40],[945,0,15,540,16,40,270]],//-14
    [[0,0,540,15,14,450,480],[945,0,15,540,25,40,270]],[[0,0,15,540,14,892,270],[0,0,960,15,18,450,474],[915,0,15,540,17,40,270]], //-16
    [[33,0,15,540,16,862,350]],[[0,525,960,15,16,345,40]],[],  //-19
    [[364,0,230,58,10,480,480],[0,525,960,15,21,450,40],[945,0,15,540,23,40,100]],[[0,0,960,15,20,450,480],[0,525,960,15,22,300,40],[925,0,15,540,23,40,350]],//-21
    [[0,0,444,15,21,300,480],[0,495,444,15,25,594,94],[460,0,500,15,24,108,458],[945,0,15,540,26,40,270]],[[0,0,15,230,20,892,270],[0,240,15,330,21,892,150],[935,0,15,540,24,40,270]], //-23
    [[0,0,15,540,23,892,270],[0,525,461,15,22,600,40],[681,413,86,30,26,700,186]],[[0,0,15,540,15,900,270],[565,60,103,15,22,200,474]],//-25
    [[688,138,65,15,24,709,353],[0,0,15,540,22,900,270],[260,512,200,15,27,450,40]],[[0,0,960,15,26,329,462]], //-27
    [],[], //-29
    [[0,0,30,540,4,900,270],[0,0,960,15,31,470,480]],[[0,525,960,15,30,501,53],[0,0,960,15,32,470,480]], //-31
    [[0,525,960,15,31,470,40],[0,0,30,540,35,900,160],[945,0,15,540,36,40,163],[473,85,104,23,33,470,480]], //-32
    [[319,506,400,34,32,506,112],[0,0,960,15,34,470,462],[0,525,305,15,35,653,131]],[[0,525,960,15,33,475,38]], //-34
    [[628,93,100,15,33,130,462],[945,0,15,311,32,69,170]],[[0,0,15,540,32,900,145],[0,525,960,15,45,600,40]],[],[],[],
    [[0,525,960,15,4,470,40],[0,0,960,15,41,460,462]],[[0,0,15,540,44,900,200],[945,0,15,540,42,40,270],[0,0,960,15,42,460,462],[0,525,960,15,40,181,40]],
    [[0,0,15,540,41,900,200],[945,0,15,540,43,40,270],[0,0,960,15,44,460,462],[0,525,960,15,41,181,40]], //-42
    [[0,0,15,540,42,900,200],[945,0,15,540,44,40,270],[0,0,960,15,46,460,462],[0,525,960,15,40,181,40]],//43
    [[0,0,15,540,43,900,200],[945,0,15,540,41,40,270],[0,0,960,15,45,460,462],[0,525,960,15,42,231,40]],//44
    [[0,525,960,15,44,460,40],[0,0,960,15,36,832,473]],[[0,525,960,15,43,460,40]],[],[],[]
]
const eventobj=[    //x,y,width,height,eventnum,...（下部参照）
    [[12,107,90,102,6,2,-1],[675,448,110,24,4,41,2],[625,390,710,443,6,1,-1,0],[339,186,70,90,2],[378,148,126,10,1]],[[282,252,107,116,3,0]],
    [[221,18,300,15,4,45,3]],[[477,322,82,25,6,16,50]],[[199,338,93,26,3,1],[594,199,94,66,3,2],[215,18,490,16,4,44,3],[891,122,35,316,4,43,0]],[],[],[],[],[],
    [[381,453,209,30,4,42,2]],[],[],[],[],[[906,57,35,300,4,42,0],[322,364,95,15,3,3]],[[874,251,33,200,4,42,0]],[],[[278,226,60,15,6,5,42]],[],//10-19
    [],[],[],[],[[670,112,58,20,3,4]],[],[],[[453,329,62,15,6,8,43]],[],[],//20
    [],[[434,76,67,13,3,4]],[],[[688,86,67,15,3,5]],[[456,185,62,16,6,10,44]],[],[[638,487,320,30,4,44,2],[249,154,64,15,3,6],[568,154,66,15,3,7],[513,362,93,20,3,8]],[],[],[],//30
    [],[],[],[],[],[[455,341,160,18,3,9]],[[448,188,67,15,6,13,45]],[],[],[],//40
    [],[],[],[],[],[],[],[],[],[]//50
]
//eventnum- - - 1 マイピク整理       x,y,width,height,1
//              2 マイピク生み出す    x,y,width,height,2
//              3　お店　           x,y,width,height,3,shopNum
//              4 動けない          x,y,width,height,4,動けるためのアイテム,はじき出される方向（左右上下の順）
//              5　欠番（ボス戦はメッセージに統合）
//              6 メッセージ        x,w,width,height,6,eventMsgの番号,イベント回避のためのアイテム、イベントナンバー指定？、次のイベントナンバー？

const itemobj=[//アイテムの場所のデータ　[x,y,width,height,itemnum,stock(通常は1を指定)]
    [[150,150,30,30,0,1],[21,281,30,30,2,1],[252,154,30,30,1,1],[280,154,30,30,8,1],[525,114,30,30,5,1],[909,268,30,30,7,1]], //0
    [[230,107,30,30,6,1],[142,371,30,30,25,1],[775,99,30,30,3,1],[698,385,30,30,8,1],[342,146,30,30,2,1]],
    [[233,102,30,30,3,1],[445,102,30,30,9,1],[598,165,30,30,26,1],[136,369,30,30,3,1],[767,97,30,30,0,1]],
    [],//3
    [[124,148,30,30,3,1],[584,55,30,30,0,1],[837,376,30,30,4,1],[453,337,30,30,8,1]],//4
    [],[],[],[],[], //9
    [[199,160,30,30,14,1],[198,422,30,30,2,1],[616,62,30,30,3,1]],//10
    [[505,360,30,30,2,1],[149,393,30,30,32,1],[174,82,30,30,27,1],[791,163,30,30,10,1],[729,359,30,30,11,1]],//11
    [[120,84,30,30,8,1],[750,130,30,30,27,1],[734,363,30,30,9,1]],//12
    [[121,252,30,30,7,1],[401,191,30,30,2,1],[636,188,30,30,16,1],[797,355,30,30,32,1]],//13
    [[388,251,30,30,3,1],[700,179,30,30,6,1]],//14
    [[209,77,30,30,0,1],[642,127,30,30,26,1],[616,389,30,30,9,1]],//15
    [[230,177,30,30,8,1],[771,333,30,30,2,1],[413,367,30,30,3,1]],
    [[229,83,30,30,31,1],[832,258,30,30,2,1],[448,69,30,30,7,1],[457,301,30,30,17,1]],
    [[105,209,30,30,7,1],[541,230,30,30,9,1]],[],//18,19
    //////ここから洞窟
    [[107,109,30,30,20,1],[248,384,30,30,3,1],[716,74,30,30,8,1],[844,130,30,30,19,1]],//20
    [[138,63,30,30,3,1],[288,235,30,30,0,1],[552,421,30,30,1,1],[761,155,30,30,19,1],[835,424,30,30,29,1]],//21
    [[131,135,30,30,11,1],[217,431,30,30,3,1],[544,160,30,30,12,1],[798,380,30,30,20,1]], //22
    [[209,117,30,30,1,1],[417,239,30,30,4,1],[789,176,30,30,7,1]],//23
    [[287,91,30,30,0,1],[388,411,30,30,14,1],[528,62,30,30,17,1],[849,251,30,30,20,1]],
    [[284,89,30,30,19,1],[207,378,30,30,9,1],[530,458,30,30,10,1]],
    [[243,112,30,30,3,1],[323,284,30,30,7,1],[415,385,30,30,9,1],[816,437,30,30,34,1]],
    [[222,355,30,30,7,1],[724,370,30,30,9,1]],[],[],
     //////ここから都市
    [[201,145,30,30,2,1],[241,377,30,30,6,1],[808,386,30,30,8,1],[847,182,30,30,4,1]],
    [[812,376,30,30,19,1],[87,358,30,30,5,1],[106,129,30,30,16,1],[830,118,30,30,4,1]],
    [[104,381,30,30,5,1],[844,377,30,30,6,1],[742,158,30,30,9,1],[816,139,30,30,10,1]],
    [[171,468,30,30,9,1],[120,82,30,30,12,1],[827,89,30,30,11,1],[850,414,30,30,25,1]],
    [[122,256,30,30,5,1],[824,406,30,30,7,1],[648,120,30,30,9,1]],
    [[82,151,30,30,13,1],[176,371,30,30,20,1],[576,141,30,30,2,1]],
    [[824,155,30,30,18,1],[845,412,30,30,2,1],[90,384,30,30,25,1]],
    [],[],[],
     //////ここから砂漠
    [[321,385,30,30,3,1],[763,376,30,30,5,1],[807,77,30,30,14,1],[121,386,30,30,7,1],[271,171,30,30,9,1]],
    [[157,158,30,30,18,1],[428,109,30,30,3,1],[676,118,30,30,19,1],[656,401,30,30,20,1]],
    [[256,113,30,30,19,1],[571,111,30,30,3,1],[747,291,30,30,8,1],[275,395,30,30,10,1]],
    [[185,59,30,30,2,1],[725,197,30,30,6,1],[175,449,30,30,20,1],[451,454,30,30,19,1]],
    [[288,194,30,30,33,1],[643,262,30,30,19,1],[470,448,30,30,7,1],[717,294,30,30,20,1]],
    [[664,418,30,30,19,1],[205,287,30,30,2,1],[390,99,30,30,5,1],[727,175,30,30,10,1]],
    [[170,124,30,30,6,1],[102,241,30,30,2,1],[668,358,30,30,0,1],[676,94,30,30,17,1]],
    [],[],[]
]

var shopData=[ ////[[itemNum,price,stock(未使用?)]]
    [[3,40,99],[7,100,99]],//0号店　家の目の前
    [[0,100,99],[3,50,99],[4,90,99],[6,120,99],[7,50,99]],//1号店　家の近所１
    [[9,50,99],[10,50,99],[11,200,99],[12,300,99]],//2号店　家の近所２
    [[0,120,99],[1,180,99],[2,240,99],[3,80,99],[4,100,99],[6,125,99],[8,60,99],[15,200,99],[19,300,99],[29,1500,99]],//3号店　みずべ
    [[1,200,99],[4,130,99],[5,180,99],[6,240,99],[8,70,99],[19,300,99],[20,200,99],[29,1500,99]],//4号店　洞窟
    [[1,200,99],[2,250,99],[8,70,99],[19,120,99],[20,220,99]],//5号店　都市の入り口
    [[0,120,99],[1,240,99],[3,400,99],[5,200,99],[6,240,99],[9,100,99]],//6号店　都市1　回復屋
    [[25,1500,99],[26,1700,99],[27,1700,99],[29,1700,99]],//7号店　都市２ たまご屋
    [[10,800,99],[16,900,99],[17,1300,99],[19,140,99],[20,240,99]],//8号店　都市３　レア屋
    [[2,300,99],[4,100,99],[5,180,99],[11,200,99],[12,200,99],[13,200,99],[14,200,99],[15,200,99]],//9号店　都市４ 強化屋
    [[0,150,99],[2,320,99],[5,200,99],[6,150,99],[7,400,99],[17,1500,99],[19,150,99][20,180,99],[28,1500,99]],//10号店　砂漠１
]
const fieldNameDatabase=[ //フィールドの名前データ
    "おうち", "おうちの外", "石碑の前", "石碑の裏", "おうちの近所" ,"","","","","",
    "森の入り口", "","","","森の中","水のほとり","","崖","森の奥","",
    "洞窟の入り口", "","滝","","洞窟の中","明るいところ","","洞窟の奥","","",
    "廃墟の入り口", "","大通り","","廃墟の奥","","商店街","","","",
    "砂漠の入り口", "砂漠の中","砂漠の中","砂漠の中","砂漠の中","砂漠の端","砂漠の奥","","",""
]
const fieldNameDatabase2=[ //フィールドの名前データ　メニュー用
    "おうち", "おうちの外", "石碑の前", "石碑の裏", "おうちの近所" ,"","","","","",
    "森の入り口", "森の中","森の中","森の中","森の中","水のほとり","森の奥","崖","森の奥","",
    "洞窟の入り口", "洞窟の中","滝","洞窟の中","洞窟の中","明るいところ","洞窟の奥","洞窟の奥","","",
    "廃墟の入り口", "廃墟の中","大通り","廃墟の中","廃墟の奥","大通り","商店街","","","",
    "砂漠の入り口", "砂漠の中","砂漠の中","砂漠の中","砂漠の中","砂漠の端","砂漠の奥","","",""
]

////////////////////
/* 　アイテムデータ  */
////////////////////
const itemdata=[ //[0:アイテム名,1:フィールドで使用可能?(off:0,on:1),2:バトルで使用可能？(off:0,on:1), 3:説明 4:たまごならたまご番号　それ以外は-1
    ["ふつうの薬草",1,1,"最大HPの30%分を回復する。",-1],
    ["高級な薬草",1,1,"最大HPの60%分を回復する。",-1],
    ["特上の薬草",1,1,"HPを満タンにする。",-1],
    ["おいしい水",1,1,"HPを50回復する。",-1],
    ["甘いジュース",1,1,"HPを100回復する。",-1],
    ["スポーツドリンク",1,1,"HPを150回復する。",-1],
    ["元気のかけら",1,1,"ひんし状態になったマイピクを生き返らせ、HPを半分回復する。",-1],//6
    ["元気のかたまり",1,1,"ひんし状態になったマイピクを生き返らせ、HPを全回復する。",-1],//7
    ["アーモンドクッキー",1,1,"DPを30回復する。",-1],
    ["チョコクッキー",1,1,"DPを60回復する。",-1],
    ["奇妙なクッキー",1,0,"DPの最大値を1増やす。",-1],//10
    ["アタックブースト",0,1,"攻撃力を一時的に強化する。",-1],
    ["ガードブースト",0,1,"防御力を一時的に強化する。",-1],
    ["プロテイン",0,1,"最大HPを一時的に増加する。",-1],
    ["金運の知らせ",0,1,"敵を倒したときの獲得マイルがアップする。",-1],//(14)
    ["マスターの指導書",0,1,"敵を倒したときの獲得経験値がアップする。",-1],//15
    ["マイピク強化の初級指南書",1,0,"経験値を少し獲得する。",-1],
    ["マイピク強化の中級指南書",1,0,"経験値をそこそこ獲得する。",-1],
    ["マイピク強化の上級指南書",1,0,"経験値をかなり獲得する。",-1],
    ["安全帰還の教え",1,0,"帰れなくなった時の優れもの。使うと家に帰ることができる。",-1],
    ["虫除けスプレー",1,0,"敵が嫌がる匂いを発する。敵の遭遇率が減る。",-1],//20
    ["森の精霊の卵",0,0,"森ダンジョンの奥に眠るたまご。おうちで孵化させると強力なマイピクになり仲間に加えられる。",0],
    ["魔窟の闇に埋もれた卵",0,0,"洞窟ダンジョンの奥に眠るたまご。おうちで孵化させると強力なマイピクになり仲間に加えられる。",1],
    ["遺跡怪物の卵",0,0,"遺跡ダンジョンの奥に眠るたまご。おうちで孵化させると強力なマイピクになり仲間に加えられる。",2],
    ["砂岩の卵",0,0,"砂漠ダンジョンの奥に眠るたまご。おうちで孵化させると強力なマイピクになり仲間に加えられる。",3],
    ["よくある火の卵",0,0,"ダンジョンでよく手に入るたまご。おうちで孵化させるとマイピクになり仲間に加えられる。",4],//25
    ["よくある水の卵",0,0,"ダンジョンでよく手に入るたまご。おうちで孵化させるとマイピクになり仲間に加えられる。",5],
    ["よくある木の卵",0,0,"ダンジョンでよく手に入るたまご。おうちで孵化させるとマイピクになり仲間に加えられる。",6],
    ["よくある風の卵",0,0,"ダンジョンでよく手に入るたまご。おうちで孵化させるとマイピクになり仲間に加えられる。",7],
    ["よくある岩の卵",0,0,"ダンジョンでよく手に入るたまご。おうちで孵化させるとマイピクになり仲間に加えられる。",8],
    ["レアな火の卵",0,0,"ダンジョンで稀に手に入るたまご。おうちで孵化させると少し強いマイピクになり仲間に加えられる。",9],//30
    ["レアな水の卵",0,0,"ダンジョンで稀に手に入るたまご。おうちで孵化させると少し強いマイピクになり仲間に加えられる。",10],
    ["レアな木の卵",0,0,"ダンジョンで稀に手に入るたまご。おうちで孵化させると少し強いマイピクになり仲間に加えられる。",11],
    ["レアな風の卵",0,0,"ダンジョンで稀に手に入るたまご。おうちで孵化させると少し強いマイピクになり仲間に加えられる。",12],
    ["レアな岩の卵",0,0,"ダンジョンで稀に手に入るたまご。おうちで孵化させると少し強いマイピクになり仲間に加えられる。",13],
    ["超希少な火の卵",0,0,"ダンジョンでごく稀に手に入るたまご。おうちで孵化させると強いマイピクになり仲間に加えられる。",14],//35
    ["超希少な水の卵",0,0,"ダンジョンでごく稀に手に入るたまご。おうちで孵化させると強いマイピクになり仲間に加えられる。",15],
    ["超希少な木の卵",0,0,"ダンジョンでごく稀に手に入るたまご。おうちで孵化させると強いマイピクになり仲間に加えられる。",16],
    ["超希少な風の卵",0,0,"ダンジョンでごく稀に手に入るたまご。おうちで孵化させると強いマイピクになり仲間に加えられる。",17],
    ["超希少な岩の卵",0,0,"ダンジョンでごく稀に手に入るたまご。おうちで孵化させると強いマイピクになり仲間に加えられる。",18],
    ["不思議な卵", 0,0,"特殊なオーラを放っているたまご。おうちで孵化させると特殊なマイピクになり仲間に加えられる。",19],//40
    ["マイピクのおきて",0,0,"このおきてをよんで冒険に出発しよう!",-1],
    ["森の知覚封印石",0,0,"森ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1], //42
    ["洞窟の知覚封印石",0,0,"洞窟ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],
    ["遺跡の知覚封印石",0,0,"遺跡ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],
    ["砂漠の知覚封印石",0,0,"砂漠ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],//45
    ["謎の紙切れ1",0,0,"昔の手帳の内容が書かれている。",-1],
    ["謎の紙切れ2",0,0,"どうやら新聞の切れ端のようだ。",-1],
    ["謎の紙切れ3",0,0,"昔の手帳の内容が書かれている。",-1],
    ["謎の紙切れ4",0,0,"手紙のような紙。",-1],//49
    ["マイピクの色素研究書類",0,0,"マイピクの研究について記されているようだ。",-1]//50
]

////////////////////////
/* 　とくせい一覧(11)   */
////////////////////////
const specialAvilityText=["-","プレッシャー","ばかぢから","てっぺき","ふくつ","しゅうちゅう","トリッキー","ゆとり","こだわり","おやつもち","しんそく"]//10個
//0: なし 1:消費MP2倍, 2:残りHP20%で攻撃力1.5倍, 3:残り70%以上で防御力1.3倍, 4:一撃必殺の場合1だけ残る, 5:技の命中率が1.25倍, 
//6:20%の確率で攻撃1.5倍, 7:HP満タンの時damage半減, 8:1の位が7倍数(mod10==7)の時攻撃防御1.5倍, 9:毎ターンMAXHPの2%回復, 10:素早さがレベルアップで上がりやすい(1.4倍)

////////////////////
/* 　わざ一覧　　   */
////////////////////
const skillData=[
    //無属性(0)
    ["はたく", 20,100,0,0],
    ["たいあたり",30,100,0,0],//1
    ["づつき",35,100,0,0],
    ["しんきろう",45,100,0,1],//3
    ["きあいのパンチ",55,95,0,1],
    ["タックル",60,90,0,1],//5
    ["サイドステップ",60,100,0,2],
    ["まわしげり", 80,85,0,3],//7
    ["せいけんづき", 95,95,0,5],
    ["なぐるぼこぼこ",300,25,0,10],//9
    ///////

    //火属性(1)
    ["ほたるび", 25,100,1,0],//10
    ["ぐれんのや", 40,100,1,0],
    ["かえんだん",50,100,1,1],
    ["ひばしらの怒り", 60,100,1,1],
    ["不知火のまい",75,90,1,1],
    ["かえんほうしゃ", 80,100,1,3],//15
    ["りゅうせい火",100,85,1,4],
    ["ふんじん爆発",150,45,1,3],
    ///////

    //水属性(2)
    ["しぐれ", 25,100,2,0],
    ["マリンジェット",50,80,2,0],
    ["みずのはどう",60,100,2,2],//20
    ["アイスブレード",70,90,2,2],
    ["ねっとう", 80,100,2,4],
    ["ぜったいれいど", 100,90,2,6],
    ["こうずい", 120,50,2,4],//24
    ///////

    //木属性(3)
    ["だいちのいのり",30,100,3,0],//25
    ["花のおどり",45,100,3,1],
    ["リーフネット",60,90,3,1],
    ["きゅうしゅう",65,100,3,2],
    ["もりのざわめき",70,100,3,4],
    ["ウッドバット",80,90,3,4],//30
    ["ブランチカット",95,85,3,3],
    ["花ばくだん",140,50,3,6],//32
    ///////

    //風属性(4)
    ["吹き荒れるかぜ",30,100,3,0],
    ["とっぷう",45,100,4,0],
    ["すなあらし", 50,100,4,1],//35
    ["ソウルブラスト",70,100,4,2],
    ["たつまき", 85,85,4,4],
    ["しぜんのいぶき",95,90,4,5],
    ["ハリケーン",125,80,4,5],//39
    ///////

    //岩属性(5)
    ["かたいいし",25,100,5,0],//40
    ["こはくの煌めき",35,100,5,0],
    ["いしのねがい",45,80,5,0],
    ["いわなだれ", 60,100,5,2],
    ["メタルパンチ",70,90,5,3],
    ["ロックガン",80,100,5,4],//45
    ["じしん", 100,90,5,6],
    ["マッハストーン", 140,55,5,5],
    ///////

    //幻属性(6)
    ["魔導書のおしえ",30,100,6,0],
    ["マジカルX", 50,100,6,2],
    ["スターバースト", 85,90,6,4],//50
    ["かみのいかり", 90,100,6,5],
    ["せつなの輝き", 100,100,6,8],
    ["いんせきほう", 140,50,6,6]//53
    ///////
];
//0:"なまえ"　1:攻撃力(0-999)　2:命中率(0-100)　3:属性(0-6)　4:消費MP(0-99)

////////////////////
/* 　ぞくせい一覧   */
////////////////////
const typeDataText=["ー","火","水","木","風","岩","幻"];
const typeDataCol=["255,255,255","230,100,100","100,100,230","100,200,100","200,230,150","230,200,100","180,150,230"];

////////////////////
/* 　たまご一覧　   */
////////////////////
const eggData=[
    ["森卵",[],50,50,20,20,[1,3,33,25,26,28,29,6,30,31,7,49,32,50],4,10,3,3,3],
    ["洞窟卵",[],50,50,20,20,[1,3,41,18,4,43,20,45,22,46,7,49,47,8],4,10,3,5,3],
    ["遺跡卵",[],50,50,20,20,[1,3,33,34,19,35,5,21,37,7,22,49,39,8],4,10,3,4,3],
    ["砂漠卵",[],50,50,20,20,[1,3,10,40,12,13,4,14,6,15,49,16,50,17],4,10,3,1,3],
    ["よくある火の卵",[],40,50,20,20,[0,1,2,10,11,4,5,12,14],1,10,3,1,0],
    ["よくある水の卵",[],40,50,20,20,[0,1,2,18,19,4,5,20,21],1,10,3,2,0],
    ["よくある木の卵",[],40,50,20,20,[0,1,2,25,26,4,5,27,29],1,10,3,3,0],
    ["よくある風の卵",[],40,50,20,20,[0,1,2,33,34,4,5,36,6],1,10,3,4,0],
    ["よくある岩の卵",[],40,50,20,20,[0,1,2,40,42,4,5,43,45],1,10,3,5,0],
    ["レアな火の卵",[],45,50,20,20,[0,1,10,11,3,12,5,14,48,7,16],2,10,3,1,1],
    ["レアな水の卵",[],45,50,20,20,[0,1,18,19,3,20,5,22,48,7,23],2,10,3,2,1],
    ["レアな木の卵",[],45,50,20,20,[0,1,25,26,3,28,5,30,48,7,31],2,10,3,3,1],
    ["レアな風の卵",[],45,50,20,20,[0,1,33,34,3,35,5,37,48,7,38],2,10,3,4,1],
    ["レアな岩の卵",[],45,50,20,20,[0,1,40,42,3,43,5,44,48,7,46],2,10,3,5,1],
    ["超希少な火の卵",[],50,50,20,20,[1,2,10,11,12,14,6,36,45,15,49,8,17,50],3,10,3,1,2],
    ["超希少な水の卵",[],50,50,20,20,[1,2,18,19,20,21,6,44,36,23,49,8,23,50],3,10,3,2,2],
    ["超希少な木の卵",[],50,50,20,20,[1,2,25,26,27,29,6,36,45,31,49,8,32,50],3,10,3,3,2],
    ["超希少な風の卵",[],50,50,20,20,[1,2,33,34,35,36,6,14,30,38,49,8,39,50],3,10,3,4,2],
    ["超希少な岩の卵",[],50,50,20,20,[1,2,40,41,43,44,6,21,30,46,49,8,47,50],3,10,3,5,2],
    ["不思議な卵",[],50,50,20,20,[1,48,3,49,4,43,36,50,51,7,52,8,53,9],10,10,3,6,2]
];
//名前(実際には使わない)、使わない(1)、maxHP(2)、maxMP(3)、攻撃(4)、防御(5)、わざリスト(6)、運(7)、素早さ(8)、特性(9)、属性(10)、種族値(11)

////////////////////
/* 　敵一覧　   */
////////////////////
const enemyData=[ //0-3
    ["ナナニカ？",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],999,999,50,100,10,300,[4,5,6,7],5,50,4,8,120,1,0,1,20,0,0,0,0],
    ["ララリア？",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,80,100,100,[0,1,2,3],5,100,3,3,3100,1,0,1,10,2,5,0,0],
    ["ネネコロ？",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,99,99999,2,0,1,10,2,5,0,0],
    ["マラリリ？",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,12,5000,3,0,1,10,2,5,0,0],
    
    ///////////////////// 4-8
    //ラスボス,中ボス
    ["父親の化身",[],[400,0],[700,0],500,500,[200,0],[230,0],[16,31,52,53],70,165,0,[69,0],0,4,6,50,100,0,0,0,0],
    ["樹神",[],[150,0],[150,0],150,150,[30,0],[27,0],[16,31,52,53],6,35,0,[20,0],0,4,3,46,100,42,100,46,100],
    ["ケイブレイア",[],[120,0],[320,0],200,200,[75,0],[100,0],[45,46,47,51],7,70,0,[35,0],0,4,5,47,100,43,100,47,100],
    ["妖火",[],[220,0],[420,0],350,350,[125,0],[140,0],[15,16,17,51],8,98,0,[48,0],0,4,1,48,100,44,100,48,100],
    ["砂龍",[],[285,0],[585,0],450,450,[160,0],[185,0],[23,38,39,51],9,130,0,[59,0],0,4,4,49,100,45,100,49,100],
    /////////////////////

    ///////////////////// 9-18
    //森ダンジョンのみ出現
    ["ヤンチャム",[],[20,1],[20,1],50,50,[5,2],[13,2],[0,1,2,3],0,12,0,[3,2],0,4,0,4,10,0,0,0,0],//9
    ["ラディット",[],[45,1],[45,1],50,50,[7,2],[18,2],[0,1,2,4],0,12,0,[4,2],0,4,0,4,10,0,0,0,0],
    ["コリン",[],[44,1],[44,1],50,50,[10,2],[20,2],[0,1,3,25],0,15,0,[5,2],0,4,3,0,7,8,5,27,15],
    ["ナゾノハナ",[],[55,1],[55,1],50,50,[13,3],[25,3],[0,1,2,26],0,15,0,[6,3],0,4,3,0,7,8,5,27,15],
    ["ナーシリヤ",[],[30,2],[30,2],50,50,[15,2],[28,2],[0,2,3,26],1,30,0,[7,2],0,4,3,0,7,8,5,27,15],
    ["ママリン",[],[33,2],[33,2],50,50,[20,2],[25,2],[2,4,25,27],1,17,0,[8,2],0,4,3,0,7,8,5,27,15],
    ["ビードル",[],[45,2],[45,2],50,50,[18,2],[23,2],[1,2,18,26],1,17,0,[9,2],0,4,3,0,7,8,5,27,15],
    ["森の妃 ルナ",[],[54,3],[54,3],100,100,[24,1],[25,1],[3,41,27,48],3,23,0,[13,1],0,4,3,32,20,6,60,16,20],
    ["大樹妖霊",[],[85,5],[85,5],100,100,[28,1],[25,1],[3,19,29,49],5,28,0,[17,1],0,4,3,37,20,10,60,17,20],
    ["純水聖霊",[],[92,5],[92,5],100,100,[30,1],[23,1],[2,18,19,49],5,28,0,[17,1],0,4,2,31,30,36,20,26,50],
    /////////////////////

    ///////////////////// //19-28
    //洞窟ダンジョンのみ出現
    ["ヤンチャム",[],[60,3],[60,3],100,100,[45,2],[50,2],[0,1,2,3],0,35,0,[17,2],0,4,0,4,20,0,0,0,0],//19
    ["ラディット",[],[62,3],[62,3],100,100,[50,2],[52,2],[0,1,2,4],0,40,0,[20,2],0,4,0,4,20,0,0,0,0],
    ["スナアレイ",[],[70,3],[70,3],100,100,[51,2],[55,2],[1,2,40,41],0,45,0,[21,2],0,4,5,0,14,8,8,29,15],
    ["イシコブシ",[],[70,3],[70,3],100,100,[52,3],[55,3],[0,3,40,41],0,45,0,[24,3],0,4,5,0,14,8,8,29,15],
    ["アルレシア",[],[75,3],[75,3],100,100,[54,2],[55,2],[2,3,40,41],1,65,0,[26,2],0,4,5,0,14,8,8,29,15],
    ["ガンロック",[],[75,3],[75,3],100,100,[47,2],[85,2],[3,40,41,42],1,47,0,[26,2],0,4,5,0,14,8,8,29,15],
    ["アクアザル",[],[90,3],[90,3],100,100,[52,2],[57,2],[4,20,41,42],1,43,0,[26,2],0,4,5,0,14,8,8,29,15],//25
    ["洞窟の妃 エナ",[],[90,4],[90,4],200,200,[58,1],[64,1],[4,12,43,48],3,52,0,[29,1],0,4,5,29,20,6,50,16,30],
    ["岩石神霊",[],[100,4],[100,4],200,200,[63,1],[70,1],[6,20,43,49],5,57,0,[31,1],0,4,5,34,20,10,50,17,30],
    ["純水聖霊",[],[100,4],[100,4],200,200,[63,1],[70,1],[4,20,21,49],5,57,0,[31,1],0,4,2,31,40,36,20,26,40],
    /////////////////////

    ///////////////////// 29-38
    //遺跡ダンジョンのみ出現
    ["ヤンチャム",[],[100,4],[100,4],200,200,[75,2],[80,2],[2,3,4,5],0,63,0,[31,2],0,4,0,5,10,0,0,0,0],
    ["ラディット",[],[105,4],[105,4],200,200,[79,2],[83,2],[1,3,5,6],0,65,0,[33,2],0,4,0,5,10,0,0,0,0],
    ["ナリタリ",[],[110,5],[110,5],200,200,[83,1],[86,1],[3,10,11,13],0,66,0,[34,1],0,4,1,1,7,9,5,25,15],
    ["カマレオス",[],[115,5],[115,5],200,200,[88,2],[85,2],[4,10,11,12],0,68,0,[36,2],0,4,1,1,7,9,5,25,15],
    ["ルービッグ",[],[125,4],[125,4],200,200,[90,2],[80,2],[3,11,12,13],1,90,0,[39,2],0,4,1,1,7,9,5,25,15],
    ["キーマ",[],[130,4],[130,4],200,200,[115,2],[75,2],[4,5,11,13],1,77,0,[40,2],0,4,1,1,7,9,5,25,15],
    ["ヒーティニ",[],[180,5],[180,5],200,200,[85,3],[90,3],[5,10,11,12],1,69,0,[40,3],0,4,1,1,7,9,5,25,15],
    ["遺跡の妃 カナ",[],[160,5],[160,5],300,300,[95,1],[100,1],[15,21,28,48],3,81,0,[42,1],0,4,1,30,20,10,60,17,20],
    ["猛炎精霊",[],[170,5],[170,5],300,300,[100,1],[105,1],[14,20,29,49],5,85,0,[45,1],0,4,1,35,20,2,60,18,20],
    ["純水聖霊",[],[170,5],[170,5],300,300,[100,1],[105,1],[7,22,23,50],5,85,0,[45,1],0,4,2,31,40,36,20,26,40],
    /////////////////////

    ///////////////////// 39-48
    //砂漠ダンジョンのみ出現
    ["ヤンチャム",[],[130,5],[135,5],300,300,[100,2],[110,2],[3,5,6,20],0,80,0,[45,2],0,4,0,5,20,0,0,0,0],
    ["ラディット",[],[135,5],[135,5],300,300,[105,2],[115,2],[2,4,5,21],0,84,0,[47,2],0,4,0,5,20,0,0,0,0],
    ["カゼキリムシ",[],[145,5],[145,5],300,300,[110,2],[120,2],[3,4,33,34],0,88,0,[49,2],0,4,4,1,14,9,5,28,15],
    ["モミノハナ",[],[147,5],[147,5],300,300,[115,2],[123,2],[2,6,33,35],0,92,0,[50,2],0,4,4,1,14,9,5,28,15],
    ["サザムシ",[],[155,6],[155,6],300,300,[120,2],[100,2],[6,33,34,35],1,125,0,[52,2],0,4,4,1,14,9,5,28,15],
    ["アシリア",[],[155,6],[155,6],300,300,[100,2],[170,2],[5,33,34,35],1,94,0,[52,2],0,4,4,1,14,9,5,28,15],
    ["カナキリ",[],[200,6],[200,6],300,300,[115,2],[129,2],[5,33,34,36],1,87,0,[52,2],0,4,4,1,14,9,5,28,15],
    ["砂漠の妃 リナ",[],[170,3],[170,3],400,400,[130,1],[135,1],[21,34,36,48],3,100,0,[54,1],0,4,4,33,20,10,50,17,30],
    ["神風霊",[],[180,3],[180,3],400,400,[140,1],[145,1],[35,37,49,50],5,108,0,[56,1],0,4,4,38,20,2,50,18,30],
    ["純水聖霊",[],[180,3],[180,3],400,400,[140,1],[145,1],[7,23,24,50],5,108,0,[56,1],0,4,2,31,45,36,25,26,30]
    ///////////////////////
]//管理番号、名前、形状、つかわない(2)、maxHP(3)、つかわない(4)、maxDP(5)、攻撃(6)、防御(7)、わざリスト(8)、運(9)、素早さ(10)
//特性(11)、レベル(12)、経験値(使わない)(13)、何番目の技まで覚えてるか 0は何も覚えていない(使わないけど一応4)(14)、属性(15)、ドロップアイテム1(16)、1の確率(17)、ドロップアイテム2(18)、2の確率(19)、ドロップアイテム3(20)、3の確率(21)
//形状は[形,x,y,dx,dy] 形は0:線　1:円　円はdyはなし、dxが半径
//0:ラスボス, 1-4:各ダンジョンボス, 5-13:森モブ, 14-22:洞窟モブ, 23-31:遺跡モブ, 32-40:砂漠モブ
//HP[ベースHP,レベルの変動値*x], DP[ベースDP, レベルの変動値,*x], Level[ベースレベル, レベル変動値] 
//dropitem0は何も含まないこと(確率0)


///////////////////////////
//     メッセージ一覧　　　///
///////////////////////////

//上限133文字
const eventMsgText=[ /////戦闘が始まる時は "*XXX"　の書式（XXXは敵の番号） アイテム入手の時は"^XXX"の書式　連続はダメ(XXXはアイテム番号)    ~パパの字　= ママの字
    [   "朝だ。",
        "今日は何か荷物が届く日だったか。玄関の近くを調べてみよう",
        "方向キー：移動　Z：アクション（調べる）　X：キャンセル"
        ],//0
    [   "届いた荷物の中身はいくつかあるようだ。",
        "手紙、バッグ、マップ、何やら不思議な物体...",
        "まずは手紙を見てみよう。",
        "どれどれ...",
        "=10年後の息子へ", ////もともと1の部分
        "=元気にしているかな？",
        "=私はあなたのお母さんです。",
        "=突然の手紙に驚いたことでしょう。",
        "=なぜこんな手紙を送ったかというとお願いがあるからです。",
        "=家の裏側に石碑が立っています。",
        "=これはある封印がかけられており、その解除にはいくつかのパーツ、知覚封印石が必要です。",
        "=知覚封印石は各地のダンジョンにそれぞれ隠されています。",
        "=ダンジョンには危険な生物が住み着いているので一人で冒険するのは非常に危険。",
        "=そのために、手紙と一緒に旅に必要な道具と地図、お金、マイピクのたまごを入れておきます。",
        "=マイピクはマイピクチャーズのこと。きっとあなたの役に立ってくれます。",
        "=旅の途中で敵に出逢ったらマイピクに勝負をさせてみて乗り越えてください。",
        "=旅の準備ができたらまずは森のダンジョンに向かって。",
        "=何かヒントが得られると思います。",
        "=石碑の封印を解除し、ある大切な人をたすけてあげてください。",
        "=母より",
        "なんだこれは...！？", ////もともと2の部分
        "書かれていた内容は驚くべきものだった。",
        "自分には物心ついた時から両親がいなかった。",
        "周りの人に支えられてここまで育ってきたが、なぜ両親がいないのかも何も知らないでいた。",
        "そんな親からのメッセージ。",
        "それに色々と入っているバッグと色々な地形が示されたマップ、それにみたことのない大きめのたまご。",
        "...",
        "どうなっているんだ.....",
        "考えてもよくわからない。",
        "とりあえずこのたまごを何とかするべきだな。",
        "^025",
        "真ん中の部屋の机で卵を孵化させてみよう",
        "右奥の棚で持ちきれないマイピクを整理できるよ"
    ],
        ["今日はもうベッドで休もう",//2
        "¥手持ちのマイピクのステータスが全回復した！"],[],
    [   "何やら奇妙なモンスターが出てきた！",//4
        "これがマイピクか...",
        "生まれたマイピクはこちらをつぶらな目で見ている。",
        "^041",
        "次は何するんだっけ...",
        "母親からの手紙を取り出し、文章を見返した。",
        "森のダンジョン...か。旅の準備ができたら行ってみよう。",
        "確か場所は家の西側にあったよな...",
        "Cキーでメニューが開けるよ",
        "こまめにメニューからセーブしておこう！"],//4
    [   "我を倒せるかな！", //5
        "*005",
        "ん？何やらものが落ちてるぞ？",
        "手帳の紙切れ1には何が書いてあるんだろう...",
        "~20XX年8月21日、",
        "~今日は素晴らしい日だ",
        "~最近続けていたマイピクの研究についに兆しが見え始めた。",
        "~マイピクの能力を利用して強大なエネルギー合成が可能になるだろう。",
        "~私の助手であり妻である彼女には大変感謝している。",
        "~彼女の気付きでこの事実が解明できたと言っても過言じゃない。",
        "~まさか既存研究で検証不足と判明したデータから漏れを発見し、その原因から新発見を得ることができるなんて...",
        "~彼女の才能には毎回驚かされる。偉大な研究者になれるはずだ。",
        "~面白い結果が得られたのはよかったがこれはかなり危険だ。",
        "~マイピクの色に過敏反応し、エネルギー放出を促すがそれにはマイピクの重大な体力消費がともなう。",
        "~下手をすればマイピクが死んでしまうかもしれない...",
        "~ただそこで得られるエネルギー量は理論値では計り知れない数値である。",
        "~この技術を使えばこの国の深刻なエネルギー問題はまるっと解決だ。",
        "~こんなの学会で発表したら金目当ての悪党がわんさか出てきてマイピクがその犠牲になってしまう...！",
        "~人々の役に立ちたいがマイピクを苦しませるわけにもいかない...",
        "~一体どうすればいいんだ...",
        "...",
        "この字には見覚えがある。",
        "父親だ。",
        "家の書斎にあったノートに書いてあった独特な筆跡。",
        "それにそっくりだった。",
        "つまり父親は研究者で、母親その助手だったのか。",
        "言われてみれば家の中に数多くの薬品が残っていた。",
        "何やら危険な研究をしていたらしい。",
        "その先のページは切り離されていて読むことができなかった。",
        "...",
        "次はどこに行けばいいのだろう？",
        "そういえば森ダンジョンの入り口に別のルートがあった気がする。",
        "まずはそこに行ってみよう。"],[],[],//7
    [   "ここでキサマの命息絶えよ！", //8
        "*006",
        "ん？何やらものが落ちてるぞ？",
        "memo2には何が書いてあるんだろう...",
        "~最近、一部地域で流行しているマイピクの不可解な現象についに専門チームが動いた。",
        "~現在行政から派遣された研究員が調査にあたっているが未だ原因は解明されていない。",
        "~その地域に住んでいるマイピクの第一人者は数ヶ月前にマイピクのエネルギー開発利用に成功しているが、その女性は突然姿を眩まし、今も行方不明となっている。",
        "そこには新聞が落ちていた。",
        "新聞が発行されたのはおよそ10年前。",
        "母親からの手紙の年数と一致する。",
        "一体どんな事件なんだ？",
        "...",
        "次はどこに行けばいいのだろう？",
        "家の反対側にも何か入り口があったはずだ。",
        "あっちの方は...都市の方だ",
        "まずはそこに行ってみよう。"],[],
    [   "ガゥウルルルッ！", //10
        "*007",
        "ん？何やらものが落ちてるぞ？",
        "memo3には何が書いてあるんだろう...",
        "~20XX年12月17日、",
        "~ようやく完成した。",
        "~過剰反応を抑えながらエネルギー放出を行える薬は史上初だ。",
        "~これで安全に公開し、エネルギー問題解決の糸口として使えることができる。",
        "~...はずだった。",
        "~この技術はまれに謎な現象を起こすことを私と彼女は知っている。",
        "~マイピクの色がなくなるのだ。",
        "~色素がなくなるだけで特に体に変化は見られないが明らかに異常現象だ。",
        "~ただ確率が非常に低いのである程度は仕方ないと思ったが彼女は違った。",
        "~私が実際の使用をしたいと伝えると激昂した様子で止めるべきと訴えてきた。",
        "~あんな姿を見たのは初めてだった。",
        "~何か方法はないのか...",
        "前の紙切れと同じく父親の筆跡だった。",
        "マイピクへの利用を考えたが父親と母親の間で喧嘩したのだろうか...",
        "今のマイピクは...色がない。",
        "この薬は実際に使用されたのだろうか。",
        "...",
        "次はどこに行けばいいのだろう？",
        "このメモの場所だと砂漠だけ行ってない。",
        "もしかしたら最後の封印石はそこにあるかもしれない。",
        "まずはそこに行ってみよう。"],[],[],
    [   "その先には...イカセンゾ...", //13
        "*008",
        "ん？何やらものが落ちてるぞ？",
        "memo4には何が書いてあるんだろう...",
        "=ごめんなさい。",
        "=許せない過ちを犯してしまった。",
        "=あの後彼と揉みあいになった挙句、開発したばかりの薬を投げつけてしまった。",
        "=彼の姿は変わり果て強化された肉体は謎の化身に変化し不気味なオーラを放っていた。",
        "=雄叫びをあげ激昂した瞬間、その化身は突然かたまり全身灰色になった。",
        "=気がつくとあたりは静かになり彼は石碑と化していた。",
        "=過失であった…ではすまされない。",
        "=私と幼い息子にとって大切な父親を失ってしまった。",
        "=彼の石碑が影響する地域ではマイピクの色が失われていることにもさっき気がついた。",
        "=おそらく知覚封印石はそこに眠っているのだろう。",
        "=森、洞窟、都市、砂漠...",
        "=とても私一人じゃ集めきれない...",
        "=...",
        "=この子に未来を託すしかないのね...",
        "今までの文字と明らかに異なっていた。",
        "繊細でとても綺麗な文字。",
        "女性の残したメモのようだ。",
        "...",
        "これで全ての知覚封印石が揃った。",
        "石碑の封印を解除してこの謎を終わらせよう。"],[],[],
    [   "マイピクの未来は...私が守る.........",//16
        "*004",
        "...",
        "化身となった父親を倒すと、マイピクたちに色が戻った。",
        "マイピクたちはその変化に喜んでいる。",
        "この街に平和が戻った..."]//16
]

//キーボードのマップ
const keyboarddata = [["あ","い","う","え","お","M","Z"],["か","き","く","け","こ","L","Y"],
["さ","し","す","せ","そ","K","X"],["た","ち","つ","て","と","J","W"],
["な","に","ぬ","ね","の","I","V"],["は","ひ","ふ","へ","ほ","H","U"],
["ま","み","む","め","も","G","T"],["や","","ゆ","","よ","F","S"],
["ら","り","る","れ","ろ","E","R"],["わ","ん","ー","！","？","D","Q"],
["０","１","２","３","４","C","P"],["５","６","７","８","９","B","O"],
["小","ア","←","゛","゜","A","N"],];

//変換マップ
const keyChgMap=[[["か","が"],["き","ぎ"],["く","ぐ"],["け","げ"],["こ","ご"],
["さ","ざ"],["し","じ"],["す","ず"],["せ","ぜ"],["そ","ぞ"],
["た","だ"],["ち","ぢ"],["つ","づ"],["て","で"],["と","ど"],
["は","ば"],["ひ","び"],["ふ","ぶ"],["へ","べ"],["ほ","ぼ"],
["カ","ガ"],["キ","ギ"],["ク","グ"],["ケ","ゲ"],["コ","ゴ"],
["サ","ザ"],["シ","ジ"],["ス","ズ"],["セ","ゼ"],["ソ","ゾ"],
["タ","ダ"],["チ","ヂ"],["ツ","ヅ"],["テ","デ"],["ト","ド"],
["ハ","バ"],["ヒ","ビ"],["フ","ブ"],["ヘ","ベ"],["ホ","ボ"]]

,[["は","ぱ"],["ひ","ぴ"],["ふ","ぷ"],["へ","ぺ"],["ほ","ぽ"],
["ハ","パ"],["ヒ","ピ"],["フ","プ"],["ヘ","ペ"],["ホ","ポ"]]

,[["や","ゃ"],["ゆ","ゅ"],["よ","ょ"],["わ","ゎ"],["つ","っ"],
["ヤ","ャ"],["ユ","ュ"],["ヨ","ョ"],["ワ","ヮ"],["ツ","ッ"],
["A","a"],["B","b"],["C","c"],["D","d"],["E","e"],
["F","f"],["G","g"],["H","h"],["I","i"],["J","j"],
["K","k"],["L","l"],["M","m"],["N","n"],["O","o"],
["P","p"],["Q","q"],["R","r"],["S","s"],["T","t"],
["U","u"],["V","v"],["W","w"],["X","x"],["Y","y"],
["Z","z"]]

,[["あ","ア"],["い","イ"],["う","ウ"],["え","エ"],["お","オ"],
["か","キ"],["き","キ"],["く","ク"],["け","ケ"],["こ","コ"],
["さ","サ"],["し","シ"],["す","ス"],["せ","セ"],["そ","ソ"],
["た","タ"],["ち","チ"],["つ","ツ"],["て","テ"],["と","ト"],
["な","ナ"],["に","ニ"],["ぬ","ヌ"],["ね","ネ"],["の","ノ"],
["は","ハ"],["ひ","ヒ"],["ふ","フ"],["へ","ヘ"],["ほ","ホ"],
["ま","マ"],["み","ミ"],["む","ム"],["め","メ"],["も","モ"],
["や","ヤ"],["ゆ","ユ"],["よ","ヨ"],
["ら","ラ"],["り","リ"],["る","ル"],["れ","レ"],["ろ","ロ"],
["わ","ワ"],["ん","ン"]]];

function chgChara(chara,mode){
    for(var i = 0;i < keyChgMap[mode].length;i++){
        if (chara == keyChgMap[mode][i][0]) return keyChgMap[mode][i][1]
        if (chara == keyChgMap[mode][i][1]) return keyChgMap[mode][i][0]
    }
    return chara;
}