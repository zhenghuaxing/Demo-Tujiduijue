cc.Class({
    extends: cc.Component,
    properties: {},
// LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
        }, this)
        //监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        //触摸抬起
        this.node.on(cc.Node.EventType.TOUCH_ENDED, function (t) {
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
        }, this);
    },
    on_touch_move(t) {
        //定义一个n_pos变量存储当前触摸点的位置
        var n_pos = t.getLocation();
        var delta = t.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
    },
    start() {
    }
});
