/**
 * Created by Yunzhe on 2018/2/27.
 */

'use strict';

const bPlayer = new BPlayer();
const bRender = new BRender();

class BPlaylist {
    constructor() {

    }
}

class BDisc {
    constructor() {

    }
}

class BTime {
    constructor() {

    }
}

class BVolume {
    constructor() {

    }
}

class BCirculation {
    constructor() {

    }
}

/**
 * 只管理一首歌，通过有计划地改变src来达到切歌的效果
 */
class BAudio {
    constructor(parent) {
        this.parent = parent;
        this.src = null;
    }

    pauseSong() {

    }

    play() {

    }

    play(second) {

    }
}

/**
 * 这实质上是一个“播放列表”的管理器，功能是播放不同的歌曲和对应地操作UI
 */
class BPlayer {
    constructor() {
        this.disc = null;
        this.time = null;
        this.volume = null;
        this.audio = null;
        this.circulation = null;
    }

    addSongToPlaylist(musicInfo) {

    }

    removeSongFromPlaylist(num) {

    }

    playCurrentSong() {

    }

    playCurrentSongFrom() {

    }

    pauseCurrentSong() {

    }

    playPreviousSongFromPlaylist() {

    }

    playNextSongFromPlaylist() {

    }

    setVolumeTo(newVolume) {

    }

    saveVolumeAndMute() {

    }

    loadVolumeFromMute() {

    }

    setCirculationTo() {

    }
}

/**
 * 渲染部分，在UI上绑定事件，这些事件会导致播放器状态的改变，并且反过来更新UI
 */
class BRender {
    constructor(e) {

    }

    /**
     * 根据传入的bool值改变UI的播放状态，包括“唱片”的转动状态和底部“播放按钮”
     * 在唱片停止转动的状态下显示一个播放按钮，并为它绑定一个事件
     * @param setToPlay 将要设定的播放状态，可选{'playing', 'paused'}
     */
    setPlayingStateTo(state) {
        // TODO: 使用字典，简洁分类
        if (state === 'playing') {

        } else if (state === 'paused') {

        } else {
            console.log('Unknown input in setPlayingStateTo(): ' + state);
        }
    }

    /**
     * 根据传入的播放进度百分比，改变播放进度指示器的位置，并为已播放的部分设置样式
     * @param percentage 将要设置的播放进度百分比
     */
    setTimeIndicator(percentage) {

    }

    /**
     * 根据传入的缓冲进度百分比，设置已缓冲部分的样式
     * @param percentage 将要设置的缓冲进度百分比
     */
    setLoadIndicator(percentage) {

    }

    /**
     * 根据传入的音量值，改变音量指示器的位置，并为音量值部分设置样式
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeIndicator(volume) {

    }

    /**
     * 根据传入的音量图标类型值，改变音量图标。
     * @param type 将要设置的音量图标类型值，可选{'mute', ‘low’, 'medium', 'high'}
     */
    setVolumeIcon(type) {

    }

    /**
     * 根据传入的循环模式类型值，改变循环模式图标。
     * @param type 将要设置的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationIcon(type) {

    }

    /**
     * 根据传入的播放列表可见性状态值，设置一系列样式，改变播放列表可见性
     * @param state
     */
    setPlaylistVisibilityTo(state) {
        // TODO: 是否可以用auto的高度代替固定的高度值

        return 1
    }

    /**
     * 根据传入的歌曲信息，为播放列表新增一条数据
     * @param musicInfo 将要新增的歌曲信息
     */
    addItemToPlaylist(musicInfo) {

    }

    /**
     * 根据传入的条目编号，在播放列表中删除一条数据
     * @param num 将要删除的条目编号，列表下第1个子元素的编号为1
     */
    removeItemFromPlaylist(num) {

    }
}
