let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {},
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
    },
    onComplete() {
        //cc.director.pause();
    },
    onDestroy() {
    },
    onLoad() {
    },
    start() {
    },
    onClosed() {
        //cc.director.resume();
        game.emit(game.gameEvent.closed_prefab, this.node);
    },
    //返回大厅
    onBackHome() {
        //cc.director.resume();
        game.emit(game.gameEvent.closed_prefab, this.node);
        game.emit(game.gameEvent.load_scene, game.gameScene.hall);
    },
    //重新开始
    onReStart() {
        //cc.director.resume();
        game.emit(game.gameEvent.closed_prefab, this.node);
        game.emit(game.gameEvent.load_scene, game.gameScene.gameGuanka);
    }
});
