cc.Class({
    extends: cc.Component,
    properties: {
        controlNode: {
            default: null,
            type: cc.Node,
            tooltip: "可操作摇杆的节点（决定操作范围）"
        },
        stick: {
            default: null,
            type: cc.Node,
            tooltip: "摇杆"
        },
        maxRadius: {
            default: 200,
            type: cc.Float,
            tooltip: "摇杆最大移动半径"
        },
        isTouch: {
            get() {
                return this._isTouch;
            },
            type: cc.Boolean,
            tooltip: "摇杆是否按下"
        },
        dir: {
            get() {
                return this._dir;
            },
            type: cc.Vec2,
            tooltip: "摇杆向量"
        }
    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    onEnable() {
        this._onTouchEnd();
        this.controlNode.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.controlNode.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.controlNode.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.controlNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    },
    onDisable() {
        this._onTouchEnd();
        this.controlNode.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.controlNode.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.controlNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.controlNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    },
    _onTouchStart(e) {
        this._isTouch = true;
        this._setStickPosition(e);
    },
    _onTouchMove(e) {
        if (!this._isTouch)
            return;
        this._setStickPosition(e);
    },
    _setStickPosition(e) {
        var pos = e.getLocation();
        var jPos = this.node.convertToNodeSpaceAR(pos);
        var len = jPos.mag();
        // 设置摇杆的位置
        if (len > this.maxRadius) {
            jPos.x = this.maxRadius * jPos.x / len;
            jPos.y = this.maxRadius * jPos.y / len;
            len = this.maxRadius;
        }
        this._dir.x = jPos.x / this.maxRadius;
        this._dir.y = jPos.y / this.maxRadius;
        this.stick.setPosition(jPos);
        if(len<50)return;




    },
    _onTouchEnd(e) {
        this._isTouch = false;
        // 初始化摇杆节点位置及角度
        this.stick.setPosition(cc.v2(0, 0));
        this._dir = cc.v2(0, 0);
    },
    start() {
    }
    // update (dt) {},
});
