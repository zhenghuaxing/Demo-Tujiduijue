cc.Class({
    extends: cc.Component,
    properties: {},
    onEnterGame(event, value) {
        value = parseInt(value)
        switch (value) {
            case 1:
                game.isOver = false;
                game.emit(game.gameEvent.load_scene, game.gameScene.gameGuanka);
                break;
            case 2:
                game.emit(game.gameEvent.load_scene, game.gameScene.mapEdit);
                break;
            case 3:
                game.emit(game.gameEvent.load_scene, game.gameScene.roleEdit);
                break;
            default:
                break;
        }
    },
    onLoad() {
        //game.soundManager.musicMute = true;
        game.soundManager.playMusic(game.gameSound.op, true);

    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
