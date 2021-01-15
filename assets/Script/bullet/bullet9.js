let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {
        speed: 500,
        fire: cc.Animation,
        addSpeedY: 100,
        range: 2000,
    },
    onLoad() {
    },
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        game.soundManager.playEffect(game.gameSound.qing_xing_qiang_jie4,false);
        this.data = data;
        this.init(data);
    },
    init(data) {
        this.idx = 0;
        if (data.group) this.node.group = data.group;
        this.node.angle = data.angle;
        let hd = this.node.angle * Math.PI / 180;
        this.speedX = Math.cos(hd) * this.node.width / 2;
        this.speedY = Math.sin(hd) * this.node.width / 2;
        this.node.x = data.v.x + this.speedX;
        this.node.y = data.v.y + this.speedY;
        this.speedX = Math.cos(hd) * this.speed;
        this.speedY = Math.sin(hd) * this.speed;
        this.curRange = this.range;
        //火焰动画
        if (!this._isinit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bullet_atlas, "fire1");
            let fireClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 30);
            fireClip.name = 'fire';
            fireClip.wrapMode = cc.WrapMode.Loop;
            this.fire.addClip(fireClip);
            this.fire.play('fire');
        }
        this.state = "move";
        this.node.active = true;
    },
    start() {
    },
    onDestroy() {
    },
    //碰撞检测到
    onCollisionEnter: function (other, self) {
        this.end();
    },
    end() {
        if (this.state == "end") return;
        this.state = "end";
        this.data = _.assign(this.data, {
            aniName: "bomb1",//预制体名称
            v: cc.v2(this.node.x, this.node.y), //位置
            angle: 0,//角度
            group: this.node.group //组
        });
        game.emit("bomb2", this.data);//爆炸
        let pool = this.node.pool;
        if (pool) {
            pool.put(this.node);
        }
        else {
            this.node.removeFromParent(true);
            this.node.destroy();
        }
    },
    update(dt) {
        if (this.state != "move") {
            return;
        }
        // let hd = this.node.angle * Math.PI / 180;
        // this.speedX = Math.cos(hd) * this.speed;
        // this.speedY = Math.sin(hd) * this.speed;
        //
        this.idx++;
        this.curRange -= this.speed * dt;
        if (this.curRange <= 0) {
            this.end();
            return;
        }
        // let curPos = cc.v2(this.node.x, this.node.y);
        // // this.speedY -= 9.8;
        this.node.x += this.speedX * dt;
        this.node.y += this.speedY * dt;
        // let pos = cc.v2(this.node.x, this.node.y);
        // let rotation = game.gameUtils.getRotation(curPos, pos);
        // this.node.angle = rotation;
    },
});
