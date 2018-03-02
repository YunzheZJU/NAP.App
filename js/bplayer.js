/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

class MusicInfo {
    constructor(id, title, description, artists, album, url, pic, lrc) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.artists = artists;
        this.album = album;
        this.url = url;
        this.pic = pic;
        this.lrc = lrc;
    }
}

class PlaylistItem {
    constructor(num, musicInfo) {
        this.num = num;
        BPlaylist.checkMusicInfo(musicInfo, 'constructor', this);
        this.musicInfo = musicInfo;
    }
}

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
        try {
            this.bRender.playPreviousSong(this.bPlaylist.playPreviousSong());
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 从播放列表中选择下一曲播放，若已为最后一首，选择第一首播放
     */
    onPlayNextSong() {
        try {
            this.bRender.playNextSong(this.bPlaylist.playNextSong());
        } catch (e) {
            console.error(e);
        }
    }

    onPlayCurrentSong() {
        try {
            this.bRender.setPlayingStatusTo(this.bPlaylist.playCurrentSong());
        } catch (e) {
            console.error(e);
        }
    }

    onPauseCurrentSong() {
        try {
            this.bRender.setPlayingStatusTo(this.bPlaylist.pauseCurrentSong());
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
}
