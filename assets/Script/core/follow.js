cc.Class({
    extends: cc.Component,
    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        map: cc.Node
    },
    // use this for initialization
    onLoad: function () {
        if (!this.target || !this.map) {
            return;
        }
        var widget = this.node.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        this.mapRect = this.map.getBoundingBox();
        this.minX = 0;
        this.maxX = this.mapRect.width - cc.winSize.width;
        this.minY = 0;
        this.maxY = this.mapRect.height - cc.winSize.height;

        game.mapRect=this.mapRect;
    },
    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if (!this.target) {
            return;
        }
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let nodepos = this.node.parent.convertToNodeSpaceAR(targetPos);
        if (nodepos.x < this.minX) nodepos.x = this.minX;
        else if (nodepos.x > this.maxX) nodepos.x = this.maxX;
        if (nodepos.y < this.minY) nodepos.y = this.minY;
        else if (nodepos.y > this.maxY) nodepos.y = this.maxY;
        this.node.position = nodepos;
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },
});
