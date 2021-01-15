cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        var parent = this.node.parent; //父节点
        var box = this.node.getComponent(cc.BoxCollider); //碰撞组件
        if (box) {
            var parentBox = parent.getComponent(cc.PhysicsBoxCollider);//物理引擎碰撞组件
            parentBox.offset = box.offset.clone();
            parentBox.size = box.size.clone();
        }
        else {
            // box = this.node.getComponent(cc.PolygonCollider); //碰撞组件
            // var parentBox = parent.getComponent(cc.PhysicsPolygonCollider);//物理引擎碰撞组件
            // parentBox.points = box.points;
        }
    },
    start() {
    },
    // update (dt) {},
});
