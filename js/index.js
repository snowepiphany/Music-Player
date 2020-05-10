$(function() {
    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();
    // 1.监听歌曲的移入
    $(".list_music").hover(function() {
        // 显示子菜单
        // find(expr|obj|ele)
        // expr: 用于查找的表达式|obj：一个用于匹配元素的jQuery对象|ele一个DOM元素
        // 搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。
        $(this).find(".list_menu").stop().fadeIn(100);
        $(this).find(".list_time a").stop().fadeIn(100);
        // 隐藏时长
        $(this).find(".list_time span").stop().fadeOut(100);
    }, function(){
        // 隐藏子菜单
        $(this).find(".list_menu").stop().fadeOut(100);
        $(this).find(".list_time a").stop().fadeOut(100);
        // 显示时长
        $(this).find(".list_time span").stop().fadeIn(100);
    });
    // 2.监听复选框的点击事件
    $(".list_check").click(function() {
        // alert("abc");
        $(this).toggleClass("list_checked");
    });
});