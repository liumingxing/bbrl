Ti.include("public.js");

////////////////////数据库///////////////////////////
Ti.App.db = Ti.Database.open('jsonDB');
Ti.App.db2 = Ti.Database.install('db/data.sqlite3', 'data4.sqlite3');

//初始化数据库
Ti.App.db.execute('CREATE TABLE IF NOT EXISTS jsons (json_type VARCHAR(100) NOT NULL, id VARCHAR(100), json text, created_at char(50))');
Ti.App.db.execute('CREATE TABLE IF NOT EXISTS drafts (user_id integer, content VARCHAR(500) NOT NULL, pic VARCHAR(200), kind varchar(100), created_at char(50))');
Ti.App.db.execute('CREATE TABLE IF NOT EXISTS album_books (rowid integer PRIMARY KEY, user_id integer, name varchar(100), json text, logo varchar(250), order_id integer, book_id integer, template_id integer, kid_id integer, created_at char(50), updated_at char(50))');

////////////////全局变量///////////////////
//网络超时时间30秒
Ti.App.timeout = 60000;

Ti.App.wechat_key = "wxc4e544191aa9121a";
if (Ti.App.id == "com.mamashai.yunfree")
	Ti.App.wechat_key = "wxf0f8850c3a525af7";
else if (Ti.App.id == "com.mamashai.yufree")
	Ti.App.wechat_key = "wx15a9f4829379b46f";

Ti.App.mamashai = "http://www.mamashai.com";

Ti.App.aliyun = "http://img.mamashai.com";

Ti.App.bar_color = "#EA609E";

//灰色色值
Ti.App.gray_color = "#e8e8e8";

var bg_color = '#fff';

var osname = Ti.Platform.osname;
Ti.App.is_android = (osname == 'android') ? true : false;
Ti.App.is_ipad = (osname == 'ipad') ? true : false;
Ti.App.is_iphone = (osname == 'iphone') ? true : false;
Ti.App.osname = Ti.Platform.osname;
Ti.App.osversion = Titanium.Platform.version;
Ti.App.manufacturer  = Ti.Platform.manufacturer;
Ti.App.model  = Ti.Platform.model;


Ti.App.is_bbrl = Ti.App.id == "com.mamashai.babycalendar" ? true : false;
Ti.App.ios7 = false;
if (!Ti.App.is_android && Ti.App.osversion >= "7.0")
	Ti.App.ios7 = true;

Ti.App.platform_width = Titanium.Platform.displayCaps.platformWidth;
Ti.App.platform_height = Titanium.Platform.displayCaps.platformHeight;

Ti.App.logicalDensityFactor = 1;
if (Ti.App.is_android)
	Ti.App.logicalDensityFactor = Ti.Platform.displayCaps.logicalDensityFactor;

Ti.App.dpi = Ti.Platform.displayCaps.xdpi;
Ti.App.density = Ti.Platform.displayCaps.density;

Ti.App.android_offset = Ti.App.is_android && Ti.Platform.Android.API_LEVEL<11 ? __l(44) : 0;

Ti.API.log("---------------" + Ti.App.logicalDensityFactor + " " + Ti.App.density + " " + Ti.App.dpi + " " + Ti.App.platform_width + " " + Ti.App.platform_height);

Ti.App.ImageFactory = require('ti.imagefactory');

//图片后缀
Ti.App.pic_sufix = "";
if (Ti.Platform.displayCaps.density == "high" || Ti.Platform.displayCaps.density == "xhigh") {
	Ti.App.pic_sufix = "@2x";
} else if (Ti.App.is_android && Ti.Platform.displayCaps.density == "medium"/* && Ti.App.platform_width > 480*/) {
	Ti.App.pic_sufix = "@2x";
}
if (Ti.App.is_ipad) {
	Ti.App.pic_sufix = "@2x";
}

if (!Ti.App.util){
	Ti.App.util = require("/lib/util");
}

function make_bottom_tab_window(arrs, current_index){
	  	 var window = new arrs[current_index].klass({
	  	 	title: arrs[current_index].text,
	  	 	__index : current_index,
	  	 	theme: current_index == 0 ? "MyTheme1" : "MyTheme2"
	  	 });
	  	 
	  	 var wrapper = Ti.UI.createView({
	  	 	height: __l(54),
	  	 	left: 0,
	  	 	right: 0,
	  	 	bottom: 0,
	  	 	backgroundColor: "#000",
	  	 	layout: 'horizontal'
	  	 });
	  	 window.bottom_tab = wrapper;
	  	 
	  	 for(var i=0; i<arrs.length; i++){
	  	 	var btn = Ti.UI.createView({
	  	 		top: 1,
	  	 		bottom: 0,
	  	 		index: i,
	  	 		width: i == arrs.length-1 ? Ti.UI.FILL : 100/arrs.length + "%",
	  	 		backgroundColor: "#eee"
	  	 	});
	  	 	btn.addEventListener("click", function(e){
	  	 		if (e.source.index > 0){
	  	 			var w = make_bottom_tab_window(arrs, e.source.index);
	  	 			w.open();
	  	 		}
	  	 		
	  	 		if (current_index > 0){
	  	 			window.close();
	  	 		}
	  	 	});
	  	 	
	  	 	btn.add(Ti.UI.createImageView({
	  	 		image: i == current_index ? arr[i].image : arr[i].image_unselect,
	  	 		top: __l(6),
	  	 		width: __l(26),
	  	 		height: __l(26),
	  	 		touchEnabled: false
	  	 	}));
	  	 	var label = Ti.UI.createLabel({
	  	 		text: arrs[i].text,
	  	 		bottom: __l(2),
	  	 		textAlign: "center",
	  	 		height: __l(16),
	  	 		font: {fontSize: __l(12)},
	  	 		touchEnabled: false,
	  	 		color: i == current_index ? Ti.App.bar_color : "#999"
	  	 	});
	  	 	btn.add(label);
	  	 	
	  	 	wrapper.add(btn);
	  	 }
	  	 
	  	 window.add(wrapper);
	  	 
	  	 window.addEventListener("set_badge", function(e){
	  	 	var btn = wrapper.children[e.index];
	  	 	if (btn.badge){
	  	 		if (e.number){
	  	 			btn.badge.text = " " + e.number + " ";
	  	 		}
	  	 		else{
	  	 			btn.remove(btn.badge);
	  	 			btn.badge = null;
	  	 		}
	  	 	}
	  	 	else{
	  	 		if (e.number){
	  	 			var badge = Ti.UI.createLabel({
			  	 		text: " " + e.number + " ",
			  	 		top: __l(2),
			  	 		right: "16%",
			  	 		width: e.number > 9 ? Ti.UI.SIZE : __l(16),
			  	 		height: __l(16),
			  	 		textAlign: "center",
			  	 		borderRadius: __l(8),
			  	 		font: {fontSize: __l(11)},
			  	 		color: "white",
			  	 		backgroundColor: "red"
			  	 	});
			  	 	btn.add(badge);
			  	 	btn.badge = badge;
	  	 		}
	  	 	}
	  	 	
	  	 	if (window.__index != 0 && Ti.App.win0){
	  	 		Ti.App.win0.fireEvent("set_badge", e);
	  	 	}
	  	 });
	  	 
	  	 var record = require('/lib/mamashai_db').db.select_one_json("mention", 0);
		 if (!record.blank){
			var json = JSON.parse(record.json);
			var count = json.dm + json.followers + json.mentions + json.comments + json.gifts;
			if (count > 0){
				window.fireEvent("set_badge", {index: 3, number: count});
			}
		 }
			
		 Ti.App.current_window = window;	
	  	 return window;
}

Titanium.UI.orientation = Titanium.UI.PORTRAIT;

Ti.App.addEventListener("resumed", function(e){
	var args = Ti.App.getArguments();
	Ti.App.fireEvent("ios_resumed", {url: args.url, source: args.source});
});

if (Ti.App.is_android){
	var arg = {};
	if (Ti.App.id == "com.mamashai.babycalendar")
		arg = {text: "宝典", image: "/images/baodian@2x_u.png", image_unselect: "/images/baodian@2x.png", klass: require('recent_article')};
	else if (Ti.App.id == "com.mamashai.yunfree")
		arg = {text: "指南", image: "/images/yunfu@2x_u.png", image_unselect: "/images/yunfu@2x.png", klass: require('jiance1')};
	else if (Ti.App.id == "com.mamashai.yufree")
		arg = {text: "指南", image: "/images/yunfu@2x_u.png", image_unselect: "/images/yunfu@2x.png", klass: require('jiance2')};
	
	var arr = [{text: "记录", image: "/images/post@2x_u.png", image_unselect: "/images/post@2x.png", klass: require('weibo')},
  			 	 arg,
  			 	 {text: "发现", image: "/images/find@2x_u.png", image_unselect: "/images/find@2x.png", klass: require('find')},
  			 	 {text: "我", image: "/images/User@2x_u.png", image_unselect: "/images/User@2x.png", klass: require('center')}];
  			
  	var win0 = make_bottom_tab_window(arr, 0);
  	Ti.App.win0 = win0;
  	win0.addEventListener("androidback", function(e) {
		var alertDialog = Ti.UI.createAlertDialog({
			message : '确定要退出宝宝日历吗?',
			title : '提示',
			buttonNames : ['退出', '取消'],
			cancel : 1
		});
	
		alertDialog.addEventListener('click', function(f) {
			if (f.index == 0) {
				win0.close();
			}
		});
		alertDialog.show();
	});
  	win0.open();
  	
  	//订阅推送
  	register_notify();
  	
  	//伪造一个Ti.App.currentTabGroup.activeTab对象，这样其他地方可以顺利
  	Ti.App.currentTabGroup = new Object({
  		activeTab: {
  			open: function(win, animate){
  				win.open();
  			}
  		}
  	});
}
else{
	var tabGroup = Titanium.UI.createTabGroup({
		//backgroundColor : Ti.App.bar_color,
		//navBarHidden: true,
		//tabsBackgroundColor : "#DDD",//Ti.App.bar_color,
		//tabsselectedBackgroundColor : "#FA609E",
		tintColor: Ti.App.bar_color,//"#FFF",
		tabsTintColor: Ti.App.bar_color,
		backgroundColor: 'white',
		barColor : Ti.App.bar_color,
		exitOnClose: true,
		title: "宝宝日历"
	});
		
	tabGroup.addEventListener("close", function(e){
		Ti.App.db.close();
		Ti.App.db2.close();
	});
	
	if (Ti.App.ios7){
		tabGroup.barColor = null;
	}

	Ti.App.currentTabGroup = tabGroup;

	var Weibo = require('weibo');
	var win1 = new Weibo({
		title : '记录',
		backgroundColor : bg_color,
		id : 0
	});
	var tab1 = Titanium.UI.createTab({
		icon : Ti.App.is_android ? null : './images/post' + Ti.App.pic_sufix + '.png',
		title : '记录',
		window : win1
	});
	
	var tab2 = null;
	if (Ti.App.id == "com.mamashai.babycalendar"){
		var RecentArticle = require('recent_article');
		var win2 = new RecentArticle({
			title : '宝典',
			backgroundColor : bg_color
		});
		
		tab2 = Titanium.UI.createTab({
			icon : Ti.App.is_android ? null : './images/baodian' + Ti.App.pic_sufix + '.png',
			title : '宝典',
			window : win2
		});
	}
	else if (Ti.App.id == "com.mamashai.yunfree"){
		var Jiance = require('jiance1');
		var win5 = new Jiance({
			title : '指南',
			backgroundColor : bg_color
		});
		
		tab2 = Titanium.UI.createTab({
			icon : Ti.App.is_android ? null : './images/yunfu' + Ti.App.pic_sufix + '.png',
			title : '指南',
			window : win5
		});
	}
	else if (Ti.App.id == "com.mamashai.yufree"){
		var Jiance = require('jiance2');
		var win5 = new Jiance({
			title : '指南',
			backgroundColor : bg_color
		});
		
		tab2 = Titanium.UI.createTab({
			icon : Ti.App.is_android ? null : './images/yunfu' + Ti.App.pic_sufix + '.png',
			title : '指南',
			window : win5
		});
	}
	
	
	var Shequ = require('find');
	var win3 = new Shequ({
		title : '发现',
		backgroundColor : bg_color,
	});
	var tab3 = Titanium.UI.createTab({
		icon : Ti.App.is_android ? null : './images/find' + Ti.App.pic_sufix + '.png',
		title : '发现',
		window : win3
	});
	var Center = require("center");
	var win4 = new Center({
		title : '我',
		backgroundColor : bg_color,
		backButtonTitle: ''
	});
	
	win4.id = Ti.App.Properties.getString("userid", "0");
	var tab4 = Titanium.UI.createTab({
		icon : Ti.App.is_android ? null : './images/User' + Ti.App.pic_sufix + '.png',
		title : '我',
		window : win4
	});
	
	pre(win1);
	pre(win2);
	pre(win3);
	pre(win4);
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);
	tabGroup.addTab(tab3);
	tabGroup.addTab(tab4);
	
	tabGroup.addEventListener("open", function(e){
		var record = require('/lib/mamashai_db').db.select_one_json("show_tip_1", 0); 
		if (record.blank && Ti.App.id == "com.mamashai.babycalendar") {		//第一次进入，弹出帮助界面
				require('lib/mamashai_db').db.insert_json("show_tip_1", 0, "true");
				var Helper = require("help");
				var helper = new Helper({
					backgroundColor : "#B4D3D7",
					theme: "NoActionBar"
				});
				if (Ti.App.is_android){
					helper.open();
				}
				else{
					helper.opacity = 0;
					helper.open({opacity: 1, duration: 800});
				}
		}
		else{								//不是第一次登录
			Ti.API.log("not first time login");
			Ti.App.fireEvent("register_notify");
		}
	});
	
	Ti.App.currentTabGroup.activeTab = tab1;
	
	tabGroup.open();
		
	tabGroup.setActiveTab(0);
}


/////////////   Flurry 统计    //////////////
var flurry = null;
Titanium.Flurry = null;
if (Ti.App.is_android) {
	flurry = require('sg.flurry');
	flurry.setReportLocation(false);
	flurry.onStartSession('P5FWFMF5X3ZJR9HFC6MR');
} else {
	var Flurry = require("ti.flurry");
	Titanium.Flurry = Flurry;

	Titanium.Flurry.initializeWithCrashReporting("ZLLEP9WR3RUHHQ5XKMUY");
	Titanium.Flurry.reportOnClose(true);
}

Titanium.App.addEventListener("submit_flurry", function(e) {
	if (Ti.App.is_android)
		flurry.onEndSession();
});

Titanium.App.addEventListener("flurry_event", function(e) {
	if (Ti.App.is_android) {
		flurry.onEvent(e.event);
	} else {
		Titanium.Flurry.logEvent(e.event);
	}
});



//////////////////////////共用函数/////////////////////////////////////
var Mamashai = null;
Titanium.App.addEventListener("open_topic", function(e) {
	//alert(e.text)
	if (!Mamashai) {
		Mamashai = require("lib/mamashai_ui");
	}

	e.value = e.value.replace('#', '').replace('#', '')
	var win = Titanium.UI.createWindow({
		title : e.value,
		backgroundColor : '#fff',
		backButtonTitle : ''
	});
	pre(win)
	//add_default_action_bar(win, win.title, true)
	Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab;
	var topic_tableview = Mamashai.ui.make_weibo_tableview('topic_' + e.value, Ti.App.mamashai + "/api/statuses/public_timeline.json?tag=" + e.value, user_id(), "posts");
	win.add(make_tableview_pull(topic_tableview));
	topic_tableview.send();

	var join = Titanium.UI.createButton({
		title : '参与话题',
		tag : e.value
	});
	join.addEventListener('click', function(e) {
		if (!check_login()) {
			to_login();
			return;
		}

		var WritePost = require("write_post")
		var win = new WritePost({
			text : "#" + e.source.tag + "#",
			backgroundColor : 'white',
			kind : "wenzi",
			from : "wenzi",
			backButtonTitle : '',
			title : '参与话题'
		});
		pre(win)
		Ti.App.currentTabGroup.activeTab.open(win, {
			animated : true
		});
	});
	if (!Ti.App.is_android)
		win.setRightNavButton(join)
		
	add_default_action_bar2(win, win.title, "参与话题", function(){
		join.fireEvent("click");
	});

	logEvent('popup_topic');

	Ti.App.currentTabGroup.activeTab.open(win, {
		animated : true
	});

});
////////////////////////////////////////////////////////////

var indWin = null;
var indWin_Show = false;
function showIndicator(tip) {
	if (indWin && indWin.visible) {
		return;
	}

	indWin = Titanium.UI.createWindow({
		height : __l(100),
		width : __l(100)
	});
	
	function win_load(){
		// black view
		var indView = Titanium.UI.createView({
			height : __l(100),
			width : __l(100),
			backgroundColor : '#000',
			borderRadius : __l(10),
			opacity : 0.8
		});
		indWin.add(indView);
	
		// loading indicator
		var actInd = Titanium.UI.createActivityIndicator({
			top : __l(18),
			height : __l(30),
			width : __l(30)
		});
		if (!Ti.App.is_android) {
			actInd.style = Titanium.Platform.osname == 'ipad' ? Titanium.UI.iPhone.ActivityIndicatorStyle.BIG : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		} else {
			actInd.style = Titanium.UI.ActivityIndicatorStyle.BIG;
		}
	
		indWin.add(actInd);
	
		// message
		var message = Titanium.UI.createLabel({
			text : '正在加载',
			color : '#fff',
			width : 'auto',
			height : 'auto',
			font : {
				fontSize : __l(14),
				fontWeight : 'bold'
			},
			bottom : __l(16)
		});
		if (tip && tip.length > 0) {
			message.text = tip;
		}
		indWin.add(message);
		indWin_Show = true;
		actInd.show();
	}
	if (Ti.App.is_android)
		indWin.addEventListener("open", win_load);
	else{
		tabGroup.last_tick = (new Date()).getTime();
		win_load();
	}	
	
	indWin.open();
}

function hideIndicator() {
	if (indWin_Show){
		/*
		indWin.close({
			opacity : 0,
			duration : 900
		});
		*/
		indWin.close();
		indWin = null;
		indWin_Show = false;
	}
}

//
// 显示或隐藏正在加载的浮动窗
//
var is_showing = false;
Titanium.App.addEventListener('show_indicator', function(e) {
	if (Ti.version <= '3.0.0') {
		return;
	}
	
	if (Ti.App.is_android){
		show_android_notice_dialog(e);
		return;
	}
	
	if (is_showing) {
		if (e.tip && indWin && indWin.message) {
			indWin.message.text = e.tip;
		}
		return;
	}
	Ti.API.info("IN SHOW INDICATOR");
	showIndicator(e.tip);
	is_showing = true;
});

Titanium.App.addEventListener('hide_indicator', function(e) {
	if (Ti.version <= '3.0.0') {
		return;
	}
	
	if (Ti.App.is_android && android_dialog){
		android_dialog.hide();
		android_dialog = null;
		android_dialog_show = false;
		return;
	}
	
	Ti.API.info("IN HIDE INDICATOR");
	hideIndicator();
	is_showing = false;
});

//
// 显示操作提示信息
//
var messageWin = Titanium.UI.createWindow({
	height : __l(30),
	width : __l(250),
	top : __l(80),
	borderRadius : __l(10),
	touchEnabled : false,

	orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]
});
var messageView = Titanium.UI.createView({
	id : 'messageview',
	top : 0,
	left : 0,
	height : __l(30),
	width : __l(250),
	borderRadius : __l(10),
	backgroundColor : '#000',
	opacity : 0.7,
	touchEnabled : false
});

var messageLabel = Titanium.UI.createLabel({
	id : 'messagelabel',
	text : '',
	color : '#fff',
	width : __l(250),
	height : 'auto',
	font : {
		fontSize : __l(14)
	},
	textAlign : 'center'
});
messageWin.add(messageView);
messageWin.add(messageLabel);

Titanium.App.addEventListener('show_notice', function(e) {
	if (Ti.App.is_android){
		var theToast = Ti.UI.createNotification({
			message: e.notice,
    		duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
    		offsetY: 0-__l(100),
		    //gravity: 16 | 1
		    gravity: 1
		});
		theToast.show();
		
		return;
	}
	
	
	messageLabel.text = e.notice;
	messageWin.open();

	setTimeout(function() {
		messageWin.close({
			opacity : 0,
			duration : 900
		});
	}, e.last || 2000);
});

var android_dialog = null;
var android_dialog_show = false;
function show_android_notice_dialog(e){
		if (android_dialog_show)
			return;
			
		var view = Ti.UI.createView({
		    top:0,
		    width: __l(300),
		    height: __l(80),
		    backgroundColor: 'transparent'
		});
		var actInd = Titanium.UI.createActivityIndicator({
			top : __l(26),
			bottom: __l(26),
			left: __l(60),
			height : __l(30),
			width : __l(30),
			style : Titanium.UI.ActivityIndicatorStyle.BIG
		});
		var label = Ti.UI.createLabel({
		  color:'black',
		  text: e.tip || '正在加载...',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		  top: __l(26),
		  bottom: __l(26),
		  left: __l(110),
		  font : {fontSize: __l(18)},
		  width: Ti.UI.SIZE, 
		  height: __l(30)
		});
		view.add(actInd);
		view.add(label);
		 
		android_dialog = Ti.UI.createAlertDialog({
		   //title: "提示",
		   androidView:view
		});
		android_dialog.addEventListener("android:back", function(e){
			return false;
		});
		 
		android_dialog.show();
		actInd.show();
		android_dialog_show = true;
		//dialog.show();
		return;
}

Titanium.App.addEventListener('show_tab', function(e) {
	tabGroup.setActiveTab(e.index);
});

Titanium.App.addEventListener('open_url', function(e) {
	if (Ti.App.is_android && e.url == "http://t.cn/zHIAP2N"){
		Ti.Platform.openURL(e.url);
		return;
	}
	
	//Ti.Platform.openURL(e.url)
	var win = Titanium.UI.createWindow({
		title : e.title || "",
		backgroundColor : '#fff',
		backButtonTitle: ''
	});
	if (!Ti.App.ios7)
		win.barColor = Ti.App.bar_color;
	
	Ti.App.currentWebWindow = win;

	pre(win)

	var webview = Ti.UI.createWebView({
		top : 0,
		url : e.url,
		win: win
	});
	win.add(webview)

	webview.addEventListener('load', function(e) {
		if (!Ti.App.is_android)
			navActInd.hide();
			
		Ti.App.fireEvent("page_load", {
			url : e.url
		});
	});
	var navActInd = Titanium.UI.createActivityIndicator();
	if (!Ti.App.is_android) {
		win.setRightNavButton(navActInd);
	} else {
		add_default_action_bar(win, win.title, true);
	}

	win.addEventListener("open", function(e) {
		if (!Ti.App.is_android)
			navActInd.show();
	});


	Ti.App.currentTabGroup.activeTab.open(win, {
		animated : true
	});
});

//播放视频
Titanium.App.addEventListener("playVideo", function(e){
		if (Ti.App.is_android){
				var intent = Ti.Android.createIntent({
				       action: Ti.Android.ACTION_VIEW,
				       type: "video/*",
				       data: e.url == "/" ? "http://www.mamashai.com" + encodeURI(e.url) : encodeURI(e.url),
				});
				intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
				e.win.activity.startActivityForResult(intent, function(e) {
				})
		}
		else{
				var video_win = Titanium.UI.createWindow({
					title: "视频播放"
				});
				var activeMovie = Titanium.Media.createVideoPlayer({
					url: e.url && e.url[0] == "/" ? "http://www.mamashai.com" + encodeURI(e.url) : encodeURI(e.url),
					mediaControlStyle:Titanium.Media.VIDEO_CONTROL_DEFAULT, // See TIMOB-2802, which may change this property name
					scalingMode:Titanium.Media.VIDEO_SCALING_MODE_NONE
				});
				video_win.add(activeMovie);
				activeMovie.play();
					
				video_win.addEventListener('close', function() 
				{
					activeMovie.stop();
				});
				Ti.App.currentTabGroup.activeTab.open(video_win, {
					animated : true
				});
		}
})

//显示图片
Titanium.App.addEventListener('showPicture', function(e) {
	galary_browse([e.src], 0);
});

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//已登陆
if (check_login()) {
		setTimeout(function() {
			get_mentions();
		}, 10000);
} else {//未登录
	Titanium.App.addEventListener('logged_in', function(e) {
		setTimeout(function() {
			get_mentions();
		}, 2000);
	});
}

//推送中包含了自定义参数,title和json分别为推送文本内容及扩展参数
function push_call(title, json){
	Ti.API.info(JSON.stringify(json));
	switch(json.t)
	{
	case "comment":                //评论或转发
		Ti.App.util.show_window(Ti.App.mamashai + "/bbrl_code/message2.txt", {
			id: user_id(),
			backButtonTitle: '',
			backgroundColor: 'white',
			title: '我的消息'
		});
	  break;
	case "post":
		http_call(Ti.App.mamashai + "/api/statuses/show/" + json.id, function(e){
			var json = JSON.parse(e.responseText);
			var win = Titanium.UI.createWindow({
				json : json,
				id : json.id,
				title : "记录详情",
				backButtonTitle: "",
				backgroundColor : 'white'
			});

			var Mamashai = require("lib/mamashai_ui");
			Mamashai.ui.make_post_win(win);

			pre(win);

			if (!Ti.App.is_android)
				win.hideTabBar();

			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		});
	  break;
	case "private_message":        //私信
		Ti.App.util.show_window(Ti.App.mamashai + "/bbrl_code/message2.txt", {
			id: user_id(),
			backButtonTitle: '',
			backgroundColor: 'white',
			title: '我的消息',
			index: 1
		});
	  break;
	case "fans":                   //新粉丝
	  		show_window("followers", {
				title : "新粉丝",
				id : user_id(),
				m_url : "followers"
			});
	  break;
	case "score":                  //获得晒豆
	  cache_http_call(Ti.App.mamashai + '/api/statuses/ddh_rules', "ddh_rules", function(e){
			eval(e.responseText);
	  });
	  break;
	case "article":                //育儿宝典推送
	  	Ti.App.util.show_window(Ti.App.mamashai + "/bbrl_code/article.txt", {
			id : json.id,
			t : 'article',
			backgroundColor : 'white',
			title : title,
			backButtonTitle: ""
		});
		
	  break;
	case "ddh_all":
		Ti.App.util.show_window(Ti.App.mamashai + "/bbrl_code/ddh.txt", {
			backButtonTitle: '',
			backgroundColor: 'white',
			title: '免费派礼'
		});
	  break;
	case "ddh":                    //免费派礼兑换消息
	  cache_http_call(Ti.App.mamashai + "/bbrl_code/ddh_my.txt", "cache_ddh_my", function(e){
			var OrdersWin = eval(e.responseText);
	  });
	  break;
	case "xxb":                    //星星榜
	  	show_window("xxb", {
			title: "星星榜"
	 	});
	  break;
	case "url":                    //传入url
	  http_call(json.url, function(e){
	  	eval(e.responseText);
	  });
	  break;
	case "url2":                    //传入url
	  	Ti.App.util.show_window(json.url, {
			backButtonTitle: '',
			backgroundColor: 'white',
			title: ''
		});
	  break;
	default:
	  break;
	}
}

//推送回调事件
if (Ti.App.is_android){
		var act = Titanium.Android.currentActivity;
		var _intent = act.intent;
		var str = _intent.getStringExtra("cn.jpush.android.EXTRA");
		if (str && str.length > 0){
			push_call(_intent.getStringExtra("cn.jpush.android.ALERT"), JSON.parse(str));
		}
		
		var bc = Ti.Android.createBroadcastReceiver({
		    onReceived : function(e) {
		        /*
		        Ti.API.info("cn.jpush.android.PUSH_ID: " 		+ e.intent.getStringExtra("cn.jpush.android.PUSH_ID"));
		        Ti.API.info("app: " 							+ e.intent.getStringExtra("app"));
		        Ti.API.info("cn.jpush.android.ALERT: " 			+ e.intent.getStringExtra("cn.jpush.android.ALERT"));
		        Ti.API.info("cn.jpush.android.EXTRA: " 			+ e.intent.getStringExtra("cn.jpush.android.EXTRA"));
		        Ti.API.info("cn.jpush.android.NOTIFICATION_ID: "+ e.intent.getStringExtra("cn.jpush.android.NOTIFICATION_ID"));
		        Ti.API.info("cn.jpush.android.NOTIFICATION_CONTENT_TITLE: " + e.intent.getStringExtra("cn.jpush.android.NOTIFICATION_CONTENT_TITLE"));
		        Ti.API.info("cn.jpush.android.MSG_ID: " 		+ e.intent.getStringExtra("cn.jpush.android.MSG_ID"));
		        Ti.API.info("cn.jpush.android.TITLE: " 			+ e.intent.getStringExtra("cn.jpush.android.TITLE"));
		        Ti.API.info("cn.jpush.android.MESSAGE: " 		+ e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
		        Ti.API.info("cn.jpush.android.CONTENT_TYPE: " 	+ e.intent.getStringExtra("cn.jpush.android.CONTENT_TYPE"));
				*/
				var str = e.intent.getStringExtra("cn.jpush.android.EXTRA"); 
				if (str && str.length > 0){
					//show_alert("提示", e.intent.getStringExtra("cn.jpush.android.EXTRA"));
					push_call(e.intent.getStringExtra("cn.jpush.android.ALERT"), JSON.parse(str));
				}
		    }
		});
		 
		Ti.Android.registerBroadcastReceiver(bc, ['mamashai_jpush']);
		win0.addEventListener("close", function(){
			Ti.Android.unregisterBroadcastReceiver(bc);
		});	
		
		//收到推送，还未打开
		var bc2 = Ti.Android.createBroadcastReceiver({
		    onReceived : function(e) {
		        var json = JSON.parse(e.intent.getStringExtra("cn.jpush.android.EXTRA"));
		        if (json.t == "comment" || json.t == "private_message" || json.t == "fans"){
		        	get_mentions();
		        }
		    }
		});
		Ti.Android.registerBroadcastReceiver(bc2, ['mamashai_jpush_received']);
		win0.addEventListener("close", function(){
			Ti.Android.unregisterBroadcastReceiver(bc2);
		});	
}

function register_notify(){
	if (Ti.App.is_android){
		var push = require('com.mamashai.jpush');
		push.setAlias(Ti.App.Properties.getString("userid", ""), function(e){
			if (e.device_token.length == 0)
				return;
			
		    Ti.API.log("register to jpush code: " + e.code + ", token: " + e.device_token);
		   
		    Ti.App.Properties.setString("jpush_token", e.device_token);

			var url = Ti.App.mamashai + "/api/statuses/subscribe?token=" + e.device_token;
			url += "&os=android&app=" + Ti.App.id;
			url += "&sid=" + Ti.Platform.id;
			if (check_login()){
				url += "&id=" + Ti.App.Properties.getString("userid", "");
			}
			url += "&from=jpush";
			
			Ti.API.log("subscribe push :" + e.device_token);
			var xhr = Ti.Network.createHTTPClient();
			xhr.onload = function() {
				Ti.API.log("subscribe success : " + e.device_token);
			};		
			xhr.open('GET', url, true);
			xhr.send();
		});
	}
	else{
		function subscribe(e){
			var url = Ti.App.mamashai + "/api/statuses/subscribe?token=" + e.deviceToken;
		  	url += "&app=" + Ti.App.id;
		  	url += "&sid=" + Ti.Platform.id;
		  	if (check_login()){
		  		url += "&id=" + Ti.App.Properties.getString("userid", "");
		  	}
		  	http_call(url, function(f){
		  		Ti.API.log("subscribe success : " + e.deviceToken);
		  	});
		  	Ti.App.Properties.setString("ios_token", e.deviceToken);
		}
		
		if (parseInt(Ti.Platform.version.split(".")[0]) >= 8){
			function registerForPush() {
		        Ti.Network.registerForPushNotifications({
		            success: subscribe,
		            error: function(e) {
					    Ti.API.warn("push notifications disabled(ios8): "+e);
					    logEvent('push_notification_disable');
					  },
		            callback: function(e) {
		            	var alert_dialog = Titanium.UI.createAlertDialog({
							title : '',
							message : e.data.alert,
							buttonNames : ['去看看', '关闭'],
							cancel : 0
						});
						alert_dialog.addEventListener("click", function(e1){
							if (e1.index == 0){
								push_call(e.data.alert, e.data);		
							}
						});
						alert_dialog.show();
					  }
		        });
		        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
		    };
		 
		    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
		    
			Ti.App.iOS.registerUserNotificationSettings({
			    types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, 
			    		Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, 
			    		Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
		}
		else{
			Ti.Network.registerForPushNotifications({
				  types: [
				    Ti.Network.NOTIFICATION_TYPE_BADGE,
				    Ti.Network.NOTIFICATION_TYPE_ALERT,
				    Ti.Network.NOTIFICATION_TYPE_SOUND
				  ],
				  success:function(e){
				  	subscribe(e);
				  },
				  error:function(e) {
				    Ti.API.warn("push notifications disabled: "+e);
				    logEvent('push_notification_disable');
				  },
				  callback:function(e) {
				  		var alert_dialog = Titanium.UI.createAlertDialog({
							title : '提示',
							message : e.data.alert,
							buttonNames : ['去看看', '关闭'],
							cancel : 0
						});
						alert_dialog.addEventListener("click", function(e1){
							if (e1.index == 0){
								push_call(e.data.alert, e.data);		
							}
						});
						alert_dialog.show();
				  }
				});
		}
	}
}

Ti.App.addEventListener("register_notify", function(e){
	register_notify();
});

Titanium.App.addEventListener('logged_out', function(e) {
	var device_token = "";
	if (Ti.App.is_android){
		device_token = Ti.App.Properties.getString("jpush_token", "");
	}
	else{
		device_token = Ti.App.Properties.getString("ios_token", "");
	}
	var url = Ti.App.mamashai + "/api/statuses/subscribe?token=" + device_token;
	url += "&app=" + Ti.App.id;
	if (Ti.App.is_android){
		url += "&os=android";
	}
	else{
		url += "&os=ios";
	}
	http_call(url, function(f){
		Ti.API.log("unscribe");
	});
});
