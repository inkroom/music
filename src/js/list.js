/**
 * 底部歌曲列表
 */
(function () {


    let vue = new Vue({
        el: '#list',
        data: {
            musics: [],
            index: -1
        },
        methods: {
            random() {

            },
            next() {

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