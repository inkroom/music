/**
 * 从酷狗搜索音乐
 */
(function () {
    const axios = require('axios');

    function getQueryString(url, name) {
        // /(\?|&)listid=([^&]*)(&|$|#)/.exec
        var reg = new RegExp("(\\?|&)" + name + "=([^&]*)(&|$|#)");
        var r = url.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function escape2Html(str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    }
    let ku = {
        search(name, page, callback) {

            let pageSize = 15;

            axios.get('https://songsearch.kugou.com/song_search_v2?pagesize=' + pageSize + '&keyword=' + name + '&page=' + page)
                .then(function (res) {
                    console.log(res);
                    res = res.data;
                    if (res.status == 1 && res.error_code == 0) {
                        let result = {
                            pageCount: Math.ceil(res.data.total / pageSize),
                            musics: []
                        }
                        for (var i = 0; i < res.data.lists.length; i++) {
                            let music = {
                                name: escape2Html(res.data.lists[i].SongName),
                                hash: res.data.lists[i].FileHash,
                                total: transTime(res.data.lists[i].Duration),
                                author: res.data.lists[i].SingerName,
                            };
                            result.musics.push(music);
                        }
                        callback(result);
                    } else {
                        callback(null);
                    }
                }).catch(function (error) {
                    console.log(error);
                })
        },
        equals(music1, music2) { //判断两个音频是否相等

            return (music1.hash == music2.hash);

        },
        index(music, callback) {
            console.log(music);
            axios.get('https://wwwapi.kugou.com/yy/index.php', {
                    timeout: 2000,
                    params: {
                        r: 'play/getdata',
                        hash: music.hash
                    }
                })
                .then(function (res) {
                    res = res.data;
                    if (res.status != 1 || res.err_code != 0) {
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
        },
        import(url, callback) {

            axios.get(url).then(function (res) {

                let token = getQueryString(res.request.responseURL, 'token');
                if (token == null) {
                    callback(null);
                    return;
                }
                console.log(res);
                //获取url
                let redirectUrl = 'https://wwwapi.kugou.com/share/zlist.html?listid=' +
                    getQueryString(res.request.responseURL, 'listid') + '&type=' +
                    getQueryString(res.request.responseURL, 'type') + '&uid=' + getQueryString(res.request.responseURL, 'uid') +
                    '&sign=' + getQueryString(res.request.responseURL, 'sign') + '&_t=' + getQueryString(res.request.responseURL, '_t') +
                    '&token=' + token;

                // alert(redirectUrl);
                console.log(redirectUrl);

                axios.get(redirectUrl).then(function (res) {
                    if (res.status === 200) {

                        var lines = res.data.split('\n');
                        for (var i = 0; i < lines.length; i++) {

                            if (lines[i].includes('var dataFromSmarty')) {
                                console.log('lines = ' + lines[i]);
                                //获取json
                                var json = new RegExp(' (\\[.+),//').exec(lines[i])
                                if (json.length == 2) {
                                    json = JSON.parse(json[1]);
                                    console.log(json)
                                    let musics = [];
                                    for (var j = 0; j < json.length; j++) {
                                        let music = {
                                            hash: json[j].hash,
                                            total: transTime(json[j].timelength),
                                            name: escape2Html(json[j].song_name),
                                            author: json[j].author_name
                                        };

                                        musics.push(music);
                                    }
                                    console.log('数据入库')
                                    console.log(musics);
                                    callback(musics);
                                    return;
                                }
                            }
                        }
                        callback(null);
                    }
                })
                callback(null);

            })


        }
    }
    // 注册
    console.log('注册')
    control.install('ku', '酷狗', ku);
})();