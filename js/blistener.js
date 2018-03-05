/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

/**
 * Event Parser
 * 事件解析器：
 * 1. 为页面元素添加侦听器，包括window和document
 * 2. 提供侦听器，对事件进行预处理，包括筛选事件和组装参数
 * 3. 调用相应的事件处理器，处理事件
 * 4. 只查询、读取和判断页面元素，不更改页面元素，交由下一级事件处理器来更改页面元素
 */
class BListener {
    constructor() {
        this.isSeekingTime = false;
        this.isSeekingVolume = false;
        this.isDescriptionCollected = true;
        this.progressContainerWidth = 0;
        this.volumeContainerWidth = 0;
        this.controlMode = 3;
        this.controlBoard = 1;
        // 具有兼容性的剪贴板
        this.clipboard = new Clipboard('#btn-share', {
            text: function () {
                return location['href'];
            }
        });
        this.initPage();
        this.initPlayer();
    }

    initPage() {
        // 判断页面类型
        switch ($('#page-container').attr('data-type')) {
            case 'song':
                this.ajaxSong();
                break;
            case 'album':
                break;
            case 'artist':
                break;
            default:
                throw new TypeError('Unknown page type.');
        }
    }

    /**
     * 发送ajax请求，在回调函数中触发组装页面的侦听器，组装页面结束后调用初始化其他侦听器的函数
     */
    ajaxSong() {
        const id = ~~($('#page-container').attr('data-id'));
        $.ajax({
            data: {id: id},
            method: 'GET',
            url: 'http://api.anisong.online/song',
            success: (data) => {this.onAjaxSongSuccess(data)},
            error: (e) => {this.onAjaxError(e)}
        })
    }

    initPlayer() {
        this.initPlayerListeners();
        bPlayer.initPlayer();
    }

    initSongPageListenersBeforeMakeUp() {
        // 添加标签区的侦听器
        $('#tag').on('update', (e, data, $span) => {this.onUpdateTag(e, data, $span)});
    }

    initSongPageListeners() {
        // OK添加初始状态下“唱片”的侦听器，播放状态下的“唱片”侦听器将被动态添加和删除
        $('#disc-play').click((e) => {this.onClickDiscPlay(e)});
        // OK添加“播放数/下载数”UI的悬停侦听器
        $('#count').hover((e) => {this.onHoverCount(e)}, (e) => {this.onHoverCount(e)});
        // OK添加收缩和展开歌曲描述段落的按钮的侦听器
        $('#collapse-toggle').click((e) => {this.onClickCollapseToggle(e)});
        // 添加“播放”按钮的侦听器
        $('#btn-play').click((e) => {this.onClickBtnPlay(e)});
        // 添加“列表”按钮的侦听器
        $('#btn-add').click((e) => {this.onClickBtnAdd(e)});
        // 添加“收藏”按钮的侦听器（未完成）
        $('#btn-favorite').click((e) => {this.onClickBtnFavorite(e)});
        // 添加“下载”按钮的侦听器
        $('#btn-download').click((e) => {this.onClickBtnDownload(e)});
        // 添加剪贴板对象“成功”的侦听器
        this.clipboard.on('success', (e) => {this.onSuccessClipboard(e)});
        // 添加剪贴板对象“错误”的侦听器
        this.clipboard.on('error', (e) => {this.onErrorClipboard(e)});
        // 添加“面板”按钮的侦听器
        $('#control-board').click((e) => {this.onClickControlBoard(e)});
    }

    initPlayerListeners() {
        // OK为窗口添加侦听器，并且触发一次
        $(window).resize((e)=>{this.onResize(e)}).resize();
        // 添加“上一曲”按钮的侦听器
        $('#control-previous').click((e) => {this.onClickControlPrevious(e)});
        // 添加“下一曲”按钮的侦听器
        $('#control-next').click((e) => {this.onClickControlNext(e)});
        // OK添加“播放/暂停”按钮的侦听器
        $('#control-toggle').click((e) => {this.onClickControlToggle(e)});
        // OK添加音量图标的侦听器
        $('#control-volume').click((e) => {this.onClickControlVolume(e)});
        // OK添加循环模式图标的侦听器
        $('#control-mode').click((e) => {this.onClickControlMode(e)});
        // OK添加显示/隐藏播放列表按钮的侦听器
        $('#control-list').click((e) => {this.onClickControlList(e)});
        // OK添加音频的“timeupdate”侦听器
        $('#bplayer').on('timeupdate', (e) => {this.onTimeUpdateBplayer(e)});
        // 添加音频的“abort”侦听器
        $('#bplayer').on('abort', (e) => {console.log('abort');console.log(e);});
        // 添加音频的“stalled”侦听器
        $('#bplayer').on('stalled', (e) => {console.log('stalled');console.log(e);});
        // 添加音频的“suspend”侦听器
        $('#bplayer').on('suspend', (e) => {console.log('suspend');});
        // 添加音频的“error”侦听器
        $('#bplayer').on('error', (e) => {console.log('error');console.log($('#bplayer')[0].error);});
        // 添加音频的“ended”侦听器
        $('#bplayer').on('ended', (e) => {this.onEndedBplayer(e)});
        // OK添加播放进度槽的侦听器
        $('#progress-go').click((e) => {this.onClickProgressGo(e)});
        // OK添加音量槽的侦听器
        $('#volume-go').click((e) => {this.onClickVolumeGo(e)});
        // OK添加播放进度指示器的侦听器
        $('#progress-indicator').mousedown((e) => {this.onMouseDownProgressIndicator(e)});
        // OK添加音量指示器的侦听器
        $('#volume-indicator').mousedown((e) => {this.onMouseDownVolumeIndicator(e)});
        // OK添加整个页面上鼠标移动的侦听器
        $(document).mousemove((e) => {this.onMouseMoveDocument(e)});
        // OK添加整个页面上鼠标弹起的侦听器
        $(document).mouseup((e) => {this.onMouseUpDocument(e)});
        // 添加播放列表“添加数据”的侦听器
        $('#playlist').on('addData', (e, data) => {this.onAddDataPlaylist(e, data)});
        // 添加播放列表“添加子项”的侦听器
        $('#playlist').on('addChild', (e, data) => {this.onAddChildPlaylistItems(e, data)});
    }

    changePage(id) {
        $.get('pjax.html', (data) => {
            $('#page-container').empty().attr('data-id', id).append(data);
            this.initPage();
        });
    }

    onResize() {
        this.progressContainerWidth = $('#progress-container').width();
        this.volumeContainerWidth = $('#volume-container').width();
        bPlayer.onResize();
    }

    onClickControlPrevious() {
        bPlayer.onPlayPreviousSong();
    }

    onClickControlNext() {
        bPlayer.onPlayNextSong();
    }

    onClickControlToggle() {
        if ($('.icomoon-play2').length) {
            bPlayer.onPlayContinue();
        } else {
            bPlayer.onPauseCurrentSong();
        }
    }

    onClickDiscPlay() {
        bPlayer.onPlayCurrentSong();
    }

    onHoverCount(e) {
        switch (e.type) {
            case 'mouseenter':
                bPlayer.onShowCount();
                break;
            case 'mouseleave':
                bPlayer.onHideCount();
                break;
        }
    }

    onClickCollapseToggle() {
        if (this.isDescriptionCollected) {
            bPlayer.onSpreadDescription();
        } else {
            bPlayer.onCollectDescription();
        }
        this.isDescriptionCollected = !this.isDescriptionCollected;
    }

    onClickControlVolume(e) {
        if ($(e.target).hasClass('icomoon-volume-mute2')) {
            // 处于静音状态
            bPlayer.onLeaveMute();
        } else {
            bPlayer.onEnterMute();
        }
    }

    onClickControlMode() {
        this.controlMode = ++this.controlMode === 5 ? 1 : this.controlMode;
        bPlayer.onSetCirculation(this.controlMode);
    }

    onClickControlList(e) {
        if ($(e.target).attr('data-hidden') === 'true') {
            bPlayer.onShowPlaylist();
        } else {
            bPlayer.onHidePlaylist();
        }
    }

    onTimeUpdateBplayer() {
        bPlayer.onUpdateTime();
    }

    onMouseDownProgressIndicator(e) {
        this.isSeekingTime = true;
        this.mouseDownX = e.clientX;
        bPlayer.onStartSeekingTime();
    }

    onMouseDownVolumeIndicator(e) {
        this.isSeekingVolume = true;
        this.mouseDownX = e.clientX;
        bPlayer.onStartSeekingVolume();
    }

    onMouseMoveDocument(e) {
        const deltaX = e.clientX - this.mouseDownX;
        if (this.isSeekingTime) {
            const containerWidth = this.progressContainerWidth;
            const delta = deltaX / containerWidth;
            bPlayer.onSeekingTime(delta);
        } else if (this.isSeekingVolume) {
            const containerWidth = this.volumeContainerWidth;
            const delta = deltaX / containerWidth;
            bPlayer.onSeekingVolume(delta);
        }
    }

    onMouseUpDocument(e) {
        const deltaX = e.clientX - this.mouseDownX;
        if (this.isSeekingTime) {
            this.isSeekingTime = false;
            const containerWidth = this.progressContainerWidth;
            const delta = deltaX / containerWidth;
            bPlayer.onEndSeekingTime(delta);
        } else if (this.isSeekingVolume) {
            this.isSeekingVolume = false;
            bPlayer.onEndSeekingVolume();
        }
    }

    onClickProgressGo(e) {
        // 用e.target会出现异常
        const percentage = e.offsetX / this.progressContainerWidth * 100;
        bPlayer.onSetTime(percentage);
    }

    onClickVolumeGo(e) {
        const percentage = e.offsetX / this.volumeContainerWidth * 100;
        bPlayer.onSetVolume(percentage);
    }

    onClickBtnPlay() {
        bPlayer.onPlay();
    }

    onClickBtnAdd() {
        bPlayer.onPlaylist();
    }

    onClickBtnFavorite() {
        alert('Add this song to my playlist.');
        bPlayer.onFavorite();
    }

    onClickBtnDownload() {
        bPlayer.onDownload();
    }

    onSuccessClipboard(e) {
        bPlayer.onClipboardSuccess(e);
    }

    onErrorClipboard(e) {
        bPlayer.onClipboardError(e);
    }

    onAjaxSongSuccess(data) {
        this.initSongPageListenersBeforeMakeUp();
        // 用歌曲信息初始化播放器组装页面元素
        // 若播放器中歌曲源为空，将歌曲url填入播放器
        bPlayer.onMakeUpSongPage(data[0]);
        // 为页面元素添加侦听器
        this.initSongPageListeners();
    }

    onAjaxError(e) {
        console.log(`Ajax error: ${e}`);
    }

    onUpdateTag(e, data, $span) {
        bPlayer.onUpdateTag(data, $span);
    }

    onClickControlBoard() {
        this.controlBoard = ++this.controlBoard === 4 ? 1 : this.controlBoard;
        bPlayer.onSetBoard(this.controlBoard);
    }

    onAddDataPlaylist(e, data) {
        bPlayer.onAddPlaylistItems(data.list);
    }

    onAddChildPlaylistItems(e, data) {
        $(data).dblclick((e) => {this.onDblClickPlaylistItem(e)});
    }

    onDblClickPlaylistItem(e) {
        bPlayer.onSetSong(~~($(e.currentTarget).attr('data-num')));
    }

    onEndedBplayer() {
        bPlayer.onSwitchSong();
    }
}
