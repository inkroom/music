/**
 * 网易云音乐接口
 */
(function () {

    const wangRequest = require('./163/163_request');

    let wang = {
        search(title, page, callback) {

            const data = {
                s: title,
                type: 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
                limit: 15,
                offset: page
            }
            let res = wangRequest(
                'POST', `https://music.163.com/weapi/search/get`, data, {
                    crypto: 'weapi'
                }
            ).then(function (data) {
                console.log(data);
                data = data.body;
                if (data.code == 200) {

                    let musics = [];
                    for (var i = 0; i < data.result.songs.length; i++) {

                        let music = {
                            name: data.result.songs[i].name,
                            time: transTime(data.result.songs[i].duration / 1000),
                            id: data.result.songs[i].id,
                            author: data.result.songs[i].atrist.name,
                            // br: data.result.songs[i].m.br
                        }
                        if (data.result.songs[i].m) {
                            music.br = data.result.songs[i].m.br;
                        }
                        if (data.result.songs[i].album) {
                            music.album = data.result.songs[i].album.id;
                        }

                        musics.push(music);

                    }
                    callback(musics);
                } else {
                    callback(null);
                }
            })
            callback(null);
        },
        equals(music1, music2) {
            return music1.id == music2.id;
        },
        index(music, callback) {
            // https://music.163.com/weapi/v3/song/detail
            const data = {
                br: parseInt(music.br || 999000),
                ids: JSON.stringify([music.id])
            }
            console.log(data);

            let res = wangRequest(
                'POST', `https://music.163.com/weapi/song/enhance/player/url`, data, {
                    crypto: 'weapi'
                }
            ).then(function (data) {
                console.log(data);
                data = data.body;
                if (data.code == 200) {
                    try {
                        music.url = data.data[0].url;
                        console.log(music);
                        if (music.album) {
                            //获取封面
                            wangRequest(
                                'POST', `https://music.163.com/weapi/v1/album/${music.album}`, {}, {
                                    crypto: 'weapi'
                                }
                            ).then(function (data) {
                                console.log(data);
                                if (data.body.code == 200)
                                    music.cover = data.body.album.picUrl;
                                callback(music);
                            }).catch(function (error) {
                                console.log(error);
                                callback(music);
                            })
                        } else {
                            callback(music);
                        }
                    } catch (e) {
                        console.log(e);
                        callback(music);
                    }

                } else {
                    callback(null);
                }
            }).catch(function (error) {
                console.log(error);
                callback(null);
            })
            callback(null);
        }
    }
    control.install('163', '网易云', wang);
})();