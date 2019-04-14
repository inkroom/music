<template>
  <el-dialog :visible.sync="visible" width="100%" append-to-body>
    <el-container>
      <el-header>
        <div style="text-align:center">
          <div style="display:inline-block">
            <el-input placeholder="歌曲名" v-model="name" @keydown.enter.native="search"></el-input>
          </div>
          <el-select v-model="origin" placeholder="来源" @change="search">
            <el-option
              v-for="(item ,i) in originNames"
              :key="i"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar style="max-height:80%;">
          <ul class="k-m-list" ref="list">
            <li v-for="(m,i) in musics" :key="i" class="text-ellipsis">
              {{ i+1 }} .
              <!-- <span
            v-if="!m.status"
            class="el-badge__content el-badge__content--undefined"
              >error</span>-->

              <span style="float:right">
                <span>{{ m.originName }}</span>
                <span>{{ m.time | humanTime}}</span>
                <span>
                  <i class="iconfont icon-plus" @click="add(i)"></i>
                  <!-- <i class="el-icon-delete" @click="remove(m)"></i> -->
                </span>
              </span>
              <span
                class="name"
                @click="play(m)"
                :title="m.name +' - '+m.author"
              >{{ m.name }} - {{m.author}}</span>
            </li>
          </ul>
        </el-scrollbar>
      </el-main>
      <el-footer style="text-align:center">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="search"
        ></el-pagination>
      </el-footer>
    </el-container>

    <div style="text-align:center"></div>
  </el-dialog>
</template>

<script>
import mixins from "@/mixins/list";

export default {
  mixins: [mixins],
  props: {
    show: Boolean
  },
  data() {
    return {
      visible: this.show,
      name: "",
      origin: "",
      page: 1,
      pageSize: 15,
      total: 0, //总记录数
      musics: []
    };
  },
  computed: {
    originNames() {
      return this.$helper.getOriginNames();
    }
  },
  watch: {
    show(nv) {
      this.visible = nv;
    },
    visible(nv) {
      this.$emit("update:show", nv);
    }
  },
  methods: {
    search(page) {
      if (typeof page === "number") {
        this.page = page;
      }
      if (this.name !== "" && this.origin !== "") {
        this.$helper
          .search(this.name, this.page, this.pageSize, this.origin)
          .then(res => {
            this.pageSize = res.pageSize;
            this.page = res.page;
            this.total = res.total;
            this.musics = res.musics;
          }).catch(err=>{
              if(err==null){
                  this.$message.error('找不到指定歌曲')
              }
          });
      }
    },
    add(index) {
      if (
        !this.$helper.contains(this.musics[index], this.$store.state.List.list)
      ) {
        this.$store.dispatch("addMusic", this.musics[index]).then(() => {
          this.$message.success("添加成功");
        });
      } else {
        this.$message("已有该歌曲");
      }
    }
  }
};
</script>

<style lang="scss">
</style>

<style lang="scss">
.el-dialog__body {
  // max-height: 300px;
}
</style>
