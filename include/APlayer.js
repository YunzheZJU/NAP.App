(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("APlayer", [], factory);
    else if(typeof exports === 'object')
        exports["APlayer"] = factory();
    else
        root["APlayer"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	let installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId]) {
                /******/ 			return installedModules[moduleId].exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		let module = installedModules[moduleId] = {
                /******/ 			i: moduleId,
                /******/ 			l: false,
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
            /******/ 		if(!__webpack_require__.o(exports, name)) {
                /******/ 			Object.defineProperty(exports, name, {
                    /******/ 				configurable: false,
                    /******/ 				enumerable: true,
                    /******/ 				get: getter
                    /******/ 			});
                /******/ 		}
            /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
            /******/ 		let getter = module && module.__esModule ?
                /******/ 			function getDefault() { return module['default']; } :
                /******/ 			function getModuleExports() { return module; };
            /******/ 		__webpack_require__.d(getter, 'a', getter);
            /******/ 		return getter;
            /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "/";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = 0);
        /******/ })
    /************************************************************************/
    /******/ ([
        /* 0 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, '__esModule', { value: true });
            let _createClass = function () {
                function defineProperties(target, props) {
                    for (let i = 0; i < props.length; i++) {
                        let descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            __webpack_require__(1);
            function _toConsumableArray(arr) {
                if (Array.isArray(arr)) {
                    for (let i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                        arr2[i] = arr[i];
                    }
                    return arr2;
                } else {
                    return Array.from(arr);
                }
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            console.log('%c APlayer 1.6.1 %c http://aplayer.js.org ', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
            let instances = [];
            let APlayer = function () {
                function APlayer(option) {
                    let _this = this;
                    _classCallCheck(this, APlayer);
                    let svg = {
                        'play': [
                            '0 0 16 31',
                            'M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z'
                        ],
                        'pause': [
                            '0 0 17 32',
                            'M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z'
                        ],
                        'volume-up': [
                            '0 0 28 32',
                            'M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056zM29.728 16q0 4.096-2.272 7.552t-6.048 5.056q-0.224 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.64 0.704-1.056 0.128-0.064 0.384-0.192t0.416-0.192q0.8-0.448 1.44-0.896 2.208-1.632 3.456-4.064t1.216-5.152-1.216-5.152-3.456-4.064q-0.64-0.448-1.44-0.896-0.128-0.096-0.416-0.192t-0.384-0.192q-0.704-0.416-0.704-1.056 0-0.448 0.32-0.8t0.832-0.352q0.224 0 0.448 0.096 3.776 1.632 6.048 5.056t2.272 7.552z'
                        ],
                        'volume-down': [
                            '0 0 28 32',
                            'M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528z'
                        ],
                        'volume-off': [
                            '0 0 28 32',
                            'M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z'
                        ],
                        'circulation': [
                            '0 0 29 32',
                            'M25.6 9.92q1.344 0 2.272 0.928t0.928 2.272v9.28q0 1.28-0.928 2.24t-2.272 0.96h-22.4q-1.28 0-2.24-0.96t-0.96-2.24v-9.28q0-1.344 0.96-2.272t2.24-0.928h8v-3.52l6.4 5.76-6.4 5.76v-3.52h-6.72v6.72h19.84v-6.72h-4.8v-4.48h6.080z'
                        ],
                        'random': [
                            '0 0 33 31',
                            'M29.867 9.356l-5.003 5.003c-0.094 0.094-0.235 0.141-0.36 0.141-0.266 0-0.5-0.219-0.5-0.5v-3.002h-4.002c-2.079 0-3.064 1.423-3.94 3.111-0.453 0.875-0.844 1.782-1.219 2.673-1.735 4.033-3.768 8.223-8.849 8.223h-3.502c-0.281 0-0.5-0.219-0.5-0.5v-3.002c0-0.281 0.219-0.5 0.5-0.5h3.502c2.079 0 3.064-1.423 3.94-3.111 0.453-0.875 0.844-1.782 1.219-2.673 1.735-4.033 3.768-8.223 8.849-8.223h4.002v-3.002c0-0.281 0.219-0.5 0.5-0.5 0.141 0 0.266 0.063 0.375 0.156l4.987 4.987c0.094 0.094 0.141 0.235 0.141 0.36s-0.047 0.266-0.141 0.36zM10.262 14.781c-0.907-1.892-1.907-3.783-4.268-3.783h-3.502c-0.281 0-0.5-0.219-0.5-0.5v-3.002c0-0.281 0.219-0.5 0.5-0.5h3.502c2.783 0 4.831 1.298 6.41 3.518-0.876 1.344-1.517 2.798-2.142 4.268zM29.867 23.363l-5.003 5.003c-0.094 0.094-0.235 0.141-0.36 0.141-0.266 0-0.5-0.235-0.5-0.5v-3.002c-4.643 0-7.504 0.547-10.396-3.518 0.86-1.344 1.501-2.798 2.126-4.268 0.907 1.892 1.907 3.783 4.268 3.783h4.002v-3.002c0-0.281 0.219-0.5 0.5-0.5 0.141 0 0.266 0.063 0.375 0.156l4.987 4.987c0.094 0.094 0.141 0.235 0.141 0.36s-0.047 0.266-0.141 0.36z'
                        ],
                        'order': [
                            '0 0 32 32',
                            'M0.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549h-19.54v3.725z'
                        ],
                        'single': [
                            '0 0 38 32',
                            'M2.072 21.577c0.71-0.197 1.125-0.932 0.928-1.641-0.221-0.796-0.333-1.622-0.333-2.457 0-5.049 4.108-9.158 9.158-9.158h5.428c0.056-0.922 0.221-1.816 0.482-2.667h-5.911c-3.158 0-6.128 1.23-8.361 3.463s-3.463 5.203-3.463 8.361c0 1.076 0.145 2.143 0.431 3.171 0.164 0.59 0.7 0.976 1.284 0.976 0.117 0 0.238-0.016 0.357-0.049zM21.394 25.613h-12.409v-2.362c0-0.758-0.528-1.052-1.172-0.652l-5.685 3.522c-0.644 0.4-0.651 1.063-0.014 1.474l5.712 3.69c0.637 0.411 1.158 0.127 1.158-0.63v-2.374h12.409c3.158 0 6.128-1.23 8.361-3.463 1.424-1.424 2.44-3.148 2.99-5.029-0.985 0.368-2.033 0.606-3.125 0.691-1.492 3.038-4.619 5.135-8.226 5.135zM28.718 0c-4.985 0-9.026 4.041-9.026 9.026s4.041 9.026 9.026 9.026 9.026-4.041 9.026-9.026-4.041-9.026-9.026-9.026zM30.392 13.827h-1.728v-6.822c-0.635 0.576-1.433 1.004-2.407 1.285v-1.713c0.473-0.118 0.975-0.325 1.506-0.62 0.532-0.325 0.975-0.665 1.329-1.034h1.3v8.904z'
                        ],
                        'menu': [
                            '0 0 22 32',
                            'M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z'
                        ]
                    };
                    this.getSVG = function (type) {
                        return '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="' + svg[type][0] + '" width="100%"><use xlink:href="#aplayer-' + type + '"></use><path class="aplayer-fill" d="' + svg[type][1] + '" id="aplayer-' + type + '"></path></svg>';
                    };
                    this.isMobile = /mobile/i.test(window.navigator.userAgent);
                    if (this.isMobile) {
                        option.autoplay = false;
                    }
                    let defaultOption = {
                        element: document.getElementsByClassName('aplayer')[0],
                        narrow: false,
                        autoplay: false,
                        mutex: true,
                        showlrc: 0,
                        theme: '#b7daff',
                        mode: 'circulation'
                    };
                    for (let defaultKey in defaultOption) {
                        if (defaultOption.hasOwnProperty(defaultKey) && !option.hasOwnProperty(defaultKey)) {
                            option[defaultKey] = defaultOption[defaultKey];
                        }
                    }
                    this.option = option;
                    this.audios = [];
                    this.mode = option.mode;
                    this.secondToTime = function (second) {
                        if (isNaN(second)) {
                            return '00:00';
                        }
                        let add0 = function add0(num) {
                            return num < 10 ? '0' + num : '' + num;
                        };
                        let min = parseInt(second / 60);
                        let sec = parseInt(second - min * 60);
                        let hours = parseInt(min / 60);
                        let minAdjust = parseInt(second / 60 - 60 * parseInt(second / 60 / 60));
                        return second >= 3600 ? add0(hours) + ':' + add0(minAdjust) + ':' + add0(sec) : add0(min) + ':' + add0(sec);
                    };
                    this.element = this.option.element;
                    if (this.option.showlrc === 2 || this.option.showlrc === true) {
                        this.savelrc = [];
                        for (let i = 0; i < this.element.getElementsByClassName('aplayer-lrc-content').length; i++) {
                            this.savelrc.push(this.element.getElementsByClassName('aplayer-lrc-content')[i].innerHTML);
                        }
                    }
                    this.lrcs = [];
                    this.updateBar = function (type, percentage, direction) {
                        percentage = percentage > 0 ? percentage : 0;
                        percentage = percentage < 1 ? percentage : 1;
                        bar[type + 'Bar'].style[direction] = percentage * 100 + '%';
                    };
                    this.updateLrc = function () {
                        let currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.audio.currentTime;
                        if (_this.lrcIndex > _this.lrc.length - 1 || currentTime < _this.lrc[_this.lrcIndex][0] || !_this.lrc[_this.lrcIndex + 1] || currentTime >= _this.lrc[_this.lrcIndex + 1][0]) {
                            for (let _i = 0; _i < _this.lrc.length; _i++) {
                                if (currentTime >= _this.lrc[_i][0] && (!_this.lrc[_i + 1] || currentTime < _this.lrc[_i + 1][0])) {
                                    _this.lrcIndex = _i;
                                    _this.lrcContents.style.transform = 'translateY(' + -_this.lrcIndex * 16 + 'px)';
                                    _this.lrcContents.style.webkitTransform = 'translateY(' + -_this.lrcIndex * 16 + 'px)';
                                    _this.lrcContents.getElementsByClassName('aplayer-lrc-current')[0].classList.remove('aplayer-lrc-current');
                                    _this.lrcContents.getElementsByTagName('p')[_i].classList.add('aplayer-lrc-current');
                                }
                            }
                        }
                    };
                    let eventTypes = [
                        'play',
                        'pause',
                        'canplay',
                        'playing',
                        'ended',
                        'error'
                    ];
                    this.event = {};
                    for (let _i2 = 0; _i2 < eventTypes.length; _i2++) {
                        this.event[eventTypes[_i2]] = [];
                    }
                    this.trigger = function (type) {
                        for (let _i3 = 0; _i3 < _this.event[type].length; _i3++) {
                            _this.event[type][_i3]();
                        }
                    };
                    this.playIndex = 0;
                    if (Object.prototype.toString.call(option.music) !== '[object Array]') {
                        this.option.music = [this.option.music];
                    }
                    this.music = this.option.music[this.playIndex];
                    if (this.option.showlrc) {
                        this.element.classList.add('aplayer-withlrc');
                    }
                    if (this.option.music.length > 1) {
                        this.element.classList.add('aplayer-withlist');
                    }
                    if (!this.isMultiple() && this.mode !== 'circulation' && this.mode !== 'order') {
                        this.mode = 'circulation';
                    }
                    this.getRandomOrder();
                    let eleHTML = '<div class="aplayer-pic" ' + (this.music.pic ? 'style="background-image: url(\'' + this.music.pic + '\');"' : '') + '><div class="aplayer-button aplayer-play"><button type="button" class="aplayer-icon aplayer-icon-play">' + this.getSVG('play') + '</button></div></div><div class="aplayer-info"><div class="aplayer-music"><span class="aplayer-title"></span><span class="aplayer-author"></span></div><div class="aplayer-lrc"><div class="aplayer-lrc-contents" style="transform: translateY(0); -webkit-transform: translateY(0);"></div></div><div class="aplayer-controller"><div class="aplayer-bar-wrap"><div class="aplayer-bar"><div class="aplayer-loaded" style="width: 0"></div><div class="aplayer-played" style="width: 0; background: ' + this.option.theme + ';"><span class="aplayer-thumb" style="border: 1px solid ' + this.option.theme + ';"></span></div></div></div><div class="aplayer-time"><span class="aplayer-time-inner">- <span class="aplayer-ptime">00:00</span> / <span class="aplayer-dtime">00:00</span></span><div class="aplayer-volume-wrap"><button type="button" class="aplayer-icon aplayer-icon-volume-down" ' + (this.isMobile ? 'style="display: none;"' : '') + '>' + this.getSVG('volume-down') + '</button><div class="aplayer-volume-bar-wrap"><div class="aplayer-volume-bar"><div class="aplayer-volume" style="height: 80%; background: ' + this.option.theme + ';"></div></div></div></div><button type="button" class="aplayer-icon aplayer-icon-mode">' + this.getSVG(this.mode) + '</button><button type="button" class="aplayer-icon aplayer-icon-menu">' + this.getSVG('menu') + '</button></div></div></div><div class="aplayer-list" ' + (this.option.listmaxheight ? 'style="max-height: ' + this.option.listmaxheight + '"' : '') + '><ol>';
                    for (let _i4 = 0; _i4 < this.option.music.length; _i4++) {
                        eleHTML += '<li><span class="aplayer-list-cur" style="background: ' + this.option.theme + ';"></span><span class="aplayer-list-index">' + (_i4 + 1) + '</span><span class="aplayer-list-title">' + this.option.music[_i4].title + '</span><span class="aplayer-list-author">' + this.option.music[_i4].author + '</span></li>';
                    }
                    eleHTML += '</ol></div>';
                    this.element.innerHTML = eleHTML;
                    if (this.element.offsetWidth < 300) {
                        this.element.getElementsByClassName('aplayer-icon-mode')[0].style.display = 'none';
                    }
                    this.ptime = this.element.getElementsByClassName('aplayer-ptime')[0];
                    if (this.element.getElementsByClassName('aplayer-info')[0].offsetWidth < 200) {
                        this.element.getElementsByClassName('aplayer-time')[0].classList.add('aplayer-time-narrow');
                    }
                    let bar = {};
                    bar.barWrap = this.element.getElementsByClassName('aplayer-bar-wrap')[0];
                    if (this.option.narrow) {
                        this.element.classList.add('aplayer-narrow');
                    }
                    this.button = this.element.getElementsByClassName('aplayer-button')[0];
                    this.button.addEventListener('click', function () {
                        _this.toggle();
                    });
                    let list = this.element.getElementsByClassName('aplayer-list')[0];
                    list.addEventListener('click', function (e) {
                        let target = void 0;
                        if (e.target.tagName.toUpperCase() === 'LI') {
                            target = e.target;
                        } else {
                            target = e.target.parentElement;
                        }
                        let musicIndex = parseInt(target.getElementsByClassName('aplayer-list-index')[0].innerHTML) - 1;
                        if (musicIndex !== _this.playIndex) {
                            _this.setMusic(musicIndex);
                            _this.play();
                        } else {
                            _this.toggle();
                        }
                    });
                    bar.playedBar = this.element.getElementsByClassName('aplayer-played')[0];
                    bar.loadedBar = this.element.getElementsByClassName('aplayer-loaded')[0];
                    let thumb = this.element.getElementsByClassName('aplayer-thumb')[0];
                    let barWidth = void 0;
                    bar.barWrap.addEventListener('click', function (event) {
                        let e = event || window.event;
                        barWidth = bar.barWrap.clientWidth;
                        let percentage = (e.clientX - getElementViewLeft(bar.barWrap)) / barWidth;
                        if (isNaN(_this.audio.duration)) {
                            _this.updateBar('played', 0, 'width');
                        } else {
                            _this.updateBar('played', percentage, 'width');
                            _this.element.getElementsByClassName('aplayer-ptime')[0].innerHTML = _this.secondToTime(percentage * _this.audio.duration);
                            _this.audio.currentTime = parseFloat(bar.playedBar.style.width) / 100 * _this.audio.duration;
                        }
                    });
                    thumb.addEventListener('mouseover', function () {
                        thumb.style.background = _this.option.theme;
                    });
                    thumb.addEventListener('mouseout', function () {
                        thumb.style.background = '#fff';
                    });
                    let thumbMove = function thumbMove(event) {
                        let e = event || window.event;
                        let percentage = (e.clientX - getElementViewLeft(bar.barWrap)) / barWidth;
                        percentage = percentage > 0 ? percentage : 0;
                        percentage = percentage < 1 ? percentage : 1;
                        _this.updateBar('played', percentage, 'width');
                        if (_this.option.showlrc) {
                            _this.updateLrc(parseFloat(bar.playedBar.style.width) / 100 * _this.audio.duration);
                        }
                        _this.element.getElementsByClassName('aplayer-ptime')[0].innerHTML = _this.secondToTime(percentage * _this.audio.duration);
                    };
                    let thumbUp = function thumbUp() {
                        document.removeEventListener('mouseup', thumbUp);
                        document.removeEventListener('mousemove', thumbMove);
                        if (isNaN(_this.audio.duration)) {
                            _this.updateBar('played', 0, 'width');
                        } else {
                            _this.audio.currentTime = parseFloat(bar.playedBar.style.width) / 100 * _this.audio.duration;
                            _this.playedTime = setInterval(function () {
                                _this.updateBar('played', _this.audio.currentTime / _this.audio.duration, 'width');
                                if (_this.option.showlrc) {
                                    _this.updateLrc();
                                }
                                _this.element.getElementsByClassName('aplayer-ptime')[0].innerHTML = _this.secondToTime(_this.audio.currentTime);
                                _this.trigger('playing');
                            }, 100);
                        }
                    };
                    thumb.addEventListener('mousedown', function () {
                        barWidth = bar.barWrap.clientWidth;
                        clearInterval(_this.playedTime);
                        document.addEventListener('mousemove', thumbMove);
                        document.addEventListener('mouseup', thumbUp);
                    });
                    bar.volumeBar = this.element.getElementsByClassName('aplayer-volume')[0];
                    let volumeBarWrap = this.element.getElementsByClassName('aplayer-volume-bar')[0];
                    this.volumeicon = this.element.getElementsByClassName('aplayer-time')[0].getElementsByTagName('button')[0];
                    let barHeight = 35;
                    this.element.getElementsByClassName('aplayer-volume-bar-wrap')[0].addEventListener('click', function (event) {
                        let e = event || window.event;
                        let percentage = (barHeight - e.clientY + getElementViewTop(volumeBarWrap)) / barHeight;
                        percentage = percentage > 0 ? percentage : 0;
                        percentage = percentage < 1 ? percentage : 1;
                        _this.volume(percentage);
                    });
                    this.volumeicon.addEventListener('click', function () {
                        if (_this.audio.muted) {
                            _this.audio.muted = false;
                            _this.volumeicon.className = _this.audio.volume === 1 ? 'aplayer-icon aplayer-icon-volume-up' : 'aplayer-icon aplayer-icon-volume-down';
                            if (_this.audio.volume === 1) {
                                _this.volumeicon.className = 'aplayer-icon aplayer-icon-volume-up';
                                _this.volumeicon.innerHTML = _this.getSVG('volume-up');
                            } else {
                                _this.volumeicon.className = 'aplayer-icon aplayer-icon-volume-down';
                                _this.volumeicon.innerHTML = _this.getSVG('volume-down');
                            }
                            _this.updateBar('volume', _this.audio.volume, 'height');
                        } else {
                            _this.audio.muted = true;
                            _this.volumeicon.className = 'aplayer-icon aplayer-icon-volume-off';
                            _this.volumeicon.innerHTML = _this.getSVG('volume-off');
                            _this.updateBar('volume', 0, 'height');
                        }
                    });
                    function getElementViewLeft(element) {
                        let actualLeft = element.offsetLeft;
                        let current = element.offsetParent;
                        let elementScrollLeft = 0;
                        while (current !== null) {
                            actualLeft += current.offsetLeft;
                            current = current.offsetParent;
                        }
                        elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
                        return actualLeft - elementScrollLeft;
                    }
                    function getElementViewTop(element) {
                        let actualTop = element.offsetTop;
                        let current = element.offsetParent;
                        let elementScrollTop = 0;
                        while (current !== null) {
                            actualTop += current.offsetTop;
                            current = current.offsetParent;
                        }
                        elementScrollTop = document.body.scrollTop + document.documentElement.scrollTop;
                        return actualTop - elementScrollTop;
                    }
                    let modeEle = this.element.getElementsByClassName('aplayer-icon-mode')[0];
                    modeEle.addEventListener('click', function () {
                        if (_this.isMultiple()) {
                            if (_this.mode === 'random') {
                                _this.mode = 'single';
                            } else if (_this.mode === 'single') {
                                _this.mode = 'order';
                            } else if (_this.mode === 'order') {
                                _this.mode = 'circulation';
                            } else if (_this.mode === 'circulation') {
                                _this.mode = 'random';
                            }
                        } else {
                            if (_this.mode === 'circulation') {
                                _this.mode = 'order';
                            } else {
                                _this.mode = 'circulation';
                            }
                        }
                        modeEle.innerHTML = _this.getSVG(_this.mode);
                        _this.audio.loop = !(_this.isMultiple() || _this.mode === 'order');
                    });
                    list.style.height = list.offsetHeight + 'px';
                    this.element.getElementsByClassName('aplayer-icon-menu')[0].addEventListener('click', function () {
                        if (!list.classList.contains('aplayer-list-hide')) {
                            list.classList.add('aplayer-list-hide');
                        } else {
                            list.classList.remove('aplayer-list-hide');
                        }
                    });
                    if (this.mode === 'random') {
                        this.setMusic(this.randomOrder[0]);
                    } else {
                        this.setMusic(0);
                    }
                    if (this.option.autoplay) {
                        this.play();
                    }
                    instances.push(this);
                }
                _createClass(APlayer, [
                    {
                        key: 'setMusic',
                        value: function setMusic(index) {
                            let _this2 = this;
                            if (typeof index !== 'undefined') {
                                this.playIndex = index;
                            }
                            let indexMusic = this.playIndex;
                            this.music = this.option.music[indexMusic];
                            if (this.music.pic) {
                                this.element.getElementsByClassName('aplayer-pic')[0].style.backgroundImage = 'url(\'' + this.music.pic + '\')';
                            } else {
                                this.element.getElementsByClassName('aplayer-pic')[0].style.backgroundImage = '';
                            }
                            this.element.getElementsByClassName('aplayer-title')[0].innerHTML = this.music.title;
                            this.element.getElementsByClassName('aplayer-author')[0].innerHTML = this.music.author ? ' - ' + this.music.author : '';
                            if (this.element.getElementsByClassName('aplayer-list-light')[0]) {
                                this.element.getElementsByClassName('aplayer-list-light')[0].classList.remove('aplayer-list-light');
                            }
                            this.element.getElementsByClassName('aplayer-list')[0].getElementsByTagName('li')[indexMusic].classList.add('aplayer-list-light');
                            if (!this.isMobile && this.audio) {
                                this.pause();
                                this.audio.currentTime = 0;
                            }
                            this.element.getElementsByClassName('aplayer-list')[0].scrollTop = indexMusic * 33;
                            if (this.isMobile && this.audio) {
                                this.audio.src = this.music.url;
                            } else if (!this.isMobile && this.audios[indexMusic]) {
                                this.audio = this.audios[indexMusic];
                                this.audio.volume = parseInt(this.element.getElementsByClassName('aplayer-volume')[0].style.height) / 100;
                                this.audio.currentTime = 0;
                                this.audio.src = this.music.url;
                            } else {
                                this.audio = document.createElement('audio');
                                this.audio.src = this.music.url;
                                this.audio.preload = this.option.preload ? this.option.preload : 'auto';
                                this.audio.addEventListener('play', function () {
                                    if (_this2.button.classList.contains('aplayer-play')) {
                                        _this2.button.classList.remove('aplayer-play');
                                        _this2.button.classList.add('aplayer-pause');
                                        _this2.button.innerHTML = '';
                                        setTimeout(function () {
                                            _this2.button.innerHTML = '<button type="button" class="aplayer-icon aplayer-icon-pause">' + _this2.getSVG('pause') + '     </button>';
                                        }, 100);
                                        if (_this2.option.mutex) {
                                            for (let i = 0; i < instances.length; i++) {
                                                if (_this2 !== instances[i]) {
                                                    instances[i].pause();
                                                }
                                            }
                                        }
                                        if (_this2.playedTime) {
                                            clearInterval(_this2.playedTime);
                                        }
                                        _this2.playedTime = setInterval(function () {
                                            _this2.updateBar('played', _this2.audio.currentTime / _this2.audio.duration, 'width');
                                            if (_this2.option.showlrc) {
                                                _this2.updateLrc();
                                            }
                                            _this2.ptime.innerHTML = _this2.secondToTime(_this2.audio.currentTime);
                                            _this2.trigger('playing');
                                        }, 100);
                                        _this2.trigger('play');
                                    }
                                });
                                let pauseHandler = function pauseHandler() {
                                    if (_this2.button && (_this2.button.classList.contains('aplayer-pause') || _this2.ended)) {
                                        _this2.ended = false;
                                        _this2.button.classList.remove('aplayer-pause');
                                        _this2.button.classList.add('aplayer-play');
                                        _this2.button.innerHTML = '';
                                        setTimeout(function () {
                                            _this2.button.innerHTML = '<button type="button" class="aplayer-icon aplayer-icon-play">' + _this2.getSVG('play') + '     </button>';
                                        }, 100);
                                        clearInterval(_this2.playedTime);
                                        _this2.trigger('pause');
                                    }
                                };
                                this.audio.addEventListener('pause', pauseHandler);
                                this.audio.addEventListener('abort', pauseHandler);
                                this.audio.addEventListener('durationchange', function () {
                                    if (_this2.audio.duration !== 1) {
                                        _this2.element.getElementsByClassName('aplayer-dtime')[0].innerHTML = _this2.secondToTime(_this2.audio.duration);
                                    }
                                });
                                this.audio.addEventListener('progress', function () {
                                    let percentage = _this2.audio.buffered.length ? _this2.audio.buffered.end(_this2.audio.buffered.length - 1) / _this2.audio.duration : 0;
                                    _this2.updateBar('loaded', percentage, 'width');
                                });
                                this.audio.addEventListener('error', function () {
                                    _this2.element.getElementsByClassName('aplayer-author')[0].innerHTML = ' - Error happens \u2565﹏\u2565';
                                    _this2.trigger('pause');
                                });
                                this.audio.addEventListener('canplay', function () {
                                    _this2.trigger('canplay');
                                });
                                this.ended = false;
                                this.audio.addEventListener('ended', function () {
                                    if (_this2.isMultiple()) {
                                        if (_this2.audio.currentTime !== 0) {
                                            if (_this2.mode === 'random') {
                                                _this2.setMusic(_this2.nextRandomNum());
                                                _this2.play();
                                            } else if (_this2.mode === 'single') {
                                                _this2.setMusic(_this2.playIndex);
                                                _this2.play();
                                            } else if (_this2.mode === 'order') {
                                                if (_this2.playIndex < _this2.option.music.length - 1) {
                                                    _this2.setMusic(++_this2.playIndex);
                                                    _this2.play();
                                                } else {
                                                    _this2.ended = true;
                                                    _this2.pause();
                                                    _this2.trigger('ended');
                                                }
                                            } else if (_this2.mode === 'circulation') {
                                                _this2.playIndex = (_this2.playIndex + 1) % _this2.option.music.length;
                                                _this2.setMusic(_this2.playIndex);
                                                _this2.play();
                                            }
                                        }
                                    } else {
                                        if (_this2.mode === 'order') {
                                            _this2.ended = true;
                                            _this2.pause();
                                            _this2.trigger('ended');
                                        }
                                    }
                                });
                                this.audio.volume = parseInt(this.element.getElementsByClassName('aplayer-volume')[0].style.height) / 100;
                                this.audio.loop = !(this.isMultiple() || this.mode === 'order');
                                this.audios[indexMusic] = this.audio;
                            }
                            let parseLrc = function parseLrc(lrc_s) {
                                let lyric = lrc_s.split('\n');
                                let lrc = [];
                                let lyricLen = lyric.length;
                                for (let i = 0; i < lyricLen; i++) {
                                    let lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g);
                                    let lrcText = lyric[i].replace(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g, '').replace(/^\s+|\s+$/g, '');
                                    if (lrcTimes) {
                                        let timeLen = lrcTimes.length;
                                        for (let j = 0; j < timeLen; j++) {
                                            let oneTime = /\[(\d{2}):(\d{2})\.(\d{2,3})]/.exec(lrcTimes[j]);
                                            let lrcTime = oneTime[1] * 60 + parseInt(oneTime[2]) + parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000);
                                            lrc.push([
                                                lrcTime,
                                                lrcText
                                            ]);
                                        }
                                    }
                                }
                                lrc.sort(function (a, b) {
                                    return a[0] - b[0];
                                });
                                return lrc;
                            };
                            if (this.option.showlrc) {
                                let _index = indexMusic;
                                if (!this.lrcs[_index]) {
                                    let lrcs = '';
                                    if (this.option.showlrc === 1) {
                                        lrcs = this.option.music[_index].lrc;
                                    } else if (this.option.showlrc === 2 || this.option.showlrc === true) {
                                        lrcs = this.savelrc[_index];
                                    } else if (this.option.showlrc === 3) {
                                        let xhr = new XMLHttpRequest();
                                        xhr.onreadystatechange = function () {
                                            if (xhr.readyState === 4) {
                                                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                                                    lrcs = xhr.responseText;
                                                    _this2.lrcs[_index] = parseLrc(lrcs);
                                                } else {
                                                    console.log('Request was unsuccessful: ' + xhr.status);
                                                    _this2.lrcs[_index] = [[
                                                        '00:00',
                                                        'Not available'
                                                    ]];
                                                }
                                                _this2.lrc = _this2.lrcs[_index];
                                                let _lrcHTML = '';
                                                _this2.lrcContents = _this2.element.getElementsByClassName('aplayer-lrc-contents')[0];
                                                for (let i = 0; i < _this2.lrc.length; i++) {
                                                    _lrcHTML += '<p>' + _this2.lrc[i][1] + '</p>';
                                                }
                                                _this2.lrcContents.innerHTML = _lrcHTML;
                                                if (!_this2.lrcIndex) {
                                                    _this2.lrcIndex = 0;
                                                }
                                                _this2.lrcContents.getElementsByTagName('p')[0].classList.add('aplayer-lrc-current');
                                                _this2.lrcContents.style.transform = 'translateY(0px)';
                                                _this2.lrcContents.style.webkitTransform = 'translateY(0px)';
                                            }
                                        };
                                        let apiurl = this.option.music[_index].lrc;
                                        xhr.open('get', apiurl, true);
                                        xhr.send(null);
                                    }
                                    if (lrcs) {
                                        this.lrcs[_index] = parseLrc(lrcs);
                                    } else {
                                        if (this.option.showlrc === 3) {
                                            this.lrcs[_index] = [[
                                                '00:00',
                                                'Loading'
                                            ]];
                                        } else {
                                            this.lrcs[_index] = [[
                                                '00:00',
                                                'Not available'
                                            ]];
                                        }
                                    }
                                }
                                this.lrc = this.lrcs[_index];
                                let lrcHTML = '';
                                this.lrcContents = this.element.getElementsByClassName('aplayer-lrc-contents')[0];
                                for (let i = 0; i < this.lrc.length; i++) {
                                    lrcHTML += '<p>' + this.lrc[i][1] + '</p>';
                                }
                                this.lrcContents.innerHTML = lrcHTML;
                                if (!this.lrcIndex) {
                                    this.lrcIndex = 0;
                                }
                                this.lrcContents.getElementsByTagName('p')[0].classList.add('aplayer-lrc-current');
                                this.lrcContents.style.transform = 'translateY(0px)';
                                this.lrcContents.style.webkitTransform = 'translateY(0px)';
                            }
                            if (this.audio.duration !== 1) {
                                this.element.getElementsByClassName('aplayer-dtime')[0].innerHTML = this.audio.duration ? this.secondToTime(this.audio.duration) : '00:00';
                            }
                        }
                    },
                    {
                        key: 'play',
                        value: function play(time) {
                            if (Object.prototype.toString.call(time) === '[object Number]') {
                                this.audio.currentTime = time;
                            }
                            if (this.audio.paused) {
                                this.audio.play();
                            }
                        }
                    },
                    {
                        key: 'pause',
                        value: function pause() {
                            if (!this.audio.paused) {
                                this.audio.pause();
                            }
                        }
                    },
                    {
                        key: 'volume',
                        value: function volume(percentage) {
                            this.updateBar('volume', percentage, 'height');
                            this.audio.volume = percentage;
                            if (this.audio.muted) {
                                this.audio.muted = false;
                            }
                            if (percentage === 1) {
                                this.volumeicon.className = 'aplayer-icon aplayer-icon-volume-up';
                                this.volumeicon.innerHTML = this.getSVG('volume-up');
                            } else {
                                this.volumeicon.className = 'aplayer-icon aplayer-icon-volume-down';
                                this.volumeicon.innerHTML = this.getSVG('volume-down');
                            }
                        }
                    },
                    {
                        key: 'on',
                        value: function on(name, func) {
                            if (typeof func === 'function') {
                                this.event[name].push(func);
                            }
                        }
                    },
                    {
                        key: 'toggle',
                        value: function toggle() {
                            if (this.button.classList.contains('aplayer-play')) {
                                this.play();
                            } else if (this.button.classList.contains('aplayer-pause')) {
                                this.pause();
                            }
                        }
                    },
                    {
                        key: 'isMultiple',
                        value: function isMultiple() {
                            return this.option.music.length > 1;
                        }
                    },
                    {
                        key: 'getRandomOrder',
                        value: function getRandomOrder() {
                            function random(min, max) {
                                if (max) {
                                    max = min;
                                    min = 0;
                                }
                                return min + Math.floor(Math.random() * (max - min + 1));
                            }
                            function shuffle(arr) {
                                let length = arr.length, shuffled = new Array(length);
                                for (let index = 0, rand; index < length; index++) {
                                    rand = random(0, index);
                                    if (rand !== index) {
                                        shuffled[index] = shuffled[rand];
                                    }
                                    shuffled[rand] = arr[index];
                                }
                                return shuffled;
                            }
                            if (this.isMultiple()) {
                                this.randomOrder = shuffle([].concat(_toConsumableArray(Array(this.option.music.length))).map(function (item, i) {
                                    return i;
                                }));
                            }
                        }
                    },
                    {
                        key: 'nextRandomNum',
                        value: function nextRandomNum() {
                            if (this.isMultiple()) {
                                let index = this.randomOrder.indexOf(this.playIndex);
                                if (index === this.randomOrder.length - 1) {
                                    return this.randomOrder[0];
                                } else {
                                    return this.randomOrder[index + 1];
                                }
                            } else {
                                return 0;
                            }
                        }
                    },
                    {
                        key: 'removeSong',
                        value: function removeSong(indexOfSong) {
                            if (this.option.music[indexOfSong]) {
                                let list = this.element.getElementsByClassName('aplayer-list')[0];
                                let oList = list.getElementsByTagName('ol')[0];
                                let liList = oList.getElementsByTagName('li');
                                if (this.option.music[indexOfSong + 1] || this.option.music[indexOfSong - 1]) {
                                    if (indexOfSong === this.playIndex) {
                                        if (this.option.music[indexOfSong + 1]) {
                                            this.setMusic(indexOfSong + 1);
                                            this.playIndex = this.playIndex - 1;
                                        } else if (!this.option.music[indexOfSong + 1]) {
                                            this.setMusic(indexOfSong - 1);
                                        }
                                    } else {
                                        if (indexOfSong < this.playIndex) {
                                            this.playIndex = this.playIndex - 1;
                                        }
                                    }
                                    if (liList[indexOfSong + 1]) {
                                        let targetSong = liList[indexOfSong - 1];
                                        targetSong.getElementsByClassName('aplayer-list-index')[0].textContent = indexOfSong;
                                    } else {
                                        for (let i = 1; i < liList.length; i++) {
                                            if (liList[indexOfSong + i]) {
                                                let _targetSong = liList[indexOfSong + i];
                                                _targetSong.getElementsByClassName('aplayer-list-index')[0].textContent = indexOfSong + i;
                                            }
                                        }
                                    }
                                    this.option.music.splice(indexOfSong, 1);
                                    this.audios.splice(indexOfSong, 1);
                                    liList[indexOfSong].remove();
                                    if (this.option.music[0] && this.option.music[1]) {
                                        this.multiple = false;
                                        this.element.classList.remove('aplayer-withlist');
                                    }
                                }
                                let listHeight = parseInt(list.style.height, 10);
                                list.style.height = listHeight - 33 + 'px';
                            } else {
                                console.error('ERROR: Song does not exist');
                            }
                        }
                    },
                    {
                        key: 'destroy',
                        value: function destroy() {
                            instances.splice(instances.indexOf(this), 1);
                            this.pause();
                            this.element.innerHTML = '';
                            clearInterval(this.playedTime);
                            for (let key in this) {
                                if (this.hasOwnProperty(key)) {
                                    delete this[key];
                                }
                            }
                        }
                    },
                    {
                        key: 'addMusic',
                        value: function addMusic(newMusic) {
                            let wasSingle = !this.isMultiple();
                            this.option.music = this.option.music.concat(newMusic);
                            let list = this.element.getElementsByClassName('aplayer-list')[0];
                            let listEle = list.getElementsByTagName('ol')[0];
                            let newItemHTML = '';
                            for (let i = 0; i < newMusic.length; i++) {
                                newItemHTML += '<li><span class="aplayer-list-cur" style="background: ' + this.option.theme + ';"></span><span class="aplayer-list-index">' + (this.option.music.length - newMusic.length + i + 1) + '</span><span class="aplayer-list-title">' + newMusic[i].title + '</span><span class="aplayer-list-author">' + newMusic[i].author + '</span></li>';
                            }
                            listEle.innerHTML += newItemHTML;
                            if (wasSingle && this.isMultiple()) {
                                this.element.classList.add('aplayer-withlist');
                                this.audio.loop = false;
                            }
                            let songListLength = listEle.getElementsByTagName('li').length;
                            list.style.height = songListLength * 33 + 'px';
                            this.getRandomOrder();
                        }
                    }
                ]);
                return APlayer;
            }();
            exports.default = APlayer;

            /***/ }),
        /* 1 */
        /***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

            /***/ })
        /******/ ])["default"];
});


// WEBPACK FOOTER //
// APlayer.min.js