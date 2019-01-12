/**
 * 从酷狗搜索音乐
 */
(function () {
    let https = require('https');
    // var result = request.get.sync('http://www.baidu.com');
    // console.log(result);
    const axios = require('axios');


    let ku = {
        search(title, page, callback) {
            console.log('发送请求' + title + ',page=' + page)
            axios.get('https://songsearch.kugou.com/song_search_v2?pagesize=15&keyword=' + title + '&page=' + page)
                .then(function (res) {
                    console.log(res);
                    res = res.data;
                    if (res.status == 1 && res.error_code == 0) {
                        let musics = [];
                        for (var i = 0; i < res.data.lists.length; i++) {
                            let music = {
                                title: res.data.lists[i].SongName,
                                hash: res.data.lists[i].FileHash,
                                time: transTime(res.data.lists[i].SQDuration),
                                origin: '酷狗'
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
            console.log('发送请求')
            axios.get('https://wwwapi.kugou.com/yy/index.php',
                { timeout: 2000, params: { r: 'play/getdata', hash: music.hash } })
                .then(function (res) {
                    res = res.data;
                    if (res.status != 1 || res.error_code != 0)
                        callback(null);
                    let music = {
                        cover: res.data.img,
                        url: res.data.play_url,
                        time: transTime(res.data.timelength / 1000),
                        title: music.title,
                        origin: '酷狗'
                    }
                    callback(music);
                }).catch(function (error) {
                    console.log(error);
                    callback(null);
                })
        }
    }

    search.install('ku', '酷狗', ku);
})();
