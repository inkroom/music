/**
 * 播放器相关js
 */
(function () {


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

    audio.ontimeupdate = function () {
        listener_rate();
    }

    audio.onprogress = function () {//缓冲
        // player.playing = false;

    }

    document.body.appendChild(audio);



    //轮询监听播放进度
    function listener_rate() {
        if (player.draging) {//正在拖拽
            return;
        }
        var currentTime = audio.currentTime;
        var duration = audio.duration;

        if (currentTime == duration) {
            player.playing = false;
            return;
        }
        player.music.now = transTime(currentTime);
        player.music.total = transTime(duration);
        player.music.rate = (currentTime / duration) * 100;
    }

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

    window.player = new Vue({
        el: '#player',
        data: {
            playing: false,
            music: {
                cover: '',
                title: '暂无歌曲',
                total: '00:00',
                now: '00:00',
                rate: '0',//进度比例
            },//当前播放的music
            vol: {},//音量
            random: true,
        },
        mounted() {
            var _this = this;
            this.$watch('music', function (nv, ov) {

                this.$set(this.music, 'now', '00:00')
                this.$set(this.music, 'total', '00:00')
                this.$set(this.music, 'rate', 0)
                //解析音频
                audio.src = nv.url;
                // audio.load();
                _this.play();
            })
        },
        methods: {
            play() {
                //解析时长
                // this.music.total = transTime(audio.duration);
                // this.music.now = '00:00';
                // this.music.rate = 0;

                // if (!this.music.total) {
                //     this.$set(this.music, 'now', '00:00')
                //     this.$set(this.music, 'total', '00:00')
                //     this.$set(this.music, 'rate', 0)
                // }

                // clearInterval(interval_index);
                //开始播放
                if (audio.duration > 0){
                    if (audio.paused) {
                        audio.play();
                        // audio.load();
                    }

                this.playing = true;
                // interval_index = setInterval(listener_rate, 1000);
                }
                    
            },
            pause() {
                if(audio.duration>0){
                    audio.pause();
                    this.playing = false;
                }
               
            },
            toogle() {
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
                control.showSearch();
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
                    this.draging = true;
                    this.mx = event.pageX;
                    this.sx = event.target.offsetLeft;
                    let _this = this;
                    document.onmousemove = function (event) {
                        if (event.pageX > _this.$refs['bar'].offsetLeft && event.pageX < _this.$refs['bar'].offsetLeft + _this.$refs['bar'].offsetWidth) {
                            console.log('event.pageX=' + event.pageX);
                            console.log('_this.mx=' + _this.mx);
                            console.log('_this.sx=' + _this.sx);
                            _this.music.rate = ((event.pageX - _this.mx + _this.sx) / _this.$refs['bar'].offsetWidth) * 100;
                        }
                    }
                }


            }
        }
    })

})();

