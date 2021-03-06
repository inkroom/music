// 插件位置
//引入插件
import Vue from 'vue';
import { resolve } from 'path';

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
    if (key === './index.js') return;

    let origin = files(key).default;
    console.log(origin);

    console.log(new origin());

    modules[key.replace(/(\.\/|\.js)/g, '')] = new origin();
})



let helpers = {
    contains(music, musics) {
        let m = modules[music.origin];
        for (let i = 0; i < musics.length; i++) {
            if (musics[i].origin != music.origin) {
                continue;
            }
            if (m.equals(music, musics[i])) {
                return true;
            }
        }
        return false;
    },
    equals(target, source) {//此处判断很有问题
        if (target.origin != source.origin) {//不是一个库的直接不等
            return false;
        }
        let m = modules[target.origin];
        return m.equals(target, source);
    },
    getOriginNames() {
        let names = [];
        console.log(modules);

        for (const key in modules) {
            if (modules.hasOwnProperty(key)) {
                const element = modules[key];
                names.push({ name: element.originName, key: key })
            }
        }
        return names;
    },
    search(name, page, pageSize, origin) {
        let m = modules[origin];
        return Promise.resolve(m.search(name, page, pageSize).then(res => {
            res.musics.forEach(e => {
                e.origin = origin;
                e.kid = Math.random();
                e.originName = m.originName;
                e.status = true;
            })
            return res;
        }));
    },

    getMusic(music) {

        return Promise.resolve(modules[music.origin].getMusic(music).then(music => { music.kid = Math.random(); return music; }))
        // return new Promise((resolve,reject)=>{
        //     modules[music.origin].getMusic(music).then()
        // })
        // return  modules[music.origin].getMusic(music);
    },
    //第三个参数为现在有的音乐，进行去重操作
    getMusics(origin, url, musics) {


        let m = modules[origin];
        return Promise.resolve(m.getMusics(url).then(ms => {
            console.log('导入')
            console.log(ms);
            for (let i = ms.length - 1; i >= 0; i--) {
                ms[i].kid = Math.random();
                ms[i].status = true;
                ms[i].origin = origin;
                ms[i].originName = m.originName
                
                for (let j = 0; j < musics.length; j++) {
                    if (m.equals(ms[i], musics[j])) {//重复需要去掉
                        ms.splice(i, 1);
                        break;
                    }
                }
                
            }
            // ms.forEach(e => {
            //     e.status = true;
            //     e.origin = origin;
            //     e.originName = m.originName
            // })
            return ms;
        }));
    }

}



export default helpers;