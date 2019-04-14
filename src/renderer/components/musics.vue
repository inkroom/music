<template>
  <div style="height:100%" id="k-music-list-container">
    <p style="padding:5px;">
      共 {{ musicsSize }} 首
      <span style="float:right;margin-right:20px;">
        <i class="iconfont icon-search" @click="dialog.search.visible=true"></i>
        <i class="iconfont icon-download"></i>
        <i class="iconfont icon-import" @click="dialog.import.visible=true"></i>
      </span>
    </p>
    <el-scrollbar style="height:100%;">
      <ul class="k-m-list" ref="list">
        <li v-for="(m,i) in musics" :key="i" class="text-ellipsis" :id="'k-musics-'+i">
          {{ i+1 }} .
          <el-tag
            closable
            :disable-transitions="false"
            @close="statusClear(i)"
            v-if="!m.status"
            type="warning"
            size="mini"
          >error</el-tag>
          <!-- <span v-if="!m.status" class="el-badge__content el-badge__content--undefined">error</span> -->

          <span style="float:right">
            <span>{{ m.originName }}</span>
            <span>{{ m.time | humanTime}}</span>
            <span>
              <i class="el-icon-delete" @click="remove(m)"></i>
            </span>
          </span>
          <span v-if="index==i">
            <i class="iconfont icon-hand-pointing-right"></i>
          </span>
          <span
            class="name"
            @click="play(i)"
            :title="m.name +' - '+m.author"
          >{{ m.name }} - {{m.author}}</span>
        </li>
      </ul>
      <i class="iconfont icon-location-searching" @click="location"></i>
    </el-scrollbar>
    <search :show.sync="dialog.search.visible"></search>
    <import :show.sync="dialog.import.visible"></import>
  </div>
</template>
<script>
import origin from "../mixins/origin";
import Import from "./import";
import Search from "./search";

import mixins from "@/mixins/list";

export default {
  //   mixins: { origin },
  components: { Import, Search },
  mixins: [mixins],
  computed: {
    musics: {
      get() {
        //将数组倒序输出，使后添加的在前方
        return this.$store.state.List.list.slice().reverse();
        // return this.$store.state.List.list;
      }
    },
    musicsSize() {
      // return  this.$store.state.List.list.slice().reverse();
      return this.$store.state.List.list.length;
    },
    originNames() {
      return this.$helper.getOriginNames();
    }
  },
  data() {
    console.log("data");
    console.log(this.$store.state);
    return {
      dialog: {
        import: { visible: false },
        search: { visible: false }
      },
      mode: {
        random: true
      },
      index: -1
    };
  },
  watch: {
    index(nv, ov) {
      console.log(`index nv=${nv} ov=${ov}`);
    }
  },
  created() {
    this.$eventHub.$on("next", this.next);
    this.$eventHub.$on("prev", music => {});
    this.$eventHub.$on("playError", music => {
      console.log(`${music.name} play error`);
      //查找index
      let index = this.musics.findIndex(d => d.kid === music.kid);
      console.log('error index ='+index);
      if (index != -1) {
        music.status = false;
        this.$store.dispatch("updateMusic", {
          index: this.musicsSize - 1 - index,
          music
        });
      }
    });

    this.$eventHub.$on("playEnd", music => {
      this.index = -1;
    });
  },
  methods: {
    next(music) {
      if (this.mode.random) {
        if (this.musics.length == 0) {
          return;
        }
        if (this.musics.length === 1) {
          this.play(0);
          return;
        }
        let next = Math.floor(Math.random() * this.musics.length);
        console.log(`next = ${next}`);

        if (!this.$helper.equals(music, this.musics[next])) {
          this.play(next);
          // this.$eventHub.$emit('musicChange',next);
        } else {
          console.log(`递归 next = ${next}`);
          console.log(music);
          console.log(this.musics[next]);
          //重复则递归生成，歌曲数量够的话是不会递归过深的
          this.next(music);
        }
      }
    },
    remove(value) {
      console.log(value);
      this.$store
        .dispatch("removeMusic", Object.assign({}, value))
        .then(res => {})
        .catch(err => {
          console.log("删除失败");
        });
    },
    statusClear(index) {
      let music = Object.assign({}, this.musics[index]);
      music.status = true;
      this.$store.dispatch("updateMusic", {
        index: this.musicsSize - 1 - index,
        music
      });
    },
    location() {
      function getStyle(obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr];
        } else {
          return document.defaultView.getComputedStyle(obj, null)[attr];
        }
      }

      function getMargin(obj) {
        let margin = getStyle(obj, "marginTop");
        if (margin !== "" && margin.indexOf("px") != -1) {
          margin = /^([0-9]+)/.exec(margin)[1];
        } else {
          margin = 0;
        }
        let marginBottom = getStyle(obj, "marginBottom");
        if (margin !== "" && margin.indexOf("px") != -1) {
          margin += /^([0-9]+)/.exec(margin)[1];
        } else {
          margin = 0;
        }
        return margin;
      }
      if (this.index !== -1) {
        //使用hash实现定位
        location.hash = "k-musics-" + this.index;
        location.hash = "";

        // let margin = getStyle(this.$refs.list.children[0], "marginTop");
        // if (margin !== "" && margin.indexOf("px") != -1) {
        //   margin = /^([0-9]+)/.exec(margin)[1];
        // } else {
        //   margin = 0;
        // }

        // console.log(
        //   `margin = ${margin} offsetTop=${
        //     this.$refs.list.children[this.index].offsetTop
        //   } 要设置的=${this.$refs.list.children[this.index].offsetTop -
        //     margin * (this.index + 1)} height=${
        //     this.$refs.list.children[0].offsetHeight
        //   }`
        // );

        //使用高度累加

        // let top = 0;
        // for (let i = 0; i < this.index; i++) {
        //   top += this.$refs.list.children[i].offsetHeight;
        //   top += getMargin(this.$refs.list.children[i]);
        // }

        // console.log(`累计高度=${top} 现有top=${this.$refs.list.parentNode.parentNode.scrollTop}`);
        // this.$refs.list.parentNode.parentNode.scrollTop =
        //   this.$refs.list.children[this.index].offsetTop -
        //   margin * (this.index + 1) +
        //   15 *(this.index + 1) ;
      }
    }
  }
};
</script>
<style lang="scss">
$name-height: 24px;
$li-margin-vertical: 10px;

$bar-padding-height: $name-height + $li-margin-vertical * 2;

#k-music-list-container {
  padding-bottom: 30px;
  box-sizing: border-box;

  .icon-location-searching {
    cursor: pointer;

    font-size: 25px;
    position: fixed;
    bottom: 30px;
    right: 50px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .el-scrollbar .is-vertical {
    // box-sizing: border-box;
    // padding-bottom: $bar-padding-height;
  }
  .iconfont {
    cursor: pointer;
    margin-right: 15px;
    font-size: 20px;
  }
}

.k-m-list {
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: $bar-padding-height;
  box-sizing: border-box;
  ul,
  li {
    list-style-type: none;
    margin: $li-margin-vertical 3px;

    user-select: text;
  }
  i {
    cursor: pointer;
  }
  .icon-hand-pointing-right {
    color: rgb(218, 97, 97);
    font-size: 20px;
    margin-right: 3px !important;
  }
  .name {
    line-height: $name-height;
    height: $name-height;
    cursor: pointer;
    user-select: text;
  }
  .name:hover {
    text-decoration: underline;
  }
}
</style>
