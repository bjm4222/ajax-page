var listModel = (function () {
    var curPage = 1; //当前显示页
    var totalPage = 0; //一共有多少页

    var userList = document.getElementById('userList');//获取用户列表区域
    var page = document.getElementById('page');//获取页码区域
    var pageControl = document.getElementById('pageControl');//获取页码控制区域
    var pageGo = document.getElementById('pageGo');//获取页码跳转区域

    //给html中的元素绑定事件
    function bindEvent() {
        //绑定页码区域
        pageControl.onclick = function (ev) {
            ev = ev || window.event;   //获取event
            var tar = ev.target || ev.srcElement;//获取事件源
            var tarName = tar.tagName.toUpperCase(); //获取元素名字
            if (tarName == 'SPAN') {
                if (tar.innerHTML == '首页') {
                    if (curPage == 1) {//当前本身就是首页
                        return; //不用跳转
                    }
                    curPage = 1;
                } else if (tar.innerHTML == '上一页') {
                    if (curPage == 1) {
                        return;
                    }
                    curPage--;
                } else if (tar.innerHTML == '下一页') {
                    if (curPage == totalPage) {
                        return;
                    }
                    curPage++;
                } else if (tar.innerHTML == '尾页') {
                    if (curPage == totalPage) {
                        return;
                    }
                    curPage = totalPage;
                }
            } else if (tarName == 'LI') {
                var val = parseInt(tar.innerHTML);//获取点击的是第几页
                if (val == curPage) { //如果点击的就是当前页, 不需要跳转
                    return;
                }
                curPage = val;//设置当前页是点击的页码

            } else if (tarName == 'INPUT') {
                return;
            }
            sendAjax();//发送ajax请求, 从新渲染页面
        }

        //绑定页面跳转区域
        pageGo.onkeyup = function (ev) {
            ev = ev || window.event;
            if (ev.keyCode == 13){ //回车键
                var val = parseInt(this.value);//获取input中的内容
                //有效数字
                if (!isNaN(val)){
                    if (val == curPage){
                        return
                    } else if (val > totalPage){
                        val = totalPage;
                    } else if (val < 1){
                        val = 1;
                    }
                    curPage = val;
                }
                //无效数字
                this.value = curPage;
                sendAjax();
            }
        }

        //绑定用户列表区域
        userList.onclick = function (ev) {
            ev = ev || window.event;
            var tar = ev.target||ev.srcElement;//事件源
            var tarName = tar.parentNode.tagName;
            if ((tarName=='LI') && (tar.parentNode.parentNode.id == 'userList')){
                var id = parseInt(tar.parentNode.getAttribute('userId')); //获取自定义属性值
                //在原来页面中覆盖
                //window.location.href = '/detail.html';
                //打开新的页面，原页面保留
                window.open('/detail.html?id='+id);
            }
        }
    }

    //绑定html页面，用真实数据替换假数据
    function bindHTML(ary) {
        var str = '';

        //绑定用户列表区域
        for (var i = 0; i < ary.length; i++) {  //遍历所有用户信息
            var userInfo = ary[i];//每个用户信息
            str += '<li userId="'+userInfo.id+'"> <span>' + userInfo.id + '</span> <span>' + userInfo.name + '</span> <span>' + (userInfo.sex ? "女" : "男") + '</span> <span>' + userInfo.score + '</span> </li>';
        }
        userList.innerHTML = str;

        //绑定页码区域
        str = '';//清空字符串
        for (var i = 1; i <= totalPage; i++) {
            str += '<li class="' + (curPage == i ? 'select' : '') + '">' + i + '</li>';
        }
        page.innerHTML = str;

        //绑定事件
        bindEvent();
    }

    function sendAjax() {
        ajax({
            type: 'get',
            url: '/getList?page=' + curPage,
            async: true,
            data: null,
            dataType: 'json',
            success: function (data) {
                if ((data.code == 0) && (data.data)) {
                    totalPage = data.total;//总页数
                    bindHTML(data.data);  //绑定html
                }
            }
        });
    }

    function init() {
        sendAjax();
    }

    return {
        init: init
    }
})();
listModel.init();