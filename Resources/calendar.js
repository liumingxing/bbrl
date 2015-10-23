Ti.include("public.js");
var Mamashai = require("lib/mamashai_ui");
var win = Titanium.UI.currentWindow;

function not_login() {
	var bg_view = Ti.UI.createView({
		left: 0,
		right: 0,
		backgroundColor: "#B4D3D7",
	});
	bg_image_view = Ti.UI.createView({
		width : __l(320),
		height : __l(367),
		backgroundImage : './images/start' + Ti.App.pic_sufix + '.png'
	})
	bg_view.add(bg_image_view)
	win.add(bg_view)
	bg_image_view.addEventListener("click", function(){
		to_login();
	})
	
	var button = Ti.UI.createButton({title : "登录"})
	button.addEventListener("click", function(){
		to_login();
	})
	if (!Ti.App.is_android)
		win.setRightNavButton(button)
	else{
		add_default_action_bar2(win, win.title, "登录", function(){
			button.fireEvent("click");
		});
	}
}

function already_login() {
	var kid = null;
	var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
	if (!record.blank){
		var json = JSON.parse(record.json);
		kid = json.user_kids[0];
	}
	
	var tableview = Ti.UI.createTableView({
		top: 0,
		bottom: 0,
		left: 0,
		width: Ti.App.platform_width
	})
	var null_row = Ti.UI.createTableViewRow({height: Ti.UI.SIZE});
	var aLabel = Ti.UI.createLabel({
		text : '今天没有记录',
		font : {fontSize: __l(14)},
		height : __l(20),
		width : Ti.UI.SIZE,
		top : __l(20),
		bottom: __l(10),
		left : __l(20),
		color: "#333",
		textAlign : 'center'
	});
	null_row.add(aLabel);
	
	var aButton = Ti.UI.createButton({
		title : '去记录',
		height : __l(35),
		width : __l(100),
		top : __l(15),
		bottom: __l(15),
		right: __l(10),
		font : {fontSize: __l(16)}
	});
	pre_btn(aButton)
	
	aButton.addEventListener('click', function() {
		Ti.App.fireEvent("show_write_date", {date: filter_date})
		win.close()
	});
	null_row.add(aButton);
	
	var future_row = Ti.UI.createTableViewRow({height: Ti.UI.SIZE});
	var bLabel = Ti.UI.createLabel({
		text : '这一天还未来到，无法记录',
		font : {fontSize:__l(14)},
		height : __l(20),
		width : Ti.UI.SIZE,
		top : __l(10),
		bottom: __l(10),
		left : __l(20),
		textAlign : 'center'
	});
	future_row.add(bLabel);
	
	tableview.top = 0;
	win.add(tableview);
	var pulled = false;
	var contentOffset = 0;
	tableview.addEventListener('scroll', function(e) {
		if (Ti.App.is_android)
			return;
			
		contentOffset = e.contentOffset.y;
	})
	
	tableview.addEventListener('dragEnd', function(e) {
		if (Ti.App.is_android){
			return;
		}
		
		if(!pulled && contentOffset <= __l(-100.0)) {
			tableview.setContentInsets({
				top : Titanium.Platform.osname == 'ipad' ? 592 : 270
			}, {
				animated : true
			});
			pulled = true;
			contentOffset = 0;
		} else if(pulled && contentOffset > __l(-200) && contentOffset < __l(160)) {
			tableview.setContentInsets({
				top : 0
			}, {
				animated : true
			});
			tableview.scrollToTop();
			pulled = false;
			contentOffset = 0;
		}
	});
	var json = new Array();
	var filter_date = "";
	tableview.filter_date = filter_date;
	Ti.App.addEventListener('show_date', function(e) {
		var year = e.date.split('-')[0];
		var month = parseInt(e.date.split('-')[1], 10);
		var day = parseInt(e.date.split('-')[2], 10);

		if(month < 10) {
			month = "0" + parseInt(month);
		}

		if(parseInt(day) < 10)
			day = "0" + parseInt(day)
		var str = year + "-" + month + "-" + day;
		filter_date = str
		filter()
	})

	//点击日历上某一天显示tableview的记录
	function filter() {
		if (kid){
			aLabel.text = kid.name + detail_age_for_birthday(kid.birthday, filter_date);
		}

		tableview.data = [];
		
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onerror = function(){}
		xhr.onload = function(){
				if (this.responseText == "null"){
					if (filter_date < date_str(new Date())){
						tableview.appendRow(null_row)
					}
					else if (filter_date > date_str(new Date())){
						tableview.appendRow(future_row)
					}
				}
				else{
					var json = JSON.parse(this.responseText);
					for(var i = 0; i < json.length && i<100; i++) {
							var row = Mamashai.ui.make_weibo_row(json[i])
							tableview.appendRow(row);
					}
					require('lib/mamashai_db').db.insert_json("calendar_posts" + user_id(), filter_date, this.responseText)
				}
		}	
		
		var max = filter_date + " 23:59:59";
		var min = filter_date + " 0:0:0" 
		var url = Ti.App.mamashai + "/api/statuses/user_timeline.json?1=1&count=" + Mamashai.ui.receive_count + "&cond=posts.created_at>='" + min + "' and posts.created_at<='" + max + "'&" + account_str(); 
		var record = require('/lib/mamashai_db').db.select_one_json("calendar_posts" + user_id(), filter_date)
		if (record.blank){
			xhr.open("GET", url)
			xhr.send()
		}
		else{
			var json = JSON.parse(record.json)
			for(var i = 0; i < json.length && i<100; i++) {
				var row = Mamashai.ui.make_weibo_row(json[i])
				tableview.appendRow(row);
			}
		}
		
		tableview.filter_date = filter_date;
	}

	//用户的所有记录
	var container = Ti.UI.createView({
		height : 20,
		backgroundColor : "white",
		textAlign: "center"
	})
	var calView = Ti.UI.createWebView({
		url : Titanium.Platform.osname == 'ipad' ? 'calendar/index_ipad.html' : 'calendar/index.html',
		height : Titanium.Platform.osname == 'ipad' ? 592 : __l(270),
		//left: 0,
		//bottom : 0,
		width: Ti.App.is_android && Ti.App.platform_width > 320 ? __l(320) : Ti.App.platform_width
	});
	
	if (!Ti.App.is_android){
		container.add(calView)
		tableview.headerPullView = container;
		calView.bottom = 0;
	}
	else{
		calView.top = 0;
		
		if (Ti.App.platform_width == 480){
			calView.url = "calendar/index_480.html"
			calView.height = 420
			calView.width = 480
			tableview.top = 421
		}
		else if (Ti.App.platform_width == 400){
			calView.url = "calendar/index_400.html"
			calView.height = 364
			calView.width = 400
			tableview.top = 364
		}
		else if (Ti.App.platform_width == 360){
			calView.url = "calendar/index_360.html"
			calView.height = 330
			calView.width = 360
			tableview.top = 330
		}
		else if (Ti.App.platform_width == 600){
			calView.url = "calendar/index_600.html"
			calView.height = 525
			calView.width = 600
			tableview.top = 525
		}
		else
			tableview.top = __l(270);
		
		win.add(calView)
	}
	
	show_loading();
	calView.addEventListener("load", function() {
		hide_loading();
		calView.show();
		if (!Ti.App.is_android){
			tableview.setContentInsets({
				top : Titanium.Platform.osname == 'ipad' ? 592 : __l(270)
			}, {
				animated : true
			});
		}
		
		pulled = false;
		
		http_call(Ti.App.mamashai + "/api/statuses/user_dot_dates.json?" + account_str(), function(e){
			var json = JSON.parse(e.responseText);
				
			Ti.App.fireEvent('set_select', {
				str : json.dates
			});
			hide_loading();
				
			Ti.App.fireEvent("show_date", {date: date_str(new Date())});
			
			require('lib/mamashai_db').db.insert_json('red_dot' + user_id(), '0', json.dates);
		}, function(e){
			hide_loading();
			
			var record = require('/lib/mamashai_db').db.select_one_json('red_dot' + user_id(), '0');
			if (!record.blank){
				Ti.App.fireEvent('set_select', {
					str : record.json
				});
			}
		});
	});
	//从json抽取created_at组合字符串
	function post_json_to_str(json) {
		var result = new Array();

		if(!json)
			return "";

		for(var i = 0; i < json.length; i++) {
			if(!json[i].created_at)
				continue;

			result.push(json[i].created_at.substr(0, 10))
		}
		return result.join(",");
	}
	
	Titanium.App.addEventListener('delete_post', function(e) {
		Mamashai.ui.delete_weibo_from_tableview(tableview, e.id)
	})
	
	Titanium.App.addEventListener('update_post', function(e) {
		if (!Ti.App.is_android)		//安卓下会崩溃
		{
			Mamashai.ui.update_weibo_from_tableview(tableview, e.id, e.comment_count, e.forward_count)
		}
	})

	tableview.addEventListener("click", function(e) {
		if (!e.rowData.id)
			return;
			
		if (e.source.image && e.source.image.length > 0){
				return;
		}
			
	    if (e.rowData.from == 'album_book'){
	    	var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout
			xhr.onerror = function(e) {
					hide_loading()
					show_notice("获取照片书失败")
			}
			xhr.onload = function() {
					hide_loading()
					var json = JSON.parse(this.responseText)
					var AlbumMv = require('album_mv')
					var win = new AlbumMv({
							title : json.name,
							backgroundColor : '#78A1A7',
							json : json,
							id : json.id,
							backButtonTitle: ''
					});
							
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
			}
			var url = Ti.App.mamashai + "/api/mbook/album_book.json?id=" + e.rowData.from_id;
			xhr.open("GET", url)
			xhr.send()
			show_loading()
			return;
		}
		
		var win = Titanium.UI.createWindow({
			title : "记录详情",
			json : e.rowData.json,
			id : e.rowData.id,
			backgroundColor : 'white',
			from : e.rowData.from,
			path : e.rowData.path,
			seconds : e.rowData.seconds
		});
		pre(win)
		Mamashai.ui.make_post_win(win)
		
		if (!Ti.App.is_android)
			win.hideTabBar();
		if(e.rowData.from == 'column') {
			win.id = e.rowData.from_id;
		}

		win.backButtonTitle = '';
		Ti.App.currentTabGroup.activeTab.open(win, {
			animated : true
		});
	})
	
	Titanium.App.addEventListener('add_dot', function(e) {
		Ti.App.fireEvent('set_select', {
			str : e.date
		});
		require('/lib/mamashai_db').db.delete_one_json("calendar_posts" + user_id(), e.date)
		filter();
		
		// to do 时间轴上添加
	});
	
	add_default_action_bar(win, win.title, true)
}

if(!check_login()) {
	not_login();
	//to_login();
} else {
	already_login();
}

Titanium.App.addEventListener('logged_in', function(e) {
	var win = Titanium.UI.currentWindow;
	clear_window(win)
	already_login();
});

Titanium.App.addEventListener('logged_out', function(e) {
	var win = Titanium.UI.currentWindow;
	clear_window(win)
	not_login()
});

logEvent('calendar_1');
