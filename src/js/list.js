/**
 * 底部歌曲列表
 */
(function () {


    let fse = require('fs-extra');
    let path=require('path');
    let vue = new Vue({
        el: '#list',
        data: {
            musics: [],
            index: -1
        },
        created(){
            //读取数据
            let _this = this;
            console.log(path.resolve('../config'))
            fse.ensureDirSync('../config');
            fse.ensureFile('../config/list.bat').then(function(){
               fse.readJSON('../config/list.bat',function(err,value){
                    if(err) throw err;
                    if(value)
                        _this.musics = value;
                    console.log(_this.musics);
               })
            })
           
        },
        mounted(){
            this.$watch('musics',function(nv,ov){
                fse.writeJSON('../config/list.bat',nv);
            })
        },
        methods: {
            random() {

            },
            next() {

            },
            play(index) {
                control.play(this.musics[index]);
                this.index = index;
            },
            rm(index){
                this.musics.splice(index,1);
            }
        },
    })

    window.list = {
        next(random) {
            if (random) {
                if (vue.musics.length == 0) return null;
                let index = Math.floor(Math.random() * vue.musics.length);
                vue.index = index;
                return vue.musics[index];
            } else {
                index = (index + 1) % vue.musics.length;
                return vue.musics[index];
            }
        },
        add(music) {
            vue.musics.push(music);
        }
    }



})();