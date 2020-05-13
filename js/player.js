(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            //判断是否是同一首音乐
            if (this.currentIndex == index) {
                //同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                //不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        }

    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);