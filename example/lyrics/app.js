'use strict';

// Create an instance
var wavesurfer;

// Init & load audio file
document.addEventListener('DOMContentLoaded', function() {
    // Init
    wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        backend: 'MediaElement',
        plugins: [
            WaveSurfer.lyrics.create({
                lyricsMinLength: 1,
                lyrics: [
                    {
                        start: 1,
                        end: 13,
                        line1:"this is jaca",
                        line2:"这是借卡",
                        loop: false,
                        color: 'hsla(400, 100%, 30%, 0.5)'
                    },
                    {
                        start: 15,
                        end: 37,
                        line1:"Hello world",
                        line2:"你好世界！",
                        loop: false,
                        color: 'hsla(200, 50%, 70%, 0.4)',
                        minLength: 1,
                        maxLength: 5
                    }
                ],
                dragSelection: {
                    slop: 5
                }
            })
        ]
    });

    wavesurfer.on('error', function(e) {
        console.warn(e);
    });

    // Load audio from URL
    wavesurfer.load('../media/demo.wav');


    document.querySelector(
        '[data-action="play-lyric-1"]'
    ).addEventListener('click', function() {
        let lyric = Object.values(wavesurfer.lyrics.list)[0];
        lyric.play();
    });

    document.querySelector(
        '[data-action="play-lyric-2"]'
    ).addEventListener('click', function() {
        let lyric = Object.values(wavesurfer.lyrics.list)[1];
        lyric.playLoop();
    });

    document.querySelector(
        '[data-action="pause"]'
    ).addEventListener('click', function() {
        wavesurfer.pause();
    });
});
