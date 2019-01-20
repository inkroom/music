
# music

### 基于electron的音乐播放器

鉴于我听得歌无法在一个音乐平台上找齐，目前在网易云音乐和酷狗音乐找都有。。

*** 

由于酷狗音乐没有linux版本，因此开发一个跨平台的音乐播放器，音乐源来自网易云音乐以及酷狗音乐（可以考虑实现插件功能添加多个音乐来源）


后续可能还会使用flutter之类的做一个app。

就这样


### 依赖

- [vue](https://github.com/vuejs/vue)
- vue滚动条插件：[ink-vue-scroll](https://github.com/inkroom/ink-vue-scroll)
- vue弹出层插件:[ink-layer](https://github.com/inkroom/vue-layer)

### 构建步骤

**目前使用的是联网版本，必须联网才能听歌**

建议使用vscode，并且安装less easy插件，自动编译less文件

``` bash
    git clone https://github.com/inkroom/music.git
    cd music
    ## 开发者模式
    npm run dev-server ##这会启动一个http server
    npm run dev

    ## 生产模式
    npm run proc
```

### 音乐源js规范

- js文件存储在plugins目录，入口文件直接放plugins根目录，依赖文件建立文件夹存放
- 使用node.js 写法，不用导出模块
- 必须调用search.install(key,value,bean)方法注册
    - key，每一个插件唯一的key，自定义
    - value，插件名字，显示在搜索下拉框以及音乐来源的文字，如酷狗
    - bean，object对象，有search(name,page,callback)和index(music,callback)方法，出错直接回调传递null
        - search方法
            > search(name:string,page:interge,callback:function(music?))
        - index 
            > index(music?,callback:function(music?))
        - import
            > import(url:string,callback:function(musics))
        
### features

- [ ] 网易云导入歌单
- [x] 点击进度条调整进度  
- [ ] 音量调节
- [ ] 播放模式 - 是否开启随机播放
- [ ] 是否自动下一曲
- [x] 优化滚动条UI
- [ ] 歌词（待定）
- [ ] 更友好的黑色主题(这个实在不擅长啊)
- [x] toast & loading
- [x] 在歌曲列表中高亮当前播放歌曲
- [ ] 搜索列表分页
- [x] 对于版权受限歌曲添加徽章提示


### change log

#### 2018-1-19

- 完成toast & loading
- 修改歌曲添加为头部添加
- 添加列表高亮
- 修正部分情况下歌曲列表指向错误
- 添加配置文件，我自己的歌单，部分歌曲暂不可播放

#### 2018-1-17

- 修改滚动条UI，主要是在改我的另一个项目-[ink-vue-scroll](https://github.com/inkroom/ink-vue-scroll)
- 歌曲列表中高亮正在播放歌曲
- 不能播放音乐添加徽章提醒
- 添加歌曲数量统计功能

#### 2018-1-14

- 修复暂停后随便点击再次播放bug
- 修复随便点击导致音频停顿bug
- 完成酷狗歌单导入功能
- 完成播放完自动下一曲功能
- 歌曲添加歌手属性

#### 2018-1-13

- 修正二次拖拽错误
- 完成酷狗、网易云音乐搜索播放功能
- 修正播放状态显示错误
- 重新排版搜索列表
- 改善歌曲列表UI
- 将歌单和当前播放状态存入配置文件

#### 2018-1-12

- 引入网易云音乐源，源码来自 [网易云音乐API node版](https://github.com/Binaryify/NeteaseCloudMusicApi)
- 修改部分UI

#### 2018-1-11

- 初步完成页面设计，想使用黑色主题，但是配色太难了
- 完成拖动进度条功能（由于事件延迟，效果不是很好）
- 完成酷狗音乐源的搜索功能


**ps：不考虑提供下载功能**  



