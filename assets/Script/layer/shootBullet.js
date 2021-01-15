cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        game.off("shoot", this.shoot, this);//
    },
    onLoad() {
        game.on("shoot", this.shoot, this);//
    },
    /****
     * 发射子弹
     * ****/
    shoot(data) {
        let pool = game.bulletPool[data.prefabName];
        if (pool && pool.prefab) {
            pool.getNode(data,this.node);
            //this.node.addChild(b);
        }
    }
})
;
