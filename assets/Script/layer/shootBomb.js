cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        game.off("bomb1", this.bomb1, this);//爆炸
        game.off("bomb2", this.bomb2, this);//爆炸
        game.off("bomb3", this.bomb3, this);//爆炸
    },
    onLoad() {
        game.on("bomb1", this.bomb1, this);//爆炸
        game.on("bomb2", this.bomb2, this);//爆炸
        game.on("bomb3", this.bomb3, this);//爆炸
    },
    /********
     *
     * 爆炸效果
     * **/
    bomb1(data) {
        data.aniName = "bomb1";
        let pool = game.bombPool["bomb1"];
        if (pool && pool.prefab) {
            pool.getNode(data, this.node);
            //this.node.addChild(b);
        }
    },
    /********
     *
     * 爆炸效果
     * **/
    bomb2(data) {
        data.aniName = "bomb2";
        let pool = game.bombPool["bomb2"];
        if (pool && pool.prefab) {
            pool.getNode(data, this.node);
            //this.node.addChild(b);
        }
    },
    /********
     * 爆炸效果
     * **/
    bomb3(data) {
        data.aniName = "bomb3";
        let pool = game.bombPool["bomb3"];
        if (pool && pool.prefab) {
            pool.getNode(data, this.node);
            //this.node.addChild(b);
        }
    }
});
