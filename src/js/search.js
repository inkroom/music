/**
 * 搜索模块
 */
(function () {

    window.search = new Vue({
        el: '#search',
        data: {
            show: false,
            origin: 'ku',
            name: "",
            result: [],
            origins: [],
            bean: {

            },
            page: {
                now: -1,
                count: -1
            },
            scroll: 1
        },
        watch: {
            show(nv, ov) {
                if (nv) {
                    this.scroll += 1;
                    let _this = this;
                    setTimeout(function () {
                        _this.$el.getElementsByTagName('input')[0].focus();
                    }, 50)
                }
            }
        },
        mounted() {
            // let _this = this;
            // this.$watch('show', function (nv, ov) {

            // })

        },
        methods: {
            // show() { }
            search(now) {
                if (this.name !== '' && this.origin != '') {
                    let bean = this.bean[this.origin];
                    if (bean) {
                        let _this = this;
                        _this.$layer.loading();
                        now = now || 1;
                        bean.search(this.name, now, function (result) {

                            console.log(result);
                            _this.$layer.close();
                            if (result == null) { //请求错误
                                _this.$layer.msg('请求错误');
                            } else {
                                let musics = result.musics;
                                for (var i = 0; i < musics.length; i++) {
                                    musics[i].origin = _this.origin;
                                    musics[i].playable = true;
                                    for (var j = 0; j < _this.origins.length; j++) {
                                        if (_this.origins[j].key == musics[i].origin) {
                                            musics[i].originName = _this.origins[j].value;
                                            break;
                                        }
                                    }
                                }
                                _this.page.count = result.pageCount;
                                _this.page.now = now;
                                _this.result = musics
                            }
                        });
                    } else { //没有对应的值
                        _this.$layer.msg('没有对应的插件');
                    }
                }
            },
            play(index) {

                // console.log(this.result);
                let music = this.result[index];

                // console.log(index);
                // console.log(music);
                if (music.url) {
                    control.play(music);
                } else { //查询对应url
                    //获取对应的bean
                    if (this.bean[music.origin]) {
                        let _this = this;
                        this.bean[music.origin].index(music, function (n_music) {
                            console.log(n_music);
                            if (n_music == null) { //请求错误
                                _this.$layer.msg('请求错误');
                            } else {
                                n_music.playable = true;
                                _this.result[index] = n_music
                                control.play(n_music);
                            }
                        });
                    } else { //没有对应的值
                        _this.$layer.msg('没有对应的插件');
                    }

                }
            },
            add(index) {
                let music = this.result[index];
                //获取对应的bean
                if (this.bean[music.origin]) {
                    let _this = this;
                    this.bean[music.origin].index(music, function (n_music) {
                        console.log(n_music);
                        if (n_music == null) { //请求错误
                            _this.$layer.msg('请求错误');
                        } else {
                            _this.result[index] = n_music
                            control.add(n_music);
                        }
                    });
                } else { //没有对应的值
                    _this.$layer.msg('没有对应的插件');
                }
            },
            install(key, value, bean) { //加载对应的库,每个音乐源js文件都需要调用该方法注册
                this.bean[key] = bean;
                this.origins.push({
                    key: key,
                    value: value
                })
            }

        }
    })
})();