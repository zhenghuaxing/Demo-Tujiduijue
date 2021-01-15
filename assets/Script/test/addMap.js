cc.Class({
    extends: cc.Component,
    properties: {
        cell: cc.Node
    },
    onLoad() {
        this.node.removeAllChildren();
        var num = 30;
        for (let i = 0; i < num; i++) {
            let cell = cc.instantiate(this.cell);
            let r = parseInt(Math.random() * 255);
            let g = parseInt(Math.random() * 255);
            let b = parseInt(Math.random() * 255);
            cell.color = cc.color(r, g, b);
            cell.getComponent("itemTest").setInfo(i);
            this.node.addChild(cell);
        }
    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
