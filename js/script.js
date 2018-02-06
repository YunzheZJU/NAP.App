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
const $count_switch = $('#count-switch');
const $control_previous = $('#control-previous');
const $control_toggle = $('#control-toggle');
const $control_next = $('#control-next');
const $current_time = $('#current-time');
const $total_time = $('#total-time');
const $prograss_go = $('#progress-go');
const $prograss_played = $('#progress-played');
const $prograss_loaded = $('#progress-loaded');
const $prograss_indicator = $('#progress-indicator');
let $aplayer_ptime;
let $aplayer_dtime;
let $aplayer_loaded;
let $aplayer_played;
const rotation_speed = 0.2;
let ap;
let musicInfo;
let listCount = 0;
let isPlaying = false;
let rotation = 0;
let currentUrl = location['href'];
let title;
let description = $description[0].innerText;
let descriptionToShow = description.substring(0, 60);
let resizeFnBox = [];
let resizeTimer = null;
let needle_rotation_max = '-60deg';
let popup_message = new $.Popup({
    backOpacity: 0,
    speed: 500,
    closeContent: '',
    preloaderContent: '',
    containerClass: "popup-message",
    afterOpen : function(){
        let popup = this;
        setTimeout(function(){
            popup.close();
        }, 500);
    }
});
let clipboard = new Clipboard('#btn-share', {
    text: function () {
        return currentUrl;
    }
});

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
        $disc_group.css('top', '30px');
        needle_rotation_max = '-12deg';
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
        $control_toggle.removeClass('icomoon-play2');
        $control_toggle.addClass('icomoon-pause');
        console.log('play');
    });
    ap.on('pause', function () {
        switchDisc();
        $control_toggle.removeClass('icomoon-pause');
        $control_toggle.addClass('icomoon-play2');
        console.log('pause');
    });
    ap.on('canplay', function () {
        console.log('canplay');
    });
    ap.on('playing', function () {
        if ($aplayer_ptime) {
            console.log(ap.audio.currentTime);
            const text_current_time = $aplayer_ptime.innerText;
            const text_total_time = $aplayer_dtime.innerText;
            const current_time = convertTime(text_current_time);
            const total_time = convertTime(text_total_time);
            const percentage = current_time / total_time;
            const loaded = $aplayer_loaded.css('width');
            const played = $aplayer_played.css('width');
            const progress_width = $prograss_go[0].offsetWidth;
            const indicator_offset = ~~(progress_width * percentage - 7);
            // console.log($prograss_go[0].offsetWidth);
            $prograss_loaded.css('width', loaded);
            $prograss_played.css('width', played);
            $prograss_indicator.css('left', '' + indicator_offset + 'px');
            // $prograss_played.attr('aria-valuenow', current_time);
            // $prograss_played.attr('aria-valuemax', total_time);
            $current_time[0].innerText = text_current_time;
            $total_time[0].innerText = $aplayer_dtime.innerText;
        } else {
            $aplayer_ptime = $('.aplayer-ptime')[0];
            $aplayer_dtime = $('.aplayer-dtime')[0];
            $aplayer_loaded = $('.aplayer-loaded');
            $aplayer_played = $('.aplayer-played');
        }
        console.log('playing');
    });
    ap.on('ended', function () {
        console.log('ended');
    });
    ap.on('error', function () {
        console.log('error');
    });
}

function convertTime(text_time) {
    const time = text_time.split(':');
    return ~~time[0] * 60 + ~~time[1];
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
            initiatePlayer(musicInfo);
        }
        ap.play();
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

$control_previous.click(function () {
    if (!ap) {
        return;
    }
    let index = ap.playIndex;
    if (index > 0) {
        index--;
        ap.setMusic(index);
        ap.play();
    } else {
        popup_message.open(
            '<p class="popup-text"><span class="icomoon-notification icon-message"></span>已到第一首>_<</p>',
            'html'
        );
    }
});

$control_toggle.click(function () {
    if (ap) {
        ap.toggle();
    } else {
        initiatePlayer(musicInfo);
        ap.play();
    }
});

$control_next.click(function () {
    if (!ap) {
        return;
    }
    let index = ap.playIndex;
    if (index < listCount - 1) {
        index++;
        ap.setMusic(index);
        ap.play();
    } else {
        popup_message.open(
            '<p class="popup-text"><span class="icomoon-notification icon-message"></span>已到最后一首>_<</p>',
            'html'
        );
    }
});

$btn_play.click(function () {
    if (ap) {
        ap.addMusic([musicInfo]);
    } else {
        initiatePlayer(musicInfo);
    }
    listCount++;
    ap.setMusic(listCount - 1);
    ap.play();
});

$btn_add.click(function () {
    if (ap) {
        ap.addMusic([musicInfo]);
    } else {
        initiatePlayer(musicInfo);
    }
    listCount++;
    popup_message.open(
        '<p class="popup-text"><span class="icomoon-notification icon-message"></span>已添加到播放列表>_<</p>',
        'html'
    );
});

$btn_favorite.click(function () {
    alert('Add this song to my playlist.');
});

$btn_download.click(function () {
    window.open(musicInfo['url']);
    popup_message.open(
        '<p class="popup-text"><span class="icomoon-notification icon-message"></span>开始下载开始下载>_<</p>',
        'html'
    );
});

clipboard.on('success', function (e) {
    popup_message.open(
        '<p class="popup-text"><span class="icomoon-notification icon-message"></span>本页URL已复制到剪贴板>_<</p>',
        'html'
    );
    e.clearSelection();
});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    popup_message.open(
        '<p class="popup-text"><span class="icomoon-cancel-circle icon-message"></span>访问剪贴板失败>_<<br />请使用Ctrl + C手动复制</p>',
        'html'
    );
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