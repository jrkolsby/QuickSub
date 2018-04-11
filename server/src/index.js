const express = require('express');
const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')

const crypto = require('crypto')
const session = require('express-session')
const fileUpload = require('express-fileupload');

require('./actions')

require('./secret')
const PORT = 3001
const PUBLIC_DIRECTORY = "./public"
const VIDEO_FILENAME = "full-video"
const AUDIO_FILENAME = "full-audio"
const AUDIO_EXTENSION = ".wav"
const CHUNK_FILENAME = "chunk"

const app = express();

let hash = (aSecret, anotherSecret) => {
    return crypto.createHmac('sha256', aSecret)
                 .update(anotherSecret)
                 .digest('hex');

}

let directories = []

let sess = {
    secret: hash(SECRET, DARKER_SECRET),
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 12000
    }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

app.use(fileUpload());

app.use(express.static(PUBLIC_DIRECTORY))

function extractAudio(videoFile, successCallback, errorCallback) {
    let directory = path.dirname(videoFile)
    let extension = path.extname(videoFile)
    let destination = directory + "/" + AUDIO_FILENAME + AUDIO_EXTENSION

    let command = "ffmpeg -y -i " + videoFile + " -ac 1 -ar 32000 -vn " + destination

    exec(command, (err, stdout, stderr) => {
        if (err) {
            errorCallback("Audio extraction error: " + err)
        } else {
            successCallback(destination)
        }
    })
}

function generateChunks(audioFile, successCallback, errorCallback) {
    let command = 'python ./src/chunkify.py 1 ' + audioFile

    console.log(command)

    exec(command, (err, stdout, stderr) => {
        if (err) {
            errorCallback("Chunk generation error: " + err)
        } else {
            successCallback(stdout)    
        }
    })
}

app.get('/', function(req, res) { 
    let errorCallback = (errorMessage) => {
        return res.status(500).send(error(errorMessage))
    }

    let successCallback = (chunkData) => {
        return res.status(200).send(success(chunkData))
    }

    videoFile = "public/grizzly.m4v"
    extractAudio(videoFile, function(audioFile) {
        generateChunks(audioFile, function(chunks) {
            successCallback(chunks)
        }, errorCallback)
    }, errorCallback)
    
});

// TODO: USE <input name="videoFile" type="file" />
// TODO: sessionStorage.getItem('sessionDirectory')
// TODO: sessionStorage.getItem('type')

app.post('/chunkify', function(req, res) {

    let errorCallback = (errorMessage) => {
        return res.status(500).send(error(errorMessage))
    }

    let successCallback = (chunkData) => {
        return res.status(200).send(success(chunkData))
    }

    if (!req.files)
        return errorCallback("No video uploaded")

    let videoFile = req.files.videoFile

    let mv = videoFile.mv
    let name = videoFile.name
    let data = videoFile.data
    let mimetype = videoFile.mimetype
    let truncated = videoFile.truncated

    if (truncated) 
        return errorCallback("Video upload incomplete")

    if (mimetype !== 'video/x-flv' ||
        mimetype !== 'video/mp4' ||
        mimetype !== 'video/application/x-mpegURL' ||
        mimetype !== 'video/MP2T' ||
        mimetype !== 'video/3gpp' ||
        mimetype !== 'video/quicktime' ||
        mimetype !== 'video/x-msvideo' ||
        mimetype !== 'video/x-ms-wmw') 
        return errorCallback("Invalid video format")

    if (req.session.sessionDirectory) {
        req.session.views ++;
    } else {
        req.session.view = 1
    
        let recursiveHash = (i) => {
            var name = hash(SECRET, req.session.id)
            fs.open(PUBLIC_DIRECTORY + "/" + name, (err, fd) => {
                if (err)
                    return recursiveHash(i + 1)
                else
                    return name
            })
        }

        req.session.sessionDirectory = recursiveHash(0)
    }

    let extension = path.extname(name)

    let fullVideo = PUBLIC_DIRECTORY + "/" +
                    req.session.sessionDirectory + 
                    VIDEO_FILENAME + extension

    mv(fullVideo, (err) => {
        if (err) {
            return errorCallback("Internal Error")
        } else {
            extractAudio(videoFile, function(audioFile) {
                generateChunks(audioFile, function(chunks) {
                    successCallback(chunkData)
                }, errorCallback)
            }, errorCallback)
        }
    })
    // FIXME: After this make sure to return
});

app.listen(PORT, () => console.log('Listening on port ' + PORT))
