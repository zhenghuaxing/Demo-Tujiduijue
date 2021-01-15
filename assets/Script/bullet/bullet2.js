let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {},
    onLoad() {
    },
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        game.soundManager.playEffect(game.gameSound.qing_xing_qiang_jie1,false);
        this.init(data);
    },
    init(data) {
        if (data.group) this.node.group = data.group;
        this.node.angle = data.angle;
        let hd = this.node.angle * Math.PI / 180;
        this.speedX = Math.cos(hd) * this.node.width / 2;
        this.speedY = Math.sin(hd) * this.node.width / 2;
        this.node.x = data.v.x + this.speedX;
        this.node.y = data.v.y + this.speedY;
        let animation = this.node.getComponent(cc.Animation);//动画组件
        if (!this._isInit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bullet_atlas, "bullet2");
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 20);
            clip.name = 'start';
            clip.wrapMode = cc.WrapMode.Normal;
            animation.addClip(clip);
            this._isInit = true;
        }
        animation.playAdditive('start', 0);
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
