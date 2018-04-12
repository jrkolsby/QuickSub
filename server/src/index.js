const express = require('express');
const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')

const crypto = require('crypto')
const session = require('express-session')
const fileUpload = require('express-fileupload');

require('./actions')
require('./secret')

const PORT = 3008
const STATIC_DIRECTORY = "./static"
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

app.use(express.static(STATIC_DIRECTORY))

function extractAudio(videoFile, successCallback, errorCallback) {
    let directory = path.dirname(videoFile)
    let extension = path.extname(videoFile)
    let destination = directory + "/" + AUDIO_FILENAME + AUDIO_EXTENSION

    let command = "ffmpeg -y -i " + videoFile + " -ac 1 -ar 32000 -vn " + destination

    console.log(command)

    exec(command, (err, stdout, stderr) => {
        if (err) {
            errorCallback("Audio extraction error: " + err)
        } else {
            successCallback(destination)
        }
    })
}

function formatChunks(chunkStream) {
    var lines = chunkStream.toString().split('\n')
    var chunks = []
    for (var i = 0; i < lines.length && lines[i] != "END"; i += 3) {
        chunks.push({
            start: lines[i],
            end: lines[i+1],
            audioURL: lines[i+2]
        }) 
    }
    return chunks
}

function generateChunks(audioFile, successCallback, errorCallback) {
    let command = 'python ./src/chunkify.py 1 ' + audioFile
    
    console.log(command)

    exec(command, (err, stdout, stderr) => {
        if (err) {
            errorCallback("Chunk generation error: " + err)
        } else {
            var chunks = formatChunks(stdout)
            for (var i = 0; i < chunks.length; i++) {
                let chunk = chunks[i]
                let audioFile = chunk.audioURL
            }
            successCallback(chunks)
        }
    })
}

function generateWaveform(audioFile, successCallback, errorCallback) {
    let directory = path.dirname(audioFile)
    let extension = path.extname(audioFile)
    let basename = path.basename(audioFile, extension)
    let output = directory + "/" + basename + '.json'

    let command = 'audiowaveform -i ' + audioFile + ' -z 4096 -o ' + output

    console.log(command)

    exec(command, (err, stdout, stderr) => {
        if (err) {
            errorCallback("Waveform generation error: " + err)
        } else {
            var contents = fs.readFileSync(output)
            var json = JSON.parse(contents)
            var data = json.data
            successCallback(data)
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

    videoFile = "static/grizzly.m4v"
    extractAudio(videoFile, function(audioFile) {
        generateChunks(audioFile, function(chunks) {
            generateWaveform(audioFile, function(fullWaveform) {
                output = {
                    audioURL: "",
                    videoURL: "",
                    waveformData: fullWaveform,
                    chunks: chunks
                }
                return res.status(200).send(success(output)) 
            }, errorCallback)
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

    // Increment / initialize session
    if (req.session.sessionDirectory) {
        req.session.views ++;
    } else {
    
        let recursiveHash = (i) => {
            var name = hash(SECRET, req.session.id)
            fs.open(STATIC_DIRECTORY + "/" + name, (err, fd) => {
                if (err)
                    return recursiveHash(i + 1)
                else
                    return name
            })
        }

        req.session.sessionDirectory = recursiveHash(0)
        req.session.view = 1
    }

    let extension = path.extname(name)

    let fullVideo = STATIC_DIRECTORY + "/" +
                    req.session.sessionDirectory + 
                    VIDEO_FILENAME + extension

    mv(fullVideo, (err) => {
        if (err) {
            return errorCallback("Internal Error")
        } else {
            extractAudio(videoFile, function(audioFile) {
                generateChunks(audioFile, function(chunks) {
                    var lines = chunks.toString().split('\n')
                    console.log(lines)
                    // TODO: make chunks
                    successCallback()
                }, errorCallback)
            }, errorCallback)
        }
    })
    // FIXME: After this make sure to return
});

app.listen(PORT, () => console.log('Listening on port ' + PORT))
