export default {
    methods: {
        play(index) {

            let music = typeof (index) === 'number' ? this.musics[index] : index;

            if (music.url && music.url != "") {
                this.index = index;
                this.$eventHub.$emit("musicChange", music);
            } else {
                console.log("获取播放url");
                this.$helper
                    .getMusic(Object.assign({}, music))
                    .then(music => {
                        if (music.url && music.url !== "") {
                            this.index = index;
                            if (typeof (index) === 'number')
                                this.$store.dispatch("updateMusic", { index, music });
                            this.$eventHub.$emit("musicChange", music);
                        } else {
                            if (typeof (index) === 'number') {
                                let m = Object.assign({ status: false }, this.musics[index]);
                                m.status = false;
                                this.$store.dispatch("updateMusic", { index, music: m });
                            }
                            this.$message(`${music.name} 不能播放`);
                        }
                    }).catch(err=>{
                        this.$message.error('获取数据失败');
                    });
            }
        },
    }
}