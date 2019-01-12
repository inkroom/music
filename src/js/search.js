/**
 * 搜索模块
 */
(function () {

    window.search = new Vue({
        el: '#search',
        data: {
            show: false,
            origin: 'ku',
            title: "",
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
                if (this.title !== '' && this.origin != '') {
                    if (this.bean[this.origin]) {
                        let _this = this;
                        this.bean[this.origin].search(this.title, 1, function (musics) {
                            console.log(musics);
                            if (musics == null) {//请求错误

                            } else {
                                _this.result = musics
                            }
                        });
                    } else {//没有对应的值

                    }
                }
            },
            play(index) {
                control.play(this.result[index], function (music) {
                    if (music == null) {
                        control.play(music)
                    } else {
                        //请求错误
                    }

                });
            },
            add(index) {
                control.add(this.result[index]);
            },
            install(key, value, bean) {//加载对应的库
                this.bean[key] = bean;
                this.origins.push({ key: key, value: value })
            }

        }
    })



})();
