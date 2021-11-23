'use strict';

var wavesurfer;

// Init & load
document.addEventListener('DOMContentLoaded', function() {
    let options = {
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        loaderColor: 'purple',
        cursorColor: 'navy',
        splitChannels: true,
        plugins: [
            WaveSurfer.timelinelrc.create({
                container: '#wave-timelinelrc',
                lrclines: [
                    {
                        time: 1.5,
                        label: "ddfdsfds",
                        color: '#ff990a'
                    },
                    {
                        time: 5.5,
                        label: "V1",
                        color: '#ff990a'
                    },
                    {
                        time: 10,
                        label: "V2",
                        color: '#00ffcc',
                        position: 'top'
                    }
                ]
            })
        ]
    };

    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }

    if (location.search.match('normalize')) {
        options.normalize = true;
    }

    // Init wavesurfer
    wavesurfer = WaveSurfer.create(options);

    /* Progress bar */
    (function() {
        const progressDiv = document.querySelector('#progress-bar');
        const progressBar = progressDiv.querySelector('.progress-bar');

        let showProgress = function(percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        let hideProgress = function() {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    })();

    wavesurfer.load('../media/stereo.mp3');

});