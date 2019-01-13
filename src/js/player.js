/**
 * 播放器相关js
 */
(function () {

    let fse = require('fs-extra')

    HTMLAudioElement.prototype._play = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype._load = HTMLAudioElement.prototype.load;
    HTMLAudioElement.prototype.play = function () {
        // 禁止load操作
        this._lockLoad = true;
        this._play();
    }
    HTMLAudioElement.prototype.load = function () {
        this._lockLoad || this._load();
    }

    //创建audio控制音乐播放
    var audio = document.createElement('audio');
    // audio.muted = "muted";
    audio.style.display = "none";

    audio.autoplay = true;
    audio.loop = false;

    audio.onprogress = function () {//缓冲
        // player.playing = false;

    }

    audio.onloadstart = function () {
        audio.ontimeupdate = listener_rate;
        // listener_rate();
    }

    //用这两个事件来修改状态，避免audio延迟导致的状态错误
    audio.onplay = function () {
        player.playing = true;
    }
    audio.onpause = function () {
        player.playing = false;
    }
    audio.onended = function () {
        player.playing = false;
    }

    //轮询监听播放进度
    function listener_rate() {
        if (player.draging) {//正在拖拽
            return;
        }
        var currentTime = audio.currentTime;
        var duration = audio.duration;

        player.music.now = transTime(currentTime);
        player.music.total = transTime(duration);
        player.music.rate = (currentTime / duration) * 100;

    }
    // document.body.appendChild(audio);

    function clearDrag() {//清除拖拽
        if (audio.duration >= 0) {
            player.draging = false;
            player.draging = null;
            player.seek(player.music.rate);
            document.onmousemove = function () { }
        }
    }
    document.onmouseup = function () {
        clearDrag();
    }
    document.onclick = function () {
        console.log('全局click')
    }

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
            },//当前播放的music
            vol: {},//音量
            random: true,
        },
        created(){
            let _this = this;
            fse.ensureDirSync('../config');
            fse.ensureFileSync('../config/play.bat');
            fse.readJSON('../config/play.bat',function(err,value){
                if(err) throw err;
                console.log(value)
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const element = value[key];
                        _this[key]  = element;
                    }
                }
                // if (value) _this._data = value;
            });
        },
        mounted() {
            var _this = this;
            this.$watch('music', function (nv, ov) {

                this.$set(this.music, 'now', '00:00')
                this.$set(this.music, 'total', '00:00')
                this.$set(this.music, 'rate', 0)
                //解析音频
                audio.src = nv.url;
                _this.play();

                console.log(_this._data);
                fse.writeJSON('../config/play.bat',_this._data);
            })
            this.$watch('playing',function(nv,ov){

                console.log("播放状态,"+ov+"->"+nv)

                fse.writeJSON('../config/play.bat',_this._data);
            })
            this.$watch('vol',function(nv,ov){
                fse.writeJSON('../config/play.bat',_this._data);
            })
            this.$watch('random',function(nv,ov){
                fse.writeJSON('../config/play.bat',_this._data);
            })

        },
        methods: {
            play() {
                console.log('出发ｐｌａｙ事件')
                //开始播放
                if (audio.duration > 0) {
                    if (audio.currentTime == audio.duration) {//已经播放完成
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
                    setTimeout(function () { audio.pause() }, 150)
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
                let next = control.next(random);
                if (next) {
                    this.music = next;
                }
            },
            search() {
                control.showSearch(true);
            },
            seek(rate) {//
                if (!rate) {//没有值

                } else {
                    audio.currentTime = (audio.duration * rate / 100);
                    audio.play();
                }

            },
            down(event) {
                if (audio.duration >= 0) {//保证有音乐才拖拽
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
                        }
                    }
                }


            }
        }
    })

})();

