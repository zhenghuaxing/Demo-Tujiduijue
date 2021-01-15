cc.Class({
    extends: cc.Component,
    //根据子节点的占用空间 重新设计宽高
    properties: {
        childNode: cc.Node
    },
    onLoad() {
        this.node.width = this.childNode.width;
        this.node.height = this.childNode.height;
    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
