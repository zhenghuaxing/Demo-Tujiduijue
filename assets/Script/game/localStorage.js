module.exports = {
    _localStorage: {},
    clear: function () {
        this._localStorage = {};
        cc.sys.localStorage.clear();
    },
    removeItem: function (key) {
        cc.sys.localStorage.removeItem(key);
        delete this._localStorage[key];
    },
    setItem: function (key, value) {
        this._localStorage[key] = value;
        try {
            value = JSON.stringify(value);
        } catch (e) {
            value = value;
        }
        cc.sys.localStorage.setItem(key, value);
    },
    getItem: function (key) {
        if (this._localStorage[key]) {
            return this._localStorage[key];
            let value = cc.sys.localStorage.getItem(key);
            if (value) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    value = value;
                }
                this._localStorage[key] = value;
                return value;
            }
            return null;
        }
    }
}