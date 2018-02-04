/**
 * Created by Yunzhe on 2018/2/4.
 */

'use strict';
const $disc_cover = $('#disc-cover');
const $disc_mask = $('#disc-mask');
const $disc_play = $('#disc-play');
const $disc_light = $('#disc-light');
const $disc_needle = $('#disc-needle');
let isPlaying = false;
let rotation = 0;
const rotation_speed = 0.2;
const ap = new APlayer({
    element: document.getElementById('player1'),
    narrow: false,
    autoplay: true,
    showlrc: false,
    mutex: true,
    theme: '#e6d0b2',
    preload: 'metadata',
    mode: 'circulation',
    music: {
        title: 'Preparation',
        author: 'Hans Zimmer/Richard Harvey',
        url: 'https://moeplayer.b0.upaiyun.com/aplayer/preparation.mp3',
        pic: 'https://moeplayer.b0.upaiyun.com/aplayer/preparation.jpg'
    }
});
ap.on('play', function () {
    switchDisc();
    console.log('play');
});
ap.on('pause', function () {
    switchDisc();
    console.log('pause');
});
ap.on('canplay', function () {
    console.log('canplay');
});
ap.on('playing', function () {
    console.log('playing');
});
ap.on('ended', function () {
    console.log('ended');
});
ap.on('error', function () {
    console.log('error');
});
function addMusic() {
    $.get("http://api.anisong.niconi.cc/song/simple?id=1&id=2&id=7&id=8", function (data) {
        // console.log(data);
        data.forEach(function (element) {
            // console.log(element);
            let tempArray = [];
            element['simpleArtistInfos'].forEach(function (element) {
                tempArray.push(element['name']);
            });
            const autherlist = tempArray.join('/');
            // console.log(autherlist);
            ap.addMusic([{
                title: element['title'],
                author: autherlist,
                url: 'http://api.anisong.niconi.cc' + element['fileUrl'],
                pic: 'http://api.anisong.niconi.cc' + element['imageUrl'],
                lrc: ''
            }])
        })
    });
}

addMusic();

function switchDisc() {
    if (isPlaying) {
        isPlaying = false;
        $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
        $disc_play.css('opacity', '1');
        $disc_play.css('cursor', 'pointer');
        $disc_play.one('click', function () {
            ap.play();
        });
    } else {
        isPlaying = true;
        $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-18deg)');
        $disc_play.css('opacity', '0');
        $disc_play.css('cursor', 'default');
        $disc_light.one('click', function () {
            ap.pause();
        });
        $disc_play.one('click', function () {
            ap.pause();
        });
    }
}

function animate() {
    if (isPlaying) {
        rotation = rotation % 360;
        rotation += rotation_speed;
        $disc_cover.css('transform', 'scale(0.63) rotate(' + rotation + 'deg)');
        $disc_mask.css('transform', 'rotate(' + rotation + 'deg)');
    }
    requestAnimationFrame(animate);
}

animate();