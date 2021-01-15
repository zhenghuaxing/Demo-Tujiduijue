cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        game.on("key_down", this.onKeyDown, this);
        game.on("key_up", this.onKeyUp, this);
    },
    onDestroy() {
        game.off("key_down", this.onKeyDown, this);
        game.off("key_up", this.onKeyUp, this);
    },
    onKeyDown(data) {
        this.node.emit("key_down", data);
    },
    onKeyUp(data) {
        this.node.emit("key_up", data);
    },
    start() {
    },


});
