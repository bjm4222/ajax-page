//ajax封装
(function () {
    function createXHR() {
        var ary = [function () {
            return new XMLHttpRequest()
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }, function () {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }, function () {
            return new ActiveXObject('Msxml3.XMLHTTP');
        }];
        var xhr = null;
        var flag = false;
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            try {
                xhr = cur();//调用方法
                createXHR = cur; //调用成功, 替换createXHR为适合当前浏览器的创建ajax方法
                flag = true;//找到创建ajax的方法
                break; //结束循环
            } catch (err) {
                //报错, 继续执行后面的方法创建ajax对象
            }
        }
        if (!flag) { //没有找到适合当前浏览器创建ajax的方法
            throw errors('没有适合当前浏览器的创建ajax的方法');
        }
        return xhr;
    }

//ajax实现ajax请求的公共方法
    function ajax(options) {
        //把需要使用的参数值指定默认的初始值, 一旦没有传递的话可以使用默认值进行赋值
        var _default = {
            type: 'get', //请求方式
            url: null,  //请求url地址
            async: true,  //是否异步
            data: null,  //请求体数据
            dataType: 'json',//设置请求回来的数据格式'json'就是将请求回来的数据转换成json对象 'txt'就是请求回来的数据为字符串
            success: null   //请求成功时的回调
        };

        //使用实参替换默认值
        for (var attr in options) {  //遍历options
            if (options.hasOwnProperty(attr)) { //获取私有属性
                _default[attr] = options[attr];    //用options替换_default
            }
        }


        //解决get请求的缓存问题
        if (_default.type == 'get'){
            //如果url中已经包含'?'则在原有基础上增加&_=随机数, 否则url末尾增加?_=随机数, 解决get请求的缓存问题
            _default.url += (((_default.url.indexOf('?')>=0)?' &_=': '?_=')+Math.random());
        }


        //1: 实例化ajax对象
        var xhr = createXHR();

        xhr.open(_default.type, _default.url, _default.async);

        xhr.onreadystatechange = function () {
            if (/^2\d{2}$/.test(xhr.status)) {
                //状态码为4的时候
                if (xhr.readyState == 4) {
                    var val = xhr.responseText;
                    //如果传递的dataType类型是json, 说明获取的是json对象
                    if (_default.dataType == 'json') {
                        val = 'JSON' in window ? JSON.parse(val) : eval('(' + val + ')');
                    }
                    _default.success && _default.success.call(xhr, val);
                }
            }
        };
        //发送ajax请求, 参数是请求主体信息
        xhr.send(_default.data);
    }

    //将ajax变成全局属性
    window.ajax = ajax;
})();