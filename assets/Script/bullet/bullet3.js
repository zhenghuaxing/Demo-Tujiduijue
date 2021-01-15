let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {
        head: cc.Animation,
    },
    onLoad() {
    },
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        game.soundManager.playEffect(game.gameSound.zhong_xing_qiang_jie5, false);
        this.init(data);
    },
    init(data) {
        if (data.group) this.node.group = data.group;
        this.node.angle = data.angle;
        let hd = this.node.angle * Math.PI / 180;
        this.speedX = Math.cos(hd) * (this.node.width / 2 + this.head.node.width);
        this.speedY = Math.sin(hd) * (this.node.width / 2 + this.head.node.width);
        this.node.x = data.v.x + this.speedX;
        this.node.y = data.v.y + this.speedY;
        //闪电头子动画
        if (!this._isinit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bullet_atlas, "flashHead");
            let startClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 30);
            startClip.name = 'start';
            startClip.wrapMode = cc.WrapMode.Normal;
            this.head.addClip(startClip);
        }
        this.head.playAdditive('start', 0);
        //自身动画
        let animation = this.node.getComponent(cc.Animation);//动画组件
        if (!this._isinit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bullet_atlas, data.prefabName);
            let flashClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 20);
            flashClip.name = 'flash';
            flashClip.wrapMode = cc.WrapMode.Normal;
            animation.addClip(flashClip);
        }
        animation.playAdditive('flash', 0);
        animation.once("finished", function () {
            let pool = this.node.pool;
            if (pool) {
                pool.put(this.node);
            }
            else {
                this.node.removeFromParent(true);
                this.node.destroy();
            }
        }.bind(this));
    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
