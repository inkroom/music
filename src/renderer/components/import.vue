<template>
  <el-dialog :visible.sync="visible" append-to-body>
    <el-input placeholder="分享的url" v-model="url"></el-input>
    <el-select v-model="origin" placeholder="来源">
      <el-option v-for="(item ,i) in originNames" :key="i" :label="item.name" :value="item.key"></el-option>
    </el-select>
    <el-button type="primary" @click="im">导入</el-button>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      visible: this.show,
      origin: "",
      url: ""
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
    visible(nv, ov) {
      this.$emit("update:show", nv);
    }
  },
  methods: {
    im() {
      if (
        this.origin &&
        /^(https?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
          this.url
        )
      ) {
        this.$helper
          .getMusics(this.origin, this.url, this.$store.state.List.list)
          .then(musics => {
            this.$store.dispatch("addMusics", musics).then(res => {
              this.$message.success(`导入${musics.length}首歌曲`);
            });
          })
          .catch(err => {
            console.log(err);
            console.log("音乐导入失败");
          });
      }
    }
  }
};
</script>
