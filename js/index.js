$(function () {
    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;

    initProgress();

    function initProgress() {
        // 音乐播放进度控制

        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar, $progressLine, $progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        // 声音播放进度
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar, $voiceLine, $voiceDot);
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    //加载歌曲列表方法,调用方法加载音乐列表
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                //遍历获取到的数据创建音乐列表
                var $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            },
        });
    }

    // 1.初始化歌曲信息
    function initMusicInfo(music) {
        // 获取对应的元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $(".song_progress_name");
        var $musicProgressTime = $(".song_progress_time");
        var $musicBg = $(".mask_bg");

        // 给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00" + " / " + music.time);
        $musicBg.css("background", "url('" + music.cover + "')");
    }

    // 初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $(".song_lyric");
        //清空上一首音乐的歌词
        $lyricContainer.html("");
        lyric.loadLyric(function () {
            //创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "</li>");
                $lyricContainer.append($item);
            });
        });
    }

    // 2.初始化事件监听
    initEvents();

    function initEvents() {
        //1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mousemove", function () {
            //显示子菜单
            // find(expr|obj|ele)
            // expr: 用于查找的表达式|obj：一个用于匹配元素的jQuery对象|ele一个DOM元素
            // 搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            //隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            //显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        //2.监听复选框的点击事件
        // 选中
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });

        // // 全选/全不选
        // $('.list_title>.list_check').click(function () {
        //     $('.list_music').find('.list_check').toggleClass('list_checked');
        // })

        // 全选/全不选
        $(".list_title>.list_check").click(function () {
            if ($(this).parent().siblings().hasClass("list_checked")) {
                $(this).parent().siblings().find(".list_checked").removeClass("list_checked");
            }
            $(this).parent().siblings().toggleClass("list_checked");

        })

        //3.监听子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music");

            //3.1切换播放的图片
            $(this).toggleClass("list_menu_play2");
            //3.2复原其他的图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //3.3切换下面的播放图标,同步播放底部按钮
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //当前是播放的状态
                $musicPlay.addClass("music_play2");
                //让文字高亮
                $item.find("div").css("color", "rgba(255,255,255,1)");
                // 排他
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            } else {
                //当前子菜单播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                //让文字不高亮
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }
            //3.4切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            // 排他
            $item.siblings().find(".list_number").removeClass("list_number2");

            // 3.5播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);

            // 3.6切换歌曲信息
            initMusicInfo($item.get(0).music);
            // 切换歌词信息
            initMusicLyric($item.get(0).music);
        });

        //4.监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            //判断有没有播放过音乐
            if (player.currentIndex == -1) {
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //已经播放过音乐
                $(".list_music")
                    .eq(player.currentIndex)
                    .find(".list_menu_play")
                    .trigger("click");
            }
        });

        //5.监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music")
                .eq(player.preIndex())
                .find(".list_menu_play")
                .trigger("click");
        });

        //6.监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music")
                .eq(player.nextIndex())
                .find(".list_menu_play")
                .trigger("click");
        });

        // 7.监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function () {
            // 找到被点击的音乐
            var $item = $(this).parents(".list_music");

            // 判断当前播放的音乐是否是当前正在播放的音乐
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            // 重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele)
                    .find(".list_number")
                    .text(index + 1);
            });
        });

        // 8.监听播放的进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //同步时间
            $(".music_progress_time").text(timeStr);
            // 同步进度条
            // 计算播放比例
            var value = (currentTime / duration) * 100;
            progress.setProgress(value);

            //实现歌词的同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            //滚动歌词
            if (index <= -2) return;
            $(".song_lyric").css("marginTop", (-index + 2) * 30);
        });

        // 9.监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            // 图标切换
            $(this).toggleClass("music_voice_icon2");
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                // 静音
                player.musicVoiceSeekTo(0);
            } else {
                // 有声音
                player.musicVoiceSeekTo(1);
            }
        });

        // 10.监听纯净按钮的点击
        $(".music_only").click(function () {
            $(this).toggleClass("music_only2");
        });

        // 11.监听收藏按钮的点击
        $(".music_fav").click(function () {
            $(this).toggleClass("music_fav2");
        });

        // 12.监听 清空列表 按钮
        $(".del_all").click(function () {
            $(".list_music").remove();
        });

        $(".list_title>.list_check").click(function () {
            $(this).parent().siblings(".list_check").toggleClass(".list_checked");
        });
        // 13.监听 list_title里的 删除 按钮
        $(".del_checked").click(function () {
            console.log($(".list_checked"));
            $(".list_checked").parent().remove();
            // 重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele)
                    .find(".list_number")
                    .text(index + 1);
            });
        });

        // 监听播放模式按钮
        var mode = $(".music_mode");

        function replaceClass($obj, c1, c2) {
            $obj.removeClass(c1);
            $obj.addClass(c2);
        }

        mode.click(function () {
            if ($(this).hasClass("music_mode")) {
                replaceClass($(this), "music_mode", "music_mode2");
                $(this).attr("title", "列表循环");
            } else if ($(this).hasClass("music_mode2")) {
                replaceClass($(this), "music_mode2", "music_mode3");
                $(this).attr("title", "随机播放");
            } else if ($(this).hasClass("music_mode3")) {
                replaceClass($(this), "music_mode3", "music_mode4");
                $(this).attr("title", "单曲循环");
            } else {
                replaceClass($(this), "music_mode4", "music_mode");
                $(this).attr("title", "循序播放");
            }
        });
    }

    //定义一个方法创建一条音乐
    function createMusicItem(index, music) {
        var $item = $(
            '<li class="list_music">\n' +
            '\t\t\t\t\t\t\t\t<div class="list_check"><i></i></div>\n' +
            '\t\t\t\t\t\t\t\t<div class="list_number">' +
            (index + 1) +
            "</div>\n" +
            '\t\t\t\t\t\t\t\t<div class="list_name">' +
            music.name +
            "\n" +
            '\t\t\t\t\t\t\t\t\t<div class="list_menu">\n' +
            '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="播放" class="list_menu_play"></a>\n' +
            '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="添加"></a>\n' +
            '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="下载"></a>\n' +
            '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="分享"></a>\n' +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t</div>\n" +
            '\t\t\t\t\t\t\t\t<div class="list_singer">' +
            music.singer +
            "</div>\n" +
            '\t\t\t\t\t\t\t\t<div class="list_time">\n' +
            "\t\t\t\t\t\t\t\t\t<span>" +
            music.time +
            "</span>\n" +
            '\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="删除" class="list_menu_del"></a>\n' +
            "\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t</li>"
        );

        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

    // // 定义一个格式化时间的方法
    // function formatData(currentTime, duration) {
    //     var endMin = parseInt(duration / 60);
    //     var endSec = parseInt(duration % 60);
    //     if (endMin < 10) {
    //         endMin = "0" + endMin;
    //     }
    //     if (endSec < 10) {
    //         endSec = "0" + endSec;
    //     }

    //     var startMin = parseInt(currentTime / 60);
    //     var startSec = parseInt(currentTime % 60);
    //     if (startMin < 10) {
    //         startMin = "0" + startMin;
    //     }
    //     if (startSec < 10) {
    //         startSec = "0" + startSec;
    //     }
    //     return startMin + ":" + startSec + " / " + endMin + ":" + endSec;
    // }
});