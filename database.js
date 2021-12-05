////////////////////
/* 　フィールド関連  */
////////////////////
var walkCol = [ //歩ける色のリスト 全フィールド共通
    [192,255,255],[102,255,255]
]
var fieldbackdata=[ //フィールドの背景の長方形データをすべて格納（主に歩ける部分）
    [["rgba(192,255,255,1)",0,0,960,540]],
    [["rgba(102,255,255,1)",0,0,960,540]],
    [["0x220000",0,0,4000,4000]],
    [["0x220000",0,0,4000,4000]],
    [["0x220000",0,0,4000,4000]],
    [["0x220000",0,0,4000,4000]]
]
var fielddata=[ //フィールドの画像データが全て格納されている
    [[100,140],[300,155],[320,550],[1000,820],[1000,900],[1320,750]],//フィールド0
    [[100,140],[300,155],[320,550],[1000,820],[1000,900],[1320,750]], //フィールド1
    [], //フィールド2
    [], //フィールド3
    [], //フィールド4
    [] //フィールド5
]
var fieldwarpobj=[
    [[940,0,20,540,1,40,30]],//フィールドのワープ場所のデータ　[x,y,width,height,jmpWorld,jmpx,jmpy]
    [[0,0,20,540,0,920,30]]
]
var eventobj=[
    [[30,30,50,50,1]],//フィールドのイベント場所のデータ　[x,y,width,height,eventnum]
    []
]

////////////////////
/* 　敵データ　     */
////////////////////


////////////////////
/* 　アイテムデータ  */
////////////////////
var itemdata=[ //["なまえ",フィールドで使用可能？,バトルで使用可能？]
    ["ふつうのきずくすり",1,1],
    ["高級なきずぐすり",1,1],
    ["特上のきずぐすり",1,1],
    ["ふつうのきずくすり2",1,1],
    ["高級なきずぐすり2",1,1],
    ["特上のきずぐすり2",1,1],
    ["ふつうのきずくすり3",1,1],
    ["高級なきずぐすり3",1,1],
    ["特上のきずぐすり3",1,1],
    ["ふつうのきずくすり4",1,1],
    ["高級なきずぐすり4",1,1],
    ["特上のきずぐすり4",1,1]
]

////////////////////
/* 　とくせい一覧   */
////////////////////
var specialAvilityText=["つよい","すばやい","よわい","なきむし","つよがり","ヒステリック","きんちょう","エスパー","のろい"];

////////////////////
/* 　わざ一覧　　   */
////////////////////
var skillData=[
    ["なぐるぼこぼこ",999,98,0,99],
    ["たたく",15,98,0,2],
    ["なみのり",10,97,2,8],
    ["ける",20,98,0,3],
    ["ぱんち",15,98,0,2],
    ["ぼうぎょ",10,97,2,8]
];
//0:"なまえ"　1:攻撃力　2:命中率　3:属性　4:消費MP


////////////////////
/* 　ぞくせい一覧   */
////////////////////
var typeDataText=["ー","火","水","木","風","岩","幻"];
var typeDataCol=["255,255,255","255,200,200","200,200,255","200,100,0","200,200,200","100,100,100","255,200,0"];