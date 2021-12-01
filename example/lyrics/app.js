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
        splitChannels: true,
        splitChannelsOptions: {
            overlay: true, 
            filterChannels: [],
            relativeNormalization: true
        },
        plugins: [
            WaveSurfer.lyrics.create({
                lyricsMinLength: 1,
                resize:true,
                lyrics: [
                    {
                        start: 1,
                        end: 13,
                        resize:true,
                        line1:"this is jaca",
                        line2:"这是借卡",
                        loop: false,
                        color: 'hsla(400, 100%, 30%, 0.5)'
                    },
                    {
                        start: 15,
                        end: 37,
                        resize:true,
                        line1:"Hello world",
                        line2:"你好世界！",
                        loop: false,
                        color: 'hsla(200, 50%, 70%, 0.4)', 
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
    //wavesurfer.load('../media/demo.wav');
    wavesurfer.load('../media/stereo.mp3');


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


    var encodeLrc = 'W2FyOlJpY2sgQXN0bGV5XQpbdGk6TmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXBdCltieTpdCltoYXNoOjgzMjU0MzY5ZjIwMzU4OTE1NGFlYzAzZmU0MzZjYmEyXQpbYWw6XQpbc2lnbjpdCltxcTpdClt0b3RhbDoyMTI5NzZdCltvZmZzZXQ6MF0KWzAwOjAwLjQ4NV1SaWNrIEFzdGxleSAtIE5ldmVyIEdvbm5hIEdpdmUgWW91IFVwClswMDoxOS4zMTFdV2UncmUgbm8gc3RyYW5nZXJzIHRvIGxvdmUKWzAwOjIzLjIwNl1Zb3Uga25vdyB0aGUgcnVsZXMgYW5kIHNvIGRvIEkKWzAwOjI3LjQ5NV1BIGZ1bGwgY29tbWl0bWVudCdzIHdoYXQgSSdtIHRoaW5raW5nIG9mClswMDozMS43NDNdWW91IHdvdWxkbid0IGdldCB0aGlzIGZyb20gYW55IG90aGVyIGd1eQpbMDA6MzUuNzA5XUkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKWzAwOjQwLjk4Ml1Hb3R0YSBtYWtlIHlvdSB1bmRlcnN0YW5kClswMDo0My4zOTNdTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAgIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpbMDA6NDguMTA0XU5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKWzAwOjUyLjg1XU5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeSAgbmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKWzAwOjU2LjM2Ml1OZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpbMDE6MDEuNTM4XVdlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWzAxOjA1LjQ1MV1Zb3VyIGhlYXJ0J3MgYmVlbiBhY2hpbmcgYnV0IHlvdSdyZSB0b28gc2h5IHRvIHNheSBpdApbMDE6MDkuNzIxXUluc2lkZSB3ZSBib3RoIGtub3cgd2hhdCdzIGJlZW4gZ29pbmcgb24KWzAxOjEzLjc0OV1XZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0ClswMToxOC40MDNdQW5kIGlmIHlvdSBhc2sgbWUgaG93IEknbSBmZWVsaW5nClswMToyMy4xODBdRG9uJ3QgdGVsbCBtZSB5b3UncmUgdG9vIGJsaW5kIHRvIHNlZQpbMDE6MjUuNjg1XU5ldmVyIGdvbm5hIGdpdmUgeW91IHVwICBuZXZlciBnb25uYSBsZXQgeW91IGRvd24KWzAxOjI5Ljk3MV1OZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91ClswMTozNC4xOTJdTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5ICBuZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpbMDE6MzguNzI4XU5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91ClswMTo0Mi42NzZdTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAgIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpbMDE6NDcuMTgxXU5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKWzAxOjUxLjcxXU5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeSAgbmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKWzAxOjU1LjU5NF1OZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpbMDI6MDAuOTE5XU9vaCBnaXZlIHlvdSB1cApbMDI6MDQuMzQ4XU9vaCBnaXZlIHlvdSB1cApbMDI6MDguNDY0XU9vaCBuZXZlciBnb25uYSBnaXZlICBuZXZlciBnb25uYSBnaXZlIGdpdmUgeW91IHVwClswMjoxMi41NTddT29oIG5ldmVyIGdvbm5hIGdpdmUgIG5ldmVyIGdvbm5hIGdpdmUgZ2l2ZSB5b3UgdXAKWzAyOjE3LjQ4OF1XZSd2ZSBrbm93biBlYWNoIG90aGVyIGZvciBzbyBsb25nClswMjoyMS43NzhdWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKWzAyOjI1Ljg2M11JbnNpZGUgd2UgYm90aCBrbm93IHdoYXQncyBiZWVuIGdvaW5nIG9uClswMjoyOS45ODVdV2Uga25vdyB0aGUgZ2FtZSBhbmQgd2UncmUgZ29ubmEgcGxheSBpdApbMDI6MzQuMjY5XUkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKWzAyOjM5LjE5MV1Hb3R0YSBtYWtlIHlvdSB1bmRlcnN0YW5kClswMjo0MS45MTddTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAgIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpbMDI6NDYuMTg3XU5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKWzAyOjUwLjQyM11OZXZlciBnb25uYSBtYWtlIHlvdSBjcnkgIG5ldmVyIGdvbm5hIHNheSBnb29kYnllClswMjo1NC43MTRdTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKWzAyOjU4Ljg2OV1OZXZlciBnb25uYSBnaXZlIHlvdSB1cCAgbmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duClswMzowMy4xOF1OZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91ClswMzowNy4yOTRdTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5ICBuZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpbMDM6MTEuNTQwXU5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91ClswMzoxNS44MTNdTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAgIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpbMDM6MTkuOTkyXU5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKWzAzOjI0LjI1OF1OZXZlciBnb25uYSBtYWtlIHlvdSBjcnkgIG5ldmVyIGdvbm5hIHNheSBnb29kYnllClswMzoyOC40NjVdTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3U='
    var encodeTLrcText = 'WzAwOjAwLjQ4NV0KWzAwOjE5LjMxMV3miJHku6zpg73kuI3mmK/mgYvniLHnmoTmlrDmiYsKWzAwOjIzLjIwNl3kvaDmiJHpg73mh4LlvpfpgqPkupvop4TliJkKWzAwOjI3LjQ5NV3miJHlj6rluIzmnJvlj6/ku6Xlhajlipvku6XotbQKWzAwOjMxLjc0M13kvaDkuI3kvJrku47lhbbku5bnlLfkurrpgqPph4zlvpfliLDov5nmoLfnmoTniLHmg4UKWzAwOjM1LjcwOV3miJHlj6rmg7PlkYror4nkvaDmiJHnmoTmhJ/lj5cKWzAwOjQwLjk4Ml3orqnkvaDmmI7nmb0KWzAwOjQzLjM5M13msLjov5zkuI3kvJrmlL7lvIPkvaAg5rC46L+c5LiN5Lya6K6p5L2g5aSx5pybClswMDo0OC4xMDRd5rC46L+c5LiN5Lya6YCD56a7IOaIluiAheaKm+W8g+S9oApbMDA6NTIuODVd5rC46L+c5LiN5Lya6K6p5L2g5rWB5rOqIOawuOi/nOS4jeS8muivtOWGjeingQpbMDA6NTYuMzYyXeawuOi/nOS4jeS8muivtOiwjiDkuI3kvJrkvKTlrrPkvaAKWzAxOjAxLjUzOF3miJHku6znm7jor4bkuobov5nkuYjkuYUKWzAxOjA1LjQ1MV3kvaDnmoTlv4Plvojnl5vkvYbljbTkuI3lpb3mhI/mgJ3lvIDlj6MKWzAxOjA5LjcyMV3lnKjmiJHku6znmoTlhoXlv4Pmt7HlpIQg5oiR5Lus6YO955+l6YGT5Y+R55Sf5LqG5LuA5LmIClswMToxMy43NDld5oiR5Lus6YO955+l6YGT54ix5oOF6KeE5YiZIOW5tuWHhuWkh+W8gOWniwpbMDE6MTguNDAzXeWmguaenOS9oOmXruaIkeeahOaEn+WPlwpbMDE6MjMuMTgwXeS4jeimgeWRiuivieaIkeS9oOeci+S4jeingQpbMDE6MjUuNjg1XeawuOi/nOS4jeS8muaUvuW8g+S9oCDmsLjov5zkuI3kvJrorqnkvaDlpLHmnJsKWzAxOjI5Ljk3MV3msLjov5zkuI3kvJrpgIPnprsg5oiW6ICF5oqb5byD5L2gClswMTozNC4xOTJd5rC46L+c5LiN5Lya6K6p5L2g5rWB5rOqIOawuOi/nOS4jeS8muivtOWGjeingQpbMDE6MzguNzI4XeawuOi/nOS4jeS8muivtOiwjiDkuI3kvJrkvKTlrrPkvaAKWzAxOjQyLjY3Nl3msLjov5zkuI3kvJrmlL7lvIPkvaAg5rC46L+c5LiN5Lya6K6p5L2g5aSx5pybClswMTo0Ny4xODFd5rC46L+c5LiN5Lya6YCD56a7IOaIluiAheaKm+W8g+S9oApbMDE6NTEuNzFd5rC46L+c5LiN5Lya6K6p5L2g5rWB5rOqIOawuOi/nOS4jeS8muivtOWGjeingQpbMDE6NTUuNTk0XeawuOi/nOS4jeS8muivtOiwjiDkuI3kvJrkvKTlrrPkvaAKWzAyOjAwLjkxOV3mlL7lvIPkvaAKWzAyOjA0LjM0OF3mlL7lvIPkvaAKWzAyOjA4LjQ2NF3nu53kuI3kvJog57ud5LiN5LyaIOe7neS4jeS8muaUvuW8g+S9oApbMDI6MTIuNTU3Xee7neS4jeS8miDnu53kuI3kvJog57ud5LiN5Lya5pS+5byD5L2gClswMjoxNy40ODhd5oiR5Lus55u46K+G5LqG6L+Z5LmI5LmFClswMjoyMS43Nzhd5L2g55qE5b+D5b6I55eb5L2G5Y205LiN5aW95oSP5oCd5byA5Y+jClswMjoyNS44NjNd5Zyo5oiR5Lus55qE5YaF5b+D5rex5aSEIOaIkeS7rOmDveefpemBk+WPkeeUn+S6huS7gOS5iApbMDI6MjkuOTg1XeaIkeS7rOmDveefpemBk+eIseaDheinhOWImSDlubblh4blpIflvIDlp4sKWzAyOjM0LjI2OV3miJHlj6rmg7PlkYror4nkvaDmiJHnmoTmhJ/lj5cKWzAyOjM5LjE5MV3orqnkvaDog73lpJ/kuobop6PmiJHnmoTlv4PmhI8KWzAyOjQxLjkxN13msLjov5zkuI3kvJrmlL7lvIPkvaAg5rC46L+c5LiN5Lya6K6p5L2g5aSx5pybClswMjo0Ni4xODdd5rC46L+c5LiN5Lya6YCD56a7IOaIluiAheaKm+W8g+S9oApbMDI6NTAuNDIzXeawuOi/nOS4jeS8muiuqeS9oOa1geazqiDmsLjov5zkuI3kvJror7Tlho3op4EKWzAyOjU0LjcxNF3msLjov5zkuI3kvJror7TosI4g5LiN5Lya5Lyk5a6z5L2gClswMjo1OC44Njld5rC46L+c5LiN5Lya5pS+5byD5L2gIOawuOi/nOS4jeS8muiuqeS9oOWkseacmwpbMDM6MDMuMThd5rC46L+c5LiN5Lya6YCD56a7IOaIluiAheaKm+W8g+S9oApbMDM6MDcuMjk0XeawuOi/nOS4jeS8muiuqeS9oOa1geazqiDmsLjov5zkuI3kvJror7Tlho3op4EKWzAzOjExLjU0MF3msLjov5zkuI3kvJror7TosI4g5LiN5Lya5Lyk5a6z5L2gClswMzoxNS44MTNd5rC46L+c5LiN5Lya5pS+5byD5L2gIOawuOi/nOS4jeS8muiuqeS9oOWkseacmwpbMDM6MTkuOTkyXeawuOi/nOS4jeS8mumAg+emuyDmiJbogIXmipvlvIPkvaAKWzAzOjI0LjI1OF3msLjov5zkuI3kvJrorqnkvaDmtYHms6og5rC46L+c5LiN5Lya6K+05YaN6KeBClswMzoyOC40NjVd5rC46L+c5LiN5Lya6K+06LCOIOS4jeS8muS8pOWus+S9oA=='
    var b64DecodeUnicode = function (str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    }

    wavesurfer.lyrics.loadLrcUrl(b64DecodeUnicode(encodeLrc), b64DecodeUnicode(encodeTLrcText))

});
