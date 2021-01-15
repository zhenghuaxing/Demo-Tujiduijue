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
        this.node.isDeath = this.isDeath = true;
        this.node.getComponent(cc.BoxCollider).enabled = false;
    },
    onLoad() {
        this.node.isDeath = this.isDeath = false;
        this.addEvent();
    },
    start() {
    },
});
