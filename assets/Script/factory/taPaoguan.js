cc.Class({
    extends: cc.Component,
    properties: {
        sendNode: cc.Node,
        attackTme: 1, //攻击时间
        attack: 1000, //攻击力
        bulletName: "bullet5"
    },
    onDestroy() {
        this.parent.off("death", this.death, this);
    },
    addEvent() {
        this.parent.on("death", this.death, this);
    },
    death() {
        this.node.getComponent(cc.CircleCollider).enabled = false;
        let renderComponents = this.node.getComponents(cc.RenderComponent);
        let renderComponent = renderComponents[0];
        renderComponent.setMaterial(0, game.materias["dissolve"]);
    },
    onLoad() {
        this.targets = [];
        this.sendTime = 0;
        this.parent = this.node.parent;
        this.worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let sx = this.node.scaleX; //* this.parent.scaleX;
        let psy = this.parent.scaleX; //* this.parent.scaleX;
        sx = sx * psy;
        this.flip = sx < 0;
        this.flip2 = psy < 0;
        this.targetGroup = "enbull2";
        if (this.node.group == "myeye") {
            this.targetGroup = "mybull2";
        }
        this.addEvent();
    },
    //碰撞进入
    onCollisionEnter: function (other, self) {
        if (game.isOver) return;
        if (this.node.isDeath) return;
        let node = other.node;
        if (this.targets.indexOf(node) < 0) {
            this.targets.push(node);
        }
    },
    //碰撞退出
    onCollisionExit: function (other, self) {
        if (game.isOver) return;
        if (this.parent.isDeath) return;
        let node = other.node;
        let idx = this.targets.indexOf(node)
        if (idx >= 0) {
            this.targets.splice(idx, 1);
        }
    },
    start() {
    },
    update(dt) {
        if (game.isOver) return;
        if (this.parent.isDeath) return;
        this.sendTime += dt;
        if (!this.targets || this.targets.length == 0) {
            //
            //this.sendTime = 0;
            return;
        }
        let target = this.targets[0];
        let targetPos = target.convertToWorldSpaceAR(game.point1);
        // game.root.emit("drawClear");
        // game.root.emit("draw", targetPos);
        //game.root.emit("draw", this.worldPos);
        let rotation = game.gameUtils.getRotation(this.worldPos, targetPos);
        if (this.flip) {
            rotation = rotation + 180;
        }
        if (this.flip2) {
            rotation = 360 - rotation;
        }
        this.node.angle = rotation;// dt * 10;
        if (this.sendTime > this.attackTme) //攻击时间到了
        {
            this.sendTime = 0;
            let sendPos = this.sendNode.convertToWorldSpaceAR(game.point1);
            rotation = game.gameUtils.getRotation(sendPos, targetPos);
            //game.emit("shootFire", "fire", "eff3", sendPos, rotation, this.targetGroup);//开火动画
            game.emit("shootFire", {aniName: "eff3", v: sendPos, angle: rotation});//开火动画
            game.emit("shoot", {
                prefabName: this.bulletName,//预制体名称
                v: sendPos, //位置
                angle: rotation - 15,//角度
                group: this.targetGroup, //组
                attack: this.attack
            });
            game.emit("shoot", {
                prefabName: this.bulletName,//预制体名称
                v: sendPos, //位置
                angle: rotation,//角度
                group: this.targetGroup, //组
                attack: this.attack
            });
            game.emit("shoot", {
                prefabName: this.bulletName,//预制体名称
                v: sendPos, //位置
                angle: rotation + 15,//角度
                group: this.targetGroup, //组
                attack: this.attack
            });
        }
    },
});
