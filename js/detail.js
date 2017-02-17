//解析出url中的参数
//例子：http://localhost:8888/detail.html?age=18&id=2
function queryString(url){
    var reg = /([^?#=&]+)=([^?#=&]+)/g;
    var obj = {};
    url.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}

