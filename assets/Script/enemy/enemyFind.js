let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {},
    onEnable() {
    },
    //当该组件被禁用或节点变为无效时调用。
    onDisable() {
    },
    //该方法为生命周期方法，父类未必会有实现。
    onDestroy() {
    },
    unuse: function () {
    },
    reuse: function (data) {
        this.node.x=this.x-Math.random()*data.findX;
    },
    onLoad() {
        this.parent = this.node.parent.parent;
        this.x = this.node.x;
    },
    //碰撞进入
    onCollisionEnter: function (other, self) {
        if (game.isOver) return;
        this.parent.emit("onCollisionEnter", other, self)
    },
    //碰撞停留
    onCollisionStay: function (other, self) {
    },
    //碰撞退出
    onCollisionExit: function (other, self) {
        if (game.isOver) return;
        this.parent.emit("onCollisionExit", other, self)
    }
});
