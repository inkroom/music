const fs = require('fs');


fs.readFile('/home/inkbox/.config/Electron/k-music.json', function (error, data) {
    let music =(JSON.parse(data.toString()))
console.log(music.musics.length)
    for(let i=0;i<music.musics.length;i++){
        console.log(music.musics[i].url)
        delete music.musics[i].url;
    }
      

    fs.writeFile('/home/inkbox/.config/Electron/k-music.json',JSON.stringify(music),function(err){
        if(err) throw err
    });

})


