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
            this.bRender.setPlayingStatus(this.bPlaylist.playCurrentSong());
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
            this.bRender.setTime(this.bPlaylist.updateTime(), this.bPlaylist.getLoaded(), this.bPlaylist.getDuration());
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
            this.bRender.setTime(this.bPlaylist.setTime(percentage), this.bPlaylist.getLoaded(), this.bPlaylist.getDuration());
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

    addToFavorite() {
        try {
            this.bRender.addToFavorite(this.bPlaylist.addToFavorite());
        } catch (e) {
            console.error(e);
        }
    }

    downloadCurrentSong(url) {
        try {
            this.bRender.downloadCurrentSong(this.bPlaylist.downloadCurrentSong(url));
        } catch (e) {
            console.error(e);
        }
    }
}
