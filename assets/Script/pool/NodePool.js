module.exports = cc.Class({
    name: 'NodePool',
    properties: {
        prefab: cc.Prefab
    },
    ctor() {
        this.nodePool = new cc.NodePool();
    },
    //获取一个节点
    getNode: function (data, parent) {
        let node = null;
        if (this.nodePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.nodePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.prefab);
            node.pool = this;
        }
        if (parent) parent.addChild(node);
        let poolComponents = node.getComponentsInChildren("PoolComponent");
        for (let i in poolComponents) {
            let poolComponent = poolComponents[i];
            poolComponent.reuse(data); //启用
        }
        return node;
    },
    put: function (node) {
        node.removeFromParent();
        this.nodePool.put(node); // 通过之前传入的管理类实例回收子弹
        let poolComponents = node.getComponentsInChildren("PoolComponent");
        for (let i in poolComponents) {
            let poolComponent = poolComponents[i];
            poolComponent.unuse(); //启用
        }
    }
});