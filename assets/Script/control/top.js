cc.Class({
    extends: cc.Component,
    properties: {
        mask: cc.Mask,
        weapon: cc.Sprite
    },
    onDestroy() {
    },
    onLoad() {
        game.on("zhujiaoXue", this.zhujiaoXue, this);
        game.on("weaponIndex", this.zhujiaoWeapon, this);
    },
    start() {
    },
    zhujiaoWeapon(weaponIndex) {
        this.weapon.spriteFrame = game.map_atlas.getSpriteFrame("qiang" + weaponIndex);
    },
    zhujiaoXue(curHp, totalHp) {
        var progress = (curHp / totalHp).format();
        this.mask.node.width = progress * 286;
    },
    onGamePaues() {
        game.emit(game.gameEvent.popup_prefab, game.gamePopup.gamePause);
    }
});
