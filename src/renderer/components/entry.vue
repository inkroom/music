<template>
  <div style="position:relative;height:100%">
    <div class="header title two-col-container">
      <player></player>
    </div>
    <div class="main">
      <!-- <el-scrollbar style="height:100%"> -->
        <musics></musics>
      <!-- </el-scrollbar> -->
    </div>
  </div>

  <!-- <el-container>
    <el-header class="title two-col-container">
      <player></player>
    </el-header>
    <el-main>
      <list></list>
    </el-main>
  </el-container>-->
</template>
<script>
import Player from "./player";
import Musics from "./musics";
export default {
  components: { Player, Musics },
  data() {
    return {
      process: 39
    };
  },
  methods: {}
};
</script>


<style lang="scss" >
$title-height: 90px;

* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title{
   height: $title-height ;
}

.main {
  position: absolute;
  width: 100%;
  top: $title-height;
  bottom: 0;
  overflow: hidden;
}
</style>
