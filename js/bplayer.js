/**
 * Created by Yunzhe on 2018/2/27.
 */

'use strict';

const bPlaylist = new BPlaylist();
const bPlayer = new BPlayer();
const bRender = new BRender();

class MusicInfo {
    constructor(id, title, author, album, url, pic, lrc) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.album = album;
        this.url = url;
        this.pic = pic;
        this.lrc = lrc;
    }
}

class PlaylistItem {
    constructor(num, info) {
        this.num = num;
        this.info = null;
        if (info instanceof MusicInfo) {
            this.info = info;
        } else {
            throw new TypeError('PlaylistItem::constructor(): 参数不正确，info应为MusicInfo类型');
        }
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
}

/**
 * Model
 * 数据模型：
 * 1. 包含播放列表、音量和循环模式等状态
 * 2. 响应状态查询
 * 3. 执行功能
 * 4. 通知View改变
 */
class BPlaylist {
    constructor() {
        this.playlist = [];
        this.audio = $('#bplayer')[0];
    }

    /**
     * 根据传入的歌曲信息，向播放列表的末尾添加一首歌曲，暂时不考虑歌曲重复的问题
     * TODO: 考虑歌曲重复的问题
     * @param musicInfo 将要传入的歌曲信息
     */
    addSong(musicInfo) {
        // 验证musicInfo类型
        if (musicInfo instanceof MusicInfo) {
            const num = this.playlist.length + 1;
            const newPlaylistItem = new PlaylistItem(num, musicInfo)
            // 包含UI更新
            this.addItemsToPlaylist(newPlaylistItem);
        } else {
            throw new TypeError('BPlaylist::addSong(): 参数不正确，musicInfo应为MusicInfo类型');
        }
    }

    addItemsToPlaylist(playlistItem) {
        this.playlist.push(playlistItem);
        // 更新UI
        bRender.addItemsToPlaylist(playlistItem);
    }

    /**
     * 根据传入的编号值，将播放列表中指定位置的歌曲删除
     * @param num 将要从播放列表中删除的歌曲的编号值
     */
    removeSong(num) {
        if (num >= 1 && num <= this.playlist.length) {
            if (Number.isInteger(num)) {
                this.playlist.splice(num - 1, 1);
                // 更新UI
                bRender.removeItemFromPlaylist(num);
            } else {
                throw new TypeError('BPlayer::removeSong(): 参数类型应为整数');
            }
        } else {
            throw new RangeError('BPlayer::removeSong(): 参数越界')
        }
    }

    /**
     * 从浏览器的Local Storage读取播放列表并附加到当前播放列表
     */
    restorePlaylistFromLocalStorage() {
        const playlistItemsString = localStorage.getItem('list');
        let playlistItems = playlistItemsString ? JSON.parse(playlistItemsString) : [];
        console.log(`BPlaylist::loadPlaylistFromLocalStorage(): Playlist is loaded successfully: ${JSON.stringify(playlistItems)}`);
        this.addItemsToPlaylist(playlistItems);
    }

    /**
     * 将当前播放列表存储（更新）至浏览器的Local Storage，一般在操作播放列表后执行一次
     */
    storePlaylistIntoLocalStorge() {
        localStorage.setItem('list', JSON.stringify(this.playlist));
        console.log(`BPlaylist::storePlaylistIntoLocalStorge(): Playlist is updated successfully: ${JSON.stringify(this.playlist)}`);
    }

    /**
     * 播放当前歌曲
     */
    playCurrentSong() {
        this.audio.play();
    }

    /**
     * 根据传入的时间值，跳转至当前歌曲的指定位置，保持原来的播放状态
     * @param second 将要跳转至的时间值，单位为秒，可以是小数
     */
    seekCurrentSongTo(second) {
        this.audio.currentTime = second;
    }

    /**
     * 暂停当前播放的歌曲
     */
    pauseCurrentSong() {
        this.audio.pause();
    }
}

// TODO: 善用try...catch...finally而不是错误码

/**
 * Controller
 * “播放列表”和视图的控制器：
 * 1. 将用户请求转换为模型的改变
 * 2. 选择响应的视图
 */
class BPlayer {
    constructor() {
    }

    /**
     * 根据传入的歌曲信息，向播放列表的末尾添加一首歌曲，暂时不考虑歌曲重复的问题
     * @param musicInfo 将要传入的歌曲信息
     */
    addSongToPlaylist(musicInfo) {
        bPlaylist.addSong(musicInfo);
    }

    /**
     * 根据传入的编号值，将播放列表中指定位置的歌曲删除
     * @param num 将要从播放列表中删除的歌曲的编号值
     */
    removeSongFromPlaylist(num) {
        bPlaylist.removeSong(num);
    }

    /**
     * 从浏览器的Local Storage读取播放列表并附加到当前播放列表
     */
    loadPlaylist() {
        bPlaylist.restorePlaylistFromLocalStorage();
    }

    /**
     * 将当前播放列表存储（更新）至浏览器的Local Storage，一般在操作播放列表后执行一次
     */
    savePlaylist() {
        bPlaylist.storePlaylistIntoLocalStorge();
    }

    /**
     * 播放当前歌曲
     */
    playCurrentSong() {
        bPlaylist.playCurrentSong();
    }

    /**
     * 根据传入的时间值，跳转至当前歌曲的指定位置，保持原来的播放状态
     * @param second 将要跳转至的时间值，单位为秒，可以是小数
     */
    seekCurrentSongTo(second) {
        bPlaylist.seekCurrentSongTo(second);
    }

    /**
     * 暂停当前播放的歌曲
     */
    pauseCurrentSong() {
        bPlaylist.pauseCurrentSong();
    }

    /**
     * 从播放列表中选择上一曲播放，若已为第一首，选择最后一首播放
     */
    playPreviousSong() {

    }

    /**
     * 从播放列表中选择下一曲播放，若已为最后一首，选择第一首播放
     */
    playNextSong() {

    }

    /**
     * 设置音量值
     * @param newVolume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeTo(newVolume) {

    }

    /**
     * 进入静音状态
     */
    saveVolumeAndMute() {

    }

    /**
     * 从静音状态恢复
     */
    loadVolumeFromMute() {

    }

    /**
     * 设置循环模式
     * @param mode 将要设置的循环模式类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationTo(mode) {

    }
}

/**
 * View
 * 渲染部分，在UI上绑定事件，这些事件会导致播放器状态的改变，并且反过来更新UI
 */
class BRender {
    /**
     * 初始化HTML节点，添加一系列侦听器
     * @param e
     */
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
     * @param mode 将要设置的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationIcon(mode) {

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
     * 根据传入的条目信息列表，为播放列表新增数据
     * @param playlistItemList 将要新增的条目信息列表
     */
    addItemsToPlaylist(playlistItemList) {
        playlistItemList.forEach(function (element) {
            this.addItemToPlaylist(element);
        }, this);
    }

    /**
     * 根据传入的条目信息，为播放列表新增数据，并移除“播放列表没有歌曲”占位项
     * @param playlistItem 将要新增的条目信息
     */
    addItemToPlaylist(playlistItem) {
        // 移除“播放列表没有歌曲”占位项
        $playlist_not_exist.remove();
        // 构造条目html
        const html =
            `<li class="container-fluid playlist-item py-1" data-num="${playlistItem.num}" data-id="${playlistItem.id}">
            <div class="row unselectable">
            <div class="col-4 col-md-5 col-lg-7 playlist-title"><a href="#">${playlistItem.name}</a></div>
            <div class="col-4 col-md-4 col-lg-3 playlist-artist">${BRender.addLinkToArtists(playlistItem.artist)}</div>
            <div class="col-4 col-md-3 col-lg-2 playlist-duration">${playlistItem.duration}</div>
            </div>
            </li>`;
        $playlist_list.append(() => html);
    }

    static addLinkToArtists(artistsList) {
        return artistsList.split('/').map((artist) => '<a href="#">' + artist + '</a>').join('/');
    }

    /**
     * 根据传入的条目编号，在播放列表中删除一条数据
     * @param num 将要删除的条目编号，列表下第1个子元素的编号为1
     */
    removeItemFromPlaylist(num) {

    }
}
