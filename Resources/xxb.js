function Xxb(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	add_default_action_bar(win, win.title, true);
	
	win.addEventListener("open", function(e){
		var web = Ti.UI.createWebView({
			top: Ti.App.android_offset,
			url: Ti.App.mamashai + "/bbrl/star"
		});
		win.add(web);
		
		web.addEventListener("beforeload", function(e){
			var arr = e.url.match(/user=(\d+)#/);
			if (arr && arr.length == 2){
				var user_id = arr[1];
				show_window("user", {
					title : "用户资料",
					id : user_id
				});
			}
		});
		
		logEvent("xxb");
	});
	return win;
}

module.exports = Xxb;
