/**
 * Created by Yunzhe on 2018/2/27.
 */

'use strict';

const bPlaylist = new BPlaylist();
const bPlayer = new BPlayer();
const bRender = new BRender();

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
        this.checkMusicInfo(musicInfo, 'addSong', this);
        // 计算新加入歌曲的编号
        const num = this.playlist.length + 1;
        // 创建新条目
        const newPlaylistItem = new PlaylistItem(num, musicInfo)
        // 包含UI更新
        this.addItemsToPlaylist(newPlaylistItem);
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
        // 检查参数
        this.checkListNumber(num, 'removeSong');
        // 删除指定元素
        this.playlist.splice(num - 1, 1);
        // 更新UI
        bRender.removeItemFromPlaylist(num);
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
        // 更新UI
        bRender.setPlayingStateTo('playing');
    }

    /**
     * 根据传入的播放状态，设置播放器到相应的播放状态
     * @param state 将要设置的播放状态，可选值{'playing', 'paused', undefined}
     * 若state值为undefined，将在'playing'和'paused'之间来回切换
     */
    toggleCurrentSong(state) {
        BPlaylist.checkPlayingState(state, 'toggleCurrentSong');
        if (state === 'playing') {
            this.playCurrentSong();
        } else if (state === 'paused') {
            this.pauseCurrentSong();
        } else {
            if (this.audio.paused) {
                this.playCurrentSong();
            } else {
                this.pauseCurrentSong();
            }
        }
    }

    /**
     * 根据传入的时间值，跳转至当前歌曲的指定位置，保持原来的播放状态
     * @param second 将要跳转至的时间值，单位为秒，可以是小数
     */
    seekCurrentSongTo(second) {
        this.audio.currentTime = second;
        // TODO: 更新UI
    }

    /**
     * 暂停当前播放的歌曲
     */
    pauseCurrentSong() {
        this.audio.pause();
        // 更新UI
        bRender.setPlayingStateTo('paused');
    }

    /**
     * 根据传入的播放列表编号，将指定的歌曲加载入播放器
     * @param num 将要播放的歌曲在播放列表中的编号
     */
    setSong(num) {
        // 检查参数类型
        this.checkListNumber(num, 'setSong');
        // 获取歌曲信息
        const musicInfo = this.playlist[num - 1].musicInfo;
        // 设置歌曲源
        this.audio.src = musicInfo.url;
        // TODO: 是否需要清理？
        // 更新UI
        bRender.setSong(musicInfo);
    }

    /**
     * 设置音量值
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeTo(volume) {
        BPlaylist.checkVolume(volume, 'setVolumeTo', this);
        this.audio.volume = volume;
        // 更新UI
        bRender.setVolumeIndicator(volume);
        if (volume > 0.8) {
            bRender.setVolumeIcon('high');
        } else if (volume > 0.3) {
            bRender.setVolumeIcon('medium');
        } else if (volume > 0) {
            bRender.setVolumeIcon('low');
        } else {
            bRender.setVolumeIcon('mute');
        }
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
     * 检查传入的音量值是否在范围内，若不在范围内则抛出错误
     * @param volume 将要检查的音量值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkVolume(volume, functionName, thisRef) {
        thisRef = thisRef || this;
        if (!(volume >= 0 && volume <= 1)) {
            throw new RangeError(`${thisRef.constructor.name}::${functionName}(): 音量值超出范围，应在[0, 1]内`);
        }
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
     * 检查传入的播放状态值是否为预设值之一，应为{'playing', 'paused'}之一，若不是则抛出错误
     * @param state 将要检查的播放状态值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkPlayingState(state, functionName, thisRef) {
        thisRef = thisRef || this;
        if (['playing', 'paused'].indexOf(state) === -1) {
            throw new RangeError(`${thisRef.constructor.name}::${functionName}(): 指定的播放状态未定义`);
        }
    }
}

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
     * 根据传入的播放状态，设置播放器到相应的播放状态
     * @param state 将要设置的播放状态，可选值{'playing', 'paused', undefined}
     * 若state值为undefined，将在'playing'和'paused'之间来回切换
     */
    toggleCurrentSong(state) {
        bPlaylist.toggleCurrentSong(state);
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
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeTo(volume) {
        bPlaylist.setVolumeTo(volume);
    }

    /**
     * 进入静音状态
     */
    saveVolumeAndMute() {
        bPlaylist.saveVolumeAndMute();
    }

    /**
     * 从静音状态恢复
     */
    loadVolumeFromMute() {
        bPlaylist.loadVolumeFromMute();
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
     * 根据传入的播放状态值改变UI的状态，包括“唱片”的转动状态和底部“播放按钮”
     * 在唱片停止转动的状态下显示一个播放按钮，并为它绑定一个事件
     * @param state 将要设定的播放状态，可选{'playing', 'paused'}
     */
    setPlayingStateTo(state) {
        BPlaylist.checkPlayingState(state, 'setPlayingStateTo', this);
        // TODO
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
        BPlaylist.checkVolume(volume, 'setVolumeIndicator', this);
        // TODO
    }

    /**
     * 根据传入的音量图标类型值，改变音量图标。
     * @param type 将要设置的音量图标类型值，可选{'mute', ‘low’, 'medium', 'high'}
     */
    setVolumeIcon(type) {
        BRender.checkVolumeIcon(type, 'setVolumeIcon');
        // TODO

    }

    /**
     * 根据传入的循环模式图标类型值，改变循环模式图标。
     * @param mode 将要设置的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationIcon(mode) {
        BRender.checkCirculationIcon(mode, 'setCirculationIcon');
        // TODO

    }

    /**
     * 根据传入的播放列表可见性状态值，设置一系列样式，改变播放列表可见性
     * @param state
     */
    setPlaylistVisibilityTo(state) {
        // TODO: 是否可以用auto的高度代替固定的高度值
        
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

    /**
     * 根据传入的条目编号，在播放列表中删除一条数据
     * @param num 将要删除的条目编号，列表下第1个子元素的编号为1
     */
    removeItemFromPlaylist(num) {

    }

    /**
     * 根据传入的歌曲信息，相应设置页面内容，这个方法仅在切换页面时会被调用，切换歌曲不应该造成页面改变
     * @param musicInfo 将要设置的歌曲信息
     */
    setSong(musicInfo) {
        // TODO: 是否需要清理？
        $disc_cover.attr('src', musicInfo.pic);
        $bg_image.attr('src', musicInfo.pic);
        $title.text(musicInfo.title);
        $album.text(musicInfo.album);
        $artist.html(BRender.addLinkToArtists(musicInfo.artists));
        // TODO: 是否要将播放进度指示器归位？
    }

    static addLinkToArtists(artistsList) {
        return artistsList.split('/').map((artist) => '<a href="#">' + artist + '</a>').join('/');
    }

    /**
     * 检查传入的音量图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的音量图标类型值，可选{'mute', 'low', 'medium', 'high'}
     */
    static checkVolumeIcon(type, functionName) {
        if (['mute', 'low', 'medium', 'high'].indexOf(type) === -1) {
            throw new RangeError(`BRender::${functionName}(): 指定的音量图标类型未定义`);
        }
    }

    /**
     * 检查传入的循环模式图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    static checkCirculationIcon(mode, functionName) {
        if (['mute', 'low', 'medium', 'high'].indexOf(mode) === -1) {
            throw new RangeError(`BRender::${functionName}(): 指定的循环模式图标类型未定义`);
        }
    }
}
