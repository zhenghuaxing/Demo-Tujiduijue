cc.Class({
    extends: cc.Component,
    properties: {
        label: cc.Node
    },
    onLoad() {
        this.node.emit("drawClear");
        this.node.removeAllChildren();
        var self = this;
        for (var i = 0; i < 8; i++) {
            var r = 360 * i / 8;
            var a = Math.PI / 180 * r;
            var v1 = cc.v2();
            var v2 = this.getNextPos(cc.v2(), 100, r);
            this.node.emit("lineTo", v1, v2, "#fff000");
            var label = cc.instantiate(this.label);
            this.node.addChild(label);
            label.x = v2.x;
            label.y = v2.y;
            label.getComponent(cc.Label).string = r;
        }
        this.node.emit("drawNow");
    },
    getNextPos: function (pos, len, rotation) {
        var angle = rotation * Math.PI / 180;
        var x = pos.x + Math.cos(angle) * len;
        var y = pos.x + Math.sin(angle) * len;
        return cc.v2(x, y);
    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
