var track = cc.Enum({
    idle: 1,
    run: 2,
    attack1: 3,
    attack2: 4,
    jump: 5
});
cc.Class({
    extends: cc.Component,
    properties: {
        sp: sp.Skeleton
    },
    onLoad() {
        this.data = this.sp._skeleton.data; // SkeletonData 骨架数据、
        var opts = {}
        for (var i in this.data.animations) {
            var animation = this.data.animations[i];
            cc.log(animation);
            cc.log(animation.duration * 30);
            opts[animation.name] = animation.duration;
        }
        this.trackIndex = track.idle;
        //this.sp.timeScale = 0.5;
        var ra1 = this.animations.run.duration > this.animations.attack1.duration ? this.animations.attack1.duration : this.animations.run.duration;
        var ra2 = this.animations.run.duration > this.animations.attack2.duration ? this.animations.attack2.duration : this.animations.run.duration;
        this.setMix('run', 'attack2', ra1 - 0.1);
        this.setMix('run', 'attack1', ra2 - 0.1);
        this.sp.setAnimation(track.run, "run", true);
    },
    //setMix 为所有关键帧设定混合及混合时间（从当前值开始差值）。
    setMix(anim1, anim2, mixTime) {
        this.sp.setMix(anim1, anim2, mixTime);
        this.sp.setMix(anim2, anim1, mixTime);
    },
    /********
     * 移动
     * **/
    onMove() {
        this.sp.clearTrack(this.trackIndex);
        this.trackIndex = track.run;
        this.sp.addAnimation(track.run, "run", true, 0.1);
    },
    /********
     * 瞄准
     * ***/
    onAim() {
    },
    /********
     * 攻击
     * ***/
    onAttack1() {
        cc.log("攻击1");
        // this.sp.clearTrack(this.trackIndex);
        // this.trackIndex = track.attack1;
        this.sp.addAnimation(track.attack1, "attack1", false, 0);
    },
    onAttack2() {
        cc.log("攻击2");
        // this.sp.timeScale = 1;
        // this.sp.clearTrack(this.trackIndex);
        // this.trackIndex = track.attack2;
        this.sp.addAnimation(track.attack2, "attack2", false, 0);
    },
    onjump() {
        cc.log("跳跃");
        this.sp.clearTrack(this.trackIndex);
        this.trackIndex = track.jump;
        this.sp.addAnimation(track.jump, "jump", false, 0.2);
    },
    /***
     * 更换皮肤
     *
     * ****/
    switchSkin() {
    },
    /*****
     *
     * ******/
    onClick(event) {
    },
});
