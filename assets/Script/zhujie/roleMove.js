cc.Class({
    extends: cc.Component,
    properties: {
        maxSpeed: 300,//最大速度
        jumps: 2, //跳跃次数
        //acceleration: 1500,//加速度
        jumpSpeed: 500, //跳跃速度
        drag: 600       //拖拽速度
    },
    onLoad: function () {
        this._moveFlags = 0;
        this.node.roleState = this.roleState = 0;//角色状态  0=静止 1=移动 2=跳跃
        this._up = false;
        this.body = this.getComponent(cc.RigidBody);
        this.jumping = false;
        this.node.on("key_down", this.onKeyDown, this);
        this.node.on("key_up", this.onKeyUp, this);
        this.node.zIndex = 10;
        this._lastX = 0;
    },
    onDestroy() {
        this.node.off("key_down", this.onKeyDown, this);
        this.node.off("key_up", this.onKeyUp, this);
    },
    onKeyDown(data) {
        if (game.isOver) return;
        switch (data) {
            case game.gameControl.left:
                this._moveFlags |= game.gameAction.MOVE_LEFT;
                break;
            case game.gameControl.right:
                this._moveFlags |= game.gameAction.MOVE_RIGHT;
                break;
            case game.gameControl.up:
                if (!this._upPressed) {
                    this._up = true;
                }
                this._upPressed = true;
                break;
            case game.gameControl.down:
                //this.node.emit("switchSkin");//更改方向
                break;
            case game.gameControl.weapons:
                this.node.emit("switchSkin");//更改方向
                break;
        }
    },
    onKeyUp(data) {
        if (game.isOver) return;
        switch (data) {
            case game.gameControl.left:
                this._moveFlags &= ~game.gameAction.MOVE_LEFT;
                break;
            case game.gameControl.right:
                this._moveFlags &= ~game.gameAction.MOVE_RIGHT;
                break;
            case game.gameControl.down:
            case game.gameControl.up:
                this._upPressed = false;
                break;
        }
    },
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.jumping = false;
    },
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },
    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },
    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },
    update: function (dt) {
        if (game.isOver) return;
        var speed = this.body.linearVelocity;
        if (this._moveFlags === game.gameAction.MOVE_LEFT) {
            // speed.x -= this.acceleration * dt;
            // if (speed.x < -this.maxSpeed) {
            //     speed.x = -this.maxSpeed;
            // }
            speed.x = -this.maxSpeed;
            this.node.emit("changeDirection", -1);//更改方向
        }
        else if (this._moveFlags === game.gameAction.MOVE_RIGHT) {
            // speed.x += this.acceleration * dt;
            // if (speed.x > this.maxSpeed) {
            //     speed.x = this.maxSpeed;
            // }
            speed.x = this.maxSpeed;
            this.node.emit("changeDirection", 1);//更改方向
        }
        else {
            // if (speed.x != 0) {
            //     var d = this.drag * dt;
            //     if (Math.abs(speed.x) <= d) {
            //         speed.x = 0;
            //     } else {
            //         speed.x -= speed.x > 0 ? d : -d;
            //     }
            // }
            speed.x = 0;
        }
        //  cc.log(speed.x,speed.y);
        if (Math.abs(speed.y) < 1) {
            this.jumps = 2;
        }
        if (this.jumps > 0 && this._up) {
            speed.y = this.jumpSpeed;
            this.jumps--;
            this.setState(2);
            this.jumping = true;
        }
        this._up = false;
        if (this.jumping == false) {
            if (speed.x > 0 || speed.x < 0) {
                this.setState(1);
            }
            else {
                this.setState(0);
            }
        }
        if (speed.x != 0) {
            if (speed.x < 0) {
                if (this.node.x < (game.mapRect.x + 150)) {
                    speed.x = 0;
                }
            }
            else {
                if (this.node.x > (game.mapRect.x + game.mapRect.width - 300)) {
                    speed.x = 0;
                }
            }
            if (speed.y == 0) {
                speed.y = 10;
            }
        }
        this._lastX = this.node.x;
        this.body.linearVelocity = speed;
    },
    //设置角色状态
    setState(value) {
        if (this.roleState == value) return;
        this.node.roleState = this.roleState = value;
        this.node.emit("roleState", this.roleState);//更改动作
    },
});
