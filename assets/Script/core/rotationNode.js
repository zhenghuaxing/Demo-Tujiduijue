cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
    },
    onLoad() {
        // var seq = cc.repeatForever(cc.sequence(cc.rotateTo(1, 90),cc.rotateTo(1, 180),cc.rotateTo(1, 270),cc.rotateTo(1, 360)));
        // this.node.runAction(seq)
    },
    start() {
    },
    update(dt) {
        this.node.angle -= (dt * 360) / 1.5;
    },
});
