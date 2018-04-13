const express = require('express');
const {exec} = require('child_process')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const crypto = require('crypto')
const session = require('express-session')
const Busboy = require('busboy')
//const fileUpload = require('express-fileupload');

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
    name: 'server-session-cookie-id',
    secret: hash(SECRET, DARKER_SECRET),
    saveUninitialized: true,
    resave: true,
    cookie: { 
        secure: false,
        maxAge: 12000
    }
}

app.use(session(sess))

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

//app.use(fileUpload());

app.use(express.static(STATIC_DIRECTORY))

// DEVELOPMENT!!
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

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

// TODO: sessionStorage.getItem('sessionDirectory')
// TODO: sessionStorage.getItem('type')

app.post('/upload', function(req, res) {

    let errorCallback = (errorMessage) => {
        return res.status(400).send(error(errorMessage))
    }

    let successCallback = (chunkData) => {
        return res.status(200).send(success(chunkData))
    }

	var busboy = new Busboy({ headers: req.headers });

	var sessionDirectory
	var localSessionDirectory

	// TODO: Migrate to same origin (domain + port) for static and cookies
	// THIS IS REQUIRED TO PRESERVE SESSION STORAGE
	if (req.session.directory) {
		sessionDirectory = req.session.directory
		localSessionDirectory = STATIC_DIRECTORY + "/" + sessionDirectory

		req.session.views ++;
	} else {
	
		let recursiveHash = (i) => {
			var exists = false
			var name = hash(i.toString(), req.session.id)
			fs.open(STATIC_DIRECTORY + "/" + name, 'r', (err, fd) => {
				if (err)
					exists = true
			})
			if (exists)
				return recursiveHash(i+1)

			return name
		}

		var newDirectory = recursiveHash(0)
		sessionDirectory = newDirectory
		localSessionDirectory = STATIC_DIRECTORY + "/" + sessionDirectory

		req.session.directory = sessionDirectory
		req.session.views = 1

		fs.mkdirSync(localSessionDirectory)
	}

	let localVideoFile

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		file.on('data', function(data) {
			console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
		});

		file.on('end', function() {
			if (mimetype !== 'video/x-flv' &&
				mimetype !== 'video/x-m4v' &&
				mimetype !== 'video/mp4' &&
				mimetype !== 'video/application/x-mpegURL' &&
				mimetype !== 'video/MP2T' &&
				mimetype !== 'video/3gpp' &&
				mimetype !== 'video/quicktime' &&
				mimetype !== 'video/x-msvideo' &&
				mimetype !== 'video/x-ms-wmw') 
				return errorCallback("Invalid video format: " + mimetype)
		});

		let extension = path.extname(filename)
    	localVideoFile = localSessionDirectory + "/" + VIDEO_FILENAME + extension
		
		file.pipe(fs.createWriteStream(localVideoFile))
	});

	busboy.on('finish', function() {
		extractAudio(localVideoFile, function(localAudioFile) {
			console.log('got audio', localAudioFile)
			generateChunks(localAudioFile, function(chunks) {
				console.log('got chunks', localAudioFile)
				generateWaveform(localAudioFile, function(fullWaveform) {
					console.log('got waveform', localAudioFile)
					output = {
						audioURL: path.basename(localAudioFile),
						videoURL: path.basename(localVideoFile),
						directory: sessionDirectory,
						waveformData: fullWaveform,
						chunks: chunks
					}
					return res.status(200).send(success(output)) 
				}, errorCallback)
			}, errorCallback)
		}, errorCallback)
	});

	return req.pipe(busboy);
});

app.listen(PORT, () => console.log('Listening on port ' + PORT))
