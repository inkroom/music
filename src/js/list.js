/**
 * 底部歌曲列表
 */
(function () {


    let fse = require('fs-extra');
    let path = require('path');

    let beans = {};

function writeJSON(){
    fse.writeJSON('../config/list.bat', vue.musics);
}

    let vue = new Vue({
        el: '#list',
        data: {
            musics: [],
            index: -1,
            origins: [

            ],
            imported: false,
            url: '',
            origin: '',
        },
        created() {
            //读取数据
            let _this = this;
            console.log(path.resolve('../config'))
            fse.ensureDirSync('../config');
            fse.ensureFile('../config/list.bat').then(function () {
                fse.readJSON('../config/list.bat', function (err, value) {
                    if (err) throw err;
                    if (value)
                        _this.musics = value;
                    console.log(_this.musics);
                })
            })

        },
        mounted() {
            this.$watch('musics', function (nv, ov) {
               writeJSON();
            })
        },
        methods: {
            random() {

            },
            next() {

            },
            play(index) {

                let music = this.musics[index];
                if (music.url) {
                    control.play(this.musics[index]);
                    this.index = index;
                } else { //直接导入的可能没有url
                    let _this = this;
                    beans[music.origin].index(music, function (music) {
                        if (music) {
                            control.play(music);
                            _this.index = index;
                            //数据更新，写入文件
                            writeJSON();
                        }
                    })
                }
            },
            rm(index) {
                this.musics.splice(index, 1);
            },
            import_music() {

                if (/http(s?):\/\/.+$/.test(this.url) && this.origin != '') {

                    let bean = beans[this.origin];
                    let _this = this;
                    if (bean) {
                        bean.import(this.url, function (musics) {
                            if (musics) {
                                for (var i = 0; i < musics.length; i++) {
                                    musics[i].origin = _this.origin;
                                    for (var j = 0; j < _this.origins.length; j++) {
                                        if (_this.origins[j].key == _this.origin) {
                                            musics[i].originName = _this.origins[j].value;
                                            break;
                                        }
                                    }
                                    _this.musics.push(musics[i]);
                                }
                            }
                            console.log(musics);

                        });


                    }

                }

                // let url = prompt('请输入酷狗歌单地址');


            }
        },
    })

    window.list = {
        next(random,callback) {
            let music = null;
            if (random) {
                if (vue.musics.length == 0) return null;
                let index = Math.floor(Math.random() * vue.musics.length);
                vue.index = index;
                music= vue.musics[index];
            } else {
                index = (index + 1) % vue.musics.length;
                music= vue.musics[index];
            }
            if(music && music.url) return music;
            beans[music.origin].index(music,function(music){
                callback(music);
            }) ;
        },
        add(music) {

            for(var i=0;i<music.length;i++){//避免重复添加
                if(musics[i].origin == music.origin && !beans[music.origin].equals(music,musics[i])){
                    vue.musics.push(music);
                }
            }
        },
        install(key, value, bean) {
            vue.origins.push({
                key: key,
                value
            });
            vue.origin = key;
            beans[key] = bean;

        }
    }



})();