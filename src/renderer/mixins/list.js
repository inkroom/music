export default {
    methods: {
        play(index) {
            let music = typeof (index) === 'number' ? this.musics[index] : index;
            if (typeof (index) !== 'number') { index = -1; }
            if (music.url && music.url != "") {
                this.index = index;
                console.log(`this.index = ${this.index} index=${index}`)
                console.log(music)
                console.log(this.musics[index])
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
                            console.log(`this.index = ${this.index} index=${index}`)
                            console.log(music)
                            console.log(this.musics[index])
                            this.$eventHub.$emit("musicChange", music);
                        } else {
                            if (typeof (index) === 'number') {
                                let m = Object.assign(Object.assign({}, this.musics[index]), music);
                                m.status = false;
                                this.$store.dispatch("updateMusic", { index, music: m });
                            }
                            this.$message(`${music.name} 不能播放`);
                        }
                    }).catch(err => {
                        this.$message.error('获取数据失败');
                    });
            }
        },
    }
}