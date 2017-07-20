
; (function () {
  var btn = document.getElementById('button');
  var txt = document.getElementById('txt');
  var cast = document.getElementById('cast');
  function openWs() {

    var ws = new WebSocket('ws://' + location.hostname + ':' + location.port + '/');
    function send() {
      if (txt.value != '') {
        // ws.send(JSON.stringify({
        //   sid: getCookie('connect.sid'),
        //   txt: txt.value
        // }));
        ws.send(txt.value);
        txt.value = '';
      }
    }
    ws.onmessage = function (msg) {
      if (msg.data == "未登录") {
        return;
      }
      debugger;
      var data = JSON.parse(msg.data);
      var div = document.createElement("div");
      var p = document.createElement("p");
      p.innerHTML = "用户：" + (data.isMySelf ? "我（" + data.user + "）" : data.user);
      var pre = document.createElement("pre");
      if (data.isMySelf) {
        div.className = "txt-right";
      }
      pre.innerHTML = data.msg;

      div.appendChild(p);
      div.appendChild(pre);

      cast.appendChild(div);
      cast.scrollTop = cast.scrollHeight;
    }
    btn.onclick = function () {
      send();
    }
    var enterDown = false, crilDown = false;
    txt.onkeydown = function (e) {
      e = e || event;
      e.keyCode == 13 && (enterDown = true);
      e.keyCode == 17 && (crilDown = true);
      if (crilDown && enterDown) {
        send();
      }
      return true;
    }
    txt.onkeyup = function (e) {
      e = e || event;
      e.keyCode == 13 && (enterDown = false);
      e.keyCode == 17 && (crilDown = false);
    }

  }

  $.ajax({
    url: 'getUser',
    type: "get",
    async: false,
    cache: false,
    success: function (res) {
      console.log(res);
      console.log(res.isSuccess);
      console.log(res.name);
      if (res.isSuccess && res.name) {
        openWs();
      } else {
        initUser();
      }
    }
  })

  function initUser() {

    var name = prompt("请输入您的名字", "");
    if (name == null) {
      name = '匿名'
    }
    $.ajax({
      url: 'setUser',
      type: "post",
      async: false,
      cache: false,
      data: {
        user: name
      },
      success: function (res) {
        if (res.isSuccess) {

          openWs();
        }
      }
    });

  }
})();