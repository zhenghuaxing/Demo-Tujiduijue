cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
    },
    onLoad() {
        window.jm = require("jm");
        window.game = jm.eventEmitter();
        window._ = require("lodash");
        window.async = require("async");
        require("utils");
        //game.gameConfig = require("gameConfig"); //公共函数
        game.gameSound = require("gameSound"); //公共函数
        game.gamePopup = require("gamePopup"); //公共函数
        game.zhujueConfig = require("zhujueConfig"); //公共函数\
        game.gameAction = require("gameAction"); //公共函数
        game.gameControl = require("gameControl"); //公共函数
        game.gameEvent = require("gameEvent"); //公共函数
        game.gameScene = require("gameScene"); //公共函数
        game.gameUtils = require("gameUtils"); //公共函数
        game.localStorage = require("localStorage"); //公共函数
        game.soundManager = require("soundManager"); //公共函数
        game.point1=cc.v2(0,0);
        game.point2=cc.v2(-100,0);
        game.soundManager.init();
        cc.tween(this.node).then(cc.delayTime(0.1)).call(function () {
            game.emit(game.gameEvent.load_scene, game.gameScene.hall);
        }).start();
    },
    start() {
    },
    // update (dt) {},i
});
