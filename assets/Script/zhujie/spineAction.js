cc.Class({
    //动画播放类
    extends: cc.Component,
    properties: {},
    onLoad() {
        this.sp = this.node.getComponent(sp.Skeleton); //获取骨骼动画组件
        this.data = this.sp._skeleton.data; // SkeletonData 骨架数据
        this.animations = {};
        for (let i in this.data.animations) {
            this.animations[animation.name] = {
                trackIndex: parseInt(i),
                name: animation.name,
                duration: animation.duration
            };
        }
        this.weaponData = require("zhujueConfig");//武器数据
        this.sp.setStartListener(function (trackEntry) {
            self.animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (self.animationName === 'attack1') {
                this.sp.timeScale = self.attackTimeScale1;
            }
            else if (self.animationName === 'attack2') {
                this.sp.timeScale = self.attackTimeScale2;
            }
            else {
                this.sp.timeScale = 1;
            }
        }.bind(this));
        this.sp.setCompleteListener(function (trackEntry) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'attack1' || animationName === 'attack2') {
            }
        }.bind(this));
    },
    onDestroy() {
        if (!this.parent) return;
        // this.parent.off("roleState", this.setRoleState, this);
        // this.parent.off("changeDirection", this.changeDirection, this);
        this.parent.off("switchSkin", this.switchSkin, this);
        // game.off("stage.touch", this.stageTouch, this);
        // game.off("gameOver", this.gameOver, this);
    },
    addEvent() {
        // this.parent.on("roleState", this.setRoleState, this);
        // this.parent.on("changeDirection", this.changeDirection, this);
        this.parent.on("switchSkin", this.switchSkin, this);
        // game.on("stage.touch", this.stageTouch, this);
        // game.on("gameOver", this.gameOver, this);
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
        var weapon = this.weaponData[this.weaponIndex];
        this.sp.setSkin(weapon.name);
        this.weapon = this.sp.findBone("root_weapons" + idx);
        this.weaponPos = cc.v2(this.weapon.worldX, this.weapon.worldY);
        this.attackTimeScale1 = 230 / (weapon.sendTime * 1000);
        this.attackTimeScale2 = 450 / (weapon.sendTime * 1000);
    },
    /**
     !#en
     Mix applies all keyframe values,
     interpolated for the specified time and mixed with the current values.
     !#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
     @param fromAnimation fromAnimation
     @param toAnimation toAnimation
     @param duration duration
     */
    setMix(anim1, anim2, mixTime) {
        this.sp.setMix(anim1, anim2, mixTime);
        this.sp.setMix(anim2, anim1, mixTime);
    },
});
