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
        this.circulationMode = 3;
        this.circulationModeDict = {1: 'random', 2: 'single', 3: 'circulation', 4: 'order'};
        this.currentSong = 1;
        this.currentPageSongInfo = null;
        this.timeBeforeSeeking = 0;
        this.volumeBeforeSeeking = 0;
        this.host = 'http://api.anisong.online';
    }

    initPlayer() {
        return this.restorePlaylistFromLocalStorage();
    }

    /**
     * 响应窗口尺寸变化
     * @return {boolean} 返回音频是否正在播放
     */
    resize() {
        return !this.audio.paused;
    }

    choosePreviousSong() {
        this.currentSong = this.currentSong === 1 ? this.playlist.length : (this.currentSong - 1);
        return this.currentSong;
    }

    chooseNextSong() {
        this.currentSong = this.currentSong === this.playlist.length ? 1 : (this.currentSong + 1);
        return this.currentSong;
    }

    /**
     * 播放当前歌曲
     * @return {boolean} 返回固定值true
     */
    playContinue() {
        if (this.audio.src.indexOf('file') !== -1) {
            this.audio.play();
            return true
        } else {
            return false;
        }
    }

    /**
     * 暂停当前歌曲
     * @return {boolean} 返回固定值false
     */
    pauseCurrentSong() {
        this.audio.pause();
        return false;
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
        this.audio.muted = true;
        return 0;
    }

    /**
     * 读取静音前的音量值并从静音状态恢复
     */
    restoreVolumeFromMute() {
        this.audio.muted = false;
        return this.audio.volume;
    }

    setCirculation(mode) {
        this.circulationMode = mode;
        return this.circulationModeDict[this.circulationMode];
    }

    showPlaylist() {
        return this.playlist.length;
    }

    hidePlaylist() {

    }

    updateTime() {
        return this.audio.currentTime / this.audio.duration * 100;
    }

    getDuration() {
        return this.audio.duration;
    }

    getLoaded() {
        return this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration * 100
    }

    startSeekingTime() {
        this.timeBeforeSeeking = this.audio.currentTime;
    }

    seekingTime(delta) {
        const totalTime = this.audio.duration;
        const deltaTime = delta * totalTime;
        let targetTime = this.timeBeforeSeeking + deltaTime;
        targetTime = targetTime < 0 ? 0 : (targetTime > totalTime ? totalTime : targetTime);
        return [targetTime, totalTime, targetTime - this.timeBeforeSeeking];
    }

    endSeekingTime(delta) {
        // 设置播放时间，最好是整数
        this.audio.currentTime = ~~(this.seekingTime(delta)[0]);
        return this.audio.duration;
    }

    startSeekingVolume() {
        this.volumeBeforeSeeking = this.audio.volume;
    }

    seekingVolume(delta) {
        const deltaVolume = delta * 1;
        let targetVolume = this.volumeBeforeSeeking + deltaVolume;
        targetVolume = targetVolume < 0 ? 0 : (targetVolume > 1 ? 1 : targetVolume);
        this.audio.volume = targetVolume;
        return targetVolume;
    }

    endSeekingVolume() {

    }

    setTime(percentage) {
        // 检查参数
        BPlaylist.checkPercentage(percentage, 'setTime', this);
        const targetTime = ~~(percentage * this.audio.duration / 100);
        this.audio.currentTime = targetTime;
        return targetTime / this.audio.duration * 100;
    }

    setVolume(percentage) {
        // 检查参数
        BPlaylist.checkPercentage(percentage, 'setVolume', this);
        const volume = percentage / 100;
        this.audio.volume = volume;
        return volume;
    }

    playNow() {

    }

    initAudioSrc() {
        if (this.playlist.length) {
            this.audio.src = this.host + this.playlist[0].src;
        }
    }

    addToPlaylist(item) {
        const result = this.findCurrentSongInPlaylist(item);
        if (result) {
            return result;
        } else {
            const newItem = item ? item : {
                num: this.playlist.length + 1,
                id: ~~this.currentPageSongInfo['id'],
                src: `${this.currentPageSongInfo['fileUrl']}`,
                title: this.currentPageSongInfo['title'],
                artist: BRender.makeUpArtists(this.currentPageSongInfo['simpleArtistInfos']),
                duration: ~~this.currentPageSongInfo['duration'] / 1000
            };
            this.playlist.push(newItem);
            if (!item) {
                this.storePlaylistIntoLocalStorge();
            }
            return newItem;
        }
    }

    findCurrentSongInPlaylist(item) {
        let songInfo = item ? item : this.currentPageSongInfo;
        let i;
        for (i = 1; i <= this.playlist.length; i++) {
            if (this.playlist[i - 1].id === ~~songInfo['id']) {
                return i;
            }
        }
        return 0;
    }

    addToFavorite() {

    }

    downloadCurrentSong() {
        return this.audio.src;
    }

    clipboardSuccess(e) {
        return e;
    }

    clipboardError(e) {
        return e;
    }


    setSongInfo(musicInfo) {
        this.currentPageSongInfo = musicInfo;
        const playingNum = this.currentSong;
        const pageNum = this.findCurrentSongInPlaylist();
        return [musicInfo, playingNum, pageNum];
    }

    updateTag() {

    }

    setBoard(mode) {
        return mode;
    }

    highlightItem(num) {
        this.checkListNumber(num, 'highlightItem');
        return num;
    }

    chooseSong(num) {
        if (num) {
            this.checkListNumber(num, 'chooseSong');
            const numOfPageSongInPlaylist = this.findCurrentSongInPlaylist();
            this.audio.src = this.host + this.playlist[num - 1].src;
            this.currentSong = num;
            return [num, numOfPageSongInPlaylist];
        } else {
            return [this.currentSong, this.currentSong];
        }
    }

    switchSong() {
        let nextSong;
        switch (this.circulationMode) {
            case 1:
                this.currentSong = ~~(Math.random() * this.playlist.length) + 1;
                nextSong = this.currentSong;
                break;
            case 2:
                nextSong = this.currentSong;
                break;
            case 3:
                this.currentSong = this.currentSong === this.playlist.length ? 1 : (this.currentSong + 1);
                nextSong = this.currentSong;
                break;
            case 4:
                if (this.currentSong === this.playlist.length) {
                    nextSong = 0;
                } else {
                    this.currentSong = this.currentSong + 1;
                    nextSong = this.currentSong;
                }
                break;
        }
        return nextSong;
    }

    /**
     * 从浏览器的Local Storage读取播放列表并附加到当前播放列表
     */
    restorePlaylistFromLocalStorage() {
        // 从浏览器的Local Storage中，以'playlist'为键，读取播放列表字符串
        const playlistItemListString = localStorage.getItem('playlist') || "[]";
        console.info(`BPlaylist::loadPlaylistFromLocalStorage(): Playlist is loaded successfully: ${playlistItemListString}`);
        // 作为JSON字符串解析为Array并返回
        return JSON.parse(playlistItemListString);
    }

    /**
     * 将当前播放列表存储（更新）至浏览器的Local Storage，一般在操作播放列表后执行一次
     */
    storePlaylistIntoLocalStorge() {
        // 将当前播放列表转换为JSON字符串，以'playlist'为键，存入Local Storage
        localStorage.setItem('playlist', JSON.stringify(this.playlist));
        console.info(`BPlaylist::storePlaylistIntoLocalStorge(): Playlist is updated successfully: ${JSON.stringify(this.playlist)}`);
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
     * @param percentage 将要检查的百分数
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkPercentage(percentage, functionName, thisRef) {
        this.checkRange(percentage, 0, 100, '百分数', functionName, thisRef);
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
