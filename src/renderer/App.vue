<template>
  <div id="app">
    <div class="header-title">
      <!-- <img src="static/img/k.png" style alt="k-redis" @click="()=>$refs.bg.showSetBg()"> -->
      <span class="title">{{ title }}</span>
      <span class="controller-bar-group">
        <i class="el-icon-minus" @click="$electron.remote.getCurrentWindow().minimize()"></i>
        <i class="el-icon-close" @click="$electron.remote.app.quit()"></i>
      </span>
    </div>
    <div class="content-main">
      <entry></entry>
    </div>
  </div>
</template>

<script >
import Entry from "./components/entry";
export default {
  name: "music",
  components: {
    Entry
  },
  data() {
    return {
      title: this.$electron.remote.getCurrentWindow().getTitle()
    };
  }
};
</script>

<style lang="scss">
/* CSS */
* {
  user-select: none;
  cursor: default;
}
$title-bar-height: 35px;

.header-title {
  height: $title-bar-height;
  line-height: $title-bar-height;
  padding-left: 15px;
  border-bottom: 1px solid rgb(121, 121, 133);
  -webkit-app-region: drag;
  .controller-bar-group {
    float: right;

    > i {
      cursor: pointer;
      width: 40px;
      text-align: center;
      line-height: inherit;

      -webkit-app-region: no-drag;
    }
    > i:hover {
      background-color: rgb(121, 121, 133);
    }
  }
}
#app {
  height: 100%;
}
.content-main {
  height: 100%;
}
</style>
