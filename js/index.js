$(function() {
    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();

    // 1.监听歌曲的移入
    // 事件委托
    $(".content_list").delegate(".list_music", "mouseenter", function() {
        // 显示子菜单
        // find(expr|obj|ele)
        // expr: 用于查找的表达式|obj：一个用于匹配元素的jQuery对象|ele一个DOM元素
        // 搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。
        $(this).find(".list_menu").stop().fadeIn(100);
        $(this).find(".list_time a").stop().fadeIn(100);
        // 隐藏时长
        $(this).find(".list_time span").stop().fadeOut(100);
    });
    $(".content_list").delegate(".list_music", "mouseleave", function() {
        // 隐藏子菜单
        $(this).find(".list_menu").stop().fadeOut(100);
        $(this).find(".list_time a").stop().fadeOut(100);
        // 显示时长
        $(this).find(".list_time span").stop().fadeIn(100);
    });

    // 2.监听复选框的点击事件
    $(".content_list").delegate(".list_check", "click", function() {
        $(this).toggleClass("list_checked");
    });

    // 3.添加子菜单播放按钮的监听
    var $musicPlay = $(".music_play");
    $(".content_list").delegate(".list_menu_play", "click", function() {
        var $item = $(this).parents(".list_music");
        // 3.1 切换播放图标
        $(this).toggleClass("list_menu_play2");
        // 3.2 复原其他播放图标
        $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
        // 3.3 同步底部播放按钮
        if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
            // 当前子菜单播放按钮是播放状态
            $musicPlay.addClass("music_play2");
            // 让文字高亮
            $item.find("div").css("color", "#fff");
            // 文字排他
            $item.siblings().css("color", "rgba(255,255,255, 0.5)");
        } else {
            // 当前子菜单播放按钮不是播放状态
            $musicPlay.removeClass("music_play2");
            // 让文字不高亮
           $item.find("div").css("color", "rgba(255,255,255, 0.5)");
        }
        // 3.4切换序号的状态
        $item.find(".list_number").toggleClass("list_number2");
        // 排他
        $item.siblings().find(".list_number").removeClass("list_number2");
    });

    // 3.加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                // console.log(data); 
                // 3.1 遍历获取到的数据，创建每一条音乐
                var $musicList = $(".content_list ul");
                $.each(data, function(index, ele) {
                    var $item = createItem(index, ele);             
                    $musicList.append($item);
                });

            },
            error: function (e) {
                console.log(e);                
            }
        });
    }

    // 定义一个方法，创建一条音乐
    function createItem(index, music) {
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