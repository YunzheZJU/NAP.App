/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

/**
 * Model
 * 数据模型：
 * 1. 包含播放列表、音量和循环模式等状态
 * 2. 响应状态查询
 * 3. 执行功能
 */
class BPlaylist {
    constructor() {
        this.playlist = [];
        this.audio = $('#bplayer')[0];
        this.isPlaylistVisible = false;
        this.circulationMode = 3;
        this.circulationModeDict = {1: 'random', 2: 'single', 3: 'circulation', 4: 'order'};
        this.volumeBeforeMute = null;
        this.currentSong = 1;
        this.savedTime = 0;
    }

    /**
     * 响应窗口尺寸变化
     * @return {boolean} 返回音频是否正在播放
     */
    resize() {
        return !this.audio.paused;
    }

    /**
     * 选择播放列表中的上一首歌并播放，若当前歌曲为第一首则选择播放列表中的最后一首播放
     */
    playPreviousSong() {
        this.pauseCurrentSong();
        const currentSong = (this.currentSong - 1) || this.playlist.length;
        this.setSong(currentSong);
        // TODO: 想办法在完成加载之后播放这首歌
    }

    /**
     * 选择播放列表中的下一首歌并播放，若当前歌曲为最后一首则选择播放列表中的第一首播放
     */
    playNextSong() {
        this.pauseCurrentSong();
        let currentSong = this.currentSong + 1;
        currentSong = (currentSong > this.playlist.length) ? 0 : currentSong;
        this.setSong(currentSong);
        // TODO: 想办法在完成加载之后播放这首歌
    }

    /**
     * 播放当前歌曲
     * @return {boolean} 返回固定值true
     */
    playCurrentSong() {
        this.audio.play();
        return true
    }

    /**
     * 暂停当前歌曲
     * @return {boolean} 返回固定值false
     */
    pauseCurrentSong() {
        this.audio.pause();
        return false;
    }


    /**
     * 根据传入的播放列表编号，将指定的歌曲加载入播放器，并不意味着会自动播放
     * @param num 将要播放的歌曲在播放列表中的编号
     * @return {*} 歌曲信息
     */
    setSong(num) {
        // 检查参数类型
        this.checkListNumber(num, 'setSong');
        // 获取歌曲信息
        const musicInfo = this.playlist[num - 1].musicInfo;
        // 设置歌曲源
        this.audio.src = musicInfo.url;
        // 记录当前播放的歌曲在播放列表中的编号
        this.currentSong = num;
        // TODO: 想办法在完成加载之后播放这首歌
        // TODO: 是否需要清理？
        return musicInfo
    }

    showCount() {
        return true;
    }

    hideCount() {
        return false;
    }

    collectDescription() {
        return true;
    }

    spreadDescription() {
        return false;
    }

    /**
     * 进入静音状态并存储静音前的音量值
     */
    storeVolumeAndMute() {
        if (this.volumeBeforeMute === null) {
            this.volumeBeforeMute = this.audio.volume;
            return 0;
        } else {
            throw new TypeError('BPlaylist::restoreVolumeFromMute(): 未退出静音状态时无法进入静音状态');
        }
    }

    /**
     * 读取静音前的音量值并从静音状态恢复
     */
    restoreVolumeFromMute() {
        if (this.volumeBeforeMute) {
            this.audio.volume = this.volumeBeforeMute;
            this.volumeBeforeMute = null;
            return this.audio.volume;
        } else {
            throw new TypeError('BPlaylist::restoreVolumeFromMute(): 未进入静音状态时无法从静音状态恢复');
        }
    }

    /**
     * 检查传入的参数值是否为整数且未越界，若非整数或越界则抛出错误
     * @param num 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     */
    checkListNumber(num, functionName) {
        if (num >= 1 && num <= this.playlist.length) {
            if (!(Number.isInteger(num))) {
                throw new TypeError(`BPlayer::${functionName}(): 参数类型应为整数`);
            }
        } else {
            throw new RangeError(`BPlayer::${functionName}(): 参数越界`);
        }
    }

    /**
     * 检查传入的百分数是否在设定的范围内，若不在范围内则抛出错误
     * @param num 将要检查的数值
     * @param lower 范围下界（包含）
     * @param upper 范围上界（包含）
     * @param description 对将要检查的数值的描述
     * @param functionName 抛出错误时使用的函数名
     * @param thisRef 上下文，用于获取抛出错误时使用的类名
     */
    static checkRange(num, lower, upper, description, functionName, thisRef) {
        thisRef = thisRef || this;
        if (!(num >= lower && num <= upper)) {
            throw new RangeError(`${thisRef.constructor.name}::${functionName}(): ${description}超出范围，应在[${lower}, ${upper}]内`);
        }
    }

    /**
     * 检查传入的音量值是否在范围内，若不在范围内则抛出错误
     * @param volume 将要检查的音量值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkVolume(volume, functionName, thisRef) {
        this.checkRange(volume, 0, 1, '音量值', functionName, thisRef);
    }

    /**
     * 检查传入的百分数是否在范围内，若不在范围内则抛出错误
     * @param volume 将要检查的百分数
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkPercentage(volume, functionName, thisRef) {
        this.checkRange(volume, 0, 100, '百分数', functionName, thisRef);
    }

    /**
     * 检查传入的参数是否为MusicInfo类型，若不是则抛出错误
     * @param musicInfo 将要检查类型的变量
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkMusicInfo(musicInfo, functionName, thisRef) {
        thisRef = thisRef || this;
        if (!(musicInfo instanceof MusicInfo)) {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为MusicInfo类的对象`);
        }
    }

    /**
     * 检查传入的参数是否为布尔值，若不是则抛出错误
     * @param bool 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkBoolean(bool, functionName, thisRef) {
        thisRef = thisRef || this;
        if (typeof bool !== "boolean") {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为布尔值`);
        }
    }
}
