Number.prototype.format = function (a) {
    a = a || 3;
    a++;
    var add = Math.pow(10, a);
    var num = Math.round(this * add);
    var str = num.toString();
    var fu = str.substring(0, 1);
    if (fu == "-" || fu == "+") { //带符号的情况
        str = str.substring(1, str.length)
    }
    else {
        fu = "+"
    }
    while (str.length < a)
        str = "0" + str;
    var str2 = fu + str.substring(0, str.length - a) + "." + str.substring(str.length - a, str.length - 1);
    return parseFloat(str2);
}