/**
 * Created by Yunzhe on 2018/3/2.
 */

'use strict';

/**
 * View
 * 渲染部分：
 * 1. 提供渲染接口，用于更新UI
 */
class BRender {
    constructor() {
        // 音量图标与css样式的映射
        this.volumeIconDict = {
            'mute': 'icomoon-volume-mute2',
            'low': 'icomoon-volume-low',
            'medium': 'icomoon-volume-medium',
            'high': 'icomoon-volume-high'
        }
        // 获得歌曲描述，这段文字应该在服务器传来的页面中存在
        this.descriptionFull = $('#description-text').text();
        // “唱片”的最大旋转角
        this.needle_rotation_max = 20;
        // 记录歌曲描述段落是否被收缩
        this.isDescriptionCollected = true;
        // 创建页面元素
        this.createDom();
    }

    /**
     * 创建页面元素
     */
    createDom() {

    }

    /**
     * 响应窗口尺寸变化
     * @param isPlaying 标志音频是否正在播放，为布尔值
     */
    resize(isPlaying) {
        // 检查参数
        BPlaylist.checkBoolean(isPlaying, 'resize', this);
        const width = window.innerWidth;
        this.switchButtonText(width);
        this.switchDescriptionText(width);
        this.switchDiscStyle(width, isPlaying);
    }

    /**
     * 根据窗口内容区宽度调整按钮区的显示文字
     * @param width 当前窗口内容区宽度
     */
    switchButtonText(width) {
        if (width < 992) {
            $('#text_favorite').text('');
            $('#text_download').text('');
            $('#text_share').text('');
        } else {
            $('#text_favorite').text('收藏');
            $('#text_download').text('下载');
            $('#text_share').text('分享');
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
        if (this.descriptionFull.length <= maxLength) {
            // 如果描述文字长度小于阈值，不显示“展开”/“收起”按钮和“...”
            $('#collapse-toggle').hide();
            $('#description-text').text(this.descriptionFull);
        } else {
            // 截取描述段落
            const descriptionThin = this.descriptionFull.substring(0, maxLength);
            // 显示完整/精简描述
            $('#description-text').text(this.isDescriptionCollected ? `${descriptionThin}...` : this.descriptionFull);
            // 切换“展开”/“收起”按钮
            $('#collapse-toggle').text(this.isDescriptionCollected ? '展开' : '收起').show();
        }
    }

    /**
     * 根据当前窗口内容区宽度调整“唱片”形态，包括唱片的上边距和磁头的最大旋转角，当音频正在播放时，更新磁头的旋转角度
     * @param width 当前窗口内容区宽度
     * @param isPlaying 标志音频是否正在播放，为布尔值
     */
    switchDiscStyle(width, isPlaying) {
        if (width < 992) {
            $('#disc-group').css('top', '100px');
            this.needle_rotation_max = 20;
        } else if (width < 1200) {
            $('#disc-group').css('top', '30px');
            this.needle_rotation_max = -12;
        } else {
            $('#disc-group').css('top', '10px');
            this.needle_rotation_max = -20;
        }
        if (isPlaying) {
            $('#disc-needle').css('transform', `translate(-15.15%, -9.09%) scale(0.25) rotateZ(${this.needle_rotation_max}deg)`);
        }
    }

    playPreviousSong() {

    }

    playNextSong() {

    }

    /**
     * 根据传入的播放状态值改变UI的状态，包括“唱片”的转动状态和底部“播放按钮”
     * 在唱片停止转动的状态下显示一个播放按钮，并为它绑定一个事件
     * @param playing 将要设定的播放状态，应为布尔值，true表示播放
     */
    setPlayingStatusTo(playing) {
        // 检查参数类型
        BPlaylist.checkBoolean(playing, 'setPlayingStatusTo', this);
        // 设置唱片样式
        if (playing) {
            $('#disc-needle').css('transform', `translate(-15.15%, -9.09%) scale(0.25) rotateZ(${this.needle_rotation_max}deg)`);
            $('#disc-play').hide(500);
            // 不止一种触发方式，one()不适用
            $('#disc-light').click('click', () => {$('#control-toggle').click();});
        } else {
            $('#disc-needle').css('transform', 'translate(-15.15%, -9.09%) scale(0.25) rotateZ(-60deg)');
            $('#disc-play').show(500);
            $('#disc-light').off();
        }
        // 一键切换底部按钮样式
        $('#control-toggle').toggleClass('icomoon-pause icomoon-play2 control-toggle-animated')
    }

    setCountVisibility(shown) {
        // 检查参数类型
        BPlaylist.checkBoolean(shown, 'setCountVisibility', this);
        $('#count-play').css('line-height', `${shown ? 1.2 : 1.5}rem`);
        $('#count-switch').toggleClass('count-off count-on');
    }

    toggleDescription(isCollected) {
        // 检查参数类型
        BPlaylist.checkBoolean(isCollected, 'toggleDescription', this);
        // 存入折叠状态，方便窗口尺寸变化时快速获取折叠状态
        this.isDescriptionCollected = isCollected;
        $('#description').attr('data-is-collected', isCollected ? 'true' : 'false');
        // 复用代码，根据窗口内容区宽度调整歌曲描述段落的长度
        this.switchDescriptionText(window.innerWidth);
    }

    setVolume(volume) {
        this.setVolumeIndicator(volume);
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
        this.setVolumeIcon(type);
    }

    /**
     * 根据传入的音量值，改变音量指示器的位置，并为音量值部分设置样式
     * @param volume 将要设置的音量值，范围为[0, 1]
     */
    setVolumeIndicator(volume) {
        // 检查参数类型
        BPlaylist.checkVolume(volume, 'setVolumeIndicator', this);
        // 计算值
        const value = `${volume * 100}%`;
        // 改变样式
        $('#volume-indicator').css('left', value);
        $('#volume-value').css('width', value);
    }

    /**
     * 根据传入的音量图标类型值，改变音量图标。
     * @param type 将要设置的音量图标类型值，可选{'mute', ‘low’, 'medium', 'high'}
     */
    setVolumeIcon(type) {
        // 检查参数类型并映射样式
        const value = this.checkVolumeIcon(type, 'setVolumeIcon');
        // 改变样式
        $('#control-volume').removeClass().addClass(value);
    }

    /**
     * 检查传入的音量图标类型值，若不是预设值之一则抛出错误
     * @param type 将要检查的音量图标类型值，可选{'mute', 'low', 'medium', 'high'}
     * @param functionName 调用此函数时所在函数的名字
     * @return {*} 音量图标类型对应的值
     */
    checkVolumeIcon(type, functionName) {
        const value = this.volumeIconDict[type];
        if (value === undefined) {
            throw new RangeError(`BRender::${functionName}(): 指定的音量图标类型未定义`);
        } else {
            return value;
        }
    }
}
