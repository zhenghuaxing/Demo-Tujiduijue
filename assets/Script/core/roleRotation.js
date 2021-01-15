let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {
        parent: cc.Node
    },
    onDestroy() {
    },
    onLoad() {
        this.idx = 0;
    },
    reuse(data) {
        this.idx = 0;
        this.node.angle = 0;
    },
    unuse() {
        this.node.angle = 0;
    },
    update(dt) {
        if (!this.parent) return;
        this.idx++;
        if (this.idx % 10 == 0) {
            var idx = _.sortedIndex(game.mapXList, this.parent.x);
            if (idx > 0) idx--;
            if (idx >= 0 && idx < game.mapRotation.length) {
                let angle = game.mapRotation[idx];
                this.node.angle = angle;
            }
        }
    },
});
