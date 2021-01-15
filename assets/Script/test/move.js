cc.Class({
    extends: cc.Component,
    properties: {
        target: cc.Node,
        speedX: 10,
        speedY: 10
    },
    onLoad() {
        this.targetRect = cc.rect(0, 0, 100, 100);
    },
    start() {
    },
    onDestroy() {
    },
    update(dt) {
        this.node.x--;
        //cc.log(this.node.width, this.node.height)
    },
});
