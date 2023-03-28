const span_captcha = document.querySelector('#span_captcha');
let curr_captcha = '';

function update_captcha() {
  let arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let vcode = new Array();
  for (i = 0; i < 4; i++) {
    let sjs = Math.floor(Math.random() * 62); //有多少个要用到的字符就是多少个 此处大小写字母各26个 还有0-9有10个
    vcode.push(arr[sjs]);
  }
  span_captcha.innerText = curr_captcha = vcode.join('');
}

update_captcha();

span_captcha.addEventListener('click', function () {
  update_captcha();
});

document.querySelector('#btn-login').addEventListener('click', function () {
  
  const login_result = document.querySelector('#login-result');
  const form_ele_username = document.querySelector('#username');
  const form_ele_password = document.querySelector('#password');
  const form_ele_captcha = document.querySelector('#captcha');
  let captcha = form_ele_captcha.value;
  let username = form_ele_username.value;
  let password = form_ele_password.value;
  login_result.innerText = '';

  if (username == null || username.trim().length == 0) {
    login_result.innerText = '用户名不能为空';
    login_result.style.color = 'red';
    return;
  }
  if (
    password == null ||
    password.trim().length < 6 ||
    password.trim().length > 16
  ) {
    login_result.innerText = '密码长度不符合要求';
    login_result.style.color = 'red';
    return;
  }
  if (captcha == null || captcha.trim().length == 0) {
    login_result.innerText = '未填写验证码';
    login_result.style.color = 'red';
    return;
  }
  if (captcha.toLowerCase() !== curr_captcha.toLowerCase()) {
    login_result.innerText = '验证码错误';
    login_result.style.color = 'red';
    update_captcha();
    return;
  }
  if(username==='000001' && password==='1qaz2wsx'){
    alert("用户登录成功");
    document.location="index.html";
  }else{
    alert("用户登录失败");
    update_captcha();
  }
});
