const less = require('less');
const fs = require('fs');
const path = require('path');
const http = require('http');


http.createServer((req, res) => {
    // 读取文件内容 
    let file = path.join(__dirname, '../' + req.url);
    if (file.includes('?')) {
        file = file.substring(0, file.indexOf('?'));
    }
    console.log(file)
    let file_type = "utf-8";
    if (file.includes('.jpg') || file.includes('.jpeg') || file.includes('.png') || file.includes('.ttf') || file.includes('woff')) {
        file_type = "binary";
    }
    fs.readFile(file, file_type, (err, data) => {
        if (err) {
            console.log(file)
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
        } else { // 状态码：200
            let type = 'text/html; charset=utf-8';
            if (req.url.includes('.css')) type = "text/css; charset=utf-8";
            else if (req.url.includes('.js')) type = "text/javascript; charset=utf-8";
            else if (req.url.includes('.jpeg') || req.url.includes('.jpg') || req.url.includes('.png'))
                type = "image/jpeg";
            else if (req.url.includes('ttf')) type = "font/ttf";
            else if (req.url.includes('woff2')) type = "font/woff2";
            else if (req.url.includes('woff')) type = "font/woff";

            res.writeHead(200, {
                'Content-Type': type
            }); // 响应文件内容

            if (file.includes('.jpg') || file.includes('.jpeg') || file.includes('.png') || file.includes('.ttf') || file.includes('woff')) {
                res.write(data, 'binary');
            } else

                res.write(data.toString());
        } // 发送响应 
        res.end();
    });
}).listen(8001)


function complie(abpath) {
    console.log('编译' + abpath)
    let data = fs.readFileSync(abpath, 'utf8');
    less.render(data, (err, css) => {
        if (err) throw err;
        fs.writeFileSync(abpath.substring(0, abpath.length - 5) + '.css', css.css);
    })

}

process.on('SIGINT', function () {
    console.log('Exit now!');
    process.exit();
});


fs.readdir(path.join(__dirname, 'css'), function (err, dirs) {
    if (err) throw err;
    for (var i = 0; i < dirs.length; i++) {

        if (dirs[i].includes('.less')) {

            let abpath = path.join(__dirname, 'css/', dirs[i]);
            complie(abpath)
            fs.watchFile(abpath, {
                interval: 500
            }, (curr, prev) => {
                complie(abpath);
            })
        }

    }
})