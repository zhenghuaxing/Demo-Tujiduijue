cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        this.node.off("death", this.death, this);
    },
    addEvent() {
        this.node.on("death", this.death, this);
    },
    death() {
        if (this.isDeath) return;
        game.isOver = true;
        this.node.isDeath = this.isDeath = true;
        var win = true;
        if (this.node.group == "myrole") {
            win = false;
        }
        game.emit("gameOver");
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = false;
        cc.director.getCollisionManager().enabled = false;
        if (win) {
            game.emit(game.gameEvent.popup_prefab, game.gamePopup.gameOver_win, {
                test: parseInt(Math.random() * 1000),
                win: win
            });
            game.soundManager.playMusic(game.gameSound.bgm_win, false);//停止播放音乐
        }
        else {
            game.emit(game.gameEvent.popup_prefab, game.gamePopup.gameOver_loss, {
                test: parseInt(Math.random() * 1000),
                win: win
            });
            game.soundManager.playMusic(game.gameSound.bgm_lose, false);//停止播放音乐
        }
    },
    onLoad() {
        this.isDeath = false;
        this.addEvent();
    },
    start() {
    },
});
