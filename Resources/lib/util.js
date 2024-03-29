var Util = {};

Ti.include("/public.js");

Util.show_window = function(url, attr){
	cache_http_call(url, url, function(e){
		var Win = eval(e.responseText);
		var win = new Win(attr);
		
		win.backButtonTitle = "";
		win.backgroundColor = "white";
						
		if (!Ti.App.is_android) {
			win.hideTabBar();
		}
		
		if (Ti.App.is_android){
			win.open();
		}
		else{
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		}
	}, function(e){
		show_notice("网络访问发生异常");
	});
	
	return;
};

module.exports = Util;