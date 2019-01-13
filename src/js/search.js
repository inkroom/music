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

            }
        },
        mounted() {
        },
        methods: {
            // show() { }
            search() {
                if (this.name !== '' && this.origin != '') {
                    let bean = this.bean[this.origin];
                    if (bean) {
                        let _this = this;
                        bean.search(this.name, 1, function (musics) {
                            console.log(musics);
                            if (musics == null) {//请求错误

                            } else {
                                for (var i = 0; i < musics.length; i++) {
                                    musics[i].origin = _this.origin;
                                    for (var j = 0; j < _this.origins.length; j++) {
                                        if (_this.origins[j].key == musics[i].origin) {
                                            musics[i].originName = _this.origins[j].value;
                                            break;
                                        }
                                    }

                                }
                                _this.result = musics
                            }
                        });
                    } else {//没有对应的值

                    }
                }
            },
            play(index) {

                console.log(this.result);
                let music = this.result[index];

                console.log(index);
                console.log(music);
                if (music.url) {
                    control.play(music);
                } else {//查询对应url
                    //获取对应的bean
                    if (this.bean[music.origin]) {
                        let _this = this;
                        this.bean[music.origin].index(music, function (n_music) {
                            console.log(n_music);
                            if (n_music == null) {//请求错误

                            } else {
                                _this.result[index] = n_music
                                control.play(n_music);
                            }
                        });
                    } else {//没有对应的值

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
                        if (n_music == null) {//请求错误

                        } else {
                            _this.result[index] = n_music
                            control.add(n_music);
                        }
                    });
                } else {//没有对应的值

                }
            },
            install(key, value, bean) {//加载对应的库,每个音乐源js文件都需要调用该方法注册
                this.bean[key] = bean;
                this.origins.push({ key: key, value: value })
            }

        }
    })
})();
