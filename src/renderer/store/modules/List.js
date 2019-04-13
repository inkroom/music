
import db from '@/../db';

const state = {
  list: db.get('musics').value()
  //  [{ name: "测试歌曲名", originName: "酷狗", time: "00:00", status: false, id: 1 }]
}

const mutations = {
  removeMusic(state, index) {
    state.list.splice(index, 1);
    db.get('musics').remove({ kid: state.list[index].kid }).write();
  },
  addMusic(state, music) {
    if (!music.kid) music.kid = Math.random();
    state.list.push(music);
    db.get('musics').push(music).write();
  },
  addMusics(state, musics) {
    musics.forEach(element => {
      if (!element.kid) {
        element.kid = Math.random();
      }
      state.list.push(element);
      db.get('musics').push(element).write();
    });
  },
  updateMusic(state, data) {
    console.log(data.music);
    // state.list[data.index] = data.music;//这样修改仿佛没法响应修改
    for (const key in data.music) {
      if (data.music.hasOwnProperty(key)) {
        const element = data.music[key];
        state.list[data.index][key] = element;
      }
    }
    db.set(`musics[${data.index}]`, data.music).write();
  }
}

const getters = {
  list(state) {
    return state.list;
  }
}
const actions = {
  removeMusic({ commit, state }, music) {
    let index = state.list.findIndex(d => d.kid == music.kid);
    if (index != -1) {
      commit('removeMusic', index);
      return Promise.resolve(index);
    }
    return Promise.reject(music);
  },
  addMusics({ commit, state }, musics) {
    //加入数据
    commit('addMusics', musics);
    return Promise.resolve(musics);
  },
  addMusic({ commit }, music) {
    if (!music.kid) {
      music.kid = Math.random();
    }
    commit('addMusic', music);
    return Promise.resolve(music);
  },
  updateMusic({ commit }, data) {
    commit('updateMusic', data);
    return Promise.resolve(data);
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
