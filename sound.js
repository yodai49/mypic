/////////////////////
////     BGM     ////
imgCnt+=13;
const homeBgm=new Howl({
    src: 'sound/home.mp3',
    volume: 0.44,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const streetBgm=new Howl({
    src: 'sound/street.mp3',
    volume: 0.44,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const forestFieldBgm=new Howl({
    src: 'sound/forestField.mp3',
    volume: 0.44,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const caveFieldBgm=new Howl({
    src: 'sound/caveField.mp3',
    volume: 0.44,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const remainsFieldBgm=new Howl({
    src: 'sound/remainsField.mp3',
    volume: 0.14,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const desertFieldBgm=new Howl({
    src: 'sound/desertField.mp3',
    volume: 0.14,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const normalBattleBgm=new Howl({
    src: 'sound/normalBattle.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const rareBattleBgm=new Howl({
    src: 'sound/rareBattle.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const dungeonBossBattle1Bgm=new Howl({//森
    src: 'sound/dungeonBossBattle1.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],    
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const dungeonBossBattle2Bgm=new Howl({//洞窟
    src: 'sound/dungeonBossBattle2.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const dungeonBossBattle3Bgm=new Howl({//遺跡
    src: 'sound/dungeonBossBattle3.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const dungeonBossBattle4Bgm=new Howl({//砂漠
    src: 'sound/dungeonBossBattle4.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
const lastBossBattle1Bgm=new Howl({//ラスボス
    src: 'sound/lastBossBattle.mp3',
    volume: 0.24,
    loop: true,
    format: ['mp3'],
    onload:()=>{
        loadedimgCnt++;
        redrawTitleLoading(loadedimgCnt);
    }
});
/////////////////////

/////////////////////
////     SE      ////
const zkeySE=new Howl({
    src: 'sound/zkeySE.wav',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const xkeySE=new Howl({
    src: 'sound/xkeySE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const ckeySE=new Howl({
    src: 'sound/ckeySE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const crosskeySE=new Howl({
    src: 'sound/crosskeySE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const warpMapSE=new Howl({
    src: 'sound/warpMapSE.mp3',
    volume: 0.3,
    loop: false,
    format: ['mp3'],
});
const messageSE=new Howl({
    src: 'sound/messageSE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const messageNextSE=new Howl({
    src: 'sound/messageNextSE.mp3',
    volume: 0.1,
    loop: false,
    format: ['mp3'],
});
const eventSE=new Howl({
    src: 'sound/eventSE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const buyEventSE=new Howl({
    src: 'sound/buyEventSE.mp3',
    volume: 0.8,
    loop: false,
    format: ['mp3'],
});
const battleLowDamageSE=new Howl({
    src: 'sound/battleLowDamageSE.mp3',
    volume: 0.6,
    loop: false,
    format: ['mp3'],
});
const battleMiddleDamageSE=new Howl({
    src: 'sound/battleMiddleDamageSE.mp3',
    volume: 0.6,
    loop: false,
    format: ['mp3'],
});
const battleHighDamageSE=new Howl({
    src: 'sound/battleHighDamageSE.mp3',
    volume: 0.6,
    loop: false,
    format: ['mp3'],
});
const compositionSE=new Howl({
    src: 'sound/compositionSE.mp3',
    volume: 0.3,
    loop: false,
    format: ['mp3'],
});
const paySE=new Howl({
    src: 'sound/paySE.mp3',
    volume: 0.6,
    loop: false,
    format: ['mp3'],
});
const playerDownSE = new Howl({
    src: 'sound/playerDownSE.mp3',
    volume: 0.6,
    loop: false,
    format: ['mp3'],
});
/////////////////////

/////////////////////
//    SEskill      //
const soundData=[
    [1, 0],
    [],[],[],[],[],[],[],[],[],//-9
    [],[],[],[],[],[],[],[],[],[], //-19
    [],[],[],[],[],[],[],[],[],[], //-29
    [],[],[],[],[],[],[],[],[],[], //-39
    [],[],[],[],[],[],[],[],[],[], //-49
    [],[],[],[],[],[],[],[],[],[], //-59
    [],[],[],[],[],[],[],[],[],[], //-69
    [],[],[],[],[]//-74
]
//0:src, 1:volume, 2:loop, 3:format
var skillSE=[];
for(var i = 0;i<soundData.length;i++){
    skillSE[i]=new Howl({
        src: "./sound/seSkill/" + i + ".mp3",
        volume: soundData[0][0],
        loop: soundData[0][1],
        format: ['mp3'],
        sprite:{
            playse: [0,1000],
        }
    });
}
/////////////////////