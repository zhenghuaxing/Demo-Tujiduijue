let PoolComponent = require("PoolComponent")
cc.Class({
    extends: PoolComponent,
    properties: {
        parent: cc.Node
    },
    unuse: function () {
        this.shooting = false;
        this.parent.off("shoot_start", this.shoot_start, this);
        this.parent.off("shoot_end", this.shoot_end, this);
    },
    reuse: function (data) {
        this.data = data;
        if (!this.parent) this.parent = this.node.parent;
        this.parent.on("shoot_start", this.shoot_start, this);
        this.parent.on("shoot_end", this.shoot_end, this);
        this.shooting = false;
    },
    //碰撞进入
    onCollisionEnter: function (other, self) {
        if (this.parent.isDeath) return;
        if (game.isOver) return;
        if (this.shooting) {
            this.shoot(other);
        }
    },
    //碰撞停留
    onCollisionStay: function (other, self) {
        if (this.shooting) {
            this.shoot(other);
        }
    },
    //碰撞退出
    onCollisionExit: function (other, self) {
    },
    //开始射击
    shoot_start() {
        this.shooting = true;
    },
    //射击动作结束
    shoot_end() {
        this.shooting = false;
    },
    //该方法为生命周期方法，父类未必会有实现。
    onDestroy() {
    },
    onLoad() {
    },
    shoot(other) {
        this.shooting = false;
        let hps = other.node.getComponentsInChildren("hpComponent");
        if (hps && hps.length) {
            let hp = hps[0];
            hp.onHurt(this.data.attack);
        }
    }
});
