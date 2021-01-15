cc.Class({
    extends: cc.Component,
    properties: {
        bingTime: 10, //每隔5秒出一个军官
    },
    onDestroy() {
        //clearInterval(this.makeJunGuan)
    },
    onLoad() {
        this.fff = true;
        this.nextBin = 0;
        this.parent = this.node.parent;
        this.bingPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let gameConfig = require(game.guanKaInfo);
        this.config = gameConfig;
        this.bingList = [];
        for (let i in gameConfig) {
            let opts = gameConfig[i];
            for (let j = 0; j < opts.count; j++) {
                this.bingList.push(i);
            }
        }
        let length = this.bingList.length;
        this.bingList.sort(function (a, b) {
            let c = parseInt(Math.random() * length - length / 2);
            return c;
        })
    },
    start() {
    },
    update(dt) {
        if (game.isOver) return;
        if (this.parent.isDeath) return;
        this.nextBin += dt;
        if (this.nextBin < this.bingTime) {
            return;
        }
        this.nextBin = 0;
        let bing = this.bingList.shift();
        this.bingList.push(bing);
        let data = this.config[bing];
        if (this.fff) {
            // this.fff = false;
            game.emit("chubing", bing, this.bingPos, data);
        }
    },
});
