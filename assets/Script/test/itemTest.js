cc.Class({
    extends: cc.Component,

    properties: {
      label:cc.Label
    },
    setInfo(vale){
      this.label.string=vale.toString();
    },

    onLoad () {
        
    },

    start () {

    },

    onDestroy() {

    },

    // update (dt) {},
});
