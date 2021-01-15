cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        this.node.on("draw", this.draw, this);
        this.node.on("drawClear", this.clear, this);
        this.node.on("lineTo", this.lineTo, this);
        this.node.on("drawNow", this.drawNow, this);
        this.colors = [
            cc.Color.YELLOW,
            cc.Color.BLUE,
            cc.Color.GREEN,
            cc.Color.RED
        ];
        this.colorIndex = 0;
        game.root = this.node;
    },
    draw(p, c) {
        var g = this.getComponent(cc.Graphics);
        if (!c) {
            this.colorIndex++;
            this.colorIndex = this.colorIndex % this.colors.length;
            c = this.colors[this.colorIndex];
        }
        // g.lineWidth = 10;
        //  cc.log("绘制", p, c)
        g.strokeColor = c;
        g.moveTo(p.x - 100, p.y);
        g.lineTo(p.x + 100, p.y);
        g.moveTo(p.x, p.y - 100);
        g.lineTo(p.x, p.y + 100);
        g.close();
        g.stroke();
        g.fill();
    },
    lineTo(p1, p2, c) {
        var g = this.getComponent(cc.Graphics);
        c = c || '#222bff';
        // g.lineWidth = 10;
        g.strokeColor = cc.Color.RED;
        g.moveTo(p1.x, p1.y);
        g.lineTo(p2.x, p2.y);
    },
    drawNow() {
        var g = this.getComponent(cc.Graphics);
        g.close();
        g.stroke();
        g.fill();
    },
    clear() {
        var g = this.getComponent(cc.Graphics);
        // g.lineWidth = 10;
        g.clear()
    },
    start() {
    },
    onDestroy() {
        this.node.off("draw", this.draw, this);
        this.node.off("drawClear", this.clear, this);
        this.node.off("lineTo", this.lineTo, this);
        this.node.off("drawNow", this.drawNow, this);
    },
    // update (dt) {},
});
