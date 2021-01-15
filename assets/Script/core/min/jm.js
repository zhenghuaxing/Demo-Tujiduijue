var jm = jm || {};
var _ = require("lodash");
(function () {
    if (jm.root) return;
    jm.root = {};
    jm.root.registries = {};
})();

module.exports = jm;
(function(){
    if(jm.Class) return;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    jm.Class = function(){};

    // Create a new Class that inherits from this class
    jm.Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if(name == 'properties'){
                continue;
            }
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        {
            var properties = prop['properties'];
            for(var key in properties){
                var desc = properties[key];
                if(desc.get && typeof desc.get == "string"){
                    desc.get = prototype[desc.get];
                }
                if(desc.set && typeof desc.set == "string"){
                    desc.set = prototype[desc.set];
                }
                Object.defineProperty(prototype, key, desc);
            }
        }

        // The dummy class constructor
        function Class() {
            if(this._className){
                Object.defineProperty(this, "className", { value: this._className, writable: false });
            }

            // All construction is actually done in the init method
            if ( this.ctor )
                this.ctor.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = jm.Class.extend;

        return Class;
    };
})();

(function(){
    if(jm.Object) return;
    jm.Object = jm.Class.extend({
        _className: 'object',
        attr: function (attrs) {
            for (var key in attrs) {
                if(key === 'className'){
                    continue;
                }
                this[key] = attrs[key];
            }
        }
    });

    jm.object = function(){
        return new jm.Object();
    };
})();

(function(){
    if(jm.Random) return;
    var iRandomMax = 200000000000;    //最大随机整数范围 0 <= randomValue <= iRandomMax;

    jm.Random = jm.Class.extend({
        _className: 'random',

        properties: {
            seed: { get: 'getSeed', set: 'setSeed' }
        },

        ctor: function(opts){
            opts = opts || {};
            this.g_seed = 0;
            this.randomMax =  opts.randomMax || iRandomMax;            
        },

        setSeed : function(seed)
        {
            this.g_seed = seed;
        },

        getSeed : function()
        {
            return this.g_seed;
        },

        random : function(){
            this.g_seed = ( this.g_seed * 9301 + 49297 ) % 233280;
            return this.g_seed / ( 233280.0 );
        },

        //min<=result<=max
        randomInt : function(min, max)
        {
            if(max === undefined) {
                max = min;
                min = 0;
            }
            var range = min + (this.random()*(max - min));
            return Math.round(range);
        },

        //min<=result<=max
        randomDouble : function(min, max)
        {
            if(max === undefined) {
                max = min;
                min = 0.0;
            }

            var range = min + (this.random()*(max - min));
            return range;
        },

        randomRange : function(range){
            return this.randomInt(0,this.randomMax) % range;
        },

        randomOdds : function(range, odds){
            if(this.randomRange(range) < odds) return 1;
            return 0;
        }
    });

    jm.random = function(opts){
        return new jm.Random(opts);
    };

})();

(function () {
    if (jm.EventEmitter) return;
    jm.EventEmitter = jm.Object.extend({
        _className: 'eventEmitter',
        ctor: function () {
            this._events = {};
            this._persistEvents = {};
            this.addListener = this.on;
        },
        __createListener: function (fn, caller) {
            caller = caller;
            return {
                fn: fn,
                caller: caller
            };
        },
        __equalsListener: function (listener1, listener2) {
            return listener1.fn === listener2.fn && listener1.caller === listener2.caller;
        },
        /**
         * Adds a listener
         * @api public
         */
        on: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (!this._events[name]) {
                this._events[name] = listener;
            } else if (Array.isArray(this._events[name])) {
                this._events[name].push(listener);
            } else {
                this._events[name] = [this._events[name], listener];
            }
            return this;
        },
        onPersist: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (!this._persistEvents[name]) {
                this._persistEvents[name] = listener;
            } else if (Array.isArray(this._persistEvents[name])) {
                this._persistEvents[name].push(listener);
            } else {
                this._persistEvents[name] = [this._persistEvents[name], listener];
            }
            return this;
        },
        /**
         * Adds a volatile listener.
         * @api public
         */

        once: function (name, fn, caller) {
            var self = this;
            var listener = this.__createListener(fn, caller);

            function on(arg1, arg2, arg3, arg4, arg5) {
                self.removeListener(name, on);
                fn.call(listener.caller, arg1, arg2, arg3, arg4, arg5);
            };
            on.listener = listener;
            this.on(name, on);
            return this;
        },
        /**
         * Removes a listener.
         * @api public
         */

        removeListener: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (this._events && this._events[name]) {
                var list = this._events[name];
                if (Array.isArray(list)) {
                    var pos = -1;
                    for (var i = 0, l = list.length; i < l; i++) {
                        var o = list[i];
                        if (this.__equalsListener(o, listener) || (o.listener && this.__equalsListener(o.listener, listener))) {
                            pos = i;
                            break;
                        }
                    }
                    if (pos < 0) {
                        return this;
                    }
                    list.splice(pos, 1);
                    if (!list.length) {
                        delete this._events[name];
                    }
                } else if (this.__equalsListener(list, listener) || (list.listener && this.__equalsListener(list.listener, listener))) {
                    delete this._events[name];
                }
            }
            return this;
        },
        removePersistListener: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (this._persistEvents && this._persistEvents[name]) {
                var list = this._persistEvents[name];
                if (Array.isArray(list)) {
                    var pos = -1;
                    for (var i = 0, l = list.length; i < l; i++) {
                        var o = list[i];
                        if (this.__equalsListener(o, listener) || (o.listener && this.__equalsListener(o.listener, listener))) {
                            pos = i;
                            break;
                        }
                    }
                    if (pos < 0) {
                        return this;
                    }
                    list.splice(pos, 1);
                    if (!list.length) {
                        delete this._persistEvents[name];
                    }
                } else if (this.__equalsListener(list, listener) || (list.listener && this.__equalsListener(list.listener, listener))) {
                    delete this._persistEvents[name];
                }
            }
            return this;
        },
        //移除NODE注册的所有事件。
        delListener: function (caller) {
            for (var name in  this._events) {
                var list = this._events[name];
                if (!Array.isArray(list)) {
                    list = [list];
                }
                list = list.concat();
                for (var i in list) {
                    var listener = list[i];
                    if (listener.caller && listener.fn && listener.caller === caller) {
                        this.removeListener(name, listener.fn, caller);
                    }
                }
            }
        },
        /**
         * Removes all listeners for an event.
         * @api public
         */

        removeAllListeners: function (name) {
            if (name === undefined) {
                this._events = {};
                return this;
            }
            if (this._events && this._events[name]) {
                //this._events[name] = null;
                delete this._events[name];
            }
            return this;
        },
        /**
         * Gets all listeners for a certain event.
         *
         * @api publci
         */

        listeners: function (name) {
            if (!this._events[name]) {
                this._events[name] = [];
            }
            if (!Array.isArray(this._events[name])) {
                this._events[name] = [this._events[name]];
            }
            return this._events[name];
        },
        /**
         * Emits an event.
         *
         * tip: use arg1...arg5 instead of arguments for performance consider.
         *
         * @api public
         */

        emit: function (name, arg1, arg2, arg3, arg4, arg5) {
            this._emitPersist(name, arg1, arg2, arg3, arg4, arg5);
            var handler = this._events[name];
            if (!handler) return this;
            if (typeof handler === 'object' && !Array.isArray(handler)) {
                handler.fn.call(handler.caller || this, arg1, arg2, arg3, arg4, arg5);
            } else if (Array.isArray(handler)) {
                var listeners = new Array(handler.length);
                for (var i = 0; i < handler.length; i++) {
                    listeners[i] = handler[i];
                }
                for (var i = 0, l = listeners.length; i < l; i++) {
                    var h = listeners[i];
                    if (h.fn.call(h.caller || this, arg1, arg2, arg3, arg4, arg5) === false) break;
                }
            }
            return this;
        },
        _emitPersist: function (name, arg1, arg2, arg3, arg4, arg5) {
            var handler = this._persistEvents[name];
            if (!handler) return this;
            if (typeof handler === 'object' && !Array.isArray(handler)) {
                handler.fn.call(handler.caller || this, arg1, arg2, arg3, arg4, arg5);
            } else if (Array.isArray(handler)) {
                var listeners = new Array(handler.length);
                for (var i = 0; i < handler.length; i++) {
                    listeners[i] = handler[i];
                }
                for (var i = 0, l = listeners.length; i < l; i++) {
                    var h = listeners[i];
                    if (h.fn.call(h.caller || this, arg1, arg2, arg3, arg4, arg5) === false) break;
                }
            }
            return this;
        }
    });
    jm.eventEmitter = function () {
        var event = new jm.EventEmitter();
        event.off = event.removeListener;
        return event;
    }
    var prototype = jm.EventEmitter.prototype;
    var EventEmitter = {
        _events: {},
        _persistEvents: {},
        delListener: prototype.delListener,
        removePersistListener: prototype.removePersistListener,
        _emitPersist: prototype._emitPersist,
        __createListener: prototype.__createListener,
        __equalsListener: prototype.__equalsListener,
        on: prototype.on,
        once: prototype.once,
        onPersist: prototype.onPersist,
        addListener: prototype.on,
        removeListener: prototype.removeListener,
        removeEventListener: prototype.removeListener,
        off: prototype.removeListener,
        removeAllListeners: prototype.removeAllListeners,
        listeners: prototype.listeners,
        emit: prototype.emit
    };
    var em = EventEmitter;
    jm.enableEvent = function (obj) {
        if (obj._events !== undefined) return;
        for (var key in em) {
            obj[key] = em[key];
        }
        obj._events = {};
        return this;
    };
    jm.disableEvent = function (obj) {
        for (var key in em) {
            delete obj[key];
        }
        return this;
    };
})();

(function(){
    if(jm.TagObject) return;
    jm.TagObject = jm.EventEmitter.extend({
        _className: 'tagObject',

        ctor: function(){
            this._super();
            this._tags = [];
            Object.defineProperty(this, "tags", { value: this._tags, writable: false });
        },

        destroy: function(){
            this.emit('destroy', this);
            this.removeAllTags();
        },

        hasTag: function(tag){
            var tags = this._tags;
            return tags.indexOf(tag) != -1;
        },

        hasTagAny: function(tags){
            for(var i in tags){
                var t = tags[i];
                if(this.hasTag(t)) return true;
            }
            return false;
        },

        hasTagAll: function(tags){
            for(var i in tags){
                var t = tags[i];
                if(!this.hasTag(t)) return false;
            }
            return true;
        },

        addTag: function(tag){
            var tags = this._tags;
            if (this.hasTag(tag)) return this;
            tags.push(tag);
            this.emit('addTag', tag);
            return this;
        },

        addTags: function(tags){
            for(var i in tags){
                var t = tags[i];
                this.addTag(t);
            }
            return this;
        },

        removeTag: function(tag){
            var tags = this._tags;
            var idx = tags.indexOf(tag);
            if(idx>=0){
                tags.splice(idx, 1);
            }
            this.emit('removeTag', tag);
            return this;
        },

        removeTags: function(tags){
            for(var i in tags){
                var t = tags[i];
                this.removeTag(t);
            }
            return this;
        },

        removeAllTags: function () {
            var v = this._tags;
            for(i in v){
                this.emit('removeTag', v[i]);
            }
            this._tags = [];
            this.emit('removeAllTags');
            return this;
        }

    });

    jm.tagObject = function(){return new jm.TagObject();}

    var prototype = jm.TagObject.prototype;
    var Tag = {
        _tags: [],
        hasTag: prototype.hasTag,
        hasTagAny: prototype.hasTagAny,
        hasTagAll: prototype.hasTagAll,
        addTag: prototype.addTag,
        addTags: prototype.addTags,
        removeTag: prototype.removeTag,
        removeTags: prototype.removeTags,
        removeAllTags: prototype.removeAllTags
    };
    jm.enableTag = function(obj) {
        if(obj._tags!=undefined) return;
        for(var key in Tag){
            obj[key] = Tag[key];
        }
        obj._tags = [];
        Object.defineProperty(obj, "tags", { value: obj._tags, writable: false });
        jm.enableEvent(obj);
    };
    jm.disableTag = function(obj) {
        for(var key in Tag){
            delete obj[key];
        }
        jm.disableEvent(obj);
    };
})();

(function () {
    if (jm.Entity) return;
    var guid = 1;

    function isEmptyObject(e) {
        var t;
        for (t in e)
            return false;
        return true;
    }

    jm.Entity = jm.TagObject.extend({
        _className: 'entity',

        ctor: function (entityManager) {
            this._super();

            this.entityManager = entityManager;
            this._components = {};
            this._componentsByClass = {};
            this._componentGUID = 1;

            this.active = true;
            this.entityId = guid++;

            Object.defineProperty(this, "components", {value: this._components, writable: false});
            Object.defineProperty(this, "componentsByClass", {value: this._componentsByClass, writable: false});

            this.on('addTag', function (tag) {
                entityManager._entitiesByTag[tag] = entityManager._entitiesByTag[tag] || {};
                entityManager._entitiesByTag[tag][this.entityId] = this;
            });
            this.on('removeTag', function (tag) {
                var o = entityManager._entitiesByTag[tag];
                if (!o) return;
                delete o[this.entityId];
                if (isEmptyObject(o))
                    delete entityManager._entitiesByTag[tag];
            });
        },

        destroy: function () {
            this.emit('destroy', this);
            this.removeAllComponents();
            this.removeAllTags();
        },

        removeChild: function (e) {
            this.entityManager.removeEntity(e.entityId);
            this.children = _.without(this.children, e);
            e.destroy();
        },

        removeFromParent: function () {
            this.removeAllTags();
            if (this.parent) {
                this.parent.removeChild(this);
            } else {
                this.entityManager.removeEntity(this.entityId);
            }
        },

        addComponent: function (c) {
            var components = this._components;
            var componentsByClass = this._componentsByClass;
            var name = c.name;
            var cClassName = c.className;

            var bUsedName = (name in components );
            if (bUsedName) {
                if (c.singleton) {
                    if (bUsedName) throw "componen already exists with the name: " + name;
                }
                name = cClassName + this._componentGUID++;
                c.name = name;
            }

            if (cClassName in componentsByClass) {
            } else {
                componentsByClass[cClassName] = {};
            }
            var vByClass = componentsByClass[cClassName];

            components[name] = c;
            vByClass[name] = c;
            this[name] = c;
            this.addTag(cClassName);
            if (c.classAlias) this.addTag(c.classAlias);

            c.onAdd(this);
            c.emit('add', this);
            this.emit('addComponent', c);

            return this;
        },

        removeComponent: function (c_or_name) {
            var components = this._components;
            var componentsByClass = this._componentsByClass;
            var c = c_or_name;
            if (typeof c == 'string') {
                c = components[c];
            }
            if (!c) return this;
            var name = c.name;
            var cClassName = c.className;
            var v = componentsByClass[cClassName];
            delete components[name];
            delete v[name];
            delete this[name];
            this.removeTag(cClassName);

            c.onRemove(this);
            c.emit('remove', this);
            this.emit('removeComponent', c);
            c.destroy();
            return this;
        },

        removeComponents: function (className) {
            var v = this.getComponents(className);
            for (i in v) {
                this.removeComponent(i);
            }
            delete this._componentsByClass[className];
            this.emit('removeComponents', className);
            return this;
        },

        removeAllComponents: function () {
            var v = this._components;
            for (i in v) {
                this.removeComponent(i);
            }
            this.emit('removeAllComponents');
            return this;
        },

        getComponent: function (name) {
            return this._components[name];
        },

        getComponents: function (className) {
            return this._componentsByClass[className];
        },

        /**
         * 鍘绘帀entityType涓凡缁忓畾涔夌殑鐩稿悓閮ㄥ垎
         */
        _clip: function (origin, target) {
            if (!origin) {
                return;
            }

            var obj = target;

            for (var key in target) {
                var t = target[key];
                var o = origin[key];
                if (_.isObject(t)) {
                    if (o) {
                        this._clip(o, t);
                    }
                    if (_.isEmpty(t)) {
                        delete target[key];
                    }
                    continue;
                }

                if (t === o) {
                    delete target[key];
                }
            }
        },

        toJSON: function () {
            var em = this.entityManager;
            var type = this.type;
            var et = em.entityType(type);

            var opts = {
                type: type,
                tags: [],
                components: {}
            };

            opts.tags = _.cloneDeep(this.tags);
            opts.tags = _.without(opts.tags, type);

            var cs = opts.components;
            var v = this.components;
            for (i in v) {
                var c = v[i];
                cs[i] = c.toJSON();
                opts.tags = _.without(opts.tags, i, c.className);
                if (c.classAlias) opts.tags = _.without(opts.tags, c.classAlias);
                if (i === cs[i].className)
                    delete cs[i].className;
            }

            for (i in et.tags) {
                opts.tags = _.without(opts.tags, et.tags[i]);
            }
            if (!opts.tags.length) delete opts.tags;

            //鍘绘帀entityType涓凡缁忓畾涔夌殑鐩稿悓閮ㄥ垎
            this._clip(et, opts);

            v = this.children;
            for (i in v) {
                var e = v[i];
                if (!opts.children) opts.children = [];
                opts.children.push(e.toJSON());
            }

            return opts;
        }

    });
})();
(function () {
    if (jm.Component) return;
    jm.Component = jm.TagObject.extend({
        _className: 'component',
        _singleton: true,
        _nameReadOnly: false,
        properties: {
            singleton: {get: 'getSignleton'},
            entity: {get: 'getEntity'},
            name: {get: 'getName', set: 'setName'}
        },

        ctor: function (entity, opts) {
            this._super();
            this._entity = entity;
            this.active = true;
            if (opts) this.attr(opts);
        },

        destroy: function () {
        },

        /**
         * on added to an entity
         * @param e
         */
        onAdd: function (e) {
        },

        /**
         * on removed from an entity
         * @param e
         */
        onRemove: function (e) {
        },

        getName: function () {
            return this._name || this.classAlias || this.className;
        },

        setName: function (name) {
            if (this._nameReadOnly) return;
            this._name = name;
        },

        getSignleton: function () {
            return this._singleton;
        },

        getEntity: function () {
            return this._entity;
        },

        toJSON: function () {
            return {
                className: this.classAlias || this.className
            };
        }

    });

    jm.root.registries.components = {
        'component': jm.Component
    };

    jm.Component.extend = function (opts) {
        var Class = jm.Class.extend.call(this, opts);
        Class.extend = jm.Component.extend;
        jm.root.registries.components[Class.prototype._className] = Class;
        return Class;
    };

})();
(function () {
    if (jm.Factory) return;
    jm.Factory = jm.EventEmitter.extend({
        _className: 'factory',

        ctor: function (entityManager, opts) {
            this._super(opts);
            this.entityManager = entityManager;
        },

        destory: function () {
            this.emit('destroy', this);
            this._super();
        },

        create: function (opts) {
            var e = new jm.Entity(this.entityManager);
            if (!opts || !opts.components) return e;
            if (opts.parent) {
                e.parent = opts.parent;
            }

            var c;
            var em = this.entityManager;
            for (var name in opts.components) {
                var info = opts.components[name];
                var className = name;
                if (info.className)
                    className = info.className;
                var C = em.component(className);
                if (!C) {
                    C = jm.root.registries.components[className];
                    if (C) {
                        em.addComponent(C, className);
                    } else {
                        console.log(className)
                        C = eval(className);
                        if (C) {
                            C = jm.root.registries.components[C.prototype._className];
                        }
                        if (C) {
                            em.addComponent(C, className, true);
                        } else {
                            em.emit('warn', 'can not find component ' + className + ', ignored');
                            continue;
                        }
                    }
                }
                c = new C(e, info);
                if (info.className)
                    c.name = name;
                e.addComponent(c);
            }
            this.emit('create', e);
            return e;
        }

    });


    jm.root.registries.factories = {
        'factory': jm.Factory
    };
    jm.Factory.extend = function (opts) {
        var Class = jm.Class.extend.call(this, opts);
        Class.extend = jm.Factory.extend;
        jm.root.registries.factories[Class.prototype._className] = Class;
        return Class;
    };
})();
(function () {
    if (jm.EntityManager) return;
    var __parseConfigInfo = function (opts, key) {
        var bArray = Array.isArray(opts);
        var className, name;
        if (bArray) {
            className = opts[key];
            name = null;
        } else {
            className = key;
            name = opts[key];
        }

        return {className: className, name: name};
    };

    jm.EntityManager = jm.EventEmitter.extend({
        _className: 'entityManager',

        ctor: function (opts) {
            this._super();

            this._components = {};
            this._processors = {};
            this._factories = {};
            this._entityTypes = {};
            this._pools = {};

            this._entities = {};
            this._entitiesByName = {};
            this._entitiesByTag = {};

            Object.defineProperty(this, "components", {value: this._components, writable: false});
            Object.defineProperty(this, "processors", {value: this._processors, writable: false});
            Object.defineProperty(this, "factories", {value: this._factories, writable: false});
            Object.defineProperty(this, "entityTypes", {value: this._entityTypes, writable: false});
            Object.defineProperty(this, "pools", {value: this._pools, writable: false});

            Object.defineProperty(this, "entities", {value: this._entities, writable: false});
            Object.defineProperty(this, "entitiesByName", {value: this._entitiesByName, writable: false});
            Object.defineProperty(this, "entitiesByTag", {value: this._entitiesByTag, writable: false});

            var v = jm.root.registries.factories;
            for (var key in v) {
                var o = new v[key](this);
                this.addFactory(o, key);
            }

            this.init(opts)
        },

        init: function (opts) {
            if (!opts) return;
            this.addComponents(opts.components);
            this.addProcessors(opts.processors);
            this.addFactories(opts.factories);
        },

        addComponents: function (opts) {
            var bArray = _.isArray(opts);
            for (var key in opts) {
                var info = __parseConfigInfo(opts, key);
                var C = eval(info.className);
                this.addComponent(C, info.className, true);
                this.addComponent(C, info.name);
            }
            return this;
        },

        addProcessors: function (opts) {
            for (var key in opts) {
                var info = __parseConfigInfo(opts, key);
                var o = eval('new ' + info.className + '(this)');
                if (info.name) {
                    this.addProcessor(o, info.name);
                } else {
                    this.addProcessor(o, info.className);
                }
            }
            return this;
        },

        addFactories: function (opts) {
            for (var key in opts) {
                var info = __parseConfigInfo(opts, key);
                var o = eval('new ' + info.className + '(this)');
                this.addFactory(o, info.className);
                this.addFactory(o, info.name);
            }
            return this;
        },

        addComponent: function (C, name, notAlias) {
            if (!C) return this;
            if (!name) {
                name = C.prototype._className;
            } else {
                if (!notAlias) {
                    if (name != C.prototype._className) {
                        C.prototype.classAlias = name;
                    }
                }
            }
            if (this._components[name]) {
                this.emit('warn', 'add Compoent already exists for ' + name + ', replaced.');
            }
            this._components[name] = C;
            this.emit('addComponent', name);
            return this;
        },

        removeComponent: function (name) {
            var components = this._components;
            var o = components[name];
            if (o) {
                this.emit('removeComponent', name);
            }
            delete components[name];
            return this;
        },

        component: function (name) {
            return this._components[name];
        },

        addEntityType: function (type, opts) {
            if (this._entityTypes[type]) {
                this.emit('warn', 'add entityType already exists for ' + type + ', replaced.');
            }

            this._entityTypes[type] = opts;
        },

        addEntityTypes: function (opts) {
            for (var type in opts) {
                this.addEntityType(type, opts[type]);
            }
        },

        entityType: function (type) {
            return this._entityTypes[type];
        },

        addFactory: function (f, name) {
            if (!f) return this;
            name = name || f.name || f.className;

            if (this._factories[name]) {
                this.emit('warn', 'add factory already exists for ' + name + ', replaced.');
            }

            this._factories[name] = f;
            if (f.entityManager != this)
                f.entityManager = this;
            this.emit('addFactory', f);

            return this;
        },

        removeFactory: function (name) {
            var factories = this._factories;
            var f = factories[name];
            if (f) {
                this.emit('removeFactory', f);
                delete factories[name];
                f.destroy();
            }
            return this;
        },

        factory: function (name) {
            return this._factories[name];
        },

        addProcessor: function (p, name) {
            if (!p) return this;
            if (!name)
                name = p.name || p.className;

            if (this._processors[name]) {
                this.emit('warn', 'add processor already exists for ' + name + ', replaced.');
            }

            this._processors[name] = p;
            if (p.entityManager != this)
                p.entityManager = this;
            this.emit('addProcessor', p);

            return this;
        },

        removeProcessor: function (name) {
            var processors = this._processors;
            var p = processors[name];

            if (p) {
                this.emit('removeProcessor', p);
                delete processors[name];
                p.destroy();
            }

            return this;
        },

        processor: function (name) {
            return this._processors[name];
        },

        //__createEntityFromPool: function (type, opts, parent) {
        //    if (!this._entityTypes[type].poolable) return null;
        //    if (parent) return null;
        //    if (opts && opts.parent) return null;
        //    if (this._pools[type]) {
        //        var e = this._pools[type].shift();
        //        if (e) {
        //            e.emit('reuse', opts);
        //            this.addEntity(e);
        //            return e;
        //        }
        //    }
        //    return null;
        //},

        createEntity: function (type, opts, parent) {
            var e = null;

            var _opts = opts;
            opts = {};
            opts = _.cloneDeep(this._entityTypes[type]); //克隆
            if (_opts) {
                opts = _.merge(opts, _.cloneDeep(_opts)); //合并
            }

            var name = opts.factory || 'factory';
            var f = this._factories[name];
            if (!f) return null;
            if (parent) opts.parent = parent;
            e = f.create(opts);
            if (!e) {
                return null;
            }

            e.type = type;
            e.addTag(type);
            e.addTags(opts.tags);
            this.addEntity(e);

            this.createEntityChildren(e, opts);

            return e;
        },

        createEntityChildren: function (e, opts) {
            //create Children
            for (var i in opts.children) {
                var info = opts.children[i];
                if (!info) continue;
                var o = null;
                var className = info.className || 'jm.Entity';
                if (className == 'jm.Entity') {
                    var type = info.type;
                    o = this.createEntity(type, info, e);
                }
                if (!e.children) {
                    e.children = [];
                }
                e.children.push(o);
            }
        },

        addEntity: function (e, tag) {
            if (!e || !e.entityId) {
                return this;
            }

            if (tag) {
                e.addTag(tag);
            }

            this._entities[e.entityId] = e;
            if (e.name) {
                this._entitiesByName[e.name] = e;
            }

            e.emit('add', this);
            this.emit('addEntity', e);

            return this;
        },
        //
        //__removeEntityToPool: function (e) {
        //    var type = e.type;
        //    if (!this._entityTypes[type].poolable) return false;
        //    if (e.parent) return false;
        //    //濡傛灉鍙睜鍖? 瀛樺埌姹犻噷
        //    if (!this._pools[type]) this._pools[type] = [];
        //    var pool = this._pools[type];
        //    e.emit('unuse');
        //    pool.push(e);
        //    return true;
        //},
        //
        //clearPool: function (type) {
        //    var pool = this._pools[type];
        //    if (!pool) return;
        //    this._pools[type] = [];
        //    pool.forEach(function (e) {
        //        e.destroy();
        //    });
        //},
        //
        //clearPools: function () {
        //    for (var type in this._pools) {
        //        this.clearPool(type);
        //    }
        //},

        removeEntity: function (entityId) {
            var e;
            if (_.isObject(entityId)) {
                e = entityId;
            } else {
                e = this._entities[entityId];
            }
            if (!e) {
                return this;
            }

            this.removeEntityChildren(e);

            e.emit('remove', this);
            this.emit('removeEntity', e);
            delete this._entities[e.entityId];

            if (e.name) {
                delete this._entitiesByName[e.name];
            }

            //if (this.__removeEntityToPool(e)) {
            //    return this;
            //} else {
            //    e.destroy();
            //}
            e.destroy();
            return this;
        },

        removeEntityChildren: function (e) {
            var v = e.children;
            for (var i in v) {
                var _e = v[i];
                this.removeEntity(_e.entityId);
            }
        },

        getEntityById: function (eid) {
            return this._entities[eid];
        },
//    getEntities('render')
//    getEntities('render move tag1')  and
//    getEntities('render, move, tag1')   or
        getEntities: function (selector) {
            var entities = this._entities;
            if (!selector) return entities;
            var v = {};
            //select entities by tags
            if (typeof selector === 'string') {
                var and = false, //flags for multiple
                    or = false;

                var rlist = /\s*,\s*/;
                var rspace = /\s+/;
                var del;
                //multiple components OR
                if (selector.indexOf(',') !== -1) {
                    or = true;
                    del = rlist;
                } else if (selector.indexOf(' ') !== -1) {
                    and = true;
                    del = rspace;
                }
                if (!and && !or) {
                    return this._entitiesByTag[selector];
                }
                var tags = selector.split(del);
                var e;
                for (var entityId in entities) {
                    e = entities[entityId];
                    if (and) {
                        if (!e.hasTagAll(tags)) continue;
                    } else if (or) {
                        if (!e.hasTagAny(tags)) continue;
                    }
                    v[entityId] = e;
                }
            }

            return v;
        },

        getEntity: function (selector) {
            var v = this.getEntities(selector);
            for (var i in v) {
                return v[i];
            }
            return null;
        },

        update: function (delta) {
            this.emit('update', delta);
            var processors = this._processors;
            for (var name in processors) {
                var p = processors[name];
                p.process(delta);
            }
        }

    });

    jm.entityManager = function (opts) {
        return new jm.EntityManager(opts);
    }
})();
(function () {
    if (jm.sprintf)return;
    var sprintfWrapper = {
        init: function () {
            if (typeof arguments == 'undefined') {
                return null;
            }
            if (arguments.length < 1) {
                return null;
            }
            if (typeof arguments[0] != 'string') {
                return null;
            }
            if (typeof RegExp == 'undefined') {
                return null;
            }
            var string = arguments[0];
            var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
            var matches = new Array();
            var strings = new Array();
            var convCount = 0;
            var stringPosStart = 0;
            var stringPosEnd = 0;
            var matchPosEnd = 0;
            var newString = '';
            var match;
            while (match = exp.exec(string)) {
                if (match[9]) {
                    convCount += 1;
                }
                stringPosStart = matchPosEnd;
                stringPosEnd = exp.lastIndex - match[0].length;
                strings[strings.length] = string.substring(stringPosStart, stringPosEnd);
                matchPosEnd = exp.lastIndex;
                matches[matches.length] = {
                    match: match[0],
                    left: match[3] ? true : false,
                    sign: match[4] || '',
                    pad: match[5] || ' ',
                    min: match[6] || 0,
                    precision: match[8],
                    code: match[9] || '%',
                    negative: parseInt(arguments[convCount]) < 0 ? true : false,
                    argument: String(arguments[convCount])
                };
            }
            strings[strings.length] = string.substring(matchPosEnd);
            if (matches.length == 0) {
                return string;
            }
            if ((arguments.length - 1) < convCount) {
                return null;
            }
            for (var i = 0; i < matches.length; i++) {
                var substitution;
                if (matches[i].code == '%') {
                    substitution = '%'
                }
                else if (matches[i].code == 'b') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                    substitution = sprintfWrapper.convert(matches[i], true);
                }
                else if (matches[i].code == 'c') {
                    matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                    substitution = sprintfWrapper.convert(matches[i], true);
                }
                else if (matches[i].code == 'd') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                    substitution = sprintfWrapper.convert(matches[i]);
                }
                else if (matches[i].code == 'f') {
                    matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                    substitution = sprintfWrapper.convert(matches[i]);
                }
                else if (matches[i].code == 'o') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                    substitution = sprintfWrapper.convert(matches[i]);
                }
                else if (matches[i].code == 's') {
                    matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                    substitution = sprintfWrapper.convert(matches[i], true);
                }
                else if (matches[i].code == 'x') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = sprintfWrapper.convert(matches[i]);
                }
                else if (matches[i].code == 'X') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
                }
                else {
                    substitution = matches[i].match;
                }
                newString += strings[i];
                newString += substitution;
            }
            newString += strings[i];
            return newString;
        },
        convert: function (match, nosign) {
            if (nosign) {
                match.sign = '';
            } else {
                match.sign = match.negative ? '-' : match.sign;
            }
            var l = match.min - match.argument.length + 1 - match.sign.length;
            var pad = new Array(l < 0 ? 0 : l).join(match.pad);
            if (!match.left) {
                if (match.pad == '0' || nosign) {
                    return match.sign + pad + match.argument;
                } else {
                    return pad + match.sign + match.argument;
                }
            } else {
                if (match.pad == '0' || nosign) {
                    return match.sign + match.argument + pad.replace(/0/g, ' ');
                } else {
                    return match.sign + match.argument + pad;
                }
            }
        }
    };
    jm.sprintf = sprintfWrapper.init;

})();



