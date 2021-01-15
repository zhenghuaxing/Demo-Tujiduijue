cc.Class({
    extends: cc.Component,
    properties: {
        gravity: -1000,//重力
    },
    onLoad() {


        this.speed = cc.v2(0, 0);//速度
        this.prePosition = cc.v2();
        this.preStep = cc.v2();
        this._lastSpeedY = 0;
    },
    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },
    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    start() {
    },
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {

        this.node.color = cc.Color.RED;
        this.touchingNumber ++;


        console.log('on collision enter');
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;
        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;
        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;
        // // 碰撞框的世界矩阵
        // var t = world.transform;
        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;
        // // 以下属性为 矩形 和 多边形 碰


        // 1st step
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        //cc.log(otherAabb,otherPreAabb);



        // // 2nd step
        // //向前x轴，检查x轴是否碰撞
        // selfPreAabb.x = selfAabb.x;
        // otherPreAabb.x = otherAabb.x;
        // if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
        //     if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
        //         this.node.x = otherPreAabb.xMax - this.node.parent.x;
        //         this.collisionX = -1;
        //     }
        //     else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
        //         this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
        //         this.collisionX = 1;
        //     }
        //
        //     this.speed.x = 0;
        //     other.touchingX = true;
        //     return;s
        // }






    },
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        console.log('on collision stay');
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        this.touchingNumber --;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

    },
    onDestroy() {
    },
    update(dt) {
    },
});
