cc.Class({
    extends: cc.Component,
    properties: {
        floor: cc.Node
    },
    onLoad() {
        if (!this.floor) return;

        cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
            let physicsManager = cc.director.getPhysicsManager();
            physicsManager.enabled = true;
            cc.director.getCollisionManager().enabled = true;
        });
        let polygonCollider = this.floor.getComponent(cc.PolygonCollider);
        let points = polygonCollider.points;
        let physicsPolygonCollider = this.floor.getComponent(cc.PhysicsPolygonCollider);
        physicsPolygonCollider.points = points;

        let mapPoint = [];
        game.mapRotation = [];
        game.mapXList = [];
        for (let i in points) {
            let p = points[i];
            if (p.y > 30) {
                mapPoint.push(cc.v2(p.x, p.y));
                game.mapXList.push(p.x);
            }

        }
        game.mapXList.sort(function (v1, v2) {
            return v1 - v2;
        })
        mapPoint.sort(function (v1, v2) {
            return v1.x - v2.x;
        })
        let startPoint = mapPoint[0]
        for (let i = 1; i < mapPoint.length; i++) {
            var endPoint = mapPoint[i];
            game.mapRotation.push(game.gameUtils.getRotation(startPoint, endPoint))
            startPoint = endPoint;
        }

    },
    start() {
    },
    onDestroy() {
    },
    // update (dt) {},
});
