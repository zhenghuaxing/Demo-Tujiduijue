cc.Class({
    extends: cc.Component,
    properties: {
        huaValue: 100,
        huaLevel: 1
    },
    onDestroy() {
    },
    onLoad() {
        this.updateHua();
    },
    setHua(value) {
        this.huaValue = value;
        this.updateHua();
    },
    updateHua() {
        let hueValue = Math.PI * 2 * this.huaValue / 255;
        let mat = this.hueMatrix(hueValue);
        let red = cc.v4(mat[0][0], mat[0][1], mat[0][2], 1);
        let green = cc.v4(mat[1][0], mat[1][1], mat[1][2], 1);
        let blue = cc.v4(mat[2][0], mat[2][1], mat[2][2], 1);
        let renderComponents = this.node.getComponents(cc.RenderComponent);
        let renderComponent = renderComponents[0];
        let material = renderComponent.getMaterial(0);
        let isLua = (material.name.indexOf("hua") >= 0)
        if (isLua) {
            material.setProperty("red", red);
            material.setProperty("green", green);
            material.setProperty("blue", blue);
            material.setProperty("huaLevel", this.huaLevel);
        }
    },
    xRotateMat: function (mat, rs, rc) {
        mat[0][0] = 1.0;
        mat[0][1] = 0.0;
        mat[0][2] = 0.0;
        mat[1][0] = 0.0;
        mat[1][1] = rc;
        mat[1][2] = rs;
        mat[2][0] = 0.0;
        mat[2][1] = -rs;
        mat[2][2] = rc;
    },
    yRotateMat: function (mat, rs, rc) {
        mat[0][0] = rc;
        mat[0][1] = 0.0;
        mat[0][2] = -rs;
        mat[1][0] = 0.0;
        mat[1][1] = 1.0;
        mat[1][2] = 0.0;
        mat[2][0] = rs;
        mat[2][1] = 0.0;
        mat[2][2] = rc;
    },
    zRotateMat: function (mat, rs, rc) {
        mat[0][0] = rc;
        mat[0][1] = rs;
        mat[0][2] = 0.0;
        mat[1][0] = -rs;
        mat[1][1] = rc;
        mat[1][2] = 0.0;
        mat[2][0] = 0.0;
        mat[2][1] = 0.0;
        mat[2][2] = 1.0;
    },
    matrixMult: function (a, b, c) {
        var x, y;
        var temp = [];
        for (y = 0; y < 3; y++) {
            temp[y] = [];
            for (x = 0; x < 3; x++) {
                temp[y][x] = b[y][0] * a[0][x] + b[y][1] * a[1][x] + b[y][2] * a[2][x];
            }
        }
        for (y = 0; y < 3; y++) {
            for (x = 0; x < 3; x++) {
                c[y][x] = temp[y][x];
            }
        }
    },
    mat1000: function (mat) {
        for (var i = 0; i < mat.length; i++) {
            for (var j = 0; j < mat[i].length; j++) {
                var temp = mat[i][j];
                mat[i][j] = temp * 1000;
            }
        }
    },
    //色调矩阵
    hueMatrix: function (hue) {
        var mat = [];
        mat[0] = [];
        mat[1] = [];
        mat[2] = [];
        var rot = [];
        rot[0] = [];
        rot[1] = [];
        rot[2] = [];
        var seq2 = Math.sqrt(2);
        var seq3 = Math.sqrt(3);
        var mag, xrs, xrc, yrs, yrc, zrs, zrc;
        mag = seq2;
        xrs = 1.0 / mag;
        xrc = 1.0 / mag;
        this.xRotateMat(mat, xrs, xrc);
        mag = seq3;
        yrs = -1.0 / mag;
        yrc = seq2 / mag;
        this.yRotateMat(rot, yrs, yrc);
        this.matrixMult(rot, mat, mat);
        zrs = Math.sin(hue);
        zrc = Math.cos(hue);
        this.zRotateMat(rot, zrs, zrc);
        this.matrixMult(rot, mat, mat);
        this.yRotateMat(rot, -yrs, yrc);
        this.matrixMult(rot, mat, mat);
        this.xRotateMat(rot, -xrs, xrc);
        this.matrixMult(rot, mat, mat);
        return mat;
    },
    start() {
    },
// update (dt) {},
})
;
