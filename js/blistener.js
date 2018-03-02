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
 */
class BListener {
    constructor() {
        // OK为页面元素添加侦听器，并且触发一次
        $(window).resize((e)=>{this.onResize(e)}).resize();
        // 添加“上一曲”按钮的侦听器
        $('#control-previous').click((e) => {this.onClickControlPrevious(e)});
        // 添加“下一曲”按钮的侦听器
        $('#control-next').click((e) => {this.onClickControlNext(e)});
        // OK添加“播放/暂停”按钮的侦听器
        $('#control-toggle').click((e) => {this.onClickControlToggle(e)});
        // OK添加初始状态下“唱片”的侦听器，播放状态下的“唱片”侦听器将被动态添加和删除
        $('#disc-play').click((e) => {this.onClickDiscPlay(e)});
        // OK添加“播放数/下载数”UI的悬停侦听器
        $('#count').hover((e) => {this.onHoverCount(e)}, (e) => {this.onHoverCount(e)});
        // OK添加收缩和展开歌曲描述段落的按钮的侦听器
        $('#collapse-toggle').click((e) => {this.onClickCollapseToggle(e)});
        // OK添加音量图标的侦听器
        $('#control-volume').click((e) => {this.onClickControlVolume(e)});
    }

    onResize() {
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
            bPlayer.onPlayCurrentSong();
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

    onClickCollapseToggle(e) {
        if ($('#description').attr('data-is-collected') === 'true') {
            bPlayer.onSpreadDescription();
        } else {
            bPlayer.onCollectDescription();
        }
    }

    onClickControlVolume(e) {
        if ($(e.target).hasClass('icomoon-volume-mute2')) {
            // 处于静音状态
            bPlayer.onLeaveMute();
        } else {
            bPlayer.onEnterMute();
        }
    }
}
