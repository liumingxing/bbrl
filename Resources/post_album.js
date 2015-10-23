function PostAlbum(attr) {
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);

	win.title = "";
	var web = Ti.UI.createWebView({
		url : Ti.App.mamashai + "/bbrl/time/" + win.id + "?user_id=" + user_id()
	});
	web.top = Ti.App.android_offset;
	if (Ti.App.is_android)
		web.pluginState = Titanium.UI.Android.WEBVIEW_PLUGINS_ON;

	win.add(web);
	win.wrapper = web;

	var tiwechat = require('com.mamashai.tiwechat');
	var right = Ti.UI.createButton({
		image : "/images/weixin.png"
	});
	right.addEventListener("click", function(e) {
		var optionsDialogOpts = {
			options : ['分享给微信好友', '发到微信朋友圈', '取消'],
			cancel : 2
		};

		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {//发给微信好友
				http_call(Ti.App.mamashai + "/api/users/show/" + win.id + "?" + account_str(), function(e) {
					var json = JSON.parse(e.responseText)
					var kid_name = "宝贝"
					if (json.user_kids.length == 1) {
						kid_name = json.user_kids[json.user_kids.length - 1].name
					}
					
					tiwechat.exampleProp = Ti.App.wechat_key;
					tiwechat.shareSession(kid_name + "的时光轴", kid_name + "的时光轴", "http://www.mamashai.com/bbrl/time/" + win.id, "http://www.mamashai.com" + json.logo_url_thumb48);
					logEvent('weixin_session');
				});
			} else if (e.index == 1) {//分享微信朋友圈
				http_call(Ti.App.mamashai + "/api/users/show/" + win.id + "?" + account_str(), function(e) {
					var json = JSON.parse(e.responseText)
					var kid_name = "宝贝"
					if (json.user_kids.length == 1) {
						kid_name = json.user_kids[json.user_kids.length - 1].name
					}
					tiwechat.exampleProp = Ti.App.wechat_key;
					tiwechat.shareTimeline(kid_name + "的时光轴", kid_name + "的时光轴", "http://www.mamashai.com/bbrl/time/" + win.id, "http://www.mamashai.com" + json.logo_url_thumb48);
					logEvent('weixin_timeline');
					if (!Ti.App.is_android)
						show_notice("成功分享到微信朋友圈");

					var url = Ti.App.mamashai + "/api/statuses/make_weixin_score?" + account_str();
					var xhr = Ti.Network.createHTTPClient();
					xhr.timeout = Ti.App.timeout;
					xhr.open("POST", url);
					xhr.send();
				});
			}
		});
		dialog.show();
	});

	if (!Ti.App.is_android && check_login() && parseInt(user_id()) == win.id && tiwechat.isWeixinInstalled() == "yes")
		win.setRightNavButton(right);

	logEvent('post_album');

	pre(win);
	
	if (check_login() && parseInt(user_id()) == win.id){
		add_default_action_bar2(win, win.title, "分享微信", function(e) {
			right.fireEvent("click");
		});
	}
	else{
		add_default_action_bar(win, win.title, true);
	}
	
	return win;
}

module.exports = PostAlbum;
