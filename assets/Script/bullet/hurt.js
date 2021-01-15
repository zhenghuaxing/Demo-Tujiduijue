let PoolComponent = require("PoolComponent"); //池子组件
cc.Class({
    extends: PoolComponent,
    properties: {
        value: 10,//伤害值
        type: 0,//0=伤害1个  1=范围伤害
        hurtValue: {
            get() {
                if (this.state == 1) {
                    return this.value;
                }
                return 0;
            }
        },
    },
    //回收
    unuse: function () {
    },
    //重用
    reuse: function (data) {
        this.state = 1;
        if (data.attack) {
            this.value = data.attack;
        }
    },
    end() {
        if (this.type == 0) {
            this.state = 0;
        }
    }
});
