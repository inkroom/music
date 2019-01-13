/**
 * 从酷狗搜索音乐
 */
// (function () {
const axios = require('axios');


let ku = {
    search(name, page, callback) {
        axios.get('https://songsearch.kugou.com/song_search_v2?pagesize=15&keyword=' + name + '&page=' + page)
            .then(function (res) {
                console.log(res);
                res = res.data;
                if (res.status == 1 && res.error_code == 0) {
                    let musics = [];
                    for (var i = 0; i < res.data.lists.length; i++) {
                        let music = {
                            name: res.data.lists[i].SongName,
                            hash: res.data.lists[i].FileHash,
                            time: transTime(res.data.lists[i].Duration),
                        };
                        musics.push(music);
                    }
                    callback(musics);
                } else {
                    callback(null);
                }
            }).catch(function (error) {
                console.log(error);
            })
    },
    index(music, callback) {
        console.log(music);
        axios.get('https://wwwapi.kugou.com/yy/index.php',
            { timeout: 2000, params: { r: 'play/getdata', hash: music.hash } })
            .then(function (res) {
                res = res.data;
                if (res.status != 1 || res.error_code != 0) {
                    callback(null);
                }
                music.cover = res.data.img;
                music.url = res.data.play_url;
                console.log(music);
                callback(music);
            }).catch(function (error) {
                console.log(error);
                callback(null);
            })
    }
}
// 注册
search.install('ku', '酷狗', ku);
// })();


