module.exports = {
//获取两点之间的角
    getRotation: function (start, end) {
        //算好初始位置和初始角度
        var angle = Math.atan2(end.y - start.y, end.x - start.x);
        if (angle < 0)
            angle = angle + Math.PI * 2;
        else if (angle > Math.PI * 2)
            angle = angle - Math.PI * 2;
        //var rotation = 360.0-angle * 180.0 / Math.PI;//原图的初始角度是向右用360- 向左则用180-
        var rotation = angle * 180.0 / Math.PI;//原图的初始角度是向右用360- 向左则用180-
        return rotation;
    },
    standardRotation: function (rotation) {
        while (rotation > 180) {
            rotation = rotation - 360;
        }
        while (rotation < -180) {
            rotation = rotation + 360;
        }
        return rotation;
    },
    limitRotation: function (rotation, start, end) {
        var a = Math.abs(rotation - start);
        var b = Math.abs(end - rotation);
        return a < 180 && b < 180;
    },
    getNextPos: function (pos, len, rotation) {
        var angle = rotation * Math.PI / 180;
        var x = pos.x + Math.cos(angle) * len;
        var y = pos.x + Math.sin(angle) * len;
        return cc.v2(x, y);
    },
    getLength: function (p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },
    getSpriteFrames: function (atlas, textName) {
        textName = textName + "_"
        var frames = [];
        var i = 0;
        while (true) {
            var frameName = jm.sprintf('%s%d', textName, i);
            var frame = atlas.getSpriteFrame(frameName);
            if (!frame) {
                frameName = jm.sprintf('%s%02d', textName, i);
                frame = atlas.getSpriteFrame(frameName);
            }
            if (frame) {
                frames.push(frame);
            }
            else if (i > 1) {
                break;
            }
            i++;
        }
        return frames;
    },
}
