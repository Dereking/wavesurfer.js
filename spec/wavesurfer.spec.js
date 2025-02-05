/* eslint-env jasmine */

import TestHelpers from './test-helpers.js';
import WaveSurfer from '../src/wavesurfer.js';

/** @test {WaveSurfer} */
describe('WaveSurfer/playback:', function() {
    let wavesurfer;
    let element;
    let manualDestroy = false;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        manualDestroy = false;

        let wave = TestHelpers.createWaveform();
        wavesurfer = wave[0];
        element = wave[1];
        wavesurfer.load(TestHelpers.EXAMPLE_FILE_PATH);

        wavesurfer.once('ready', done);
    });

    afterEach(function() {
        if (!manualDestroy) {
            wavesurfer.destroy();
            TestHelpers.removeElement(element);
        }
    });

    /**
     * @test {WaveSurfer#isReady}
     */
    it('be ready', function() {
        wavesurfer.play();

        expect(wavesurfer.isReady).toBeTrue();
    });

    /**
     * @test {WaveSurfer#VERSION}
     */
    it('have version number', function() {
        let version = require('../package.json').version;
        expect(WaveSurfer.VERSION).toEqual(version);
    });

    /**
     * @test {WaveSurfer#play}
     * @test {WaveSurfer#isPlaying}
     */
    it('play', function() {
        wavesurfer.play();

        expect(wavesurfer.isPlaying()).toBeTrue();
    });

    /**
     * @test {WaveSurfer#play}
     * @test {WaveSurfer#isPlaying}
     * @test {WaveSurfer#pause}
     */
    it('pause', function() {
        wavesurfer.play();
        expect(wavesurfer.isPlaying()).toBeTrue();

        wavesurfer.pause();
        expect(wavesurfer.isPlaying()).toBeFalse();
    });

    /**
     * @test {WaveSurfer#playPause}
     * @test {WaveSurfer#isPlaying}
     */
    it('play or pause', function() {
        wavesurfer.playPause();
        expect(wavesurfer.isPlaying()).toBeTrue();

        wavesurfer.playPause();
        expect(wavesurfer.isPlaying()).toBeFalse();
    });

    /**
     * @test {WaveSurfer#cancelAjax}
     */
    it('cancelAjax', function() {
        wavesurfer.cancelAjax();
        expect(wavesurfer.currentRequest).toBeNull();
    });

    /**
     * @test {WaveSurfer#loadBlob}
     */
    it('loadBlob', function(done) {
        fetch(TestHelpers.EXAMPLE_FILE_PATH)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                wavesurfer.once('ready', done);
                wavesurfer.loadBlob(blob);
            });
    });

    /** @test {WaveSurfer#getDuration}  */
    it('get duration', function() {
        let duration = parseInt(wavesurfer.getDuration(), 10);
        expect(duration).toEqual(TestHelpers.EXAMPLE_FILE_DURATION);
    });

    /** @test {WaveSurfer#getCurrentTime}  */
    it('get currentTime', function() {
        // initially zero
        let time = wavesurfer.getCurrentTime();
        expect(time).toEqual(0);

        // seek to 50%
        wavesurfer.seekTo(0.5);
        time = parseInt(wavesurfer.getCurrentTime(), 10);
        expect(time).toEqual(10);
    });

    /** @test {WaveSurfer#setCurrentTime}  */
    it('set currentTime', function() {
        // initially zero
        let time = wavesurfer.getCurrentTime();
        expect(time).toEqual(0);

        // set to 10 seconds
        wavesurfer.setCurrentTime(10);
        time = wavesurfer.getCurrentTime();
        expect(time).toEqual(10);

        // set to something higher than duration
        wavesurfer.setCurrentTime(1000);
        time = wavesurfer.getCurrentTime();
        // sets it to end of track
        time = parseInt(wavesurfer.getCurrentTime(), 10);
        expect(time).toEqual(TestHelpers.EXAMPLE_FILE_DURATION);
    });

    /** @test {WaveSurfer#skipBackward}  */
    it('should skip backward', function() {
        // seek to 50%
        wavesurfer.seekTo(0.5);

        // skip 4 seconds backward
        wavesurfer.skipBackward(4);
        let time = wavesurfer.getCurrentTime();
        expect(time).toBeWithinRange(6.88, 6.89);

        // skip backward with params.skipLength (default: 2 seconds)
        wavesurfer.skipBackward();
        time = wavesurfer.getCurrentTime();
        expect(time).toBeWithinRange(4.88, 4.89);
    });

    /** @test {WaveSurfer#skipForward}  */
    it('skip forward', function() {
        // skip x seconds forward
        let expectedTime = 4;
        wavesurfer.skipForward(expectedTime);
        let time = wavesurfer.getCurrentTime();
        expect(time).toBeNear(expectedTime, 0.0001);

        // skip forward with params.skipLength (default: 2 seconds)
        wavesurfer.skipForward();
        time = wavesurfer.getCurrentTime();
        expect(time).toBeNear(expectedTime + 2, 0.0001);
    });

    /** @test {WaveSurfer#getPlaybackRate}  */
    it('get playback rate', function() {
        let rate = wavesurfer.getPlaybackRate();
        expect(rate).toEqual(1);
    });

    /** @test {WaveSurfer#setPlaybackRate}  */
    it('set playback rate', function() {
        let rate = 0.5;
        wavesurfer.setPlaybackRate(rate);

        expect(wavesurfer.getPlaybackRate()).toEqual(rate);
    });

    /** @test {WaveSurfer#getVolume}  */
    it('get volume', function() {
        let volume = wavesurfer.getVolume();
        expect(volume).toEqual(1);
    });

    /** @test {WaveSurfer#setVolume}  */
    it('set volume', function(done) {
        let targetVolume = 0.5;

        wavesurfer.once('volume', function(result) {
            expect(result).toEqual(targetVolume);

            done();
        });

        wavesurfer.setVolume(targetVolume);
    });

    /** @test {WaveSurfer#toggleMute}  */
    it('toggle mute', function() {
        wavesurfer.toggleMute();
        expect(wavesurfer.isMuted).toBeTrue();

        wavesurfer.toggleMute();
        expect(wavesurfer.isMuted).toBeFalse();
    });

    /** @test {WaveSurfer#setMute}  */
    it('set mute', function() {
        wavesurfer.setMute(true);
        expect(wavesurfer.isMuted).toBeTrue();

        wavesurfer.setMute(false);
        expect(wavesurfer.isMuted).toBeFalse();
    });

    /** @test {WaveSurfer#getMute}  */
    it('get mute', function() {
        wavesurfer.setMute(true);
        expect(wavesurfer.getMute()).toBeTrue();

        wavesurfer.setMute(false);
        expect(wavesurfer.getMute()).toBeFalse();
    });

    /** @test {WaveSurfer#zoom}  */
    it('set zoom parameters', function() {
        wavesurfer.zoom(20);
        expect(wavesurfer.params.minPxPerSec).toEqual(20);
        expect(wavesurfer.params.scrollParent).toBe(true);
    });

    /** @test {WaveSurfer#zoom}  */
    it('set unzoom parameters', function() {
        wavesurfer.zoom(false);
        expect(wavesurfer.params.minPxPerSec).toEqual(
            wavesurfer.defaultParams.minPxPerSec
        );
        expect(wavesurfer.params.scrollParent).toBe(false);
    });

    /** @test {WaveSurfer#getWaveColor} */
    it('allow getting waveColor', function() {
        const waveColor = wavesurfer.getWaveColor();
        expect(waveColor).toEqual('#90F09B');
    });

    /** @test {WaveSurfer#setWaveColor} */
    it('allow setting waveColor', function() {
        let color = 'blue';
        wavesurfer.setWaveColor(color);
        const waveColor = wavesurfer.getWaveColor();

        expect(waveColor).toEqual(color);
    });

    /** @test {WaveSurfer#setWaveColorGradient} */
    it('allow setting waveColor gradient', function() {
        let colors = [
            "red",
            "green",
            "purple",
            "yellow",
            "rgba(0,255,255,.5)"
        ];
        wavesurfer.setWaveColor(colors);
        const waveColor = wavesurfer.getWaveColor();

        expect(waveColor).toEqual(colors);
    });

    /** @test {WaveSurfer#getProgressColor} */
    it('allow getting progressColor', function() {
        const progressColor = wavesurfer.getProgressColor();
        expect(progressColor).toEqual('purple');
    });

    /** @test {WaveSurfer#setProgressColor} */
    it('allow setting progressColor', function() {
        wavesurfer.setProgressColor('green');
        const progressColor = wavesurfer.getProgressColor();

        expect(progressColor).toEqual('green');
    });

    describe('split channels options', function() {
        beforeEach(function() {
            wavesurfer.params.splitChannels = true;
            wavesurfer.params.splitChannelsOptions = {
                channelColors: {
                    0: {
                        progressColor: 'green',
                        waveColor: 'pink'
                    },
                    1: {
                        progressColor: 'orange',
                        waveColor: 'purple'
                    }
                }
            };
        });

        afterEach(function() {
            wavesurfer.params.splitChannels = false;
            wavesurfer.params.splitChannelsOptions = {
                channelColors: {}
            };
        });

        /** @test {WaveSurfer#getChannelWaveColor} */
        it('allow getting channel waveColor', function() {
            const waveColor = wavesurfer.getWaveColor(1);
            expect(waveColor).toEqual('purple');
        });

        /** @test {WaveSurfer#setChannelWaveColor} */
        it('allow setting channel waveColor', function() {
            let color = 'blue';
            wavesurfer.setWaveColor(color, 1);
            const waveColor = wavesurfer.getWaveColor(1);

            expect(waveColor).toEqual(color);
        });

        /** @test {WaveSurfer#getChannelProgressColor} */
        it('allow getting channel progressColor', function() {
            const progressColor = wavesurfer.getProgressColor(1);
            expect(progressColor).toEqual('orange');
        });

        /** @test {WaveSurfer#setChannelProgressColor} */
        it('allow setting channel progressColor', function() {
            let color = 'blue';
            wavesurfer.setProgressColor(color, 1);
            const progressColor = wavesurfer.getProgressColor(1);

            expect(progressColor).toEqual(color);
        });
    });

    /** @test {WaveSurfer#getCursorColor} */
    it('allow getting cursorColor', function() {
        const cursorColor = wavesurfer.getCursorColor();
        expect(cursorColor).toEqual('white');
    });

    /** @test {WaveSurfer#setCursorColor} */
    it('allow setting cursorColor', function() {
        wavesurfer.setCursorColor('black');
        const cursorColor = wavesurfer.getCursorColor();

        expect(cursorColor).toEqual('black');
    });

    /** @test {WaveSurfer#getBackgroundColor} */
    it('allow getting backgroundColor', function() {
        const bgColor = wavesurfer.getBackgroundColor();
        expect(bgColor).toEqual(null);
    });

    /** @test {WaveSurfer#setBackgroundColor} */
    it('allow setting backgroundColor', function() {
        wavesurfer.setBackgroundColor('#FFFF00');
        const bgColor = wavesurfer.getBackgroundColor();

        expect(bgColor).toEqual('#FFFF00');
    });

    /** @test {WaveSurfer#getHeight} */
    it('allow getting height', function() {
        const height = wavesurfer.getHeight();
        expect(height).toEqual(128);
    });

    /** @test {WaveSurfer#setHeight} */
    it('allow setting height', function() {
        wavesurfer.setHeight(150);
        const height = wavesurfer.getHeight();

        expect(height).toEqual(150);
    });

    /** @test {WaveSurfer#exportPCM} */
    it('return Promise with PCM array data', function(done) {
        wavesurfer.load(TestHelpers.EXAMPLE_FILE_PATH);
        wavesurfer.once('ready', function() {
            wavesurfer.exportPCM(1024, 10000, false, 0, 100).then(pcmData => {
                expect(pcmData instanceof Array).toBeTruthy();

                done();
            });
        });
    });
    it('return Promise with PCM array data in new window', function(done) {
        wavesurfer.load(TestHelpers.EXAMPLE_FILE_PATH);
        wavesurfer.once('ready', function() {
            wavesurfer.exportPCM(1024, 10000, true, 0, 100).then(pcmData => {
                expect(pcmData instanceof Array).toBeTruthy();

                done();
            });
        });
    });

    /** @test {WaveSurfer#getFilters} */
    it('return the list of current set filters as an array', function() {
        const list = wavesurfer.getFilters();

        expect(list).toEqual([]);
    });

    /** @test {WaveSurfer#exportImage} */
    it('export image data', function() {
        const imgData = wavesurfer.exportImage();
        expect(imgData).toBeNonEmptyString();

        wavesurfer.exportImage('image/png', 1, 'blob').then(blobs => {
            expect(blobs.length).toEqual(1);
            expect(blobs[0] instanceof Blob).toBeTruthy();
        });
    });

    /** @test {WaveSurfer#destroy} */
    it('destroy', function(done) {
        manualDestroy = true;

        wavesurfer.once('destroy', function() {
            TestHelpers.removeElement(element);
            done();
        });
        wavesurfer.destroy();

        expect(wavesurfer.backend).toBeNull();
    });

    describe('seek event emission', function() {
        let seekEventSpy;
        let interactionEventSpy;

        beforeEach(function() {
            seekEventSpy = jasmine.createSpy();
            interactionEventSpy = jasmine.createSpy();

            wavesurfer.on('seek', function() {
                seekEventSpy();
            });
            wavesurfer.on('interaction', function() {
                interactionEventSpy();
            });
        });

        afterEach(function() {
            wavesurfer.unAll();
            wavesurfer.setDisabledEventEmissions([]);
        });

        describe('when event emissions are not disabled', function() {
            it('all event handlers should be called', function() {
                wavesurfer.seekTo(0.5);
                wavesurfer.setCurrentTime(1.45);

                expect(seekEventSpy).toHaveBeenCalled();
                expect(interactionEventSpy).toHaveBeenCalled();
            });
        });

        describe('when seek and interaction events are disabled', function() {
            beforeEach(function() {
                wavesurfer.setDisabledEventEmissions(['seek', 'interaction']);
            });

            it('should not call event handlers for either "seek" or "interaction"', function() {
                wavesurfer.seekTo(0.5);
                wavesurfer.setCurrentTime(1.45);

                expect(seekEventSpy).not.toHaveBeenCalled();
                expect(interactionEventSpy).not.toHaveBeenCalled();
            });
        });
    });
});

/** @test {WaveSurfer} */
describe('WaveSurfer/errors:', function() {
    let element;

    beforeEach(function() {
        element = TestHelpers.createElement('test');
    });

    afterEach(function() {
        TestHelpers.removeElement(element);
    });

    /**
     * @test {WaveSurfer}
     */
    it('throw when container element is not found', function() {
        expect(function() {
            TestHelpers.createWaveform({
                container: '#foo'
            });
        }).toThrow(new Error('Container element not found'));
    });

    /**
     * @test {WaveSurfer}
     */
    it('throw when media container element is not found', function() {
        expect(function() {
            TestHelpers.createWaveform({
                container: '#test',
                mediaContainer: '#foo'
            });
        }).toThrow(new Error('Media Container element not found'));
    });

    /**
     * @test {WaveSurfer}
     */
    it('throw for invalid maxCanvasWidth param', function() {
        expect(function() {
            TestHelpers.createWaveform({
                container: '#test',
                maxCanvasWidth: 0.5
            });
        }).toThrow(new Error('maxCanvasWidth must be greater than 1'));

        expect(function() {
            TestHelpers.createWaveform({
                container: '#test',
                maxCanvasWidth: 3
            });
        }).toThrow(new Error('maxCanvasWidth must be an even number'));
    });

    /**
     * @test {WaveSurfer}
     */
    it('throw for invalid renderer', function() {
        expect(function() {
            TestHelpers.createWaveform({
                container: '#test',
                renderer: 'foo'
            });
        }).toThrow(new Error('Renderer parameter is invalid'));
    });

    /**
     * @test {WaveSurfer}
     */
    it('not throw when rendered and media is not loaded', function() {
        expect(function() {
            let wave = TestHelpers.createWaveform({
                container: '#test'
            });

            wave[0].setWaveColor('#000000');
        }).not.toThrow();
    });

    /**
     * @test {WaveSurfer#load}
     */
    it('throw when url parameter for load is empty', function() {
        let wave = TestHelpers.createWaveform({
            container: '#test'
        });
        const expectedError = new Error('url parameter cannot be empty');

        // undefined url
        expect(function() {
            wave[0].load();
        }).toThrow(expectedError);

        // empty string
        expect(function() {
            wave[0].load('');
        }).toThrow(expectedError);

        // null
        expect(function() {
            wave[0].load(null);
        }).toThrow(expectedError);
    });
});
