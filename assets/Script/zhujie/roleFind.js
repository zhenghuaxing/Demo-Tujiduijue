let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: cc.Component,
    properties: {
        hero: cc.Node
    },
    unuse: function () {
        game.off("aim", this.aim, this);
    },
    reuse: function (data) {
        this.targets = [];
        //game.off("aim", this.aim, this);
    },
    onLoad() {
        this.targets = [];
        game.on("aim", this.aim, this);
    },
    aim(flg) {
        this.aimFlg = flg;
    },
    //碰撞进入
    onCollisionEnter: function (other, self) {
        if (game.isOver) return;
        if (this.node.isDeath) return;
        let node = other.node;
        if (this.targets.indexOf(node) < 0) {
            this.targets.push(node);
        }
        this.aimPos();
    },
    aimPos() {
        if (!this.hero || !this.aimFlg || !this.targets || this.targets.length == 0) return;
        let pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.targets.sort(function (a, b) {
            let pos1 = a.convertToWorldSpaceAR(cc.v2(0, 0));
            let pos2 = b.convertToWorldSpaceAR(cc.v2(0, 0));
            let len1 = game.gameUtils.getLength(pos1, pos);
            let len2 = game.gameUtils.getLength(pos2, pos);
            return len1 - len2;
        });
        let target = this.targets[0];
        pos = target.convertToWorldSpaceAR(cc.v2(0, 50));
        this.hero.emit("aimPos", pos);
    },
    //碰撞停留
    onCollisionStay: function (other, self) {
        this.aimPos();
    },
    //碰撞退出
    onCollisionExit: function (other, self) {
        if (game.isOver) return;
        if (this.node.isDeath) return;
        let node = other.node;
        let idx = this.targets.indexOf(node);
        if (idx >= 0) {
            this.targets.splice(idx, 1);
        }
        this.aimPos();
    }
});
