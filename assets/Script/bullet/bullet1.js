let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {
        speed: 1000,
        range: 1000
    },
    onLoad() {
    },
    start() {
    },
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        game.soundManager.playEffect(game.gameSound.qing_xing_qiang_jie2,false);
        this.state = "ready";
        this.idx = 0;
        this.curRange = this.range;
        if (data.group) this.node.group = data.group;
        this.node.angle = data.angle;
        let hd = this.node.angle * Math.PI / 180;
        this.speedX = Math.cos(hd) * this.node.width / 2;
        this.speedY = Math.sin(hd) * this.node.width / 2;
        this.node.x = data.v.x + this.speedX;
        this.node.y = data.v.y + this.speedY;
        this.speedX = Math.cos(hd) * this.speed;
        this.speedY = Math.sin(hd) * this.speed;
        let animation = this.node.getComponent(cc.Animation);//动画组件
        if (!this._isInit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bullet_atlas, data.prefabName);
            let readyClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 20);
            readyClip.name = 'move';
            readyClip.wrapMode = cc.WrapMode.Loop;
            animation.addClip(readyClip);
            animation.play("move");
            this._isInit = true;
        }
        else {
            animation.playAdditive('move', 0);
        }
        this.state = "move";
        this.init(data);
    },
    init(data) {
        game.emit("shootFire", {aniName: "eff1", v: data.v, angle: data.angle});//开火动画
    },
    end() {
        if (this.state == "end") return;
        this.state = "end";
        var curPos = cc.v2(this.node.x, this.node.y);
        var angle = this.node.angle;
        game.emit("shootFire", {aniName: "eff2", v: curPos, angle: angle});//开火动画
        // game.emit("shootFire", "eff1", "eff2", curPos, angle);//开火动画
        var pool = this.node.pool;
        if (pool) {
            pool.put(this.node);
        }
        else {
            this.node.removeFromParent(true);
            this.node.destroy();
        }
    },
    onDestroy() {
    },
    onCollisionEnter: function (other, self) {
        this.end();
    },
    update(dt) {
        if (this.state != "move") {
            return;
        }
        this.idx++;
        this.curRange -= this.speed * dt;
        if (this.curRange <= 0) {
            this.end();
            return;
        }
        this.node.x += this.speedX * dt;
        this.node.y += this.speedY * dt;
    },
});
