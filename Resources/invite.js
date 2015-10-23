function Invite(attr){
	Ti.include("public.js");
	var Mamashai = require("lib/mamashai_ui");
	var win = Titanium.UI.createWindow(attr);
		
	var label = Ti.UI.createLabel({
		left : __l(8),
		right: __l(40),
		top : __l(0),
		height: __l(30),
		font : {
			fontSize : __l(13)
		},
		textAlign: 'left',
		color: "#333",
		text: "选择你的邀请人，可以让他获得10个晒豆"
	});
	win.add(label);
	
	var search_field = Ti.UI.createSearchBar({
		top: __l(30),
		left: __l(0),
		right: __l(0),
		backgroundColor: 'transparent',
		barColor: Ti.App.ios7 ? "#eee" : Ti.App.bar_color,
		hintText: '输入您的邀请人的昵称',
		showCancel : Ti.App.is_android ? false : true,
		height: Ti.App.is_android ? __l(40) : 40
	});
	win.add(search_field);
	var ok = Ti.UI.createButton({
		right: __l(10),
		top: __l(31),
		width: __l(60),
		height: __l(35),
		title: "搜索"
	});
	ok.addEventListener("click", function(e){
		search_field.blur();
		search_field.fireEvent("return");
	});
	pre_btn(ok);
	if (Ti.App.is_android){
		search_field.right = __l(80);
		win.add(ok);
	}
		
	search_field.addEventListener("return", function(e){
		if (win.tableview)
			win.remove(tableview);
		tableview = Mamashai.ui.make_weibo_tableview("find_users", Ti.App.mamashai + "/api/statuses/find_users?tp=exact&text=" + search_field.value, null, "users");
		tableview.make_row_callback = make_user_row;
		tableview.no_new = true;
		tableview.no_more = true;
		tableview.top = __l(70);
		tableview.addEventListener("click", function(e){
			var alertDialog = Titanium.UI.createAlertDialog({
					title : '提示',
					message : '确定' + e.rowData.json.name + '为我的邀请人？',
					buttonNames : ['取消', '确定'],
					cancel : 0
			});
			alertDialog.addEventListener('click', function(evt) {
				switch (evt.index) {
					case 1:
						http_call(Ti.App.mamashai + "/api/statuses/set_invite/" + e.rowData.json.id + "?sid=" + Ti.Platform.id + "&" + account_str(), function(r){
							if (r.responseText.indexOf("error") >= 0)
								show_alert("提示", r.responseText.split(":")[1]);
							else{
								require('lib/mamashai_db').db.insert_json("set_invite", 0, "true");
								
								show_alert("提示", e.rowData.json.name + "已经获得" + r.responseText +"个晒豆");
							}	
						});
						break;
				}
			});
			alertDialog.show();
		});
		win.tableview = tableview;
		win.add(tableview);
		tableview.send();
		search_field.blur();
	});

	function make_user_row(json){
		var row = Ti.UI.createTableViewRow({
			height : __l(64),
			id : json.id,
			selectedBackgroundColor : '#fEE',
			url : "user.js",
			json: json,
			className : 'user'
		});
		
		var user_logo = Ti.UI.createImageView({
			top : __l(8),
			left : __l(8),
			width : __l(48),
			height : __l(48),
			defaultImage : "./images/default.gif",
			hires : true,
			image : Ti.App.mamashai + encodeURI(json.logo_url_thumb140),
			borderRadius : __l(4),
			touchEnabled: false
		});
	
		var user_name = Ti.UI.createLabel({
			top : __l(8),
			left : __l(64),
			width: __l(200),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(15)
			},
			color: "#333",
			text : json.name,
			touchEnabled: false
		});
	
		var kid_json = json.user_kids[0]
		if (json.kid_id && json.user.user_kids != "null"){
			for(var i=0; i<json.user.user_kids.length; i++){
				if (json.kid_id == json.user.user_kids[i].id){
					kid_json = json.user.user_kids[i]
					break;
				}
			}	
		}
		
		var user_posts = Ti.UI.createLabel({
			top : __l(34),
			left : __l(64),
			right: __l(10),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(14)
			},
			color: "#333",
			text : kid_desc(kid_json, datetime_str(new Date)),
			touchEnabled: false
		});
		
		row.add(user_logo);
		row.add(user_name);
		row.add(user_posts);
		
		return row;
	}
	
	pre(win);
	add_default_action_bar(win, win.title, true);
	
	logEvent('invite');
	
	return win;
}

module.exports = Invite;