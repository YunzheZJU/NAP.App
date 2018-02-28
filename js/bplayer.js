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
        this.isPlaylistVisible = false;
        this.circulationMode = 3;
        this.circulationModeDict = {1: 'random', 2: 'single', 3: 'circulation', 4: 'order'};
        this.volumeBeforeMute = 0;
        this.currentSong = 1;
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

    /**
     * 根据传入的条目信息列表，为播放列表新增数据
     * @param playlistItemList 将要新增的条目信息列表
     */
    addItemsToPlaylist(playlistItemList) {
        this.playlist.push(playlistItemList);
        // 更新UI
        bRender.addItemsToPlaylist(playlistItemList);
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
        // 从浏览器的Local Storage中，以'playlist'为键，读取播放列表字符串
        const playlistItemListString = localStorage.getItem('playlist') || "[]";
        console.log(`BPlaylist::loadPlaylistFromLocalStorage(): Playlist is loaded successfully: ${playlistItemListString}`);
        // 作为JSON字符串解析为Array
        let playlistItemList = JSON.parse(playlistItemListString);
        // 批量加到播放列表中
        this.addItemsToPlaylist(playlistItemList);
    }

    /**
     * 将当前播放列表存储（更新）至浏览器的Local Storage，一般在操作播放列表后执行一次
     */
    storePlaylistIntoLocalStorge() {
        // 将当前播放列表转换为JSON字符串，以'playlist'为键，存入Local Storage
        localStorage.setItem('playlist', JSON.stringify(this.playlist));
        console.log(`BPlaylist::storePlaylistIntoLocalStorge(): Playlist is updated successfully: ${JSON.stringify(this.playlist)}`);
    }

    /**
     * 根据传入的可见性状态值，改变播放列表的可见性
     * @param visible 布尔值，true表示设置为可见
     */
    togglePlaylistVisibility(visible) {
        if (visible === undefined) {
            if (this.isPlaylistVisible) {
                this.isPlaylistVisible = false;
            } else {
                this.isPlaylistVisible = true;
            }
        } else {
            this.checkBoolean(visible, 'togglePlaylistVisible', this);
            if (visible) {
                this.isPlaylistVisible = true;
            } else if (!visible) {
                this.isPlaylistVisible = false;
            }
        }
        // 更新UI
        bRender.setPlaylistVisibilityTo(this.isPlaylistVisible);
    }

    /**
     * 获取播放列表的歌曲数
     * @return {number} 播放列表的歌曲数
     */
    getPlaylistCount() {
        return this.playlist.length;
    }

    /**
     * 播放当前歌曲
     */
    playCurrentSong() {
        this.audio.play();
        // 更新UI
        bRender.setPlayingstatusTo('playing');
    }

    /**
     * 暂停当前播放的歌曲
     */
    pauseCurrentSong() {
        this.audio.pause();
        // 更新UI
        bRender.setPlayingstatusTo('paused');
    }

    /**
     * 根据传入的播放状态，设置播放器到相应的播放状态
     * @param playing 将要设置的播放状态，应为布尔值或undefined
     * 若playing值为undefined，将在'playing'和'paused'之间来回切换
     */
    toggleCurrentSong(playing) {
        if (playing === undefined) {
            if (this.audio.paused) {
                this.playCurrentSong();
            } else {
                this.pauseCurrentSong();
            }
        } else {
            BPlaylist.checkBoolean(playing, 'toggleCurrentSong', this);
            if (playing) {
                this.playCurrentSong();
            } else if (!playing) {
                this.pauseCurrentSong();
            }
        }
    }

    /**
     * 根据传入的播放进度，跳转至当前歌曲的对应时间，保持原来的播放状态
     * @param percentage 将要跳转至的播放进度，范围为[0, 100]，可以为小数
     */
    seekCurrentSongTo(percentage) {
        BPlaylist.checkPercentage(percentage, 'seekCurrentSongTo', this);
        this.audio.currentTime = percentage / 100 * this.audio.duration;
        // 更新UI
        bRender.setTimeIndicator(percentage);
    }

    seekingCurrentSongAt(percentage) {
        BPlaylist.checkPercentage(percentage, 'seekingCurrentSongAt', this);
        // TODO: 更新UI

    }

    finishSeekingCurrentSongAt(percentage) {
        BPlaylist.checkPercentage(percentage, 'finishSeekingCurrentSongAt', this);
        // TODO: 更新UI

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
     * 根据传入的播放列表编号，将指定的歌曲加载入播放器，并不意味着会自动播放
     * @param num 将要播放的歌曲在播放列表中的编号
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
        this.updateVolumeUI(volume);
    }

    /**
     * 进入静音状态并存储静音前的音量值
     */
    storeVolumeAndMute() {
        this.volumeBeforeMute = this.audio.volume;
        // 更新UI
        this.updateVolumeUI(0);
    }

    /**
     * 读取静音前的音量值并从静音状态恢复
     */
    restoreVolumeFromMute() {
        this.audio.volume = this.volumeBeforeMute;
        // 更新UI
        this.updateVolumeUI(this.audio.volume);
    }

    /**
     * 轮换循环模式，顺序为{'random', 'single', 'circulation', 'order'}
     */
    toggleCirculation() {
        this.circulationMode = (this.circulationMode + 1) % this.circulationModeDict.length;
        // 更新UI
        bRender.setCirculationIcon(this.circulationModeDict[this.circulationMode]);
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
     * @param upper 范围上界（包含）
     * @param lower 范围下界（包含）
     * @param description 对将要检查的数值的描述
     * @param functionName 抛出错误时使用的函数名
     * @param thisRef 上下文，用于获取抛出错误时使用的类名
     */
    static checkRange(num, upper, lower, description, functionName, thisRef) {
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

    /**
     * 根据传入的音量值，更新音量UI
     * @param volume 将要显示的音量值
     */
    static updateVolumeUI(volume) {
        bRender.setVolumeIndicator(volume);
        let type;
        if (volume > 0.8) {
            type = 'high';
        } else if (volume > 0.3) {
            type = 'medium';
        } else if (volume > 0) {
            type = 'low';
        } else {
            type = 'mute';
        }
        bRender.setVolumeIcon(type);
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
     * @param playing 将要设置的播放状态，应为布尔值或undefined
     * 若playing值为undefined，将在'playing'和'paused'之间来回切换
     */
    toggleCurrentSong(playing) {
        bPlaylist.toggleCurrentSong(playing);
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
        bPlaylist.playPreviousSong();
    }

    /**
     * 从播放列表中选择下一曲播放，若已为最后一首，选择第一首播放
     */
    playNextSong() {
        bPlaylist.playNextSong();
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
        bPlaylist.storeVolumeAndMute();
    }

    /**
     * 从静音状态恢复
     */
    loadVolumeFromMute() {
        bPlaylist.restoreVolumeFromMute();
    }

    /**
     * 轮换循环模式
     */
    toggleCirculation() {
        bPlaylist.toggleCirculation();
    }

    /**
     * 根据传入的播放列表可见性，设置播放列表到相应的显示状态
     * @param visible 将要设置的播放列表可见性状态值，应为布尔值或undefined
     * 若visible值为undefined，将在'visible'和'hidden'之间来回切换
     */
    togglePlaylistVisibility(visible) {
        bPlaylist.togglePlaylistVisibility(visible);
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
        this.volumeIconDict = {
            'mute': 'icomoon-volume-mute2',
            'low': 'icomoon-volume-low',
            'medium': 'icomoon-volume-medium',
            'high': 'icomoon-volume-high'
        }
        this.circulationIconDict = {
            'random': 'icomoon-shuffle',
            'single': 'icomoon-infinite',
            'circulation': 'icomoon-loop',
            'order': 'icomoon-arrow-right2'
        }
        // TODO: 添加侦听器
    }

    /**
     * 根据传入的播放状态值改变UI的状态，包括“唱片”的转动状态和底部“播放按钮”
     * 在唱片停止转动的状态下显示一个播放按钮，并为它绑定一个事件
     * @param playing 将要设定的播放状态，应为布尔值，true表示播放
     */
    setPlayingstatusTo(playing) {
        // 检查参数类型
        BPlaylist.checkBoolean(playing, 'setPlayingstatusTo', this);

        function toggleCurrentSong() {
            bPlayer.toggleCurrentSong();
        }

        // 设置唱片样式
        if (playing) {
            $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(' + needle_rotation_max + ')');
            $disc_play.css({'opacity': '0', 'cursor': 'default'});
            $disc_light.one('click', toggleCurrentSong);
            // 没办法才这么做
            $disc_play.one('click', toggleCurrentSong);
        } else {
            $disc_needle.css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
            $disc_play.css({'opacity': '1', 'cursor': 'pointer'});
            $disc_play.one('click', toggleCurrentSong);
        }
        // 一键切换底部按钮样式，可能会产生问题，先用着看看
        $control_toggle.toggleClass('icomoon-pause icomoon-play2 control-toggle-animated')
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
        // 检查参数类型
        BPlaylist.checkVolume(volume, 'setVolumeIndicator', this);
        // 计算值
        const value = `${volume * 100}%`
        // 改变样式
        $volume_indicator.css('left', value);
        $volume_value.css('width', value);
    }

    /**
     * 根据传入的音量图标类型值，改变音量图标。
     * @param type 将要设置的音量图标类型值，可选{'mute', ‘low’, 'medium', 'high'}
     */
    setVolumeIcon(type) {
        // 检查参数类型并映射样式
        const value = this.checkVolumeIcon(type, 'setVolumeIcon');
        this.volumeIconDict[type];
        // 改变样式
        $control_volume.removeClass();
        $control_volume.addClass(value);
    }

    /**
     * 根据传入的循环模式图标类型值，改变循环模式图标。
     * @param mode 将要设置的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     */
    setCirculationIcon(mode) {
        // 检查参数类型并映射样式
        const value = this.checkCirculationIcon(mode, 'setCirculationIcon');
        // 改变样式
        $control_mode.removeClass();
        $control_mode.addClass(value);
    }

    /**
     * 根据传入的播放列表可见性状态值，设置一系列样式，改变播放列表可见性
     * @param visible 将要设置的播放列表可见性状态值，应为布尔值
     */
    setPlaylistVisibilityTo(visible) {
        BPlaylist.checkBoolean(visible, 'setPlaylistVisibilityTo', this);
        if (visible) {
            $progress_playlist.css('top', '0');
            $progress_box.css('opacity', '1');
            $playlist_box.css('opacity', '0');
            $player_container.css('height', '3.5rem');
        } else {
            $progress_playlist.css('top', '-3.5rem');
            $progress_box.css('opacity', '0');
            $playlist_box.css('opacity', '1');
            // 获取播放列表中的歌曲数
            const playlistCount = bPlaylist.getPlaylistCount();
            // 计算所需高度
            let value = `${1.25 + (playlistCount || 1) * 2.25}rem`;
            // 改变样式
            $player_container.css('height', value);
        }
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
     * 根据传入的歌曲信息，相应设置页面内容，这个方法应仅在切换页面时被调用，切换歌曲不应该造成页面改变
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

    /**
     * 检查传入的音量图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的音量图标类型值，可选{'mute', 'low', 'medium', 'high'}
     * @return {*} 音量图标类型对应的值
     */
    checkVolumeIcon(type, functionName) {
        const value = this.volumeIconDict[type]
        if (value === undefined) {
            throw new RangeError(`BRender::${functionName}(): 指定的音量图标类型未定义`);
        } else {
            return value;
        }
    }

    /**
     * 检查传入的循环模式图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的循环模式图标类型值，可选{'random', 'single', 'circulation', 'order'}
     * @return {*} 循环模式图标类型对应的值
     */
    checkCirculationIcon(mode, functionName) {
        const value = this.circulationIconDict[mode]
        if (value === undefined) {
            throw new RangeError(`BRender::${functionName}(): 指定的循环模式图标类型未定义`);
        } else {
            return value;
        }
    }

    /**
     * 为歌手列表文本添加超链接
     * TODO: 超链接中应包含有效链接
     * @param artistsList 歌手列表文本
     * @return {string} 带有超链接的歌手列表文本
     */
    static addLinkToArtists(artistsList) {
        return artistsList.split('/').map((artist) => '<a href="#">' + artist + '</a>').join('/');
    }
}
