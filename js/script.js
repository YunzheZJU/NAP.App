/**
 * Created by Yunzhe on 2018/2/4.
 */

'use strict';
const $disc_group = $('#disc-group');
const $disc_cover = $('#disc-cover');
const $disc_mask = $('#disc-mask');
const $disc_play = $('#disc-play');
const $disc_light = $('#disc-light');
const $disc_needle = $('#disc-needle');
const $btn_play = $('#btn-play');
const $btn_add = $('#btn-add');
const $btn_favorite = $('#btn-favorite');
const $btn_download = $('#btn-download');
const $description = $('#description');
const $count = $('#count');
const $count_play = $('#count-play');
const $count_download = $('#count-download');
const $count_switch = $('#count-switch');
const rotation_speed = 0.2;
let ap;
let musicInfo;
let isPlaying = false;
let rotation = 0;
let currentUrl = location['href'];
let title;
let description = $description[0].innerText;
let descriptionToShow = description.substring(0, 60);
let resizeFnBox = [];
let resizeTimer = null;
let needle_rotation_max = '-60deg';
window.onresize = function () {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function () {
        for (let i = 0; i < resizeFnBox.length; i++) {
            resizeFnBox[i]();
        }
    }, 100);
};

function onWidthChange() {
    // Update description length and move the disc
    if (window.innerWidth < 992) {
        descriptionToShow = description.substring(0, 30);
        $disc_group.css('top', '100px');
        needle_rotation_max = '20deg';
    } else if (window.innerWidth < 1200) {
        descriptionToShow = description.substring(0, 50);
        $disc_group.css('top', '60px');
        needle_rotation_max = '-5deg';
    } else {
        descriptionToShow = description.substring(0, 70);
        $disc_group.css('top', '10px');
        needle_rotation_max = '-20deg';
    }
    if ($('#collect').length) {
        spread();
    } else {
        collect();
    }
    if (isPlaying) {
        $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(' + needle_rotation_max + ')');
    }
}

resizeFnBox.push(onWidthChange);

function collect() {
    $description[0].innerHTML = descriptionToShow + '...　<a id="spread" href="javascript:void(0);" class="spread link" onclick="spread();">展开</a>';
}

function spread() {
    $description[0].innerHTML = description + '　<a id="collect" href="javascript:void(0);" class="collect link" onclick="collect();">收起</a>'
}

onWidthChange();

// Enable the tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$(function () {
    $.get("http://api.anisong.niconi.cc/song/simple", {id: 1}, function (data) {
        let song = data[0];
        let tempArray = [];
        song['simpleArtistInfos'].forEach(function (element) {
            tempArray.push(element['name']);
        });
        const autherlist = tempArray.join('/');
        musicInfo = {
            title: song['title'],
            author: autherlist,
            url: 'http://api.anisong.niconi.cc' + song['fileUrl'],
            pic: 'http://api.anisong.niconi.cc' + song['imageUrl']
        };
    })
});

function play() {
    if (!ap) {
        initiatePlayer(musicInfo);
        ap.play();
    } else {
        ap.addMusic([musicInfo]);
    }
}

function initiatePlayer(musicInfo) {
    ap = new APlayer({
        element: document.getElementById('player'),
        narrow: false,
        autoplay: false,
        showlrc: false,
        mutex: true,
        theme: '#e6d0b2',
        preload: 'metadata',
        mode: 'circulation',
        music: musicInfo
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
}

function switchDisc() {
    if (isPlaying) {
        initiateDisc();
    } else {
        isPlaying = true;
        $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(' + needle_rotation_max + ')');
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

function initiateDisc() {
    isPlaying = false;
    $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
    $disc_play.css('opacity', '1');
    $disc_play.css('cursor', 'pointer');
    $disc_play.one('click', function () {
        if (!ap) {
            play();
        } else {
            ap.play();
        }
    });
}

initiateDisc();

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

$btn_play.click(function () {
    play();
    alert('Add this song to playlist and play it right now.');
});

$btn_add.click(function () {
    alert('Add tis song to current playlist.');
});

$btn_favorite.click(function () {
    alert('Add this song to my playlist.');
});

$btn_download.click(function () {
    window.open(musicInfo['url']);
    alert('Download this song.' + musicInfo['url']);
});
let clipboard = new Clipboard('#btn-share', {
    text: function (trigger) {
        return currentUrl;
    }
});
clipboard.on('success', function (e) {
    alert('本页URL已复制到剪贴板:\n' + currentUrl);

    e.clearSelection();
});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    alert('访问剪贴板失败！\n请按下Ctrl + C手动复制。');
});

$count.hover(function () {
    $count_play.css('line-height', '1.2rem');
    $count_switch.css('top', '1.2rem');
    $count_switch.css('border-top-left-radius', '0');
    $count_switch.css('border-top-right-radius', '0');
    $count_switch.css('border-bottom-left-radius', '0.3rem');
    $count_switch.css('border-bottom-right-radius', '0.3rem');
}, function () {
    $count_play.css('line-height', '1.5rem');
    $count_switch.css('top', '0');
    $count_switch.css('border-top-left-radius', '0.3rem');
    $count_switch.css('border-top-right-radius', '0.3rem');
    $count_switch.css('border-bottom-left-radius', '0');
    $count_switch.css('border-bottom-right-radius', '0');
});