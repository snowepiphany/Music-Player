(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        musicList: [],
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        loadLyric: function (callback) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    $this.parseLyric(data);
                    callback();
                },
                error: function (e) {

                }
            });
        },
        parseLyric: function (data) {
            var $this = this;
            // 先清空上一首歌曲的歌词信息
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            // console.log(array);
            // 正则表达式
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            // 遍历取出每一行歌词
            $.each(array, function (index, ele) {
                // 处理歌词
                var lrc = ele.split("]")[1];
                // console.log(lrc);
                // 排除空字符串(没有歌词)
                if (lrc.length == 1) return true;
                // 存歌词到lyrics里
                $this.lyrics.push(lrc);

                var reg = timeReg.exec(ele);
                // console.log(reg);
                if (reg == null) return true;
                var timeStr = reg[1]; // 00:00:00
                var reg2 = timeStr.split(":");
                var min = parseInt(reg2[0]) * 60;
                var sec = parseFloat(reg2[1]);
                // Number(min + sec).toFixed(2) 结果是字符串类型
                // parseFloat再给它转换为数字
                var time = parseFloat(Number(min + sec).toFixed(2));
                // console.log(typeof time);
                $this.times.push(time);
            });
            // console.log(($this.times));
            // console.log(($this.lyrics));
        },
        currentIndex: function (currentTime) {
            if (currentTime >= this.times[0]) {
                this.index++;
                // 删除数组最前面的一句
                this.times.shift();
            }
            return this.index;
        }

    }

    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);