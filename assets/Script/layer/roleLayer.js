cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        game.off("chubing", this.chubing, this);
    },
    onLoad() {
        this.zIndex = 0;//
        this.yList = [-10, -5, 0, 5, 10];
        game.on("chubing", this.chubing, this);
    },
    chubing(prefabName, pos, data) {
        let pool = game.bingPool[prefabName];
        if (pool && pool.prefab) {
            this.zIndex++;
            this.zIndex = this.zIndex % this.yList.length;
            data.zy = this.yList[this.zIndex];
            let b = pool.getNode(data, this.node);
            b.x = pos.x;
            b.y = pos.y;
            //this.node.addChild(b);
            b.zIndex = this.zIndex;
        }
    },
    start() {
    },
    // update (dt) {},
});
