/**
 * Created by Yunzhe on 2018/2/4.
 */

'use strict';
const $title = $('#title');
const $album = $('#album');
const $artist = $('#artist');
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
const $text_favorite = $('#text_favorite');
const $text_download = $('#text_download');
const $text_share = $('#text_share');
const $description = $('#description');
const $count = $('#count');
const $count_play = $('#count-play');
const $count_switch = $('#count-switch');
const $info_board = $('#info-board');
const $lyric_board = $('#lyric-board');
const $lyric_board_chs = $('#lyric-board-chs');
const $lyric_content = $('#lyric-content');
const $lyric_content_chs = $('#lyric-content-chs');
const $control_board = $('#control-board');
const $player_container = $('#player-container');
const $control_previous = $('#control-previous');
const $control_toggle = $('#control-toggle');
const $control_next = $('#control-next');
const $control_volume = $('#control-volume');
const $control_mode = $('#control-mode');
const $control_list = $('#control-list');
const $current_time = $('#current-time');
const $total_time = $('#total-time');
const $progress_playlist = $('#progress-playlist');
const $progress_box = $('#progress-box');
const $prograss_container = $('#progress-container');
const $prograss_indicator = $('#progress-indicator');
const $prograss_go = $('#progress-go');
const $prograss_played = $('#progress-played');
const $prograss_loaded = $('#progress-loaded');
const $volume_container = $('#volume-container');
const $volume_go = $('#volume-go');
const $volume_value = $('#volume-value');
const $volume_indicator = $('#volume-indicator');
const $playlist_box = $('#playlist-box');
const $playlist_list = $('#playlist-list');
const $playlist_not_exist = $('#playlist-not-exist');
const rotation_speed = 0.2;
const popup_time = new $.Popup({
    speed: 500,
    closeContent: '',
    preloaderContent: '',
    containerClass: "popup-message"
});
const popup_message = new $.Popup({
    speed: 500,
    closeContent: '',
    preloaderContent: '',
    containerClass: "popup-message",
    afterOpen: function () {
        let popup = this;
        setTimeout(function () {
            popup.close();
        }, 500);
    }
});
const clipboard = new Clipboard('#btn-share', {
    text: function () {
        return currentUrl;
    }
});
let currentId = 7;
let artistsHtml = [];
let newTime = null;
let baseTime = null;
let mouseDownX;
let progressIndicatorLeft;
let progressContainerWidth;
let volumeIndicatorLeft;
let volumeContainerWidth;
let ap;
let lrc;
let lrcContent;
let musicInfo;
let totalTime;
let listCount = 0;
let isdraggingProgressIndicator = false;
let isdraggingVolumeIndicator = false;
let isFirstPlay = true;
let showList = false;
let rotation = 0;
let boardState = 0;
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
    onWidthChange();
    resizeTimer = setTimeout(function () {
        for (let i = 0; i < resizeFnBox.length; i++) {
            resizeFnBox[i]();
        }
    }, 100);
};

function onWidthChange() {
    // Store $progress_container's new width
    progressContainerWidth = $prograss_container[0].clientWidth;
    volumeContainerWidth = $volume_container[0].clientWidth;
    // Update progress and volume indicators
    if (ap) {
        const currentTime = newTime ? newTime : ap.audio.currentTime;
        const percentage = currentTime / totalTime;
        const progressWidth = $prograss_go[0].offsetWidth;
        const progressIndicatorOffset = ~~(progressWidth * percentage - 7);
        $prograss_indicator.css('left', progressIndicatorOffset + 'px');
        const currentVolume = ap.audio.volume;
        const newLeft = currentVolume * volumeContainerWidth;
        $volume_indicator.css('left', newLeft - 8 + 'px');
        $volume_value.css('width', currentVolume * 100 + '%');
    }
    // Update description length and move the disc
    if (window.innerWidth < 992) {
        descriptionToShow = description.substring(0, 30);
        $disc_group.css('top', '100px');
        needle_rotation_max = '20deg';
        $text_favorite[0].innerText = '';
        $text_download[0].innerText = '';
        $text_share[0].innerText = '';
    } else {
        $text_favorite[0].innerText = ' 收藏';
        $text_download[0].innerText = ' 下载';
        $text_share[0].innerText = ' 分享';
        if (window.innerWidth < 1200) {
            descriptionToShow = description.substring(0, 50);
            $disc_group.css('top', '30px');
            needle_rotation_max = '-12deg';
        } else {
            descriptionToShow = description.substring(0, 70);
            $disc_group.css('top', '10px');
            needle_rotation_max = '-20deg';
        }
    }
    if ($('#collect').length) {
        spread();
    } else {
        collect();
    }
    if (ap && !ap.audio.paused) {
        $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(' + needle_rotation_max + ')');
    }
}

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

// Set up player
$(function () {
    $.get("http://api.anisong.niconi.cc/song/simple", {id: currentId}, function (data) {
        console.log(data);
        let song = data[0];
        let tempArray = [];
        artistsHtml = [];
        song['simpleArtistInfos'].forEach(function (element) {
            tempArray.push(element['name']);
            artistsHtml.push('<a href="#">' + element['name'] + '</a>')
        });
        const autherlist = tempArray.join('/');
        artistsHtml = artistsHtml.join('/');
        musicInfo = {
            id: currentId,
            title: song['title'],
            author: autherlist,
            album: song['simpleAlbumInfo'].title,
            url: 'http://api.anisong.niconi.cc' + song['fileUrl'],
            pic: 'http://api.anisong.niconi.cc' + song['imageUrl'],
            lrc: 'lyric/1.lrc'
        };
        $disc_cover.attr('src', musicInfo.pic);
        $title.text(musicInfo.title);
        $album.text(musicInfo.album);
        $artist.html(artistsHtml);
        // $control_toggle.click();
        localStorage.clear();
    });
});

function initiatePlayer(musicInfo) {
    ap = new APlayer({
        element: document.getElementById('player'),
        narrow: false,
        autoplay: false,
        showlrc: 3,
        mutex: true,
        theme: '#e6d0b2',
        preload: 'metadata',
        mode: 'circulation',
        music: musicInfo
    });
    ap.on('play', function () {
        switchDisc();
        $control_toggle.removeClass('icomoon-play2');
        $control_toggle.removeClass('control-toggle-animated');
        $control_toggle.addClass('icomoon-pause');
        console.log('play');
    });
    ap.on('pause', function () {
        switchDisc();
        $control_toggle.removeClass('icomoon-pause');
        $control_toggle.addClass('icomoon-play2');
        $control_toggle.addClass('control-toggle-animated');
        console.log('pause');
    });
    ap.on('canplay', function () {
        // Toggled when switch time or switch song
        console.log('canplay');
        // Get total time of this song
        totalTime = ~~(ap.audio.duration);
        console.log(ap.audio);
        console.log(ap.audio.readyState);
        $total_time[0].innerText = convertTimeFromNumber(totalTime);
        // If first play, add to playlist
        if (isFirstPlay) {
            addToPlaylist();
            isFirstPlay = false;
        }
    });
    ap.on('playing', function () {
        const currentTime = ap.audio.currentTime;
        const percentage = currentTime / totalTime;
        const loaded = ap.audio.buffered.end(ap.audio.buffered.length - 1) / totalTime * 100 + '%';
        const played = percentage * 100 + '%';
        const progress_width = $prograss_go[0].offsetWidth;
        const progress_indicator_offset = ~~(progress_width * percentage - 7);
        $prograss_loaded.css('width', loaded);
        if (!isdraggingProgressIndicator) {
            $prograss_played.css('width', played);
            $prograss_indicator.css('left', progress_indicator_offset + 'px');
            $total_time[0].innerText = convertTimeFromNumber(totalTime);
            // Update lyric
            updateLyric(currentTime);
        }
        $current_time[0].innerText = convertTimeFromNumber(currentTime);
    });
    ap.on('ended', function () {
        console.log('ended');
    });
    ap.on('error', function () {
        console.log('error');
    });
    // Set up volume controller
    const volume_width = $volume_go[0].offsetWidth;
    const volume_indicator_offset = ~~(0.8 * volume_width - 7);
    $volume_value.css('width', 80 + '%');
    $volume_indicator.css('left', volume_indicator_offset + 'px');
    console.log('Initialization OK');
}

function convertTimeFromText(text_time) {
    const time = text_time.split(':');
    return ~~time[0] * 60 + ~~time[1];
}

function convertTimeFromNumber(number_time) {
    if (!number_time) {
        return '00:00';
    }
    number_time = ~~number_time;
    return addZeroPrefix(~~(number_time / 60)) + ":" + addZeroPrefix(number_time % 60);
}

function addZeroPrefix(numText) {
    numText = numText.toString();
    if (numText.length < 2) {
        return '0' + numText;
    }
    else {
        return numText;
    }
}

function switchDisc() {
    if (ap.audio.paused) {
        initiateDisc();
    } else {
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
    $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
    $disc_play.css('opacity', '1');
    $disc_play.css('cursor', 'pointer');
    $disc_play.one('click', function () {
        if (!ap) {
            initiatePlayer(musicInfo);
        }
        console.log('play(' + newTime + ')');
        ap.play(newTime);
        newTime = null;
    });
}

initiateDisc();

function updateLyric(currentTime) {
    if (lrc) {
        let index = lrc.select(currentTime);
        if (index >= 0) {
            // Transform
            $lyric_content.css('top', 4 - 2 * index + 'rem');
            $lyric_content.css('background-image', '-webkit-gradient(linear, 0 top, 0 bottom, ' +
                'color-stop(' + (index - 1.5) / lrcContent.length + ', #bbbbbb), ' +
                'color-stop(' + (index + 0.5) / lrcContent.length + ', #000000), ' +
                'color-stop(' + (index + 2.5) / lrcContent.length + ', #bbbbbb))');
            $lyric_content_chs.css('top', 3.5 - 3.5 * index + 'rem');
            $lyric_content_chs.css('background-image', '-webkit-gradient(linear, 0 top, 0 bottom, ' +
                'color-stop(' + (index - 0.5) / lrcContent.length + ', #bbbbbb), ' +
                'color-stop(' + (index + 0.5) / lrcContent.length + ', #000000), ' +
                'color-stop(' + (index + 1.5) / lrcContent.length + ', #bbbbbb))');
        }
    }
}

function animate() {
    if (ap && !ap.audio.paused) {
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
        if (!ap.audio.paused) {
            ap.pause();
        } else {
            console.log('play(' + newTime + ')');
            ap.play(newTime);
            newTime = null;
        }
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
    ap.setMusic(listCount - 1);
    ap.play();
});

$btn_add.click(function () {
    if (ap) {
        ap.addMusic([musicInfo]);
        addToPlaylist();
    } else {
        initiatePlayer(musicInfo);
    }
    if (showList) {
        if (listCount) {
            $player_container.css('height', (1.5 + listCount * 2.25) + 'rem');
        }
    } else {
        $control_list.click();
    }
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
    // Switch off
    $count_switch.removeClass();
    $count_switch.addClass('count-off');
}, function () {
    $count_play.css('line-height', '1.5rem');
    // Switch on
    $count_switch.removeClass();
    $count_switch.addClass('count-on');
});

$prograss_indicator.mousedown(function (event) {
    mouseDownX = event.clientX;
    progressIndicatorLeft = ~~($prograss_indicator.css('left').split('px')[0]);
    baseTime = newTime ? newTime : ap.audio.currentTime;
    isdraggingProgressIndicator = true;
});

$(document).mouseup(function () {
    if (isdraggingProgressIndicator) {
        isdraggingProgressIndicator = false;
        $current_time[0].innerText = convertTimeFromNumber(newTime);
        if (ap && !ap.audio.paused) {
            ap.play(newTime);
            newTime = null;
        }
        $total_time.css('color', 'inherit');
        popup_time.close();
        window.getSelection().removeAllRanges();
    }
    if (isdraggingVolumeIndicator) {
        isdraggingVolumeIndicator = false;
        // console.log(window.getSelection());
        window.getSelection().removeAllRanges();
    }
});

$(document).mousemove(function (event) {
    if (isdraggingProgressIndicator && ap) {
        onDraggingProgressIndicator(event);
    }
    if (isdraggingVolumeIndicator && ap) {
        onDraggingVolumeIndicator(event);
    }
});

function onDraggingProgressIndicator(event) {
    const mouseDeltaX = event.clientX - mouseDownX;
    let newLeft = progressIndicatorLeft + mouseDeltaX;
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft > progressContainerWidth) {
        newLeft = progressContainerWidth;
    }
    const percentage = newLeft / progressContainerWidth;
    newTime = percentage * totalTime;
    const deltaTime = newTime - baseTime;
    $prograss_indicator.css('left', newLeft - 7 + 'px');
    $prograss_played.css('width', percentage * 100 + '%');
    if (deltaTime > 0) {
        $total_time.css('color', '#ed2525');
    } else if (deltaTime < 0) {
        $total_time.css('color', '#4de14d');
    } else {
        $total_time.css('color', 'inherit');
    }
    const newTimeText = convertTimeFromNumber(newTime);
    const totalTimeText = convertTimeFromNumber(totalTime);
    $total_time[0].innerText = newTimeText;
    popup_time.open(
        '<p class="popup-text"><span class="icomoon-notification icon-message"></span>' +
        newTimeText + '/' + totalTimeText + '　' + (deltaTime >= 0 ? '+' : '') + ~~deltaTime + 's</p>',
        'html'
    );
    updateLyric(newTime);
}

function onDraggingVolumeIndicator(event) {
    const mouseDeltaX = event.clientX - mouseDownX;
    let newLeft = volumeIndicatorLeft + mouseDeltaX;
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft > volumeContainerWidth) {
        newLeft = volumeContainerWidth;
    }
    const percentage = newLeft / volumeContainerWidth;
    ap.volume(percentage);
    $volume_indicator.css('left', newLeft - 8 + 'px');
    $volume_value.css('width', percentage * 100 + '%');
    switchVolumeIcon(percentage);
}

$prograss_go.click(function (event) {
    const percentage = event.offsetX / progressContainerWidth;
    newTime = percentage * totalTime;
    if (!ap.audio.paused) {
        ap.play(newTime);
        newTime = null;
    } else {
        $prograss_indicator.css('left', event.offsetX - 7 + 'px');
        $prograss_played.css('width', percentage * 100 + '%');
        $current_time[0].innerText = convertTimeFromNumber(newTime);
    }
});

$volume_indicator.mousedown(function (event) {
    mouseDownX = event.clientX;
    volumeIndicatorLeft = ~~($volume_indicator.css('left').split('px')[0]);
    isdraggingVolumeIndicator = true;
});

$volume_go.click(function (event) {
    const percentage = event.offsetX / volumeContainerWidth;
    ap.volume(percentage);
    $volume_indicator.css('left', event.offsetX - 8 + 'px');
    $volume_value.css('width', percentage * 100 + '%');
    switchVolumeIcon(percentage);
});

function switchVolumeIcon(volume) {
    let iconClass;
    if (volume === 0) {
        iconClass = 'icomoon-volume-mute2';
    } else if (volume < 0.33) {
        iconClass = 'icomoon-volume-low';
    } else if (volume < 0.66) {
        iconClass = 'icomoon-volume-medium';
    } else {
        iconClass = 'icomoon-volume-high';
    }
    $control_volume.removeClass();
    $control_volume.addClass(iconClass);
}

$control_volume.click(function () {
    // Mute
    ap.volume(0);
    $volume_indicator.css('left', '-8px');
    $volume_value.css('width', '0');
    switchVolumeIcon(0);
});

$control_mode.click(function () {
    let currentMode = ~~$control_mode.attr('data-mode');
    currentMode = currentMode === 3 ? 0 : (currentMode + 1);
    $control_mode.attr('data-mode', currentMode);
    switchModeIcon(currentMode);
});

function switchModeIcon(mode) {
    let iconClass = '';
    switch (mode) {
        case 0:
            // Random
            ap.mode = 'random';
            iconClass = 'icomoon-shuffle';
            break;
        case 1:
            // Single
            ap.mode = 'single';
            iconClass = 'icomoon-infinite';
            break;
        case 2:
            // Circulation (Loop)
            ap.mode = 'circulation';
            iconClass = 'icomoon-loop';
            break;
        case 3:
            // Order
            ap.mode = 'order';
            iconClass = 'icomoon-arrow-right2';
            break;
        default:
            console.log('Unrecongnized mode!');
    }
    $control_mode.removeClass();
    $control_mode.addClass(iconClass);
}

$control_list.click(function () {
    if (showList) {
        $progress_playlist.css('top', '0');
        $progress_box.css('opacity', '1');
        $playlist_box.css('opacity', '0');
        $player_container.css('height', '3.5rem');
        showList = false;
    } else {
        $progress_playlist.css('top', '-3.5rem');
        $progress_box.css('opacity', '0');
        $playlist_box.css('opacity', '1');
        if (listCount) {
            $player_container.css('height', (1.5 + listCount * 2.25) + 'rem');
        }
        showList = true;
    }
});

$.get('lyric/1.lrc', function (data) {
    lrc = new Lyrics(data);
    lrcContent = lrc.getLyrics();
    $('.lyric-not-exist').remove();
    for (let i = 0; i < lrcContent.length; i++) {
        const lyricText = lrc.getLyric(i).text;
        const node = $('<p class="lyric-jpn"></p>').text(lyricText.length ? lyricText : '　');
        lrcContent[i].node = node;
        $lyric_content.append(node);
    }
    $.get('lyric/1_chs.lrc', function (data) {
        const lrcChs = new Lyrics(data);
        const lrcContentChs = lrcChs.getLyrics().length;
        for (let i = 0; i < lrcContentChs; i++) {
            const lyricTextChs = lrcChs.getLyric(i).text;
            lrcContent[i].nodeChs = $('<p class="lyric-chs"></p>').text(lyricTextChs.length ? lyricTextChs : '　');
            $lyric_content_chs.append(lrcContent[i].node.clone(), lrcContent[i].nodeChs);
        }
    })
});

$control_board.click(function () {
    boardState = boardState === 2 ? 0 : (boardState + 1);
    switch (boardState) {
        case 0:
            $info_board.css('-webkit-transform', 'rotateY(0deg)');
            $info_board.css('transform', 'rotateY(0deg)');
            $lyric_board.css('-webkit-transform', 'rotateY(90deg)');
            $lyric_board.css('transform', 'rotateY(90deg)');
            $lyric_board_chs.css('-webkit-transform', 'rotateY(180deg)');
            $lyric_board_chs.css('transform', 'rotateY(180deg)');
            // Change icon
            $control_board.removeClass();
            $control_board.addClass('icomoon-linkedin');
            break;
        case 1:
            $info_board.css('-webkit-transform', 'rotateY(-90deg)');
            $info_board.css('transform', 'rotateY(-90deg)');
            $lyric_board.css('-webkit-transform', 'rotateY(0deg)');
            $lyric_board.css('transform', 'rotateY(0deg)');
            $lyric_board_chs.css('-webkit-transform', 'rotateY(90deg)');
            $lyric_board_chs.css('transform', 'rotateY(90deg)');
            $control_board.removeClass();
            $control_board.addClass('icomoon-lanyrd');
            break;
        case 2:
            $info_board.css('-webkit-transform', 'rotateY(-180deg)');
            $info_board.css('transform', 'rotateY(-180deg)');
            $lyric_board.css('-webkit-transform', 'rotateY(-90deg)');
            $lyric_board.css('transform', 'rotateY(-90deg)');
            $lyric_board_chs.css('-webkit-transform', 'rotateY(0deg)');
            $lyric_board_chs.css('transform', 'rotateY(0deg)');
            $control_board.removeClass();
            $control_board.addClass('icomoon-trello');
            break;
        default:
            console.log('Unrecognized state.');
            break;
    }
});

function addToPlaylist() {
    if (listCount === 0) {
        $playlist_not_exist.remove();
    }
    listCount++;
    let list = localStorage.getItem('list');
    const item = {
        id: musicInfo.id,
        name: musicInfo.title,
        artist: artistsHtml,
        duration: convertTimeFromNumber(totalTime)
    };
    if (!list) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    console.log('Playlist previous' + JSON.stringify(list));
    list.push(item);
    localStorage.setItem('list', JSON.stringify(list));
    console.log('Playlist is updated to' + JSON.stringify(list));
    // Update UI
    let html = '<li class="container-fluid playlist-item py-1" data-id="' + item.id + '">' +
        '<div class="row unselectable">' +
        '<div class="col-4 col-md-5 col-lg-7 playlist-title"><a href="#">' + item.name + '</a></div>' +
        '<div class="col-4 col-md-4 col-lg-3 playlist-artist">' + item.artist + '</div>' +
        '<div class="col-4 col-md-3 col-lg-2 playlist-duration">' + item.duration + '</div>' +
        '</div>' +
        '</li>';
    $playlist_list.append(function () {
        return html;
    });
}

// TODO: Active playlist item