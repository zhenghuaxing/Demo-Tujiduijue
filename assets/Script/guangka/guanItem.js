cc.Class({
    extends: cc.Component,
    properties: {
        num: 101,
        stars: [cc.Sprite],
        label: cc.Label,
        gkIcon: cc.Sprite
    },
    onDestroy() {
        this.addEvent(false)
    },
    onLoad() {
        this.zhang = parseInt(this.num / 100);
        this.guan = this.num % 100;
        this.label.string = this.guan.toString();
    },
    addEvent(flg) {
        if (this.flg == flg) return;
        this.flg = flg;
        if (flg) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        }
        else {
            this.node.off(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        }
    },
    onTouch() {
        cc.log(1);
        game.guanKaInfo = "guan1_1";
        game.emit(game.gameEvent.load_scene, game.gameScene.gameMain)
    },
    setInfo(info) {
        info = info || {};
        info.level = info.level || 0; //0
        if (game.curNum == this.num) {
            this.gkIcon.spriteFrame = game.ui_atlas.getSpriteFrame("gk-guka0");
            this.addEvent(true);
        }
        else {
            if (info.state) {
                this.addEvent(true);
                this.gkIcon.spriteFrame = game.ui_atlas.getSpriteFrame("gk-guka1");
            }
            else {
                this.gkIcon.spriteFrame = game.ui_atlas.getSpriteFrame("gk-guka2");
            }
        }
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            if (info.state > i) {
                star.spriteFrame = game.ui_atlas.getSpriteFrame("gk-start1");
            }
            else {
                star.spriteFrame = game.ui_atlas.getSpriteFrame("gk-start0");
            }
        }
    }
});
