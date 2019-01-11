/**
 * 播放器相关js
 */
(function () {

    //创建audio控制音乐播放
    var audio = document.createElement('audio');

    audio.style.display = "none";

    audio.autoplay = false;
    audio.loog = false;

    document.body.appendChild(audio);

    var interval_index = -1;

    function transTime(duration) {//将秒数转出成00:00格式

        var min = parseInt(duration / 60);
        if (min < 10) {
            min = '0' + min;
        }
        var sec = parseInt(duration % 60);
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ":" + sec;
    }
    //轮询监听播放进度
    function listener_rate() {
        var currentTime = audio.currentTime;
        var duration = audio.duration;


        player.music.now = transTime(currentTime);
        player.music.total = transTime(duration);
        player.music.rate = (currentTime / duration) * 100;

        // player.$set(player.music, 'now', transTime(currentTime))
        // player.$set(player.music, 'total', transTime(duration))
        // player.$set(player.music, 'rate', currentTime / duration)

        console.log(player.music.now)
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

                clearInterval(interval_index);
                //开始播放
                audio.play();
                this.playing = true;
                interval_index = setInterval(listener_rate, 1000);
            },
            pause() {
                audio.pause();
                this.playing = false;
                clearInterval(interval_index);
            },
            toogle() {
                if (this.playing) {
                    this.pause();
                } else {
                    this.play();
                }
            }
        }
    })

})();

