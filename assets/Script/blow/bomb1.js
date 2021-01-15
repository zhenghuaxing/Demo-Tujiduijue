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
        game.soundManager.playEffect(game.gameSound.dao_dan_bao_zha,false);
        this.init(data);
    },
    init(data) {
        if (data.group) this.node.group = data.group;
        this.node.angle = data.angle;
        this.node.x = data.v.x;
        this.node.y = data.v.y;
        //结束动画
        let animation = this.node.getComponent(cc.Animation);//动画组件
        if (!this._isinit) {
            let spriteFrames = game.gameUtils.getSpriteFrames(game.bomb_atlas, data.aniName);
            let flashClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 20);
            flashClip.name = 'end';
            flashClip.wrapMode = cc.WrapMode.Normal;
            animation.addClip(flashClip);
            animation.play('end');
        }
        else {
            animation.playAdditive('end', 0);
        }
        animation.once("finished", function () {
            let pool = this.node.pool;
            if (pool) {
                pool.put(this.node);
            }
            else {
                this.node.removeFromParent(true);
                this.node.destroy();
            }
        }.bind(this))
    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
