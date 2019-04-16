<template >
  <div id="player">
    <div class="cover left">
      <img :src="music.cover" alt @click="dev">
    </div>
    <div class="right">
      <div class="text-ellipsis">
        <marquee v-if="music.url!=''">
          <span :title="title">{{ title }}</span>
        </marquee>
        <span :title="title" v-else>{{ title }}</span>
      </div>
      <div class="controller">
        <span>
          <i class="iconfont icon-prev" @click="prev"></i>
        </span>
        <span v-if="!playing">
          <i class="iconfont icon-play" @click="playOrPause"></i>
        </span>
        <span v-else>
          <i class="iconfont icon-pause" @click="playOrPause"></i>
        </span>
        <span>
          <i class="iconfont icon-next" @click="next"></i>
        </span>
        <span>
          <i class="iconfont icon-random" @click="nextable=!nextable"></i>
        </span>
        <span style="position:relative">
          <!-- <el-slider
            v-model="volume"
            vertical
            height="100px"
            :show-tooltip="false"
          ></el-slider>-->
          <i class="iconfont icon-volume"></i>
        </span>
      </div>
      <div class="process-bar">
        <div class="bar">
          <el-slider
            v-model="process"
            :show-tooltip="false"
            ref="slider"
            @change="seek"
            :disabled="music.url==''"
          ></el-slider>
        </div>
        <span class="time">{{ music.current | humanTime }}/{{ music.time | humanTime }}</span>
      </div>
    </div>
    <audio
      :src="music.url"
      @error="playerError"
      style="display:none;"
      ref="audio"
      autoplay
      @playing="playingEvent"
      @pause="playing = false"
      @timeupdate="timeupdate"
      @ended="playEnd"
      @emptied="playerEmptied"
      @progress="playerProgress"
    ></audio>
  </div>
</template>
<script >
export default {
  data() {
    return {
      process: 0,
      now: 0,
      volume: 50, //音量
      playing: false,
      drag: false,
      nextable: true, //是否继续播放
      music: {
        name: "歌曲名",
        cover:
          "https://image-1252774288.cos.ap-chengdu.myqcloud.com/album/%E4%BA%8C%E6%AC%A1%E5%85%83/c391e135-d833-47d6-9992-e55c49694d94.jpg",
        url: "",
        time: 0,
        currentTime: 0
      }
    };
  },
  computed: {
    title() {
      if (this.music.author) {
        return `${this.music.name} - ${this.music.author}`;
      }
      return this.music.name;
    },
    audio() {
      return this.$refs.audio;
    }
  },
  created() {
    //注册播放音乐改变事件，该事件可能来自于列表项点击，自动切换，搜索列表
    this.$eventHub.$on("musicChange", music => {
      this.music = Object.assign({ currentTime: 0 }, music);
      console.log("接收到播放请求");
    });
  },
  watch: {
    volume(nv) {
      this.audio.volume = nv / 100;
    }
  },
  methods: {
    prev() {},
    next() {
      //下一曲，传递当前音乐，避免重复播放
      this.$eventHub.$emit("next", this.music);
    },
    playerEmptied() {
      // this.$message.error('播放中断');
    },
    playerProgress() {
      //正在缓冲
    },
    playingEvent() {
      this.music.time = this.audio.duration;
      this.music.current = this.audio.currentTime;
      this.audio.during;
      this.playing = true;
      this.audio.volume = this.volume / 100;

      // if (!this.music.status) {
      //   this.music.status = true;
      //   this.$store.dispatch("updateMusic", music);
      // }
    },
    playEnd() {
      this.playing = false;

      //广播播放结束事件
      this.$eventHub.$emit("playEnd", this.music);

      if (this.nextable) {
        this.next();
      }
    },
    clearDrag() {
      this.drag = false;
      // document.removeEventListener("mouseup", this.clearDrag);
    },
    timeupdate() {
      var currentTime = this.audio.currentTime;
      var duration = this.audio.duration;

      this.process = (currentTime / duration) * 100;

      this.music.current = currentTime;

      // player.music.now = transTime(currentTime);
      // player.music.total = transTime(duration);
      // player.music.rate = 50;
      // player.music.rate = (currentTime / duration) * 100;
    },
    playOrPause() {
      if (this.music.url)
        if (this.playing) {
          this.audio.pause();
        } else {
          this.audio.play();
        }
    },
    playerError() {
      if (this.music.url !== "") {
        this.$message.error(`${this.music.name}无法播放，可能是版权受限`);
        //广播无法播放事件
        this.$eventHub.$emit("playError", this.music);

        if (this.nextable) {
          this.next();
        }
      }
    },
    seek(process) {
      if (this.audio.fastSeek)
        this.audio.fastSeek((this.audio.duration * process) / 100);
      else {
        console.log(this.audio.duration);
        this.audio.currentTime = this.audio.duration * (process / 100);
        console.log(this.audio.currentTime);
        this.audio.play(); //暂停的情况下必须调用才能继续播放，播放中调用该方法无影响
      }
    },
    dev(){
      this.$electron.remote.getCurrentWindow().webContents.openDevTools();
    }
  }
};
</script>

<style lang="scss">
$cover-max-width: 80px;

$time-width: 100px;

$name-height: 24px;

.two-col-container {
  .left {
    float: left;
    width: $cover-max-width;
  }
  .right {
    padding-left: $cover-max-width + 15px;
  }
}

#player {
  .right > div:first-child {
    height: $name-height;
    line-height: $name-height;
    visibility: middle;
  }
  .cover {
    vertical-align: top;
    height: inherit;
    overflow: hidden;
    max-width: $cover-max-width;
    vertical-align: middle;
    text-align: center;
    > img {
      height: $cover-max-width;
      // width: $cover-max-width;
    }
  }
  .controller {
    word-spacing: -6px; /*解决空白导致的占宽*/
    > span {
      text-align: center;
      word-spacing: 0;
      display: inline-block;
      width: 20%;
      box-sizing: border-box;
      > i {
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
  .process-bar {
    .bar {
      margin-right: -$time-width + 5px;
      float: left;
      width: 100%;
      vertical-align: bottom;
      > .el-slider {
        vertical-align: bottom;
        margin-right: $time-width + 5px;
      }
    }
    .time {
      width: $time-width;
      // margin-left: 5px;
      // display: block;
      // float: right;
      height: 38px;
      line-height: 38px;
    }
  }
}

// .el-header {
//   width: 100%;
//   height: $title-height;
//   position: fixed;
//   opacity: 1;
// }
.el-main {
  // margin-top: $title-height !important;
  // padding-top:0 !important;
}
</style>

