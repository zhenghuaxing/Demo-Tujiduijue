cc.Class({
    extends: cc.Component,
    properties: {
        progressNode: cc.Node, //进度条节点
        resLabel: cc.Label,
        barLabel: cc.Label
    },
    onDestroy() {
    },
    onLoad() {
        cc.game.addPersistRootNode(this.node); //添加常驻节点
        this.node.zIndex = 10;
        game.curScene = this.curScene = "login";
        game.on(game.gameEvent.load_scene, this.loadScene, this); //场景切换场景
        cc.loader.onProgress = this.onProgress.bind(this);
        this.completedCount = 0;
        this.totalCount = 1;
        this.node.active = false;
        this.uuids = require("uuids");
    },
    //开始切换场景
    loadScene(scene) {
        if (game.curScene == scene) return;
        this.node.active = true;
        game.curScene = this.curScene = scene;
        if (this.progressNode)
            this.progressNode.width = 0;
        cc.log("切换场景");
        this.lastId = 0;
        cc.director.loadScene(scene, this.onCompleteScene.bind(this)); //场景加载完成
        //cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onCompleteScene.bind(this));
        //this.isLoadingScene = true;
    },
    //加载完成
    onCompleteScene: function () {
        this.node.active = false;
    },
    //加载场景进度
    onProgress(completedCount, totalCount, item) {
        var id = item.id.substring(item.id.lastIndexOf('/') + 1, item.id.lastIndexOf("."))
        var url = this.uuids[id];
        if (!url) {
            return;
        }
        if (totalCount > 1) {
            this.totalCount = totalCount;
        }
        this.completedCount = completedCount;
        if (this.completedCount > this.totalCount) {
            this.completedCount = this.totalCount;
        }
        var progress = (this.completedCount / this.totalCount).format(2);
        if (this.progressNode)
            this.progressNode.width = 1030 * progress;
        if (this.barLabel)
            this.barLabel.string = parseInt(progress * 100) + "%";
        // if (this.resLabel)
        //     this.resLabel.string = item.id || "";
    }
});
