/**
 * Created by Yunzhe on 2018/2/27.
 */

'use strict';

const bPlayer = new BPlayer();
const bListener = new BListener();

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
 * Event Parser
 * 事件解析器：
 * 1. 为页面元素添加侦听器，包括window和document
 * 2. 提供侦听器，对事件进行预处理，包括筛选事件和组装参数
 * 3. 调用相应的事件处理器，处理事件
 */
class BListener {
    constructor() {
        // 为页面元素添加侦听器
        $(window).resize((e)=>{this.onResize(e)});
        // 添加“上一曲”按钮的侦听器
        $control_previous.click((e) => {this.onClickControlPrevious(e)});
        // 添加“下一曲”按钮的侦听器
        $control_next.click((e) => {this.onClickControlNext(e)});
        // 添加“播放/暂停”按钮的侦听器
        $control_toggle.click((e) => {this.onClickControlToggle(e)});
        // 添加“播放”按钮的侦听器
        $btn_play.click((e) => {this.onClickBtnPlay(e)});
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
        bPlayer.onToggleCurrentSong();
    }

    onClickBtnPlay() {
        bPlayer.onPlayThisSong();
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

    onPlayThisSong() {

    }

    /**
     * 根据传入的歌曲信息，向播放列表的末尾添加一首歌曲，暂时不考虑歌曲重复的问题
     * @param musicInfo 将要传入的歌曲信息
     */
    addSongToPlaylist(musicInfo) {
        this.bPlaylist.addSong(musicInfo);
    }

    /**
     * 根据传入的编号值，将播放列表中指定位置的歌曲删除
     * @param num 将要从播放列表中删除的歌曲的编号值
     */
    removeSongFromPlaylist(num) {
        this.bPlaylist.removeSong(num);
    }

    /**
     * 从浏览器的Local Storage读取播放列表并附加到当前播放列表
     */
    loadPlaylist() {
        this.bPlaylist.restorePlaylistFromLocalStorage();
    }

    /**
     * 将当前播放列表存储（更新）至浏览器的Local Storage，一般在操作播放列表后执行一次
     */
    savePlaylist() {
        this.bPlaylist.storePlaylistIntoLocalStorge();
    }

    /**
     * 播放当前歌曲
     */
    playCurrentSong() {
        this.bPlaylist.playCurrentSong();
    }

    /**
     * 根据传入的播放状态，设置播放器到相应的播放状态
     * @param playing 将要设置的播放状态，应为布尔值或undefined
     * 若playing值为undefined，将在'playing'和'paused'之间来回切换
     */
    onToggleCurrentSong(playing) {
        this.bPlaylist.toggleCurrentSong(playing);
    }

    /**
     * 开始寻找时间，保存当前时间
     */
    startSeekingTime() {
        // 保存当前时间用于计算时间差
        this.bPlaylist.saveCurrentTime();
    }

    /**
     * 根据输入的百分数，调整UI的播放进度（显示popup），但不会作用在音频上
     * @param percentage 将要设置的播放进度，范围为[0, 100]，可以为小数
     */
    seekingTimeAt(percentage) {
        this.bPlaylist.seekCurrentSongTo(percentage, true);
    }

    /**
     * 根据输入的百分数，更新音频音量
     * @param percentage 将要设置的音频音量，范围为[0, 100]，可以为小数
     */
    seekingVolumeAt(percentage) {
        this.setVolumeTo(percentage / 100);
    }

    /**
     * 结束寻找时间，消去popup，恢复时间显示
     */
    finishSeekingTime() {
        // 退出寻找状态
        this.bPlaylist.finishSeeking();
    }

    /**
     * 根据传入的时间值，跳转至当前歌曲的指定位置，保持原来的播放状态
     * @param second 将要跳转至的时间值，单位为秒，可以是小数
     */
    seekCurrentSongTo(second) {
        this.bPlaylist.seekCurrentSongTo(second, false);
    }

    /**
     * 暂停当前播放的歌曲
     */
    pauseCurrentSong() {
        this.bPlaylist.pauseCurrentSong();
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
            this.bPlaylist.playNextSong();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 设置音量值
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeTo(volume) {
        this.bPlaylist.setVolumeTo(volume);
    }

    /**
     * 进入静音状态
     */
    saveVolumeAndMute() {
        this.bPlaylist.storeVolumeAndMute();
    }

    /**
     * 从静音状态恢复
     */
    loadVolumeFromMute() {
        this.bPlaylist.restoreVolumeFromMute();
    }

    /**
     * 轮换循环模式
     */
    toggleCirculation() {
        this.bPlaylist.toggleCirculation();
    }

    /**
     * 根据传入的播放列表可见性，设置播放列表到相应的显示状态
     * @param visible 将要设置的播放列表可见性状态值，应为布尔值或undefined
     * 若visible值为undefined，将在'visible'和'hidden'之间来回切换
     */
    togglePlaylistVisibility(visible) {
        this.bPlaylist.togglePlaylistVisibility(visible);
    }

    // /**
    //  * 检查传入的寻找目标名称值，若不是预设值之一则抛出错误
    //  * @param target 将要检查的寻找目标名称值，可选{'time', 'volume'}
    //  * @param functionName 调用此函数时所在函数的名字
    //  */
    // static checkSeekingTarget(target, functionName) {
    //     if (this.seekingTargetList.indexOf(target) === -1) {
    //         throw new RangeError(`BPlayer::${functionName}(): 指定的寻找目标名称未定义`);
    //     }
    // }
}

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
        this.volumeBeforeMute = 0;
        this.currentSong = 1;
        this.savedTime = 0;
    }

    resize() {

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
            this.checkBoolean(visible, 'togglePlaylistVisibility', this);
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

    isPlaying() {
        return !this.audio.paused;
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
     * 保存当前时间
     */
    saveCurrentTime() {
        this.savedTime = this.audio.currentTime;
    }

    /**
     * 根据传入的播放进度，跳转至当前歌曲的对应时间，保持原来的播放状态，若在寻找状态则显示popup
     * @param percentage 将要跳转至的播放进度，范围为[0, 100]，可以为小数
     * @param isSeeking 是否处于“查找状态”，若是则不操作音频，否则设置音频播放进度
     */
    seekCurrentSongTo(percentage, isSeeking) {
        BPlaylist.checkPercentage(percentage, 'seekCurrentSongTo', this);
        BPlaylist.checkBoolean(isSeeking, 'seekCurrentSongTo', this);
        if (!isSeeking) {
            // 非查找状态下，直接跳转
            this.audio.currentTime = percentage / 100 * this.audio.duration;
        } else {
            // UI: 显示popup
            bRender.showDeltaTime(); // TODO: Parameters
        }
        // 更新UI
        bRender.setTimeIndicator(percentage);
    }

    /**
     * 退出寻找状态，消去popup
     */
    finishSeeking() {
        // 更新UI
        bRender.hideDeltaTime(this.audio.duration);
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
 * View
 * 渲染部分：
 * 1. 提供渲染接口，用于更新UI
 */
class BRender {
    /**
     * 初始化HTML节点，添加一系列侦听器
     * @param e
     */
    constructor(e) {
        // 音量图标与css样式的映射
        this.volumeIconDict = {
            'mute': 'icomoon-volume-mute2',
            'low': 'icomoon-volume-low',
            'medium': 'icomoon-volume-medium',
            'high': 'icomoon-volume-high'
        }
        // 循环模式图标与css样式的映射
        this.circulationIconDict = {
            'random': 'icomoon-shuffle',
            'single': 'icomoon-infinite',
            'circulation': 'icomoon-loop',
            'order': 'icomoon-arrow-right2'
        }
        // 获得歌曲描述，这段文字应该在服务器传来的页面中存在
        this.description = $description.text();
        // 记录歌曲描述段落是否被收缩
        this.isDescriptionCollapsed = false;
        // 用于收缩和展开歌曲描述段落的节点
        this.collapseToggleDom = null;
        // “唱片”的旋转速度
        this.DISC_ROTATION_SPEED = 0.2;
        // “唱片”的旋转角度
        this.discRotation = 0;
        // 弹窗对象，在寻找时间时显示，不自动消失
        this.popup_time = null;
        // 弹窗对象，在显示普通信息时显示，0.5s后自动消失
        this.popup_message = null;
        // 剪贴板对象，绑定到“分享”标签
        this.clipboard = null;
        // 创建页面元素
        this.createDom();
        // 旋转“唱片”
        requestAnimationFrame(() => this.rotateDisc());
    }

    resize() {
        const width = window.innerWidth;
        this.switchButtonText(width);
        this.switchDescriptionText(width);
        this.switchDiscStyle(width);
    }

    /**
     * 创建页面元素
     */
    createDom() {
        // 创建用于收缩和展开歌曲描述段落的节点
        this.collapseToggleDom = $('<a id="collapse-toggle" href="javascript:void(0);" class="collect link">收起</a>');
        // 创建弹窗对象
        this.createPopup();
        // 创建剪贴板对象
        this.createClipboard();
    }

    /**
     * 创建弹窗对象
     */
    createPopup() {
        // 弹窗对象，在寻找时间时显示，不自动消失
        this.popup_time = new $.Popup({
            speed: 500,
            closeContent: '',
            preloaderContent: '',
            containerClass: "popup-message"
        });
        // 弹窗对象，在显示普通信息时显示，0.5s后自动消失
        this.popup_message = new $.Popup({
            speed: 500,
            closeContent: '',
            preloaderContent: '',
            containerClass: "popup-message",
            afterOpen: function () {
                // 原本使用的是let
                const popup = this;
                setTimeout(function () {
                    popup.close();
                }, 500);
            }
        });
    }

    /**
     * 创建剪贴板对象
     */
    createClipboard() {
        // 剪贴板对象，绑定到“分享”标签
        this.clipboard = new Clipboard('#btn-share', {
            text: function () {
                return location['href'];
            }
        });
    }

    /**
     * 为页面元素添加侦听器
     */
    addEventListener() {
        // 向this.collapseToggleDom添加侦听器
        this.collapseToggleDom.click(() => {
            this.isDescriptionCollapsed = !this.isDescriptionCollapsed;
            // 复用代码，根据窗口内容区宽度调整歌曲描述段落的长度
            this.switchDescriptionText(window.innerWidth);
        })
        // 添加“添加至播放列表”按钮的侦听器
        $btn_add.click(() => {
            // TODO
        });
        // 添加“收藏到歌单”按钮的侦听器
        $btn_favorite.click(() => {
            // TODO
        });
        // 添加“下载”按钮的侦听器
        $btn_download.click(() => {
            // TODO
        });
        // 添加剪贴板对象的侦听器
        this.clipboard.on('success', (e) => {
            popup_message.open(
                `<p class="popup-text">
                <span class="icomoon-notification icon-message"></span>
                本页URL已复制到剪贴板>_<
                </p>`
                , 'html'
            );
            e.clearSelection();
        });
        this.clipboard.on('error', (e) => {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
            popup_message.open(
                `<p class="popup-text">
                <span class="icomoon-cancel-circle icon-message"></span>
                访问剪贴板失败>_<
                <br />
                请使用Ctrl + C手动复制
                </p>`
                , 'html'
            );
        });
    }

    /**
     * 根据窗口内容区宽度调整按钮区的显示文字
     * @param width 当前窗口内容区宽度
     */
    switchButtonText(width) {
        if (width < 992) {
            $text_favorite.text('');
            $text_download.text('');
            $text_share.text('');
        } else {
            $text_favorite.text('收藏');
            $text_download.text('下载');
            $text_share.text('分享');
        }
    }

    /**
     * 根据窗口内容区宽度调整歌曲描述段落的长度，截取过后的描述段落末尾使用`...`来代替剩余文字
     * @param width 当前窗口内容区宽度
     */
    switchDescriptionText(width) {
        let maxLength;
        if (width < 992) {
            maxLength = 30;
        } else if (width < 1200) {
            maxLength = 50;
        } else {
            maxLength = 70;
        }
        // 截取描述段落
        const descriptionToShow = this.description.substring(0, maxLength);
        // 显示完整/精简描述
        $description.html(`${this.isDescriptionCollapsed ? `${descriptionToShow}...` : this.description}　`);
        // 追加this.collapseToggleDom节点
        $description.append(this.collapseToggleDom);
    }

    /**
     * 根据当前窗口内容区宽度调整“唱片”形态，包括唱片的上边距和磁头的最大旋转角，当音频正在播放时，更新磁头的旋转角度
     * @param width 当前窗口内容区宽度
     */
    switchDiscStyle(width) {
        if (width < 992) {
            $disc_group.css('top', '100px');
            this.needle_rotation_max = 20;
        } else if (width < 1200) {
            $disc_group.css('top', '30px');
            this.needle_rotation_max = -12;
        } else {
            $disc_group.css('top', '10px');
            this.needle_rotation_max = -20;
        }
        if (bPlaylist.isPlaying()) {
            $disc_needle.css(`transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(${this.needle_rotation_max}deg)`);
        }
    }

    /**
     * 旋转“唱片”时调用的动画方法
     */
    rotateDisc() {
        if (this.constructor.name !== 'BRender') {
            throw new Error('BRender::rotateDisc(): this绑定错误');
        }
        // 仅当音频正在播放时旋转
        if (bPlaylist.isPlaying()) {
            // 加上旋转增量
            this.discRotation = this.discRotation % 360 + this.DISC_ROTATION_SPEED;
            // 设置样式
            $disc_cover.css('transform', `scale(0.63) rotate(${this.discRotation}deg)`);
            $disc_mask.css('transform', `rotate(${this.discRotation}deg)`);
        }
        // 请求下一动画帧，函数内的this可能指向不正确
        requestAnimationFrame(() => this.rotateDisc());
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
            bPlayer.onToggleCurrentSong();
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
    setTimeIndicator(percentage, deltaTime) {
        $prograss_indicator.css('left', `${percentage}%`);
        $prograss_played.css('width', `${percentage}%`);
    }


    /**
     * 打开popup，显示“目标时间/总时长　相差时间”，播放进度条右侧显示相差时间
     * @param deltaTime 与进入寻找状态时指示器位置的距离差对应的时间，单位为秒，负值表示快退
     * @param targetTime 目标时间，单位为秒
     * @param totalTime 总时长，单位为秒
     */
    showDeltaTime(deltaTime, targetTime, totalTime) {
        const targetTimeText = convertTimeFromNumber(targetTime);
        const totalTimeText = convertTimeFromNumber(totalTime);
        $total_time.text(targetTimeText).css('color', deltaTime >= 0 ? '#ed2525' : '#4de14d');
        popup_time.open(
            `<p class="popup-text">
            <span class="icomoon-notification icon-message"></span>
            ${targetTimeText}/${totalTimeText}　${deltaTime > 0 ? `+` : ``}${deltaTime}s
            </p>`, 'html'
        );
    }

    /**
     * 关闭popup，播放进度条右侧恢复为总时长
     * @param duration 总时长，应大于0，单位为秒
     */
    hideDeltaTime(duration) {
        $total_time.text(this.convertTimeFromNumber(duration));
        $total_time.css('color', 'inherit');
        popup_time.close();
        window.getSelection().removeAllRanges();
    }

    /**
     * 根据传入的缓冲进度百分数，设置已缓冲部分的样式
     * @param percentage 将要设置的缓冲进度百分数
     */
    setLoadIndicator(percentage) {
        // 检查参数
        BPlaylist.checkPercentage(percentage, 'setLoadIndicator', this);
        // 设置样式
        $prograss_loaded.css('width', `${percentage}%`);
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
    // TODO: 去除getPlaylistCount()
    setPlaylistVisibilityTo(visible) {
        // 检查参数
        BPlaylist.checkBoolean(visible, 'setPlaylistVisibilityTo', this);
        // 设置样式
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
            const value = `${1.25 + (playlistCount || 1) * 2.25}rem`;
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
        // 检查参数

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
        // TODO
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
     * @param functionName 调用此函数时所在函数的名字
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
     * @param functionName 调用此函数时所在函数的名字
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

    /**
     * 将以秒为单位的时间转换为`MM:SS`格式的时间文本
     * @param time 将要转换的时间
     * @return {string}
     */
    static convertTimeFromNumber(time) {
        this.checkNumber(time, 'convertTimeFromNumber', this);
        time = ~~time;
        return `${this.addZeroPrefix((~~(time / 60)).toString())}:${this.addZeroPrefix((time % 60).toString())}`;
    }

    /**
     * 为长度不足2位的时间值文本添加`0`前缀
     * @param time
     * @return {*}
     */
    static addZeroPrefix(time) {
        this.checkString(time, 'addZeroPrefix', this);
        return time.length < 2 ? `0${time}` : time;
    }

    /**
     * 检查传入的参数是否为数字值，若不是则抛出错误
     * @param num 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkNumber(num, functionName, thisRef) {
        thisRef = thisRef || this;
        if (typeof num !== "number") {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为数字值`);
        }
    }

    /**
     * 检查传入的参数是否为字符串，若不是则抛出错误
     * @param str 将要检查的参数值
     * @param functionName 调用此函数时所在函数的名字
     * @param thisRef 调用此函数时的上下文，用于获取类名
     */
    static checkString(str, functionName, thisRef) {
        thisRef = thisRef || this;
        if (typeof str !== "string") {
            throw new TypeError(`${thisRef.constructor.name}::${functionName}(): 参数类型不正确，应为字符串`);
        }
    }
}
