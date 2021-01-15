cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        game.off("shootFire", this.shootFire, this);//开火动画
    },
    onLoad() {
        game.on("shootFire", this.shootFire, this);//开火动画
    },
    /*****
     * 开火动画
     * **/
    shootFire(data) {

        let pool = game.firePool["fire"];
        if (pool && pool.prefab) {
            pool.getNode(data,this.node);
            //this.node.addChild(b);
        }
    },
});
