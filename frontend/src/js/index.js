$("#getFile").click(function(){
    var url = '/dl/type/direct?filename=a.xlsx';
    $.get(url, function (data) {
      console.log(typeof(data))
      blob = new Blob([data])
      var a = document.createElement('a');
      a.download = 'data.xlsx';
      a.href=window.URL.createObjectURL(blob)
      a.click()
    });
    //这种方式保存的文件是不能打开的，console.log(typeof(data))会看到是string类型，原因是jquery将返回的数据转换为了string，不支持blob类型。
});

$("#getFile2").click(function(){
    var url = '/dl/type/direct?filename=a.xlsx';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
    xhr.responseType = "blob";  // 返回类型blob
    xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement('a');
            a.download = 'data.xlsx';
            a.href = e.target.result;
            $("body").append(a);  // 修复firefox中无法触发click
            a.click();
            $(a).remove();
          }
        }
      };
      // 发送ajax请求
      xhr.send()
    
    //这种方式保存的文件是不能打开的，console.log(typeof(data))会看到是string类型，原因是jquery将返回的数据转换为了string，不支持blob类型。
});

$.ajaxSetup({
    beforeSend:function(jqXHR,settings){
      if (settings.dataType === 'binary'){
        settings.xhr().responseType='arraybuffer';
        settings.processData=false;
      }
    }
  });

$("#dlstream").click(function(){
    var url = '/dl/type/stream2';
    var params = {
        filename:"a.xlsx"
    }
    // var prom = $.ajax({
    //     type:'POST',
    //     url: url,
    //     data: JSON.stringify(params),
    //     contentType: 'application/json;charset=utf-8',     
    //     dataType:"binary"
    // });

    var prom = window.fetch(url,{
        method:"POST",
        body: JSON.stringify(params),//// body data type must match "Content-Type" header
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        },
        //默认为omit,忽略的意思，也就是不带cookie;还有两个参数，same-origin，意思就是同源请求带cookie；include,表示无论跨域还是同源请求都会带cookie        
        credentials:"include"
    });

    prom.then(function(response){
        //response.status(number): HTTP返回的状态码，范围在100-599之间
        //response.ok(Boolean): 如果状态码是以2开头的，则为true
        //response.headers: HTTP请求返回头
        /***
         * response.body: 返回体，这里有处理返回体的一些方法
            text(): 将返回体处理成字符串类型
            json()： 返回结果和 JSON.parse(responseText)一样
            blob()： 返回一个Blob，Blob对象是一个不可更改的类文件的二进制数据
            arrayBuffer()
            formData()
         * 
         */
        //fetch在服务器返回4xx、5xx时是不会抛出错误的，这里需要手动通过，通过response中的ok字段和status字段来判断
        console.log(response);

        var blob = response.blob();
        var a = document.createElement('a');
        if(window.URL && window.URL.createObjectURL){
            var downloadUrl = window.URL.createObjectURL(blob);
            $("body").append(a);  // 修复firefox中无法触发click
            a.setAttribute('href', downloadUrl);
            a.setAttribute('download', "report.xlsx");
            a.click();
            $(a).remove();
        }
    });



    // prom.then(function(result){
    //     var blob = new Blob([result],{'type': 'application/vnd.ms-excel'});
    //     var reader = new FileReader();
    //     reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
    //     reader.onload = function (e) {
    //       // 转换完成，创建一个a标签用于下载
    //       var a = document.createElement('a');
    //       a.download = 'data_post.xlsx';
    //       a.href = e.target.result;
    //       $("body").append(a);  // 修复firefox中无法触发click
    //       a.click();
    //       $(a).remove();
    //     }

    // },function(err){
    //     console.log("报错");
    // });
});

function base64ToArrayBuffer(data) {
    var binaryString = window.atob(data);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

$("#read_n_dl").click(function(){
    var url = '/dl/type/readfile';
    var params = {
        filename:"a.xlsx"
    }

    var prom = window.fetch(url,{
        method:"POST",
        body: JSON.stringify(params),//// body data type must match "Content-Type" header
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        },
        //默认为omit,忽略的意思，也就是不带cookie;还有两个参数，same-origin，意思就是同源请求带cookie；include,表示无论跨域还是同源请求都会带cookie        
        credentials:"include"
    });
    prom.then(function(response){
        //response.status(number): HTTP返回的状态码，范围在100-599之间
        //response.ok(Boolean): 如果状态码是以2开头的，则为true
        //response.headers: HTTP请求返回头
        /***
         * response.body: 返回体，这里有处理返回体的一些方法
            text(): 将返回体处理成字符串类型
            json()： 返回结果和 JSON.parse(responseText)一样
            blob()： 返回一个Blob，Blob对象是一个不可更改的类文件的二进制数据
            arrayBuffer()
            formData()
         * 
         */
        //fetch在服务器返回4xx、5xx时是不会抛出错误的，这里需要手动通过，通过response中的ok字段和status字段来判断
        console.log(response);

        var b = response.body;
        var blob = new Blob([b],{'type': 'application/vnd.ms-excel'});
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          // 转换完成，创建一个a标签用于下载
          var a = document.createElement('a');
          a.download = 'data_post.xlsx';
          a.href = e.target.result;
          $("body").append(a);  // 修复firefox中无法触发click
          a.click();
          $(a).remove();
        }
    });

    /***
    var prom = $.ajax({
        type:'POST',
        url: url,
        data: JSON.stringify(params),
        contentType: 'application/json;charset=utf-8'
    });
    prom.then(function(result){
        var ba = base64ToArrayBuffer(result);
        var blob = new Blob([ba],{'type': 'application/vnd.ms-excel'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
        }else{
            var a = document.createElement('a');
            if(window.URL && window.URL.createObjectURL){
                var downloadUrl = window.URL.createObjectURL(blob);
                $("body").append(a);  // 修复firefox中无法触发click
                a.setAttribute('href', downloadUrl);
                a.setAttribute('download', "report.xlsx");
                a.click();
                $(a).remove();
            }else{
                var reader = new FileReader();
                reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                  a.download = 'data_post.xlsx';
                  a.href = e.target.result;
                  $("body").append(a);  // 修复firefox中无法触发click
                  a.click();
                  $(a).remove();
                }

            } 
        }

    },function(err){
        console.log("报错");
    });
****/



});