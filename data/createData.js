var fs = require('fs');

function getRandomNum(m, n){  //产生随机值，在m~n之间
    return Math.round(Math.random()*(n-m)+m);
}

var str = '立刻就会收到反馈就好了水电费看了黄金时代分开了黄金时代分开久了会打扫房间开好了水电费看了黄金时代分离即可获得是否看见了华盛顿附近开了';

var ary = [];
for (var i=1; i<=98; i++){
    var obj = {}; //创建用户信息
    obj.id = i;
    obj.name = str[getRandomNum(0, str.length-1)]+str[getRandomNum(0, str.length-1)];
    obj.sex = getRandomNum(0, 1);
    obj.score = getRandomNum(50, 100);

    ary.push(obj); //用户信息保存到数组中
}

fs.writeFileSync('./data.json', JSON.stringify(ary), 'utf8');

