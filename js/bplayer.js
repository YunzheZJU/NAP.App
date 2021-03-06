/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

/**
 * Event Handler
 * 事件处理器：
 * 1. 提供接口给事件解析器
 * 2. 更新相应的模型、视图或两者
 */
class BPlayer {
    constructor() {
        this.bPlaylist = new BPlaylist();
        this.bRender = new BRender();
    }

    initPlayer() {
        try {
            this.bRender.initPlayer(this.bPlaylist.initPlayer());
        } catch (e) {
            console.error(e);
        }
    }

    setHost(host) {
        this.bPlaylist.host = host;
        this.bRender.host = host;
    }

    onResize() {
        try {
            this.bRender.resize(this.bPlaylist.resize());
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 从播放列表中选择上一曲播放，若已为第一首，选择最后一首播放
     */
    onPlayPreviousSong() {
        this.onSetSong(this.bPlaylist.choosePreviousSong())
    }

    /**
     * 从播放列表中选择下一曲播放，若已为最后一首，选择第一首播放
     */
    onPlayNextSong() {
        this.onSetSong(this.bPlaylist.chooseNextSong())
    }

    onPlayCurrentSong() {
        this.onAddPlaylist();
        this.onPlayContinue();
    }

    onPlayContinue() {
        try {
            this.bRender.setPlayingStatus(this.bPlaylist.playContinue());
        } catch (e) {
            console.error(e);
        }
    }

    onPauseCurrentSong() {
        try {
            this.bRender.setPlayingStatus(this.bPlaylist.pauseCurrentSong());
        } catch (e) {
            console.error(e);
        }
    }

    onShowCount() {
        try {
            this.bRender.setCountVisibility(this.bPlaylist.showCount());
        } catch (e) {
            console.error(e);
        }
    }

    onHideCount() {
        try {
            this.bRender.setCountVisibility(this.bPlaylist.hideCount());
        } catch (e) {
            console.error(e);
        }
    }

    onCollectDescription() {
        try {
            this.bRender.toggleDescription(this.bPlaylist.collectDescription());
        } catch (e) {
            console.error(e);
        }
    }

    onSpreadDescription() {
        try {
            this.bRender.toggleDescription(this.bPlaylist.spreadDescription());
        } catch (e) {
            console.error(e);
        }
    }

    onEnterMute() {
        try {
            this.bRender.setVolume(this.bPlaylist.storeVolumeAndMute());
        } catch (e) {
            console.error(e);
        }
    }

    onLeaveMute() {
        try {
            this.bRender.setVolume(this.bPlaylist.restoreVolumeFromMute());
        } catch (e) {
            console.error(e);
        }
    }

    onSetCirculation(mode) {
        try {
            this.bRender.setCirculation(this.bPlaylist.setCirculation(mode));
        } catch (e) {
            console.error(e);
        }
    }

    onShowPlaylist() {
        try {
            this.bRender.showPlaylist(this.bPlaylist.showPlaylist());
        } catch (e) {
            console.error(e);
        }
    }

    onHidePlaylist() {
        try {
            this.bRender.hidePlaylist(this.bPlaylist.hidePlaylist());
        } catch (e) {
            console.error(e);
        }
    }

    onUpdateTime() {
        try {
            if (this.bPlaylist.getDuration()) {
                this.bRender.setTime(this.bPlaylist.updateTime(), this.bPlaylist.getLoaded(), this.bPlaylist.getDuration());
            }
        } catch (e) {
            console.error(e);
        }
    }

    onStartSeekingTime() {
        try {
            this.bRender.startSeekingTime(this.bPlaylist.startSeekingTime());
        } catch (e) {
            console.error(e);
        }
    }

    onSeekingTime(delta) {
        try {
            this.bRender.seekingTime(this.bPlaylist.seekingTime(delta));
        } catch (e) {
            console.error(e);
        }
    }

    onEndSeekingTime(delta) {
        try {
            this.bRender.endSeekingTime(this.bPlaylist.endSeekingTime(delta));
        } catch (e) {
            console.error(e);
        }
    }

    onStartSeekingVolume() {
        try {
            this.bRender.startSeekingVolume(this.bPlaylist.startSeekingVolume());
        } catch (e) {
            console.error(e);
        }
    }

    onSeekingVolume(delta) {
        try {
            this.bRender.seekingVolume(this.bPlaylist.seekingVolume(delta));
        } catch (e) {
            console.error(e);
        }
    }

    onEndSeekingVolume() {
        try {
            this.bRender.endSeekingVolume(this.bPlaylist.endSeekingVolume());
        } catch (e) {
            console.error(e);
        }
    }

    onSetTime(percentage) {
        try {
            if (this.bPlaylist.getDuration()) {
                this.bRender.setTime(this.bPlaylist.setTime(percentage), this.bPlaylist.getLoaded(), this.bPlaylist.getDuration());
            }
        } catch (e) {
            console.error(e);
        }
    }

    onSetVolume(percentage) {
        try {
            this.bRender.setVolume(this.bPlaylist.setVolume(percentage));
        } catch (e) {
            console.error(e);
        }
    }

    onPlay() {
        this.onAddPlaylist(undefined, true);
        this.onShowPlaylist();
        this.onSetPageSong();
        this.onSetTime(0);
        this.onPlayContinue();
    }

    onSetPageSong() {
        try {
            this.bRender.playNow(this.bPlaylist.playNow());
        } catch (e) {
            console.error(e);
        }

    }

    onPlaylist() {
        this.onAddPlaylist();
        this.onShowPlaylist();
    }

    onAddPlaylistItems(items) {
        items.forEach((item) => {
            this.onAddPlaylist(item);
        });
        this.bPlaylist.initAudioSrc();
    }

    onAddPlaylist(item, active) {
        try {
            this.bRender.addToPlaylist(this.bPlaylist.addToPlaylist(item), active);
        } catch (e) {
            console.error(e);
        }
    }

    onFavorite() {
        try {
            this.bRender.addToFavorite(this.bPlaylist.addToFavorite());
        } catch (e) {
            console.error(e);
        }
    }

    onDownload() {
        try {
            this.bRender.downloadCurrentSong(this.bPlaylist.downloadCurrentSong());
        } catch (e) {
            console.error(e);
        }
    }

    onClipboardSuccess(e) {
        try {
            this.bRender.clipboardSuccess(this.bPlaylist.clipboardSuccess(e));
        } catch (e) {
            console.error(e);
        }
    }

    onClipboardError(e) {
        try {
            this.bRender.clipboardError(this.bPlaylist.clipboardError(e));
        } catch (e) {
            console.error(e);
        }
    }

    onMakeUpSongPage(musicInfo) {
        try {
            this.bRender.makeUpSongPage(this.bPlaylist.setSongInfo(musicInfo), !this.bPlaylist.audio.paused);
        } catch (e) {
            console.error(e);
        }
    }

    onUpdateTag(data, $span) {
        try {
            this.bRender.updateTag(data, $span, this.bPlaylist.updateTag());
        } catch (e) {
            console.error(e);
        }
    }

    onSetBoard(mode) {
        try {
            this.bRender.setBoard(this.bPlaylist.setBoard(mode));
        } catch (e) {
            console.error(e);
        }
    }

    onSetSong(num) {
        this.onChooseSong(num);
        this.onSetTime(0);
        this.onHighlightItem(num);
        this.onPlayContinue();
    }

    onHighlightItem(num) {
        try {
            this.bRender.highlightItem(this.bPlaylist.highlightItem(num));
        } catch (e) {
            console.error(e);
        }
    }

    onChooseSong(num) {
        try {
            this.bRender.chooseSong(this.bPlaylist.chooseSong(num));
        } catch (e) {
            console.error(e);
        }
    }

    onSwitchSong() {
        const nextSong = this.bPlaylist.switchSong();
        this.onPauseCurrentSong();
        this.onChooseSong(nextSong);
        this.onSetTime(0);
        this.onHighlightItem(nextSong);
        if (nextSong) {
            this.onPlayContinue();
        }
    }
}
