cc.Class({
    extends: cc.Component,
    //角色类
    properties: {},
    onDestroy() {
        if (!this.parent) return;
        this.parent.off("roleState", this.setRoleState, this);
        this.parent.off("changeDirection", this.changeDirection, this);
        this.parent.off("switchSkin", this.switchSkin, this);
        game.off("stage.touch", this.stageTouch, this);
        game.off("gameOver", this.gameOver, this);
        this.node.off("aimPos", this.aimPos, this);
    },
    addEvent() {
        this.parent.on("roleState", this.setRoleState, this);
        this.parent.on("changeDirection", this.changeDirection, this);
        this.parent.on("switchSkin", this.switchSkin, this);
        game.on("stage.touch", this.stageTouch, this);
        game.on("gameOver", this.gameOver, this);
        this.node.on("aimPos", this.aimPos, this);
    },
    onLoad() {
        if (!this.parent) this.parent = this.node.parent;
        if (!this.parent) return;
        this.animationName = "";
        this.roleState = 0;//角色状态  0=静止 1=移动 2=跳跃
        this.scaleX = Math.abs(this.node.scaleX);
        this.sp = this.getComponent(sp.Skeleton);
        let sp_skeleton_data = this.sp._skeleton.data;
        this.animations = {};
        for (let i in sp_skeleton_data.animations) {
            let animation = sp_skeleton_data.animations[i];
            this.animations[animation.name] = {
                trackIndex: parseInt(i),
                name: animation.name,
                duration: animation.duration
            };
        }
        this.trackIndex = this.animations.idle.trackIndex;
        this.trackIndex2 = 0;
        this.action = "idle";
        this.changeAction(this.action);
        // let ra1 = this.animations.run.duration > this.animations.attack1.duration ? this.animations.attack1.duration : this.animations.run.duration;
        // let ra2 = this.animations.run.duration > this.animations.attack2.duration ? this.animations.attack2.duration : this.animations.run.duration;
        this.setMix('run', 'attack2', 0.1);
        this.setMix('run', 'attack1', 0.1);
        // this.setMix('run', 'attack2', ra1);
        // this.setMix('run', 'attack1', ra2);
        let ia1 = this.animations.idle.duration > this.animations.attack1.duration ? this.animations.attack1.duration : this.animations.idle.duration;
        let ia2 = this.animations.idle.duration > this.animations.attack2.duration ? this.animations.attack2.duration : this.animations.idle.duration;
        this.setMix('idle', 'attack2', 0.2);
        this.setMix('idle', 'attack1', 0.2);
        // this.setMix('idle', 'attack2', ia1);
        // this.setMix('idle', 'attack1', ia2);
        this.weaponData = require("zhujueConfig");
        this.weaponIndex = 1;
        setTimeout(this.init.bind(this), 100);
    },
    //设置角色状态
    setRoleState(value) {
        this.roleState = value;//角色状态  0=静止 1=移动 2=跳跃
        switch (value) {
            case 0: //静止
                this.action = "idle";
                this.changeAction(this.action);
                break;
            case 1://移动
                this.action = "run";
                this.changeAction(this.action);
                break;
            case 2: //跳跃
                this.action = "jump";
                this.changeAction("jump");
                break;
        }
    },
    changeAction(value) {
        if (this.sp.animation == value) return;
        switch (value) {
            case  game.gameAction.idle:
                this.sp.clearTrack(this.trackIndex);
                this.sp.clearTrack(this.trackIndex2);
                this.trackIndex = this.animations.idle.trackIndex;
                this.sp.addAnimation(this.trackIndex, "idle", true);
                break;
            case   game.gameAction.run:
                this.sp.clearTrack(this.trackIndex);
                this.sp.clearTrack(this.trackIndex2);
                this.trackIndex = this.animations.run.trackIndex;
                this.sp.addAnimation(this.trackIndex, "run", true);
                break;
            case   game.gameAction.jump:
                // this.sp.clearTrack(this.trackIndex);
                // this.trackIndex = this.animations.jump.trackIndex;
                this.sp.clearTrack(this.trackIndex);
                this.trackIndex = this.animations.jump.trackIndex;
                this.sp.addAnimation(this.trackIndex, "jump", false);
                break;
            case   game.gameAction.attack:
                // if (this.sp.animation == "jump" || this.sp.animation == "run")
                //     return;
                // this.sp.clearTrack(this.trackIndex);
                this.sp.clearTrack(this.trackIndex2);
                if (this.trackIndex == this.animations.idle.trackIndex || this.trackIndex == this.animations.jump.trackIndex) {
                    this.sp.clearTrack(this.trackIndex);
                }
                let weapon = this.weaponData[this.weaponIndex];
                if (weapon.attackId == 1) {
                    this.trackIndex2 = this.animations.attack1.trackIndex;
                    this.sp.addAnimation(this.trackIndex2, "attack1", false);
                }
                else if (weapon.attackId == 2) {
                    this.trackIndex2 = this.animations.attack2.trackIndex;
                    this.sp.addAnimation(this.trackIndex2, "attack2", false);
                }
                break;
        }
    },
    gameOver() {
        this.changeAction("idle");
    },
    init: function () {
        this.arm = this.sp.findBone("root_qiang");
        this.armPos = cc.v2(this.arm.worldX, this.arm.worldY);
        this.switchSkin(this.weaponIndex);
        this.armRotation = game.gameUtils.standardRotation(this.arm.rotation);
        this.rotationLimit = -65;
        this.rotationLimit1 = game.gameUtils.standardRotation(this.rotationLimit - 90);
        this.rotationLimit2 = game.gameUtils.standardRotation(this.rotationLimit + 90);
        this.sendTime = 0;
        // this.curAction = "idle";
        let self = this;
        let spine = this.sp;
        // //动画开始
        // let weapon = this.weaponData[this.weaponIndex];
        // this.attackTimeScale1 = 230 / (weapon.sendTime * 1000);
        // this.attackTimeScale2 = 450 / (weapon.sendTime * 1000);
        spine.setStartListener(function (trackEntry) {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            switch (animationName) {
                case "attack1":
                    break;
            }
            // if (self.animationName === 'attack1') {
            //     spine.timeScale = self.attackTimeScale1;
            // }
            // else if (self.animationName === 'attack2') {
            //     spine.timeScale = self.attackTimeScale2;
            // }
            // else {
            //     spine.timeScale = 1;
            // }
        }.bind(this));
        spine.setCompleteListener(function (trackEntry) {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            switch (animationName) {
                case "attack1":
                case "attack2":
                    this.sp.clearTrack(this.trackIndex);
                    this.changeAction(this.action);
                    break;
            }
        }.bind(this));
        this._isinit = true;
        this.addEvent();
    },
    stageTouch(pos) {
        if (!this._isinit) return;
        if (game.isOver) return;
        let p = this.node.convertToWorldSpaceAR(this.armPos);
        let rotation = game.gameUtils.getRotation(p, pos);
        if (this.node.scaleX < 0) {
            rotation = rotation - 90 - this.weaponData[this.weaponIndex].rotation;
            rotation = 360 - rotation
        }
        else {
            rotation = rotation - 90 + this.weaponData[this.weaponIndex].rotation;
        }
        rotation = game.gameUtils.standardRotation(rotation);
        if (game.gameUtils.limitRotation(rotation, this.rotationLimit1, this.rotationLimit2)) {
            this.arm.rotation = rotation;
            this.armRotation = game.gameUtils.standardRotation(this.arm.rotation);
        }
        else {
            this.changeDirection(this.node.scaleX * -1)
        }
    },
    aimPos(pos) {
        if (!this._isinit) return;
        if (game.isOver) return;
        pos.y += this.weaponData[this.weaponIndex].aimY;
        let p = this.node.convertToWorldSpaceAR(this.armPos);
        let rotation = game.gameUtils.getRotation(p, pos);
        if (this.node.scaleX < 0) {
            rotation = rotation - 90 - this.weaponData[this.weaponIndex].rotation;
            rotation = 360 - rotation
        }
        else {
            rotation = rotation - 90 + this.weaponData[this.weaponIndex].rotation;
        }
        rotation = game.gameUtils.standardRotation(rotation);
        if (game.gameUtils.limitRotation(rotation, this.rotationLimit1, this.rotationLimit2)) {
            this.arm.rotation = rotation;
            this.armRotation = game.gameUtils.standardRotation(this.arm.rotation);
        }
    },
    changeDirection(value) {
        this.node.scaleX = this.scaleX * value;
    },
    //切换皮肤 武器
    switchSkin(idx) {
        if (game.isOver) return;
        if (!idx) {
            this.weaponIndex += 1;
            if (this.weaponIndex > 4) this.weaponIndex = 1;
            idx = this.weaponIndex;
        }
        this.weaponIndex = idx;
        game.emit("weaponIndex", this.weaponIndex);
        let weapon = this.weaponData[this.weaponIndex]
        this.sp.setSkin(weapon.name);
        this.weapon = this.sp.findBone("root_weapons" + idx);
        this.weaponPos = cc.v2(this.weapon.worldX, this.weapon.worldY);
        // this.attackTimeScale1 = 230 / (weapon.sendTime * 1000);
        // this.attackTimeScale2 = 450 / (weapon.sendTime * 1000);
    },
    //setMix 为所有关键帧设定混合及混合时间（从当前值开始差值）。
    setMix(anim1, anim2, mixTime) {
        // this.sp.setMix(anim1, anim2, mixTime);
        // this.sp.setMix(anim2, anim1, mixTime);
    },
    start() {
    },
    update(dt) {
        if (game.isOver) return;
        if (!this._isinit) return;
        this.sendTime += dt;
        if (!game.touchDown) {
            return;
        }
        let weapon = this.weaponData[this.weaponIndex];
        if (this.sendTime > weapon.sendTime) {
            this.sendTime = 0;
            this.changeAction(game.gameAction.attack);
            let armPos = this.node.convertToWorldSpaceAR(this.armPos);
            this.weaponPos = cc.v2(this.weapon.worldX, this.weapon.worldY);
            let weaponPos = this.node.convertToWorldSpaceAR(this.weaponPos);
            let rotation = game.gameUtils.getRotation(armPos, weaponPos);
            let bulletName = "bullet" + this.weaponIndex;
            if (!this.shootData) this.shootData = {};
            this.shootData.prefabName = bulletName;//预制体名称
            this.shootData.v = weaponPos; //位置
            this.shootData.angle = rotation;//角度
            this.shootData.group = "mybull"; //组
            this.shootData.attack = weapon.attack;
            game.emit("shoot", this.shootData);
            //game.emit("shoot", bulletName, weaponPos, rotation, "mybull");
        }
    },
});
