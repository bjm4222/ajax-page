var fs = require('fs');
var url = require('url');
var http = require('http');

var server = http.createServer(function (req, res) {
    var objUrl = url.parse(req.url, true);
    var pathname = objUrl.pathname;
    var query = objUrl.query;
    var reg = /\.(HTML|JS|JSON|CSS|TXT|ICO)/i;

    //静态资源文件的处理
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
            {
                suffixMIME = 'text/html';
            }
                break;
            case 'CSS':
            {
                suffixMIME = 'text/css';
            }
                break;
            case 'JS':
            {
                suffixMIME = 'application/js';
            }
                break;
            case 'JSON':
            {
                suffixMIME = 'application/json';
            }
                break;
            case 'TXT':
            {
                suffixMIME = 'text/html';
            }
                break;
        }
        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf8');
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf8'});
            res.end(conFile);
        } catch (err) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf8'});
            res.end();
        }
    }

    //获取所有用户信息
    function getAllUserInfo() {
        //读取文件中所有用户的信息
        var allUserInfo = fs.readFileSync('./data/data.json', 'utf8');
        //如果用户一个都没有，设置空数组
        (!allUserInfo) && (allUserInfo = '[]');
        //转换成json对象
        return JSON.parse(allUserInfo);
    }

    //根据page在所有用户中找出客户端需要的用户信息
    function getUserInfoFromPage(allUserInfo, page) {
        var start = (page - 1) * 10;
        var end = (page * 10) - 1;
        //临界判断
        end = (end > allUserInfo.length - 1 ? allUserInfo.length - 1 : end);
        var ary = [];
        for (var i=start; i<=end; i++){
            ary.push(allUserInfo[i]);//将用户保存到ary中
        }
        return ary;//将获取的用户信息返回
    }

    //根据id获取指定用户
    function getUserInfoFromId(allUserInfo, id){
        for (var i=0; i<allUserInfo.length; i++){//遍历所有用户
            if (allUserInfo[i].id == id){ //找到匹配的用户
                return allUserInfo[i]; //返回匹配的用户
            }
        }
        return null;//没找到返回null
    }

    //前后端接口(API)的处理
    if (pathname == '/getList') {  //获取某一页用户的信息
        //1: 获取url中page值
        var page = parseInt(query.page);
        console.log(page);
        //2: 获取所有用户的信息
        var allUserInfo = getAllUserInfo();
        //3: 在所有用户中找到page用户的信息
        var ary = getUserInfoFromPage(allUserInfo, page);
        //4: 确定总页数的信息
        var total = Math.ceil(allUserInfo.length/10);
        //5: 根据接口信息将page用户信息进行返回
        var result = {};//返回给客户端的信息
        result.code = ary.length ? 0 : 1;
        result.msg = ary.length?'获取指定页用户信息成功':'获取指定页用户信息失败';
        result.total = total;
        result.data = ary;

        //将result返回给客户端
        res.writeHead(200, {'content-type':'application/json;charset=utf8'});
        res.end(JSON.stringify(result));
    }

    //获取指定用户的信息
    if (pathname == '/getInfo'){
        //1: 获取url中用户的id号
        var id = parseInt(query.id);
        //2: 获取所有用户信息
        var allUserInfo = getAllUserInfo();
        //3: 在所有用户信息中找到id匹配的用户信息
        var userInfo = getUserInfoFromId(allUserInfo, id);
        //4: 根据接口返回找到的用户信息
        var result = {};
        result.code = userInfo?0:1;
        result.msg = userInfo?'获取指定用户信息成功':'获取指定用户信息失败';
        result.data = userInfo;

        //将result返回给客户端
        res.writeHead(200, {'content-type':'application/json;charset=utf8'});
        res.end(JSON.stringify(result));
    }

});


server.listen(8888);