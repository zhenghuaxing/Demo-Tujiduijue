let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {},
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        this.data = data;
    },
    onClosed(e) {
        game.emit(game.gameEvent.load_scene, game.gameScene.hall);
        game.emit(game.gameEvent.closed_prefab, this.node);
    },
    start() {
    }
});
