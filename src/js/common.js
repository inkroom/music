function transTime(duration) {//将秒数转出成00:00格式

    var min = parseInt(duration / 60);
    if (min < 10) {
        min = '0' + min;
    }
    var sec = parseInt(duration % 60);
    if (sec < 10) {
        sec = '0' + sec;
    }
    return min + ":" + sec;
}