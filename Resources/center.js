function Center(attr){
	Ti.include("public.js");
	
	var win = Ti.UI.createWindow(attr);
	var table_header = Ti.UI.createView({
		height: __l(20)
	});
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		separatorColor : "#CACACA",
		//backgroundColor : '#e8e8e8',
		backgroundColor: '#F4F6F1',
		//rowBackgroundColor : 'white',
		headerView: table_header,
		top : 0,
		bottom : Ti.App.is_android ? __l(54) : 0
	});
	
	var header1 = Ti.UI.createView({
		height: __l(1)
	});
	var header2 = Ti.UI.createView({
		height: Ti.App.is_android ? __l(20) : __l(1)
	});
	var header3 = Ti.UI.createView({
		height: Ti.App.is_android ? __l(20) : __l(1)
	});
	var header4 = Ti.UI.createView({
		height: Ti.App.is_android ? __l(20) : __l(1)
	});
	
	var section1 = Ti.UI.createTableViewSection({headerView: header1});
	var section3 = Ti.UI.createTableViewSection({headerView: header3});
	var section4 = Ti.UI.createTableViewSection({headerView: header4});
	
	function add_a_row(image, text, callback) {
			var row = Ti.UI.createTableViewRow({
				height : __l(42),
				hasChild : Ti.App.is_android ? false : true,
				selectedBackgroundColor: "#E8E8E8",
				backgroundColor: 'white',
				callback: callback
			});
			
			row.add(Ti.UI.createImageView({
				left: __l(20),
				top: __l(10),
				bottom: __l(10),
				width: __l(22),
				height: __l(22),
				hires: true,
				image: image
			}));
			
			var label = Ti.UI.createLabel({
				top : __l(9),
				bottom : __l(9),
				left : __l(62),
				height : __l(24),
				width: Ti.UI.SIZE,
				font : {
					fontSize : __l(15)
				},
				color: "#333",
				text : text,
				touchEnabled : false
			});
			row.label = label;
			row.add(label);
			
			if (Ti.App.is_android){
				row.add(Ti.UI.createImageView({
					right: __l(10),
					top: __l(11),
					bottom: __l(11),
					width: __l(18),
					height: __l(18),
					touchEnabled: false,
					image: "/images/table_right.png"
				}));
			}
			
			row.addEventListener("click", function(e){
				callback();
			});
			return row;
	}
	
	section1.add(add_a_row("/images/my/my01.png", "记录空间", function(e){
		if(!check_login()) {
			to_login();
			return;
		}
		
		show_window('user', {
			id: user_id(),
			title: '记录空间'
		});	
	}));
	
	var message_row = add_a_row("/images/my/my05.png", "我的消息", function(e){
		if(!check_login()) {
			to_login();
			return;
		}

		cache_http_call(Ti.App.mamashai + "/bbrl_code/message2.txt", "code_message", function(e){
			var Message = eval(e.responseText);
			var win = new Message({
				id: user_id(),
				backButtonTitle: '',
				backgroundColor: 'white',
				title: '我的消息'
			});
			if (!Ti.App.is_android) {
				win.hideTabBar();
			}
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		});
	});
	section1.add(message_row);
	
	section1.add(add_a_row("/images/my/my07.png", "我的资料", function(e){
		if(!check_login()) {
			to_login();
			return;
		}
		
		show_window('profile', {
			id: user_id(),
			title: '我的资料'
		});

		return;
	}));
	
	section1.add(add_a_row("/images/my/my02.png", "我的收藏", function(e){
		if(!check_login()) {
			to_login();
			return;
		}
		
		cache_http_call(Ti.App.mamashai + "/bbrl_code/favourites.txt", "code_favourites", function(e){
			var Fav = eval(e.responseText);
			var win = new Fav({
				id: user_id(),
				backButtonTitle: '',
				backgroundColor: 'white',
				title: '我的收藏'
			});
			if (!Ti.App.is_android) {
				win.hideTabBar();
			}
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		});
	}));
	
	section3.add(add_a_row("/images/my/my10.png", "我的晒豆", function(e){
		if (!check_login()){
			to_login();
			return;
		}
			
		cache_http_call(Ti.App.mamashai + '/api/statuses/ddh_rules', "ddh_rules", function(e){
			eval(e.responseText);
		});
	}));
	
	section3.add(add_a_row("/images/my/my11.png", "礼物订单", function(e){
		if (!check_login()){
			to_login();
			return;
		}
			
		cache_http_call(Ti.App.mamashai + "/bbrl_code/ddh_my.txt", "cache_ddh_my", function(e){
			var OrdersWin = eval(e.responseText);
		});
	}));
	
	section4.add(add_a_row("/images/my/my08.png", "邀请好友", function(e){
		if(!check_login()) {
			to_login();
			return;
		}
			
		cache_http_call(Ti.App.mamashai + "/bbrl_code/invite_user2.txt", "invite_user3", function(e){
			eval(e.responseText);
		});
	}));
	
	win.has_draft = false;
	var draft_row = add_a_row("/images/my/my06.png", "草稿箱", function(e){
		show_window("draft", {
			title: '草稿箱'
		});
	});
	
	var record = Ti.App.db.execute('SELECT * FROM drafts where user_id=?', user_id());
	if (record.isValidRow()){
		section4.add(draft_row);
		win.has_draft = true;
	}
	else{
		function add_draft(){
			if (!win.has_draft){
				section4.add(draft_row);
				win.has_draft = true;
			}	
		}
		Ti.App.addEventListener("add_draft", add_draft);
		win.addEventListener("close", function(){
			Ti.App.removeEventListener("add_draft", add_draft);
		});
	}
	record.close();
	
	section4.add(add_a_row("/images/my/my17.png", "系统设置", function(e){
		var url = Ti.App.mamashai + "/bbrl_code/setup2.txt";
		cache_http_call(url, "setup_code3", function(e){
			eval(e.responseText);
		});
	}));
	
	tableview.data = [section1, section3, section4];
	win.add(tableview);
	
	var infolight = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.INFO_LIGHT,
		width: 50,
		left: 10
	});
	
	infolight.addEventListener("click", function(){
		var Help = require("help");
		var win = new Help({
			backgroundColor : "#B4D3D7"
		});
		
		if (Ti.App.is_android){
			pre(win);
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		}
		else{
			win.open();
		}
	});
	
	if (!Ti.App.is_android){
		if (Ti.App.is_bbrl)
			win.setRightNavButton(infolight);
	}	
	
	//消息提醒
	function set_mention() {	
		if (!check_login())
			return;
		
		if(message_row.mention) {
			message_row.mention.hide();
			message_row.remove(message_row.mention);
		}
		if (!Ti.App.is_android){
			Ti.App.currentTabGroup.tabs[3].badge = null;
			Titanium.UI.iPhone.appBadge = null;
		}
		var record = require('/lib/mamashai_db').db.select_one_json("mention", 0);
		var json = null;
		if(!record.blank) {
			json = JSON.parse(record.json);
		} else
			return;
	
		var message_count = json.dm + json.mentions + json.comments + json.gifts + json.followers + json.claps;
		
		if(message_count > 0 && !Ti.App.is_android) {
			Ti.App.currentTabGroup.tabs[3].badge = message_count;
			Titanium.UI.iPhone.appBadge = message_count;
		}
		//android系统下报错，故判断
		if(message_count > 0) {
			if (!Ti.App.is_android){
				var badge = require('/lib/badge').create_badge(message_count);
				badge.left = __l(130);
				badge.top = __l(12);
				message_row.add(badge);
				message_row.mention = badge;
			}
			else{
				var badge = require('/lib/badge').create_badge(message_count);
				badge.left = __l(130);
				badge.top = __l(11);
				message_row.add(badge);
				message_row.mention = badge;
			}
		}
	}
	
	Titanium.App.addEventListener('get_mention', function(e) {
		set_mention();
	});
	
	if (Ti.App.is_android)
		get_mentions();
	
	return win;
}

module.exports = Center;

