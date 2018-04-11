$(document).ready(function() {
    var $video = $("video")
    var video = $video[0]

    var $audio = $('audio')
    var audio = $audio[0]

    var $input = $("input")
    var input = $input[0]

    var $captions = $("#captions")

    var $exportButton = $("#exportbutton")

    var state = {
        url: "videos/GrizzlyMan.m4v",
        speed: 1,

        currentTimecode: 0,
        previousTimecode: 0,

        currentTime: 0,
        previousTime: 0,

        typingWPM: 0,
        actualWPM: 165,

        shouldClip: false,

        captions: []
    } 

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    function caption(start, end, text) {
        start = start.toFixed(2)
        return "<div class='caption'><span>" + start + "</span>" + text + "</div>"
    }
    
    function tick(time) {
        state.currentTimecode = time
        state.currentTime = Date.now()

        var realInterval = (state.currentTime - state.previousTime) / 1000
        var videoInterval = state.currentTimecode - state.previousTimecode

        var captionText = input.value

        // Every two real seconds update the video speed
        // Every two video seconds set shouldClip to true
        // If the spacebar is hit then clip the subtitle and reset the videointerval counter
        if (realInterval > 2) {

            state.wpm = captionText.split(" ").length / (realInterval/60)

            // If any characters in string
            if (captionText.replace(/\s+/g, '').length > 0) {

                $captions.append(caption(state.previousTimecode,
                                         state.currentTimecode,
                                         captionText))

                var newID = 0

                if (state.captions.length > 0) {
                    newID = state.captions[state.captions.length-1].id + 1
                } 

                state.captions.push({
                    id: newID,
                    startTime: state.previousTimecode * 1000,
                    endTime: state.currentTimecode * 1000,
                    text: captionText
                })
            }

            var percentWPM = state.wpm / state.actualWPM
            var videoRate = percentWPM

            if (percentWPM > 1.2) {
                videoRate = 1.2
            }
            if (percentWPM < 0.3) {
                videoRate = 0.3
            }

            video.playbackRate = videoRate

            input.value = ""

            state.previousTimecode = state.currentTimecode
            state.previousTime = state.currentTime
        }
    }

    $video.on("timeupdate", function(event) {
        tick(video.currentTime)
    });

    $video.on("play", function(event) {
        var time = Date.now();

        state.playing = true
        state.currentTime = time;
        state.previousTime = time;
    })

    $video.on("pause", function(event) {
        state.playing = false
    })

    $input.on("input", function(event) {
        state.inputValue = input.value
    })

    $input.on("keypress", function(event) {
        if (event.originalEvent.charCode == 32 &&
            state.shouldClip) {

        }
    })

    $exportButton.on("click", function(event) {
        srtContent = parser.toSrt(state.captions)
        console.log(srtContent)
        /*
        filename = "export.srt"
        data = encodeURI(srtContent)
        link = document.createElement("a")
        link.setAttribute("href", data);
        link.setAttribute("download", filename)
        link.click()
        */
    })
})
