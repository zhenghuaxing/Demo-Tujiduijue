cc.Class({
    extends: cc.Component,
    properties: {
        canvas: cc.Node
    },
    onLoad() {
        game.touchDown = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) { //ANDROID IOS
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        } else {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
            //this.node.on(cc.Node.EventType.MOUSE_MOVE, this.on_mouse_move, this);
        }
        this.touchPos = cc.v2();
    },
    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) { //ANDROID IOS
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
            //this.node.off(cc.Node.EventType.MOUSE_MOVE, this.on_mouse_move, this);
        }
    },
    //屏幕按下
    on_touch_start(touch) {
        var pos = touch.getLocation();
        var pos1 = this.node.convertToNodeSpaceAR(pos);
        this.touchPos.x = (pos1.x + this.canvas.x);
        this.touchPos.y = (pos1.y + this.canvas.y);
        game.emit("stage.touch", this.touchPos);
        game.touchDown = true;
    },
    on_touch_end(touch) {
        game.touchDown = false;
    },
    on_mouse_move(touch) {
        var pos = touch.getLocation();
        var pos1 = this.node.convertToNodeSpaceAR(pos);
        this.touchPos.x = (pos1.x + this.canvas.x);
        this.touchPos.y = (pos1.y + this.canvas.y);
        game.emit("stage.touch", this.touchPos);
    },
    on_touch_move(touch) {
        var pos = touch.getLocation();
        var pos1 = this.node.convertToNodeSpaceAR(pos);
        this.touchPos.x = (pos1.x + this.canvas.x);
        this.touchPos.y = (pos1.y + this.canvas.y);
        game.emit("stage.touch", this.touchPos);
    },
    start() {
    },
    // update (dt) {},
});
