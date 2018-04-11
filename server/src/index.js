const express = require('express');
const spawn = require('child_process').spawn;
const exec = require('exec')

const session = require('express-session')
const fileUpload = require('express-fileupload');

const PORT = 3030
const SECRET = require('./secret')

const app = express();

app.set('trust proxy', 1)

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}))

app.use(fileUpload());

function moveVideo(videoFile, callback) {
    videoFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
        callback(newFile, err)
    }); 
}

function extractAudio(videoFile, callback) {
    let command = "ffmpeg -i " 

    exec('ffmpeg -i', function(error, stdout, stderr) {
        res.send(stdout)
    })
}

function generateChunks(audioFile, callback) {
    exec('ls', function(error, stdout, stderr) {
        res.send(stdout)
    })
}

app.get('/', function(req, res) { 
    videoFile = "video.mp4"
    createSession(videoFile, function(video, err) {
        if (err) { return res.status(500).send(err); }

        seperateAudio(video, function(audio, err) {
            if (err) { return res.status(500).send(err); }

            generateChunks(audio, function(chunks, err) {
                if (err) { return res.status(500).send(err); }
            })
        })
    })
});

app.post('/upload', function(req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "videoFile") 

    moveVideoUpload(req.files.videoFile, function(videoFile, err) {
        if (err) { return res.status(500).send(err); }

        seperateAudio(videoFile, function(audioFile, err) {
            if (err) { return res.status(500).send(err); }

            generateChunks(audioFile, function(chunks, err) {
                if (err) { return res.status(500).send(err); }
            })
        })
    })
});

app.listen(PORT, () => console.log('Listening on port 3000'))
