cc.Class({
    extends: cc.Component,
    properties: {
        bullet_atlas: cc.SpriteAtlas,//子弹的序列图
        bomb_atlas: cc.SpriteAtlas,  //爆炸材质
        map_atlas:cc.SpriteAtlas,


        ui_atlas:cc.SpriteAtlas,
        materias: { //引用到的材质球
            default: [], type: cc.Material
         },
        // bingList: {default: [], type: cc.Prefab},
        // bulletList: {default: [], type: cc.Prefab},
        // effList: {default: [], type: cc.Prefab},
        // bombList: {default: [], type: cc.Prefab}
    },
    onDestroy() {
    },
    onLoad() {
        game.bullet_atlas = this.bullet_atlas;//保存到全局
        game.bomb_atlas = this.bomb_atlas;//保存到全局
        game.map_atlas = this.map_atlas;//保存到全局
        game.ui_atlas=this.ui_atlas;
        game.materias = {};
        for (var i in this.materias) {
            var materia = this.materias[i];
            if (materia) {
                game.materias[materia.name] = materia;
            }
        }
        // game.bingList = {};
        // game.bingPool = new cc.NodePool();
        // for (var i in this.bingList) {
        //     var prefab = this.bingList[i];
        //     if (prefab) {
        //         game.bingList[prefab.name] = prefab;
        //     }
        // }
        // game.bulletList = {};
        // game.bulletPool = {};
        // for (var i in this.bulletList) {
        //     var prefab = this.bulletList[i];
        //     if (prefab) {
        //         game.bulletList[prefab.name] = prefab;
        //     }
        // }
        // game.effList = {};
        // game.effPool = new cc.NodePool();
        // for (var i in this.effList) {
        //     var prefab = this.effList[i];
        //     if (prefab) {
        //         game.effList[prefab.name] = prefab;
        //     }
        // }
        // game.bombList = {};
        // game.bombPool = new cc.NodePool();
        // for (var i in this.bombList) {
        //     var prefab = this.bombList[i];
        //     if (prefab) {
        //         game.bombList[prefab.name] = prefab;
        //     }
        // }
    },
    start() {
    },
    // update (dt) {},
});
