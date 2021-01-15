let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    //骨骼动画精灵组件
    extends: PoolComponent,
    properties: {},
    //该方法为生命周期方法，父类未必会有实现。
    onDestroy() {
    },
    unuse: function () {
        //this.clearTracks();
        this.parent.off("roleState", this.setRoleState, this);
        this.parent.off("attack", this.setRoleState, this);
        this.node.off("death", this.death, this);
        game.off("gameOver", this.gameOver, this);
        this.node.off("shoot_start", this.shoot_start, this);
        this.node.off("shoot_end", this.shoot_end, this);
        this.node.off("collision_shoot_start", this.collision_shoot_start, this);
        this.node.off("collision_shoot_end", this.shoot_end, this);
    },
    reuse: function (data) {
        this.shootIng = false;
        if (!this.parent) this.parent = this.node.parent;
        this.node.getComponent(cc.Collider).enabled = true;
        this.parent.isDeath = this.node.isDeath = false;
        this.parent.on("roleState", this.setRoleState, this);
        this.parent.on("attack", this.attack, this);
        this.node.on("death", this.death, this);
        this.node.on("shoot_start", this.shoot_start, this);
        this.node.on("collision_shoot_start", this.collision_shoot_start, this);
        this.node.on("collision_shoot_end", this.shoot_end, this);
        this.node.on("shoot_end", this.shoot_end, this);
        game.on("gameOver", this.gameOver, this);
        this.node.y = data.zy;
    },
    shoot_end() {
        this.sp.timeScale = 1;
    },
    shoot_start() {
        this.sp.timeScale = 0.5;
    },
    collision_shoot_start(value) {
        value = value || 0.1;
        this.sp.timeScale = 0.1;
    },
    update() {
        if (this.sp.timeScale < 1)
            this.sp.timeScale += 0.02
    },
    gameOver() {
        this.changeAction("idle");
    },
    //死亡
    death() {
        this.changeAction("death");
        this.parent.isDeath = this.node.isDeath = true;
        this.node.getComponent(cc.Collider).enabled = false;
    },
    onLoad() {
        if (!this.parent) this.parent = this.node.parent;
        this.sp = this.getComponent(sp.Skeleton); //获取骨骼动画组件
        // this.sp_skeleton_data = this.sp._skeleton.data;
        // this.sp_state = this.sp.getState();
        // this.sp_state_data = this.sp_state.data;
        // this.sp_state_data.defaultMix = 0.3;
        //  this.setMix('run', 'attack', 0.1);
        //  this.setMix('idle', 'attack', 0.1); //移动射击
        let spine = this.sp;
        this.shootIng = false;
        spine.setStartListener(function (trackEntry) {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "attack") {
                this.shootIng = true;
                this.node.emit("shoot_start");
            }
        }.bind(this));
        spine.setCompleteListener(function (trackEntry) {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'death') {
                // this.parent.removeFromParent();
                var pool = this.parent.pool;
                if (pool) {
                    pool.put(this.parent);
                }
                else {
                    this.parent.removeFromParent(true);
                    this.parent.destroy();
                }
            }
            if (animationName === "attack") {
                //this.node.emit("attackShoot", 2);
                this.shootIng = false;
                this.node.emit("shoot_end");
                this.sp.setAnimation(0, this.curAction, true);
            }
        }.bind(this));
    },
    //setMix 为所有关键帧设定混合及混合时间（从当前值开始差值）。
    setMix(anim1, anim2, mixTime) {
        // this.sp.setMix(anim1, anim2, mixTime);
        // this.sp.setMix(anim2, anim1, mixTime);
    },
    attack(pos) {
        this.targetPos = pos;//目标位置
        this.changeAction("attack");
    },
    setRoleState(value) {
        this.roleState = value;//角色状态  0=静止 1=移动 2=跳跃
        switch (value) {
            case 0: //静止
                this.changeAction("idle");
                break;
            case 1://移动
                this.changeAction("run");
                break;
            case 2: //跳跃
                //  this.changeAction("jump");
                break;
        }
    },
    changeAction(value) {
        if (!this.node) return;
        if (this.node.isDeath) return;
        if (this.sp.animation == value) return;
        let self = this;
        switch (value) {
            case "death":
                this.sp.timeScale = 1;
                this.sp.setAnimation(0, "death", false);
                break;
            case "run":
                this.sp.timeScale = 1;
                this.sp.setAnimation(0, "run", true);
                this.curAction = "run";
                break;
            case "idle":
                this.sp.timeScale = 1;
                this.curAction = "idle";
                if (!this.shootIng)
                    this.sp.setAnimation(0, "idle", true);
                break;
            case "attack":
                this.sp.setAnimation(0, "attack", false);
                // this.sp.setTrackEventListener(entry, function (trackIndex, event) {
                //     //   console.log("TrackEventListener :", event.data.name, Date.now());
                //     // let weapon = this.sp.findBone("root_qiang");
                //     // let weaponPos = cc.v2(weapon.worldX, weapon.worldY);
                //     // let worldPos = this.node.convertToWorldSpaceAR(weaponPos);
                //     // let rotation = gameUtils.getRotation(worldPos, this.targetPos);
                //     //self.node.emit("attack", 1, worldPos, 180, "enbull");
                //     this.node.emit("attackShoot", 3);
                // }.bind(this));
                break;
        }
    }
});
