let HpComponent = require("hpComponent"); //池子组件
cc.Class({
    extends: HpComponent,
    properties: {
        progressBar: cc.ProgressBar,
        totalHp: 1000
    },
    //受到的伤害
    onHurt(value) {
        this.curHp -= value;
        this.isShow = true;
        this.progressBar.node.opacity = 255;
        this.showTime = 0;
        this.updateBar();
        if (this.curHp <= 0) {
            this.node.emit("death");
            this.parent.emit("death");
        }
    },
    onDestroy() {
    },
    updateBar() {
        var progress = (this.curHp / this.totalHp).format();
        this.progressBar.progress = progress;
        game.emit("zhujiaoXue", this.curHp, this.totalHp);
    },
    //碰撞检测到
    onCollisionEnter: function (other, self) {
        var hurt = other.node.getComponent("hurt");
        if (!hurt || hurt.hurtValue == 0) return;
        this.curHp -= hurt.hurtValue;
        hurt.end();
        this.isShow = true;
        this.progressBar.node.opacity = 255;
        this.showTime = 0;
        this.updateBar();
        if (this.curHp <= 0) {
            this.node.emit("death");
            this.parent.emit("death");
        }
    },
    onCollisionStay: function (other, self) {
    },
    //碰撞退出
    onCollisionExit: function (other, self) {
        // cc.log("碰撞退出")
    },
    onLoad() {
        var weaponData = require("zhujueConfig");
        this.totalHp = weaponData.hp;
        this.curHp = this.totalHp;
        this.parent = this.node.parent;
        this.updateBar();
        this.showTime = 0;
        this.isShow = false;
        this.progressBar.node.opacity = 0;
    },
    start() {
    },
    update(dt) {
        this.showTime += dt;
        if (this.isShow && this.showTime > 2) {
            this.isShow = false;
            this.progressBar.node.opacity = 0;
        }
    },
});
