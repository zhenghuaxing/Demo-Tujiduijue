cc.Class({
    extends: cc.Component,
    properties: {},
    onDestroy() {
        this.node.off("death", this.death, this);
    },
    addEvent() {
        this.node.on("death", this.death, this);
        this.node.on("dissolve", this.dissolve, this);
    },
    dissolve(value) {
        if (value > 1) value = 1;
        if (value < 0) value = 0;
        value = value * 255;
        if (this.hua)
            this.hua.setHua(value);
        //this.material.setProperty("disLevel", value);
    },
    death() {
        if (this.isDeath) return;
        this.node.isDeath = this.isDeath = true;
        this.node.getComponent(cc.PolygonCollider).enabled = false;
    },
    onLoad() {
        this.node.isDeath = this.isDeath = false;
        this.addEvent();
        // let renderComponents = this.node.getComponents(cc.RenderComponent);
        // let renderComponent = renderComponents[0];
        // this.material = renderComponent.getMaterial(0);
        this.hua = this.node.getComponent("hua");
    },
    start() {
    },
});
