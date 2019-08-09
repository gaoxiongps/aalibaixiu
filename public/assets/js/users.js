//主要是用于操作用户的
var userArr = new Array();

//将用户列表展示出来
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        render(userArr);
    }
})
//用于调用template方法
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    $('tbody').html(str);
}
//添加用户功能
$('#userAdd').on('click', function () {
    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function (res) {
            userArr.push(res);
            render(userArr);
        }

    })
})
// 显示用户头像
$('#avatar').on('change', function () {
    //用户选择到的文件
    //this.files[0];
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax方法不要解析请求参数
        processData: false,
        //告诉$$.ajax方法不要设置请求参数的类型
        contentType: false,
        success: function (response) {
            //实现头像预览功能
            $('#preview').attr('src', response[0].avatar);
            //将图片的地址添加到表单里面的隐藏域
            $('#hiddenAvatar').val(response[0].avatar);
        }
    })
});

var userId;
// 编辑用户功能 
$('tbody').on('click', '.edit', function () {
    userId = $(this).parent().attr('data-id');
    $('#userForm > h2').text('修改用户');

    // 先获取 当前被点击这个元素的祖先 叫tr 
    var trObj = $(this).parents('tr');

    // 获取图片的地址
    var imgSrc = trObj.children().eq(1).children('img').attr('src');
    // 将图片的地址写入到隐藏域 
    $('#hiddenAvatar').val(imgSrc);
    // 如果imgSrc有值 我们
    if (imgSrc) {
        $('#preview').attr('src', imgSrc);
    } else {
        $('#preview').attr('src', "../assets/img/default.png");
    }

    // 将对应的内容写入到左边的输入框里面
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    var status = trObj.children().eq(4).text();
    if (status == '激活') {
        $('#jh').prop('checked', true);
    } else {
        $('#wjh').prop('checked', true);
    }

    var role = trObj.children().eq(5).text();

    if (role == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }

    $('#userAdd').hide();
    $('#userEdit').show();

});
//完成修改用户功能
$('#userEdit').on('click', function () {
    //我们需要发送ajax给服务器时 需要传递id
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
            var index = userArr.findIndex(item => item._id == userId);
            userArr[index] = res;
            render(userArr);
        }
    })
})
