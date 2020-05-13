$(function () {
    //初始化自定义滚动条
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);

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

            },
            error: function (e) {
                console.log(e);
            }
        });
    }


    //初始化事件监听
    initEvents();

    function initEvents() {
        //监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mousemove", function () {
            //显示子菜单
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

        //监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");

        });

        //监听子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music");

            //切换播放的图片
            $(this).toggleClass("list_menu_play2");
            //复原其他的图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //切换下面的播放图标,同步播放底部按钮
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //当前是播放的状态
                $musicPlay.addClass("music_play2");
                //让文字高亮
                $item.find("div").css("color", "rgba(255,255,255,1)");
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            } else {
                //当前不是播放的状态
                $musicPlay.removeClass("music_play2");
                //让文字不高亮
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }
            //切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            //播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);

        });

        //监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            //判断有没有播放过音乐
            if (player.currentIndex == -1) {
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        //监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        //监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });
    }

    //定义一个方法创建一条音乐
    function createMusicItem(index, music) {
        var $item = $("<li class=\"list_music\">\n" +
            "\t\t\t\t\t\t\t\t<div class=\"list_check\"><i></i></div>\n" +
            "\t\t\t\t\t\t\t\t<div class=\"list_number\">" + (index + 1) + "</div>\n" +
            "\t\t\t\t\t\t\t\t<div class=\"list_name\">" + music.name + "\n" +
            "\t\t\t\t\t\t\t\t\t<div class=\"list_menu\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n" +
            "\t\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "\t\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "\t\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t<div class=\"list_singer\">" + music.singer + "</div>\n" +
            "\t\t\t\t\t\t\t\t<div class=\"list_time\">\n" +
            "\t\t\t\t\t\t\t\t\t<span>" + music.time + "</span>\n" +
            "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n" +
            "\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t</li>");

        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

});