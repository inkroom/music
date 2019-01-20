/**
 * 播放器相关js
 */
(function () {

    let fse = require('fs-extra')

    // HTMLAudioElement.prototype._play = HTMLAudioElement.prototype.play;
    // HTMLAudioElement.prototype._load = HTMLAudioElement.prototype.load;
    // HTMLAudioElement.prototype.play = function () {
    //     // 禁止load操作
    //     this._lockLoad = true;
    //     this._play();
    // }
    // HTMLAudioElement.prototype.load = function () {
    //     this._lockLoad || this._load();
    // }

    //创建audio控制音乐播放
    var audio = document.createElement('audio');
    // audio.muted = "muted";
    audio.style.display = "none";

    audio.autoplay = true;
    audio.loop = false;

    // document.body.appendChild(audio);


    // audio.onprogress = function () {//缓冲
    //     // player.playing = false;

    // }

    // audio.onloadstart = function () {
    //     audio.ontimeupdate = listener_rate;
    //     // listener_rate();
    // }

    audio.ontimeupdate = function (event) {
        // console.log(event);
        //这个是导致bug的原因，，，好费解啊
        listener_rate(event);
    }

    //用这两个事件来修改状态，避免audio延迟导致的状态错误
    audio.onplay = function () {
        player.playing = true;
        player.music.playable = true;
        duration = audio.duration;
        player.music.total = transTime(duration);
        control.updateMusic(player.music);
        // interval_index = setInterval(listener_rate,200);
    }
    audio.onpause = function () {
        player.music.playable = true;
        player.playing = false;
    }
    audio.onended = function () {
        player.playing = false;

        if (player.random) {
            control.next(player.random);
        }
    }

    audio.onerror = function () {
        // 可能出现的版权限制等情况
        player.$layer.msg('由于版权等原因，该歌曲不能播放')
        //等等情况
        // player.$layer.msg('');
        console.log('audio error')
        console.log(player.music)
        player.music.playable = false;
        control.updateMusic(player.music);
        control.next(player.random);
    }


    //轮询监听播放进度
    function listener_rate(event) {
        if (player.draging || !player.playing) { //正在拖拽
            return;
        }
        // event.timeStamp有延迟，如果设置了新的currentTime会拿不到
        // var currentTime = event.timeStamp / 1000;
        var currentTime = audio.currentTime;
        var duration = audio.duration;

        player.music.now = transTime(currentTime);
        // player.music.total = transTime(duration);
        // player.music.rate = 50;
        player.music.rate = (currentTime / duration) * 100;
    }
    // document.body.appendChild(audio);

    function clearDrag() { //清除拖拽
        if (audio.duration >= 0 && player.draging) {
            player.seek(player.music.rate);
            player.draging = false;
            player.draging = null;
            document.onmousemove = function () {}
        }
    }
    document.addEventListener('mouseup',clearDrag)
    // document.onmouseup = function () {
    //     clearDrag();
    // }

    window.player = new Vue({
        el: '#player',
        data: {
            playing: false,
            music: {
                // cover: '',
                // name: '暂无歌曲',
                // total: '00:00',
                // now: '00:00',
                // rate: '0',//进度比例
                // originName:'暂无',
            }, //当前播放的music
            vol: {}, //音量
            random: true,
        },
        created() {
            let _this = this;
            fse.ensureDirSync('./config');
            fse.ensureFileSync('./config/play.bat');
            fse.readJSON('./config/play.bat', function (err, value) {
                if (err) throw err;
                console.log(value)
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const element = value[key];
                        _this[key] = element;
                    }
                }
                // if (value) _this._data = value;
            });
        },
        mounted() {
            var _this = this;
            this.$watch('music', function (nv, ov) {
                if (nv.url === '') { //可能是没有版权等原因
                    if (_this.random) {
                        _this.music.playable = false;
                        control.updateMusic(_this.music);
                        control.next(_this.random);
                        return;
                    }
                    //提示

                }
                this.$set(this.music, 'now', '00:00')
                this.$set(this.music, 'total', '00:00')
                this.$set(this.music, 'rate', 0)
                //解析音频
                audio.src = nv.url;
                _this.play();

                console.log(_this._data);
                fse.writeJSON('./config/play.bat', _this._data);
            })
            this.$watch('playing', function (nv, ov) {

                console.log("播放状态," + ov + "->" + nv)

                fse.writeJSON('./config/play.bat', _this._data);
            })
            this.$watch('vol', function (nv, ov) {
                fse.writeJSON('./config/play.bat', _this._data);
            })
            this.$watch('random', function (nv, ov) {
                fse.writeJSON('./config/play.bat', _this._data);
            })

        },
        methods: {
            play() {
                //开始播放
                if (audio.duration > 0) {
                    if (audio.currentTime == audio.duration) { //已经播放完成
                        console.log('finish')
                        audio.ontimeupdate = null;
                        audio.currentTime = 0;
                        //后续注册事件，防止因为执行循序导致重新播放后立马结束
                        audio.ontimeupdate = listener_rate;
                        // audio.load();
                    } else if (audio.paused) {
                        console.log('pauesd')
                        audio.play();
                        // audio.load();
                    }
                    // this.playing = true;
                }

            },
            pause() {
                console.log('出发ｐause事件')
                if (audio.duration > 0) {
                    // this.playing = false;
                    setTimeout(function () {
                        audio.pause()
                    }, 50)
                    // audio.pause();
                }

            },
            toogle() {
                console.log('toogle=' + this.playing);
                if (this.playing) {
                    this.pause();
                } else {
                    this.play();
                }
            },
            next() {
                let next = control.next(this.random);
                if (next) {
                    this.music = next;
                }
            },
            search() {
                control.showSearch(true);
            },
            seek(rate) { //
                console.log('seek=' + rate);
                if (typeof (rate) === 'object') { //直接点击进度条
                    let event = rate;
                    //计算偏移量，使用最底层的偏移量，如果点击的是高亮的进度，target偏移量会为0
                    rate = (event.pageX - this.$refs['bar'].offsetLeft) / this.$refs['bar'].offsetWidth * 100;
                }
                if (audio.fastSeek)
                    audio.fastSeek((audio.duration * rate / 100))
                else {
                    console.log(audio.duration);
                    console.log(rate);

                    audio.currentTime = (audio.duration * (rate / 100));
                    console.log(audio.currentTime)
                    audio.play(); //暂停的情况下必须调用才能继续播放，播放中调用该方法无影响
                }
            },
            down(event) {
                if (audio.duration >= 0) { //保证有音乐才拖拽
                    console.log('拖拽开始')
                    let _this = this;

                    this.draging = true;
                    this.mx = _this.$refs['bar'].offsetLeft;
                    this.sx = event.target.offsetLeft;

                    // console.log(event.target);
                    // console.log(event.target.left);
                    // console.log('event.pageX=' + event.pageX);
                    // console.log('_this.mx=' + _this.mx);
                    // console.log('_this.sx=' + _this.sx);
                    document.onmousemove = function (event) {
                        if (event.pageX > _this.$refs['bar'].offsetLeft && event.pageX < _this.$refs['bar'].offsetLeft + _this.$refs['bar'].offsetWidth) {
                            // console.log('event.pageX=' + event.pageX);
                            // console.log('_this.mx=' + _this.mx);
                            // console.log('_this.sx=' + _this.sx);

                            // console.log('变换的像素=' + (event.pageX - _this.mx))

                            _this.music.rate = ((event.pageX - _this.mx) / _this.$refs['bar'].offsetWidth) * 100;
                            console.log('moving=' + _this.music.rate);
                        }
                    }
                }


            }
        }
    })

})();