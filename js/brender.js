/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

/**
 * View
 * 渲染部分：
 * 1. 提供渲染接口，用于更新UI
 */
class BRender {
    constructor() {
        // 音量图标与css样式的映射
        this.volumeIconDict = {
            'mute': 'icomoon-volume-mute2',
            'low': 'icomoon-volume-low',
            'medium': 'icomoon-volume-medium',
            'high': 'icomoon-volume-high'
        };
        // 循环模式图标与css样式的映射
        this.circulationIconDict = {
            'random': 'icomoon-shuffle',
            'single': 'icomoon-infinite',
            'circulation': 'icomoon-loop',
            'order': 'icomoon-arrow-right2'
        };
        // 歌曲质量与标识的映射
        this.stateDict = {
            1: '高质量',
            2: '先行版',
            3: '不完整'
        };
        // 记录页面类型，“歌曲”为1
        this.pageType = 1;
        // “唱片”的最大旋转角
        this.needle_rotation_max = 20;
        // 记录歌曲描述段落是否被收缩
        this.isDescriptionCollected = true;
        // 记录用户是否正在寻找时间
        this.isSeekingTime = false;
        // 用于寻找时间的弹窗
        this.popup_time = new $.Popup({
            speed: 500,
            closeContent: '',
            preloaderContent: '',
            containerClass: "popup-message"
        });
        // 用于显示消息的弹窗
        this.popup_message = new $.Popup({
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
        // 创建页面元素
        this.createDom();
    }

    /**
     * 创建页面元素
     */
    createDom() {

    }

    initPlayer(playlistItemList) {
        $('#playlist').trigger('addData', {list: playlistItemList});
    }

    /**
     * 响应窗口尺寸变化
     * @param isPlaying 标志音频是否正在播放，为布尔值
     */
    resize(isPlaying) {
        // 检查参数
        BPlaylist.checkBoolean(isPlaying, 'resize', this);
        const width = window.innerWidth;
        switch (this.pageType) {
            case 1:
                this.switchButtonText(width);
                this.switchDescriptionText(width);
                this.switchDiscStyle(width, isPlaying);
                break;
            default:
                throw new TypeError('Unknown page type.');
        }
    }

    /**
     * 根据窗口内容区宽度调整按钮区的显示文字
     * @param width 当前窗口内容区宽度
     */
    switchButtonText(width) {
        if (width < 992) {
            $('#text_favorite').text('');
            $('#text_download').text('');
            $('#text_share').text('');
        } else {
            $('#text_favorite').text('收藏');
            $('#text_download').text('下载');
            $('#text_share').text('分享');
        }
    }

    /**
     * 根据窗口内容区宽度调整歌曲描述段落的长度，截取过后的描述段落末尾使用`...`来代替剩余文字
     * @param width 当前窗口内容区宽度
     */
    switchDescriptionText(width) {
        let maxLength;
        if (width < 992) {
            maxLength = 30;
        } else if (width < 1200) {
            maxLength = 50;
        } else {
            maxLength = 70;
        }
        const descriptionFull = $('#description-text').text();
        if (descriptionFull.length <= maxLength) {
            // 如果描述文字长度小于阈值，不显示“展开”/“收起”按钮和“...”
            $('#collapse-toggle').hide();
            $('#description-text').text(descriptionFull);
        } else {
            // 截取描述段落
            const descriptionThin = descriptionFull.substring(0, maxLength);
            // 显示完整/精简描述
            $('#description-text').text(this.isDescriptionCollected ? `${descriptionThin}...` : descriptionFull);
            // 切换“展开”/“收起”按钮
            $('#collapse-toggle').text(this.isDescriptionCollected ? '展开' : '收起').show();
        }
    }

    /**
     * 根据当前窗口内容区宽度调整“唱片”形态，包括唱片的上边距和磁头的最大旋转角，当音频正在播放时，更新磁头的旋转角度
     * @param width 当前窗口内容区宽度
     * @param isPlaying 标志音频是否正在播放，为布尔值
     */
    switchDiscStyle(width, isPlaying) {
        if (width < 992) {
            $('#disc-group').css('top', '100px');
            this.needle_rotation_max = 20;
        } else if (width < 1200) {
            $('#disc-group').css('top', '30px');
            this.needle_rotation_max = -12;
        } else {
            $('#disc-group').css('top', '10px');
            this.needle_rotation_max = -20;
        }
        if (isPlaying) {
            $('#disc-needle').css('transform', `translate(-15.15%, -9.09%) scale(0.25) rotateZ(${this.needle_rotation_max}deg)`);
        }
    }

    /**
     * 根据传入的播放状态值改变UI的状态，包括“唱片”的转动状态和底部“播放按钮”
     * 在唱片停止转动的状态下显示一个播放按钮，并为它绑定一个事件
     * @param playing 将要设定的播放状态，应为布尔值，true表示播放
     */
    setPlayingStatus(playing) {
        // 检查参数类型
        BPlaylist.checkBoolean(playing, 'setPlayingStatus', this);
        // 设置唱片样式
        if (playing) {
            $('#disc-needle').css('transform', `translate(-15.15%, -9.09%) scale(0.25) rotateZ(${this.needle_rotation_max}deg)`);
            $('#disc-play').hide(0);
            // 不止一种触发方式，one()不适用
            $('#disc-light').click('click', () => {
                $('#control-toggle').click();
            });
            $('#control-toggle').removeClass().addClass('icomoon-pause');
            $('[id^="disc-"]').removeClass('animation-paused');
        } else {
            $('#disc-needle').css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
            $('#disc-play').show(0);
            $('#disc-light').off();
            $('#control-toggle').removeClass().addClass('icomoon-play2 control-toggle-animated');
            $('[id^="disc-"]').addClass('animation-paused');
        }
    }

    setCountVisibility(shown) {
        // 检查参数类型
        BPlaylist.checkBoolean(shown, 'setCountVisibility', this);
        $('#count-week').css('line-height', `${shown ? 1.2 : 1.5}rem`);
        $('#count-switch').toggleClass('count-off count-on');
    }

    toggleDescription(isCollected) {
        // 检查参数类型
        BPlaylist.checkBoolean(isCollected, 'toggleDescription', this);
        // 存入折叠状态，方便窗口尺寸变化时快速获取折叠状态
        this.isDescriptionCollected = isCollected;
        // 复用代码，根据窗口内容区宽度调整歌曲描述段落的长度
        this.switchDescriptionText(window.innerWidth);
    }

    setVolume(volume) {
        this.setVolumeIndicator(volume);
        let type;
        if (volume > 0.8) {
            type = 'high';
        } else if (volume > 0.3) {
            type = 'medium';
        } else if (volume > 0) {
            type = 'low';
        } else {
            type = 'mute';
        }
        this.setVolumeIcon(type);
    }

    /**
     * 根据传入的音量值，改变音量指示器的位置，并为音量值部分设置样式
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeIndicator(volume) {
        // 检查参数类型
        BPlaylist.checkVolume(volume, 'setVolumeIndicator', this);
        // 计算值
        const value = `${volume * 100}%`;
        // 改变样式
        $('#volume-indicator').css('left', value);
        $('#volume-value').css('width', value);
    }

    /**
     * 根据传入的音量图标类型值，改变音量图标。
     * @param type 将要设置的音量图标类型值，可选{'mute', ‘low’, 'medium', 'high'}
     */
    setVolumeIcon(type) {
        // 检查参数类型并映射样式
        const value = this.checkVolumeIcon(type, 'setVolumeIcon');
        // 改变样式
        $('#control-volume').removeClass().addClass(value);
    }

    setCirculation(mode) {
        this.setCirculationIcon(mode);
    }

    /**
     * 根据传入的循环模式图标类型值，改变循环模式图标。
     * @param mode 将要设置的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationIcon(mode) {
        // 检查参数类型并映射样式
        const value = this.checkCirculationIcon(mode, 'setCirculationIcon');
        // 改变样式
        $('#control-mode').removeClass().addClass(value);
    }

    showPlaylist(playlistCount) {
        $('#control-list').attr('data-hidden', 'false');
        $('#progress-playlist').css('top', '-3.5rem');
        $('#progress-box').css('opacity', '0');
        $('#playlist-box').css('opacity', '1');
        // 计算所需高度
        const value = `${1.25 + (playlistCount || 1) * 2.25}rem`;
        // 改变样式
        $('#player-container').css('height', value);
    }

    hidePlaylist() {
        $('#control-list').attr('data-hidden', 'true');
        $('#progress-playlist').css('top', '0');
        $('#progress-box').css('opacity', '1');
        $('#playlist-box').css('opacity', '0');
        $('#player-container').css('height', '3.5rem');
    }

    /**
     * 根据传入的播放进度百分比，改变播放进度指示器的位置，并为已播放的部分设置样式
     * @param played 将要设置的播放进度百分比
     * @param loaded 将要设置的缓冲进度百分比
     * @param duration 当前歌曲的持续时间，单位为秒
     */
    setTime(played, loaded, duration) {
        // 检查参数
        BPlaylist.checkPercentage(played, 'setTime', this);
        BPlaylist.checkPercentage(loaded, 'setTime', this);
        this.setLoaded(loaded);
        this.setCurrent(duration * played / 100);
        if (!this.isSeekingTime) {
            this.setPlayed(played);
            this.setDuration(duration);
        }
    }

    setLoaded(loaded) {
        $('#progress-loaded').css('width', `${loaded}%`);
    }

    setCurrent(current) {
        $('#current-time').text(BRender.convertTimeFromNumber(current));
    }

    setPlayed(played) {
        $('#progress-indicator').css('left', `${played}%`);
        $('#progress-played').css('width', `${played}%`);
    }

    setDuration(duration) {
        $('#total-time').text(BRender.convertTimeFromNumber(duration));
    }

    startSeekingTime() {
        this.isSeekingTime = true;
    }

    seekingTime(timeInfo) {
        this.showDeltaTime(timeInfo[0], timeInfo[1], timeInfo[2]);
    }


    /**
     * 打开popup，显示“目标时间/总时长　相差时间”，播放进度条右侧显示相差时间
     * @param targetTime 目标时间，单位为秒
     * @param totalTime 总时长，单位为秒
     * @param deltaTime 与进入寻找状态时指示器位置的距离差对应的时间，单位为秒，负值表示快退
     */
    showDeltaTime(targetTime, totalTime, deltaTime) {
        const targetTimeText = BRender.convertTimeFromNumber(targetTime);
        const totalTimeText = BRender.convertTimeFromNumber(totalTime);
        this.setPlayed(targetTime / totalTime * 100);
        $('#total-time').text(targetTimeText).css('color', deltaTime >= 0 ? '#ed2525' : '#4de14d');
        this.popup_time.open(
            `<p class="popup-text">
            <span class="icomoon-notification icon-message"></span>
            ${targetTimeText}/${totalTimeText}　${deltaTime > 0 ? `+` : ``}${~~deltaTime}s
            </p>`, 'html'
        );
    }

    endSeekingTime(duration) {
        this.isSeekingTime = false;
        this.hideDeltaTime(duration);
    }

    /**
     * 关闭popup，播放进度条右侧恢复为总时长
     * @param duration 总时长，应大于0，单位为秒
     */
    hideDeltaTime(duration) {
        $('#total-time').text(BRender.convertTimeFromNumber(duration)).css('color', 'inherit');
        this.popup_time.close();
        window.getSelection().removeAllRanges();
    }

    startSeekingVolume() {

    }

    seekingVolume(target) {
        this.setVolume(target);
    }

    endSeekingVolume() {
        window.getSelection().removeAllRanges();
    }

    addToFavorite() {

    }

    downloadCurrentSong(url) {
        window.open(url);
        this.popup_message.open(
            '<p class="popup-text"><span class="icomoon-notification icon-message"></span>开始下载开始下载>_<</p>',
            'html'
        );
    }

    clipboardSuccess(e) {
        this.popup_message.open(
            '<p class="popup-text"><span class="icomoon-notification icon-message"></span>本页URL已复制到剪贴板>_<</p>',
            'html'
        );
        e.clearSelection();
    }

    clipboardError(e) {
        this.popup_message.open(
            '<p class="popup-text"><span class="icomoon-cancel-circle icon-message"></span>访问剪贴板失败>_<<br />请使用Ctrl + C手动复制</p>',
            'html'
        );
        throw new ReferenceError(`访问剪贴板时发生错误\nAction: ${e.action}\nTrigger: ${e.trigger}`);
    }

    makeUpSongPage(musicInfo) {
        const artists = BRender.makeUpArtists(musicInfo['simpleArtistInfos']);
        const tags = this.makeUpTags(musicInfo['tags']);
        const imageUrl = `https://file.anisong.online${musicInfo['imageUrl']}`;
        const description = musicInfo['description'];
        $('#state').text(this.stateDict[musicInfo['state']]);
        $('#count-week').text(musicInfo['weekPlayCount']);
        $('#count-month').text(musicInfo['monthPlayCount']);
        $('#title').text(musicInfo['title']).attr('title', `Uploader: ${musicInfo['uploadUserName']}`);
        $('#description-text').text(description ? description : '暂无简介');
        $('#artist').html(artists);
        $('#album').text(musicInfo['simpleAlbumInfo']['title']);
        $('#work').text(musicInfo['simpleWorkInfo']['title']);
        $('#tag').empty().append(tags);
        $('#disc-cover').attr('src', imageUrl);
        $('#bg-image').attr('src', imageUrl);
        // 显示底部播放器
        $('#player-container').css('bottom', '0');
        // 启用工具提示
        $('[data-toggle="tooltip"]').tooltip();
    }

    static makeUpArtists(simpleArtistInfos) {
        return simpleArtistInfos.map((simpleArtistInfo) => `<a href="#">${simpleArtistInfo['name']}</a>`).join('/');
    }

    makeUpTags(tags) {
        let tagDomList = [];
        tags.forEach((tag) => {
            const $div = $('<div class="float-left"></div>');
            const $span = $(`<span class="oi oi-tag icon-tag" data-toggle="tooltip" data-html="true" \
                data-id="${tag['id']}" title="<em>Loading</em>"></span>`);
            const $a = `<a href="#" class="link tag mr-3">${tag['name']}</a>`;
            $.ajax({
                data: {id: tag['id']},
                method: 'GET',
                url: 'http://api.anisong.online/tag',
                success: (data) => {
                    $('#tag').trigger('update', [data[0], $span])
                }
            });
            $div.append($span, $a);
            tagDomList.push($div);
        });
        return tagDomList
    }

    playNow() {

    }

    addToPlaylist(item, active) {
        if (item.num) {
            $('#playlist-not-exist').hide();
            const $li = $(
                `<li class="container-fluid playlist-item py-1 ${item.num === 1 ? 'active' : ''}" data-num="${item.num}" data-id="${item.id}">
                <div class="row unselectable">
                <div class="col-4 col-md-5 col-lg-7 playlist-title"><a href="javascript:bListener.changePage(${item.id})">${item.title}</a></div>
                <div class="col-4 col-md-4 col-lg-3 playlist-artist">${item.artist}</div>
                <div class="col-4 col-md-3 col-lg-2 playlist-duration">${BRender.convertTimeFromNumber(item.duration)}</div>
                </div>
                </li>`
            );
            $(`#playlist`).trigger('addChild', $li);
            $('#playlist').append($li);
            this.scrollToFocus(item.num, active);
        } else {
            this.highlightItem(item, active);
        }
    }

    scrollToFocus(item, active) {
        const rem = ~~($('html').css('font-size').split('px')[0]);
        const scrollTop = $(`#playlist`).scrollTop() / rem;
        const itemScrolled = ~~(scrollTop / 2.25 + 0.4);
        const listHeight = $('#playlist').height() / 2.25 / rem;
        // Range: [itemScrolled + 1, itemScrolled + listHeight]
        if (item < itemScrolled + 1) {
            const deltaItemCount = (itemScrolled + 1) - item;
            $(`#playlist`).animate({scrollTop: scrollTop - 2.25 * rem * deltaItemCount}, 500);
        } else if (item > itemScrolled + listHeight) {
            const deltaItemCount = item - (itemScrolled + 1);
            $(`#playlist`).animate({scrollTop: scrollTop + 2.25 * rem * deltaItemCount}, 500);
        }
        if (active) {
            this.chooseSong(item);
        }
    }

    updateTag(data, $span) {
        const description = data['description'];
        const imageUrl = data['imageUrl'];
        $span.attr('data-original-title',
            `${imageUrl ? `<img src='https://file.anisong.online${imageUrl}' width=100 style='padding:0;'/></br>` : ``}\
            ${description ? description : `<em>No description</em>`}`);
    }

    setBoard(mode) {
        const $info_board = $('#info-board');
        const $lyric_board = $('#lyric-board');
        const $lyric_board_chs = $('#lyric-board-chs');
        const $control_board = $('#control-board');
        switch (mode) {
            case 1:
                $info_board.css({'-webkit-transform': 'rotateY(0deg)', 'transform': 'rotateY(0deg)'});
                $lyric_board.css({'-webkit-transform': 'rotateY(90deg)', 'transform': 'rotateY(90deg)'});
                $lyric_board_chs.css({'-webkit-transform': 'rotateY(180deg)', 'transform': 'rotateY(180deg)'});
                // Change icon
                $control_board.removeClass().addClass('icomoon-linkedin');
                break;
            case 2:
                $info_board.css({'-webkit-transform': 'rotateY(-90deg)', 'transform': 'rotateY(-90deg)'});
                $lyric_board.css({'-webkit-transform': 'rotateY(0deg)', 'transform': 'rotateY(0deg)'});
                $lyric_board_chs.css({'-webkit-transform': 'rotateY(90deg)', 'transform': 'rotateY(90deg)'});
                $control_board.removeClass().addClass('icomoon-lanyrd');
                break;
            case 3:
                $info_board.css({'-webkit-transform': 'rotateY(-180deg)', 'transform': 'rotateY(-180deg)'});
                $lyric_board.css({'-webkit-transform': 'rotateY(-90deg)', 'transform': 'rotateY(-90deg)'});
                $lyric_board_chs.css({'-webkit-transform': 'rotateY(0deg)', 'transform': 'rotateY(0deg)'});
                $control_board.removeClass().addClass('icomoon-trello');
                break;
        }
    }

    highlightItem(num, active) {
        this.scrollToFocus(num, active);
        $(`#playlist`).find(`li:nth-child(${num + 1})`).fadeOut(700).fadeIn(300);
    }

    chooseSong(num) {
        $(`#playlist`).find('li').removeClass('active');
        $(`#playlist`).find(`li:nth-child(${num + 1})`).addClass('active');
    }

    /**
     * 检查传入的音量图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的音量图标类型值，可选{'mute', 'low', 'medium', 'high'}
     * @param functionName 调用此函数时所在函数的名字
     * @return {*} 音量图标类型对应的值
     */
    checkVolumeIcon(type, functionName) {
        const value = this.volumeIconDict[type];
        if (value === undefined) {
            throw new RangeError(`BRender::${functionName}(): 指定的音量图标类型未定义`);
        } else {
            return value;
        }
    }

    /**
     * 检查传入的循环模式图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     * @param functionName 调用此函数时所在函数的名字
     * @return {*} 循环模式图标类型对应的值
     */
    checkCirculationIcon(type, functionName) {
        const value = this.circulationIconDict[type];
        if (value === undefined) {
            throw new RangeError(`BRender::${functionName}(): 指定的循环模式图标类型未定义`);
        } else {
            return value;
        }
    }

    /**
     * 将以秒为单位的时间转换为`MM:SS`格式的时间文本
     * @param time 将要转换的时间
     * @return {string}
     */
    static convertTimeFromNumber(time) {
        this.checkNumber(time, 'convertTimeFromNumber', this);
        time = ~~time;
        return `${this.addZeroPrefix((~~(time / 60)).toString())}:${this.addZeroPrefix((time % 60).toString())}`;
    }

    /**
     * 为长度不足2位的时间值文本添加`0`前缀
     * @param time
     * @return {*}
     */
    static addZeroPrefix(time) {
        this.checkString(time, 'addZeroPrefix', this);
        return time.length < 2 ? `0${time}` : time;
    }

    /**
     * 检查传入的参数是否为数字值，若不是则抛出错误
     * @param num 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkNumber(num, functionName, thisRef) {
        thisRef = thisRef || this;
        if (typeof num !== "number") {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为数字值`);
        }
    }

    /**
     * 检查传入的参数是否为字符串，若不是则抛出错误
     * @param str 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkString(str, functionName, thisRef) {
        thisRef = thisRef || this;
        if (typeof str !== "string") {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为字符串`);
        }
    }
}
