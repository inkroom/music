
import axios from 'axios';
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
export default class Ku {
    constructor() {
        this.originName = '酷狗';
    }
    search(name, page,pageSize) {

        return new Promise((resolve, reject) => {
            // let pageSize = 15;

            axios.get('https://songsearch.kugou.com/song_search_v2?pagesize=' + pageSize + '&keyword=' + name + '&page=' + page)
                .then(function (res) {
                    console.log(res);
                    res = res.data;
                    if (res.status == 1 && res.error_code == 0) {
                        let result = {
                            pageCount: Math.ceil(res.data.total / pageSize),
                            musics: [],
                            page: res.data.page,
                            pageSize: res.data.pageSize,
                            total: res.data.total
                        }
                        for (var i = 0; i < res.data.lists.length; i++) {
                            let music = {
                                name: escape2Html(res.data.lists[i].SongName),
                                hash: res.data.lists[i].FileHash,
                                // total: transTime(res.data.lists[i].Duration),
                                time: res.data.lists[i].Duration,
                                author: res.data.lists[i].SingerName,
                            };
                            result.musics.push(music);
                        }
                        resolve(result)
                    } else {
                        reject();
                    }
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                })
        })

    }
    getMusic(music) {

        return new Promise((resolve, reject) => {
            axios.get('https://wwwapi.kugou.com/yy/index.php', {
                timeout: 2000,
                params: {
                    r: 'play/getdata',
                    hash: music.hash
                }
            })
                .then((res) => {
                    res = res.data;
                    if (res.status != 1 || res.err_code != 0) {
                        reject(null);
                    }
                    music.cover = res.data.img;
                    music.url = res.data.play_url;
                    music.time = res.data.timelength / 1000;

                    console.log(res.data);
                    console.log(music);
                    resolve(music);
                }).catch((error) => {
                    reject(error);
                })
        })

    }

    equals(target, source) {
        return target.hash === source.hash;
    }

    getMusics(url) {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {

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
                                            time: parseInt((json[j].timelength) / 1000),
                                            name: escape2Html(json[j].song_name),
                                            author: json[j].author_name
                                        };

                                        console.log(music);
                                        musics.push(music);
                                    }
                                    console.log('数据入库')
                                    console.log(musics);
                                    resolve(musics);
                                    return;
                                }
                            }
                        }
                        reject(null);
                    }
                }).catch(err => {
                    reject(err);
                })
            })
        })
    }
}