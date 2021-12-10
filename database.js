////////////////////
/* 　フィールド関連  */
////////////////////
const walkCol = [ //歩ける色のリスト 全フィールド共通
    [0,0,0]
]
const homposx=90,homposy=130,homposworld=0;
const fieldbackdata=[ //フィールドの背景の長方形データをすべて格納（主に歩ける部分）
    [["fieldbackobj0"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],[["fieldbackobj1"]],
    [["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],[["fieldbackobj2"]],
    [["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],[["fieldbackobj3"]],
    [["0x220000",0,0,4000,4000]]
]
const fielddata=[ //フィールドの画像データが全て格納されている
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド0~9
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド10~19
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド20~29
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]], //フィールド30~39
    [[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]]//フィールド40~49
]
const fieldenemy=[ //フィールドごとに出会うモンスターのタイプセット番号
    0,0,0,0,0,0,0,0,0,0, //0
    0,0,0,0,0,0,0,0,0,0, //10
    0,0,0,0,0,0,0,0,0,0, //20
    0,0,0,0,0,0,0,0,0,0, //30
    0,0,0,0,0,0,0,0,0,0 //40
]
const fieldenemyDataSet=[ //出会う敵の確率 [Num,odds]の形で格納 oddsの総和はなんでもよい
    [], //敵が出ないゾーン
    [[2,1],[3,1]],
    [],
    []
]
const fieldwarpobj=[
    [[693,436,64,14,1,716,109]],//フィールドのワープ場所のデータ　[x,y,width,height,jmpWorld,jmpx,jmpy]
    [[691,86,67,12,0,693,396],[0,0,20,540,2,910,270],[945,0,15,540,4,40,270]],
    [[945,0,15,540,1,40,270],[221,0,300,15,3,480,480],[0,0,20,540,10,900,270]],
    [[0,525,960,15,2,360,40]],
    [[0,0,20,540,1,900,270],[0,0,960,15,40,480,480],[945,0,15,540,30,40,270]],
    [],[],[],[],[],//0-9
    [[0,0,880,15,11,480,480],[945,0,15,540,2,40,270],[400,473,169,15,20,480,70]],
    [[0,525,770,15,10,400,40],[945,0,15,540,12,40,270]],[[0,0,15,540,11,900,270],[0,0,960,15,13,480,480],[945,0,15,540,14,40,270]],//-12
    [[0,525,596,15,12,450,40],[663,525,300,15,14,116,40]],[[0,0,15,540,12,900,270],[47,0,160,15,13,892,474],[0,525,960,15,15,450,40],[945,0,15,540,16,40,270]],//-14
    [[0,0,540,15,14,450,480],[945,0,15,540,25,40,270]],[[0,0,15,540,14,892,270],[0,0,960,15,18,450,474],[915,0,15,540,17,40,270]], //-16
    [[33,0,15,540,16,862,350]],[[0,525,960,15,16,450,40]],[],  //-19
    [[364,0,230,58,10,480,480],[0,525,960,15,21,450,40],[945,0,15,540,23,40,100]],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[]
]
const eventobj=[//フィールドのイベント場所のデータ　[x,y,width,height,eventnum,(shopnum,move Item Num,boss Num),はじき出される方向(左右上下の順)or(ボス戦回避のItemNum)]
    [[339,186,70,90,2],[378,128,126,10,1]],[[282,252,107,116,3,0]],
    [[221,18,300,15,4,-1,3]],[],[[199,338,93,26,3,1],[594,199,94,46,3,2]],[],[],[],[],[],
    [[381,453,209,30,4,42,2]],[],[],[],[],[[322,364,95,15,3,3]],[],[],[[278,226,60,15,5,0]],[],//10-19
    [],[],[],[],[],[],[],[],[],[],//20
    [],[],[],[],[],[],[],[],[],[],//30
    [],[],[],[],[],[],[],[],[],[],//40
    [],[],[],[],[],[],[],[],[],[]//50
]
//eventnum- - - 1 マイピク整理　2 マイピク生み出す 3　お店　4 動けない 5　ボス戦
const itemobj=[//アイテムの場所のデータ　[x,y,width,height,itemnum,stock(通常は1を指定)]
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[]
]

var shopData=[ ////[[itemNum,price,stock(未使用?)]]
    [[0,50,99],[3,50,99],[4,200,99],[5,300,99],[6,300,99]],//0号店　家の目の前
    [[0,50,99],[3,50,99],[4,200,99],[5,300,99],[6,300,99],[12,300,99],[13,300,99]],//1号店　家の近所１
    [[0,50,99],[3,50,99],[4,200,99],[5,300,99],[6,300,99],[7,50,99],[8,50,99],[9,200,99],[12,300,99],[13,300,99]],//2号店　家の近所２
    [[0,50,99],[3,50,99],[4,200,99],[5,300,99],[6,300,99],[7,50,99],[8,50,99],[9,200,99],[12,300,99],[13,300,99]],//3号店　みずべ
    []///
]
const fieldNameDatabase=[ //フィールドの名前データ
    "おうち", "おうちの外", "石碑の前", "石碑の裏", "おうちの近所" ,"","","","","",
    "森の入り口", "","","","森の中","水のほとり","","崖","森の奥","",
    "洞窟の入り口", "","","","","","","","","",
    "森の入り口", "","","","","","","","","",
    "森の入り口", "","","","","","","","",""
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
    ["森の精霊の卵",0,0,"森ダンジョンの奥に眠るたまご。孵化させると強力なマイピクになり仲間に加えられる。",0],
    ["魔窟の闇に埋もれた卵",0,0,"洞窟ダンジョンの奥に眠るたまご。孵化させると強力なマイピクになり仲間に加えられる。",1],
    ["都市怪物の卵",0,0,"都市ダンジョンの奥に眠るたまご。孵化させると強力なマイピクになり仲間に加えられる。",2],
    ["砂岩の卵",0,0,"砂漠ダンジョンの奥に眠るたまご。孵化させると強力なマイピクになり仲間に加えられる。",3],
    ["よくある火の卵",0,0,"ダンジョンでよく手に入るたまご。孵化させるとマイピクになり仲間に加えられる。",4],
    ["よくある水の卵",0,0,"ダンジョンでよく手に入るたまご。孵化させるとマイピクになり仲間に加えられる。",5],
    ["よくある木の卵",0,0,"ダンジョンでよく手に入るたまご。孵化させるとマイピクになり仲間に加えられる。",6],
    ["よくある風の卵",0,0,"ダンジョンでよく手に入るたまご。孵化させるとマイピクになり仲間に加えられる。",7],
    ["よくある岩の卵",0,0,"ダンジョンでよく手に入るたまご。孵化させるとマイピクになり仲間に加えられる。",8],
    ["レアな火の卵",0,0,"ダンジョンで稀に手に入るたまご。孵化させると少し強いマイピクになり仲間に加えられる。",9],//30
    ["レアな水の卵",0,0,"ダンジョンで稀に手に入るたまご。孵化させると少し強いマイピクになり仲間に加えられる。",10],
    ["レアな木の卵",0,0,"ダンジョンで稀に手に入るたまご。孵化させると少し強いマイピクになり仲間に加えられる。",11],
    ["レアな風の卵",0,0,"ダンジョンで稀に手に入るたまご。孵化させると少し強いマイピクになり仲間に加えられる。",12],
    ["レアな岩の卵",0,0,"ダンジョンで稀に手に入るたまご。孵化させると少し強いマイピクになり仲間に加えられる。",13],
    ["超希少な火の卵",0,0,"ダンジョンでごく稀に手に入るたまご。孵化させると強いマイピクになり仲間に加えられる。",14],
    ["超希少な水の卵",0,0,"ダンジョンでごく稀に手に入るたまご。孵化させると強いマイピクになり仲間に加えられる。",15],
    ["超希少な木の卵",0,0,"ダンジョンでごく稀に手に入るたまご。孵化させると強いマイピクになり仲間に加えられる。",16],
    ["超希少な風の卵",0,0,"ダンジョンでごく稀に手に入るたまご。孵化させると強いマイピクになり仲間に加えられる。",17],
    ["超希少な岩の卵",0,0,"ダンジョンでごく稀に手に入るたまご。孵化させると強いマイピクになり仲間に加えられる。",18],
    ["不思議な卵", 0,0,"特殊なオーラを放っているたまご。孵化させると特殊なマイピクになり仲間に加えられる。",19],//40
    ["マイピクのおきて",0,0,"このおきてをよんで冒険に出発しよう！",-1],
    ["森の知覚封印石",0,0,"森ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1], //42
    ["洞窟の知覚封印石",0,0,"洞窟ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],
    ["都市の知覚封印石",0,0,"都市ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],
    ["砂漠の知覚封印石",0,0,"砂漠ダンジョンボスで手に入る封印石。石碑の封印解除に用いられる。",-1],//45
    ["謎の紙切れ1",0,0,"昔の手帳の内容が書かれている。",-1],
    ["謎の紙切れ2",0,0,"どうやら新聞の切れ端のようだ。",-1],
    ["謎の紙切れ3",0,0,"昔の手帳の内容が書かれている。",-1],
    ["謎の紙切れ4",0,0,"手紙のような紙。",-1]//49
]

////////////////////////
/* 　とくせい一覧(11)   */
////////////////////////
const specialAvilityText=["プレッシャー","ばかぢから","てっぺき","ふくつ","しゅうちゅう","トリッキー","ゆとり","こだわり","おやつもち","しんそく"]//10個
//0:消費MP2倍, 1:残りHP20%で攻撃力1.5倍, 2:残り70%以上で防御力1.3倍, 3:一撃必殺の場合1だけ残る, 4:技の命中率が1.25倍, 
//5:20%の確率で攻撃1.5倍, 6:HP満タンの時damage半減, 7:1の位が7倍数(mod10==7)の時攻撃防御1.5倍, 8:毎ターンMAXHPの2%回復, 9:素早さがレベルアップで上がりやすい(1.4倍)

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
    ["都市卵",[],50,50,20,20,[1,3,33,34,19,35,5,21,37,7,22,49,39,8],4,10,3,4,3],
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
const enemyData=[
    ["きむしゅん",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],999,999,50,50,10,300,[4,5,6,7],5,50,4,8,120,1,0,1,20,0,0,0,0],
    ["臭いきむしゅん",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,3,3100,1,0,1,10,2,5,0,0],
    ["ナツノハナ",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,99,99999,2,0,1,10,2,5,0,0],
    ["あああ",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,12,5000,3,0,1,10,2,5,0,0],
    ["いう",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,12,4908,0,0,1,10,2,5,0,0],
    ["さぼてん",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,32,32000,4,0,1,10,2,5,0,0],
    ["サボテンダー",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,2,120,4,0,1,10,2,5,0,0],
    ["とんがりコーン",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,3,3100,1,0,1,10,2,5,0,0],
    ["とんがり",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,99,99999,2,0,1,10,2,5,0,0],
]//管理番号、名前、形状、つかわない(2)、maxHP(3)、つかわない(4)、maxMP(5)、攻撃(6)、防御(7)、わざリスト(8)、運(9)、素早さ(10)、特性(11)、レベル(12)、経験値(13)、何番目の技まで覚えてるか 0は何も覚えていない(14)、属性(15)、ドロップアイテム1(16)、1の確率(17)、ドロップアイテム2(18)、2の確率(19)、ドロップアイテム3(20)、3の確率(21)
//形状は[形,x,y,dx,dy] 形は0:線　1:円　円はdyはなし、dxが半径

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