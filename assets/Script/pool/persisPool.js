const NodePool = require('NodePool');
cc.Class({
    extends: cc.Component,
    properties: {
        bulletPool: {
            default: [],
            type: NodePool
        },
        firePool: {
            default: [],
            type: NodePool
        },
        bombPool: {
            default: [],
            type: NodePool
        },
        bingPool: {
            default: [],
            type: NodePool
        },
    },
    onDestroy() {
    },
    onLoad() {
        game.bulletPool = {};
        for (var i in this.bulletPool) {
            var pool = this.bulletPool[i];
            if (pool) {
                game.bulletPool[pool.prefab.name] = pool;
            }
        }
        game.firePool = {};
        for (var i in this.firePool) {
            var pool = this.firePool[i];
            if (pool) {
                game.firePool[pool.prefab.name] = pool;
            }
        }
        game.bombPool = {};
        for (var i in this.bombPool) {
            var pool = this.bombPool[i];
            if (pool) {
                game.bombPool[pool.prefab.name] = pool;
            }
        }
        game.bingPool = {};
        for (var i in this.bingPool) {
            var pool = this.bingPool[i];
            if (pool) {
                game.bingPool[pool.prefab.name] = pool;
            }
        }
    },
    start() {
    },
    // update (dt) {},
});
