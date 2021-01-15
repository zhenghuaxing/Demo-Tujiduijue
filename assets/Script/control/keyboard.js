cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
    },
    onLoad() {
    },
    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                game.emit("key_down", game.gameControl.left);
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                game.emit("key_down", game.gameControl.right);
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                game.emit("key_down", game.gameControl.up);
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                game.emit("key_down", game.gameControl.down);
                break;
            case cc.macro.KEY.e:
                game.emit("key_down", game.gameControl.weapons);
                break;
        }
    },
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                game.emit("key_up", game.gameControl.left);
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                game.emit("key_up", game.gameControl.right);
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                game.emit("key_up", game.gameControl.up);
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                game.emit("key_up", game.gameControl.down);
                break;
            case cc.macro.KEY.e:
                game.emit("key_up", game.gameControl.weapons);
                break;
        }
    },
    start() {
    },
});
