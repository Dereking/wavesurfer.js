/**
 *  @since 4.0.0 This class has been split
 *
 * @typedef {Object} LyricsPluginParams
 * @property {?boolean} dragSelection Enable creating lyrics by dragging with
 * the mouse
 * @property {?LyricParams[]} lyrics Lyrics that should be added upon
 * initialisation
 * @property {number} slop=2 The sensitivity of the mouse dragging
 * @property {?number} snapToGridInterval Snap the lyrics to a grid of the specified multiples in seconds
 * @property {?number} snapToGridOffset Shift the snap-to-grid by the specified seconds. May also be negative.
 * @property {?boolean} deferInit Set to true to manually call
 * @property {number[]} maxLyrics Maximum number of lyrics that may be created by the user at one time.
 * `initPlugin('lyrics')`
 * @property {function} formatTimeCallback Allows custom formating for lyric tooltip.
 * @property {?number} edgeScrollWidth='5% from container edges' Optional width for edgeScroll to start
 */

/**
 * @typedef {Object} LyricParams
 * @desc The parameters used to describe a lyric.
 * @example wavesurfer.addLyric(lyricParams);
 * @property {string} id=→random The id of the lyric
 * @property {number} start=0 The start position of the lyric (in seconds).
 * @property {number} end=0 The end position of the lyric (in seconds).
 * @property {?boolean} loop Whether to loop the lyric when played back.
 * @property {boolean} drag=true Allow/disallow dragging the lyric.
 * @property {boolean} resize=true Allow/disallow resizing the lyric.
 * @property {string} [color='rgba(0, 0, 0, 0.1)'] HTML color code.
 * @property {string} [line1='这是歌词1'] lyric first line 
 * @property {string} [line2='这是歌词2'] lyric seconde line 
 * @property {?object} handleStyle A set of CSS properties used to style the left and right handle.
 * @property {?boolean} preventContextMenu=false Determines whether the context menu is prevented from being opened.
 * @property {boolean} showTooltip=true Enable/disable tooltip displaying start and end times when hovering over lyric.
 */

import {Lyric} from "./lyric.js"; 
import LyricParser from 'lrc-file-parser';

/**
 * Lyrics are visual overlays on waveform that can be used to play and loop
 * portions of audio. Lyrics can be dragged and resized.
 *
 * Visual customization is possible via CSS (using the selectors
 * `.wavesurfer-lyric` and `.wavesurfer-handle`).
 *
 * @implements {PluginClass}
 * @extends {Observer}
 *
 * @example
 * // es6
 * import LyricsPlugin from 'wavesurfer.lyrics.js';
 *
 * // commonjs
 * var LyricsPlugin = require('wavesurfer.lyrics.js');
 *
 * // if you are using <script> tags
 * var LyricsPlugin = window.WaveSurfer.lyrics;
 *
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     LyricsPlugin.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
export default class LyricsPlugin {
    /**
     * Lyrics plugin definition factory
     *
     * This function must be used to create a plugin definition which can be
     * used by wavesurfer to correctly instantiate the plugin.
     *
     * @param {LyricsPluginParams} params parameters use to initialise the plugin
     * @return {PluginDefinition} an object representing the plugin
     */
    static create(params) {
        return {
            name: 'lyrics',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {
                addLyric(options) {
                    if (!this.initialisedPluginList.lyrics) {
                        this.initPlugin('lyrics');
                    }
                    return this.lyrics.add(options);
                },

                clearLyrics() {
                    this.lyrics && this.lyrics.clear();
                },

                enableDragSelection(options) {
                    if (!this.initialisedPluginList.lyrics) {
                        this.initPlugin('lyrics');
                    }
                    this.lyrics.enableDragSelection(options);
                },

                disableDragSelection() {
                    this.lyrics.disableDragSelection();
                }
            },
            instance: LyricsPlugin
        };
    }

    constructor(params, ws) {
        this.params = params;
        this.wavesurfer = ws;
        this.util = {
            ...ws.util,
            getLyricSnapToGridValue: value => {
                return this.getLyricSnapToGridValue(value, params);
            }
        };
        this.maxLyrics = params.maxLyrics;
        this.lyricsMinLength = params.lyricsMinLength || null;

        // turn the plugin instance into an observer
        const observerPrototypeKeys = Object.getOwnPropertyNames(
            this.util.Observer.prototype
        );
        observerPrototypeKeys.forEach(key => {
            Lyric.prototype[key] = this.util.Observer.prototype[key];
        });


        this.wavesurfer.Lyric = Lyric; 
        let that = this
        this.lyricParser = new LyricParser({
            onPlay: function (line, text) { // 歌词播放时的回调
              console.log(line, text) // line 是当前播放行
                                      // text 是当前播放的歌词 
            },
            onSetLyric: function (lines) { // 监听歌词设置事件。当设置歌词时，歌词解析完毕会触发此回调。
              //that.lrcLines = lines 
              lines.forEach(line => { 
                  console.log(line)
                let start =  line.time / 1000.0
                let end = start + 10
                that.add({
                    start: start,
                    end: end,
                    resize:true,
                    line1:line.text,
                    line2:"",
                    loop: false,
                    color: 'hsla(400, 100%, 30%, 0.5)'
                }); 
              });
            },
            offset: 0 // 歌词偏移时间单位毫秒, 默认 150 ms
          }) 

        // By default, scroll the container if the user drags a lyric
        // within 5% (based on its initial size) of its edge
        const scrollWidthProportion = 0.05;
        this._onBackendCreated = () => {
            this.wrapper = this.wavesurfer.drawer.wrapper;
            this.orientation = this.wavesurfer.drawer.orientation;
            this.defaultEdgeScrollWidth = this.wrapper.clientWidth * scrollWidthProportion;
            if (this.params.lyrics) {
                this.params.lyrics.forEach(lyric => {
                    this.add(lyric);
                });
            }
        };

        // Id-based hash of lyrics
        this.list = {};
        this._onReady = () => {
            this.wrapper = this.wavesurfer.drawer.wrapper;
            this.vertical = this.wavesurfer.drawer.params.vertical;
            if (this.params.dragSelection) {
                this.enableDragSelection(this.params);
            }
            Object.keys(this.list).forEach(id => {
                this.list[id].updateRender();
            });
        };
    }

    init() {
        // Check if ws is ready
        if (this.wavesurfer.isReady) {
            this._onBackendCreated();
            this._onReady();
        } else {
            this.wavesurfer.once('ready', this._onReady);
            this.wavesurfer.once('backend-created', this._onBackendCreated);
        }
    }

    destroy() {
        this.wavesurfer.un('ready', this._onReady);
        this.wavesurfer.un('backend-created', this._onBackendCreated);
        // Disabling `lyric-removed' because destroying the plugin calls
        // the Lyric.remove() method that is also used to remove lyrics based
        // on user input. This can cause confusion since teardown is not a
        // user event, but would emit `lyric-removed` as if it was.
        this.wavesurfer.setDisabledEventEmissions(['lyric-removed']);
        this.disableDragSelection();
        this.clear();
    }

    /**
     * check to see if adding a new lyric would exceed maxLyrics
     * @return {boolean} whether we should proceed and create a lyric
     * @private
     */
    wouldExceedMaxLyrics() {
        return (
            this.maxLyrics && Object.keys(this.list).length >= this.maxLyrics
        );
    }

    /**
     * Add a lyric
     *
     * @param {object} params Lyric parameters
     * @return {Lyric} The created lyric
     */
    add(params) {
        if (this.wouldExceedMaxLyrics()) {
            return null;
        }

        params = {
            edgeScrollWidth: this.params.edgeScrollWidth || this.defaultEdgeScrollWidth,
            ...params
        };

        // Take formatTimeCallback from plugin params if not already set
        if (!params.formatTimeCallback && this.params.formatTimeCallback) {
            params = {...params, formatTimeCallback: this.params.formatTimeCallback};
        }

        if (!params.minLength && this.lyricsMinLength) {
            params = {...params, minLength: this.lyricsMinLength};
        }

        const lyric = new this.wavesurfer.Lyric(params, this.util, this.wavesurfer);

        this.list[lyric.id] = lyric;

        lyric.on('remove', () => {
            delete this.list[lyric.id];
        });

        return lyric;
    }

    /**
     * Remove all lyrics
     */
    clear() {
        Object.keys(this.list).forEach(id => {
            this.list[id].remove();
        });
    }


    /**
     * Get a  sorted lyric list. sorted by start time
     *
     * 
     * @return {Lyric} The created lyric
     */
     getSortedLyrics() { 
        // return function(array,key){
        //     return array.sort(function(a,b){
        //         var x = a[key];
        //         var y = b[key];
        //         return ((x<y)?-1:(x>y)?1:0)
        //     })
        // }(this.list,'start');
        let ret = []
        Object.keys(this.list).forEach(id => {
            let lyric = this.list[id] ;
        }); 
        let that = this
        var newKeys = Object.keys(this.list).sort(function(a,b){ 
        //console.log("a",a,b, that.wavesurfer.regions.list[a], that.wavesurfer.regions.list[b])
            return that.list[a].start - that.list[b].start
        })
    
        //console.log("newKeys",newKeys)
     
        for(var nk in newKeys){
            //console.log("recalc ",newKeys[nk])
            ret.push(this.list[ newKeys[nk] ])
        }  

        return ret
    }

    /**
     * load a *.lrc file from text
     *
     * @param {lrcText} the lrc file content
     * @param {lrcTextTranslation} the lrc file content  for translation.
     * @return {success} return ture when success.
     */
     loadLrcUrl(lrcText,lrcTextTranslation) {
        this.lyricParser.setLyric(lrcText,lrcTextTranslation)
     }

    enableDragSelection(params) {
        this.disableDragSelection();

        const slop = params.slop || 2;
        const container = this.wavesurfer.drawer.container;
        const scroll =
            params.scroll !== false && this.wavesurfer.params.scrollParent;
        const scrollSpeed = params.scrollSpeed || 1;
        const scrollThreshold = params.scrollThreshold || 10;
        let drag;
        let duration = this.wavesurfer.getDuration();
        let maxScroll;
        let start;
        let lyric;
        let touchId;
        let pxMove = 0;
        let scrollDirection;
        let wrapperRect;

        // Scroll when the user is dragging within the threshold
        const edgeScroll = e => {
            if (!lyric || !scrollDirection) {
                return;
            }

            // Update scroll position
            let scrollLeft =
                this.wrapper.scrollLeft + scrollSpeed * scrollDirection;
            this.wrapper.scrollLeft = scrollLeft = Math.min(
                maxScroll,
                Math.max(0, scrollLeft)
            );

            // Update range
            const end = this.wavesurfer.drawer.handleEvent(e);
            lyric.update({
                start: Math.min(end * duration, start * duration),
                end: Math.max(end * duration, start * duration)
            });

            // Check that there is more to scroll and repeat
            if (scrollLeft < maxScroll && scrollLeft > 0) {
                window.requestAnimationFrame(() => {
                    edgeScroll(e);
                });
            }
        };

        const eventDown = e => {
            if (e.touches && e.touches.length > 1) {
                return;
            }
            duration = this.wavesurfer.getDuration();
            touchId = e.targetTouches ? e.targetTouches[0].identifier : null;

            // Store for scroll calculations
            maxScroll = this.wrapper.scrollWidth -
                this.wrapper.clientWidth;
            wrapperRect = this.util.withOrientation(
                this.wrapper.getBoundingClientRect(),
                this.vertical
            );
 
            // set the lyric channel index based on the clicked area
            if (this.wavesurfer.params.splitChannels) {
                const y = (e.touches ? e.touches[0].clientY : e.clientY) - wrapperRect.top;
                const channelCount = this.wavesurfer.backend.buffer != null ? this.wavesurfer.backend.buffer.numberOfChannels : 1;  
                const channelHeight = this.wrapper.clientHeight / channelCount;
                const channelIdx = Math.floor(y / channelHeight);
                //params.channelIdx = 0; 
                const channelColors = this.wavesurfer.params.splitChannelsOptions.channelColors[channelIdx];
                if (channelColors && channelColors.dragColor) {
                    params.color = channelColors.dragColor;
                }
            } 

            drag = true;
            start = this.wavesurfer.drawer.handleEvent(e, true);
            lyric = null;
            scrollDirection = null;
        };
        this.wrapper.addEventListener('mousedown', eventDown);
        this.wrapper.addEventListener('touchstart', eventDown);
        this.on('disable-drag-selection', () => {
            this.wrapper.removeEventListener('touchstart', eventDown);
            this.wrapper.removeEventListener('mousedown', eventDown);
        });

        const eventUp = e => {
            if (e.touches && e.touches.length > 1) {
                return;
            }

            drag = false;
            pxMove = 0;
            scrollDirection = null;

            if (lyric) {
                this.util.preventClick();
                lyric.fireEvent('update-end', e);
                this.wavesurfer.fireEvent('lyric-update-end', lyric, e);
            }

            lyric = null;
        };
        this.wrapper.addEventListener('mouseleave', eventUp);
        this.wrapper.addEventListener('mouseup', eventUp);
        this.wrapper.addEventListener('touchend', eventUp);

        document.body.addEventListener('mouseup', eventUp);
        document.body.addEventListener('touchend', eventUp);
        this.on('disable-drag-selection', () => {
            document.body.removeEventListener('mouseup', eventUp);
            document.body.removeEventListener('touchend', eventUp);
            this.wrapper.removeEventListener('touchend', eventUp);
            this.wrapper.removeEventListener('mouseup', eventUp);
            this.wrapper.removeEventListener('mouseleave', eventUp);
        });

        const eventMove = event => {
            if (!drag) {
                return;
            }
            if (++pxMove <= slop) {
                return;
            }

            if (event.touches && event.touches.length > 1) {
                return;
            }
            if (event.targetTouches && event.targetTouches[0].identifier != touchId) {
                return;
            }

            // auto-create a lyric during mouse drag, unless lyric-count would exceed "maxLyrics"
            if (!lyric) {
                lyric = this.add(params || {});
                if (!lyric) {
                    return;
                }
            }

            const end = this.wavesurfer.drawer.handleEvent(event);
            const startUpdate = this.wavesurfer.lyrics.util.getLyricSnapToGridValue(
                start * duration
            );
            const endUpdate = this.wavesurfer.lyrics.util.getLyricSnapToGridValue(
                end * duration
            );
            lyric.update({
                start: Math.min(endUpdate, startUpdate),
                end: Math.max(endUpdate, startUpdate)
            });

            let orientedEvent = this.util.withOrientation(event, this.vertical);

            // If scrolling is enabled
            if (scroll && container.clientWidth < this.wrapper.scrollWidth) {
                // Check threshold based on mouse
                const x = orientedEvent.clientX - wrapperRect.left;
                if (x <= scrollThreshold) {
                    scrollDirection = -1;
                } else if (x >= wrapperRect.right - scrollThreshold) {
                    scrollDirection = 1;
                } else {
                    scrollDirection = null;
                }
                scrollDirection && edgeScroll(event);
            }
        };
        this.wrapper.addEventListener('mousemove', eventMove);
        this.wrapper.addEventListener('touchmove', eventMove);
        this.on('disable-drag-selection', () => {
            this.wrapper.removeEventListener('touchmove', eventMove);
            this.wrapper.removeEventListener('mousemove', eventMove);
        });

        this.wavesurfer.on('lyric-created', lyric => {
            if (this.lyricsMinLength) {
                lyric.minLength = this.lyricsMinLength;
            }
        });
    }

    disableDragSelection() {
        this.fireEvent('disable-drag-selection');
    }

    /**
     * Get current lyric
     *
     * The smallest lyric that contains the current time. If several such
     * lyrics exist, take the first. Return `null` if none exist.
     *
     * @returns {Lyric} The current lyric
     */
    getCurrentLyric() {
        const time = this.wavesurfer.getCurrentTime();
        let min = null;
        Object.keys(this.list).forEach(id => {
            const cur = this.list[id];
            if (cur.start <= time && cur.end >= time) {
                if (!min || cur.end - cur.start < min.end - min.start) {
                    min = cur;
                }
            }
        });

        return min;
    }

    /**
     * Match the value to the grid, if required
     *
     * If the lyrics plugin params have a snapToGridInterval set, return the
     * value matching the nearest grid interval. If no snapToGridInterval is set,
     * the passed value will be returned without modification.
     *
     * @param {number} value the value to snap to the grid, if needed
     * @param {Object} params the lyrics plugin params
     * @returns {number} value
     */
    getLyricSnapToGridValue(value, params) {
        if (params.snapToGridInterval) {
            // the lyrics should snap to a grid
            const offset = params.snapToGridOffset || 0;
            return (
                Math.round((value - offset) / params.snapToGridInterval) *
                    params.snapToGridInterval +
                offset
            );
        }

        // no snap-to-grid
        return value;
    }
}
