var express = require('express');
var router = express.Router();
var fs    =  require("fs");
var path = require("path");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 第一种方式直接返回file 下载文件
router.get("/type/direct",function(req,res,next){
  var filename = req.query.filename;
  var filePath = path.join(__dirname, '../assets/' + filename);
  res.redirect("/"+filename);
});

//以文件流的形式server下载文件
router.post("/type/stream",function(req,res,next){
    var filename = req.body.filename;
    var filePath = path.join(__dirname, '../assets/' + filename);
    var stats = fs.statSync(filePath);
    var isFile = stats.isFile();
    if(isFile){
        res.set({
            'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
            'Content-Disposition': 'attachment; filename=' + filename, //告诉浏览器这是一个需要下载的文件，而不是解析并显示
            'Content-Length': stats.size  //文件大小
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.end(404);
    }  
});


//以文件流的形式server下载文件
router.post("/type/stream2",function(req,res,next){
  var filename = req.body.filename;
  var filePath = path.join(__dirname, '../assets/' + filename);
  var stats = fs.statSync(filePath);
  var isFile = stats.isFile();
  if(isFile){
      res.set({
          'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
          'Content-Disposition': 'attachment; filename=' + filename, //告诉浏览器这是一个需要下载的文件，而不是解析并显示
          'Content-Length': stats.size  //文件大小
      });
      res.status(200).download(filePath,filename);
  } else {
      res.end(404);
  }  
});

//读取文件内容后再以stream形式响应给前端        
router.post("/type/readfile",function(req,res,next){
  var filename = req.body.filename;
  var filePath = path.join(__dirname, '../assets/' + filename);
  var stats = fs.statSync(filePath);
  var isFile = stats.isFile();
  if (isFile) {
      fs.readFile(filePath, function(isErr, data){
          if (isErr) {
              res.end("Read file failed!");
              return;
          }
          res.set({
              'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
              'Content-Disposition': 'attachment; filename=' + filename, //告诉浏览器这是一个需要下载的文件
              'Content-Length': stats.size  //文件大小
          });
          res.end(data);
      })
  } else {
      res.end(404);
  }

});



module.exports = router;
