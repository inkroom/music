import wangRequest from './163/request'
// const wangRequest = require('./163/request');


export default class Wang {
    constructor() {
        this.originName = '网易云';
    }
    search(name, page, pageSize) {
        return new Promise((resolve, reject) => {
            let params = {
                s: name,
                type: 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
                limit: pageSize,
                offset: page
            }
            let res = wangRequest(
                'POST', `https://music.163.com/weapi/search/get`, params, {
                    crypto: 'weapi'
                }
            ).then((data) => {
                console.log(data);
                data = data.body;
                if (data.code == 200) {

                    if (typeof data.result.songs != 'undefined') {
                        console.log(data.result.songCount)
                        let result = {
                            pageCount: Math.ceil(data.result.songCount / pageSize),
                            // musics: [],
                            page: page,
                            pageSize: pageSize,
                            total: data.result.songCount,
                            // pageCount = parseInt(data.result.songCount / 15),
                            musics: []
                        }
                        result.pageCount = Math.ceil(data.result.songCount / 15);
                        for (var i = 0; i < data.result.songs.length; i++) {
                            let music = {
                                name: data.result.songs[i].name,
                                time: (data.result.songs[i].duration / 1000),
                                id: data.result.songs[i].id,
                                author: data.result.songs[i].artists[0].name,
                                // br: data.result.songs[i].m.br
                            }
                            if (data.result.songs[i].m) {
                                music.br = data.result.songs[i].m.br;
                            }
                            if (data.result.songs[i].album) {
                                music.album = data.result.songs[i].album.id;
                            }
                            result.musics.push(music);
                        }
                        resolve(result);
                    } else {
                        reject(null);
                    }

                } else {
                    reject(null);
                }
            })


        })
    }
    equals(target, source) {
        return target.id == source.id;
    }
    getMusics(url) {
        let id = -1;
        let res = new RegExp('^http://music\\.163\\.com/playlist/([0-9]+)/').exec(url);
        if (res instanceof Array && res.length > 1) {
            id = res[1];
        } else {
            res = new RegExp('^https://music\\.163\\.com/#/playlist\\?id=([0-9]+)').exec(url);
            console.log(res);
            if (res instanceof Array && res.length > 1) {
                id = res[1];
            }
        }
        if (id == -1) {
            return Promise.reject(url);
        }

        const data = {
            id: id,
            n: 100000,
            s: 8
        }

        return Promise.resolve(wangRequest(
            'POST', `https://music.163.com/weapi/v3/playlist/detail`, data,
            { crypto: 'linuxapi' }
        ).then(res => {
            let data = res.body.playlist.tracks;
            let musics = [];

            for (let i = 0; i < data.length; i++) {
                let m = { name: data[i].name, id: data[i].id, time: data[i].dt / 1000 };
                if (data[i].al) {
                    m.cover = data[i].al.picUrl;
                }
                if (data[i].ar && data[i].ar.length > 0) {
                    m.author = data[i].ar[0].name;
                }
                musics.push(m)
            }
            return musics;
        }))
    }
    getMusic(music) {

        return new Promise((resolve, reject) => {
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
            ).then((data) => {
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
                            ).then((data) => {
                                console.log(data);
                                if (data.body.code == 200)
                                    music.cover = data.body.album.picUrl;
                                resolve(music)
                            }).catch((error) => {
                                reject(error)
                            })
                        } else {
                            resolve(music)
                        }
                    } catch (e) {
                        console.log(e);
                        resolve(music)
                    }

                } else {
                    reject()
                }
            }).catch(function (error) {
                console.log(error);
                reject(error)
            })
        })

    }
}