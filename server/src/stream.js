var fs = require('fs');
var http = require('http');
var express = require('express')

var app = express();
var process.env.PORT || 3000;

var server = http.createServer(function(req, res) {
    var stream = fs.createReadStream(__dirname + '/data.txt');
    stream.pip(res);
});

server.listen(8000)

var video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });

// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info.filename);
  console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream('myvideo.mp4'));
