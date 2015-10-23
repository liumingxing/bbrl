Ti.include("public.js")
var win = Titanium.UI.currentWindow;

if (Ti.App.is_android){
		if (win.json.score <= 5){
				add_tab_to_actionbar(win, win.title, [{
			           		title: '申请用户',
			           		selected: true,
			           		click: function(){
			           			wrapper.scrollToView(0);
			           		}
			           },
			           {
			           		title: '成功用户',
			           		click: function(){
			           			wrapper.scrollToView(1);
			           		}
			           },
			           {
			           		title: '试用报告',
			           		click: function(){
			           			wrapper.scrollToView(2);
			           		}
			           }
			    ]);
		}
		else{
			add_default_action_bar(win, "查看报告", true)
		}
}
else{
	var tab_title = Titanium.UI.iOS.createTabbedBar({
		labels : ['申请用户', '成功用户', '试用报告'],
		index : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor : Ti.App.bar_color,
		width : __l(180),
		height : 30
	});
	
	tab_title.addEventListener("click", function(e) {
		wrapper.scrollToView(e.index)
	})
}


var wrapper = Ti.UI.createScrollableView({
	showPagingControl : false,
	left : 0,
	right : 0,
	top : 0,
	bottom : 0,
	width : Ti.App.platform_width
});

win.add(wrapper)

//申请用户
function create_view_1(){
	var wrapper = Ti.UI.createScrollView({
		top: __l(6), 
		left: 0,
		bottom: 0,
		right: 0,
		layout: 'horizontal',
		contentHeight: 'auto',
		contentWidth: Ti.App.platform_width
	})
	
	var label = Ti.UI.createLabel({
		text: "进店人数：" + win.json.visit + "    申请人数：" + win.json.order_count,
		left: 0,
		right: 0,
		width: Ti.App.platform_width,
		height: __l(30),
		font:{
			fontSize: __l(14)
		},
		color: "#333",
		textAlign: 'center'
	})
	
	if (win.json.score<5)
		wrapper.add(label)
	
	var more_button = Titanium.UI.createButton({
		top : __l(10),
		bottom : __l(6),
		left : (Ti.App.platform_width-__l(300))/2,
		width : __l(300),
		height : __l(40),
		title : "下一页",
		font : {fontSize: __l(18)}
	});
	pre_btn(more_button)
	more_button.addEventListener("click", function(){
		show_loading();
		page += 1;
		xhr.open('GET', Ti.App.mamashai + '/api/statuses/ddh_users/'+ win.json.id +'?page=' + page)
		xhr.send();
	})

	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/statuses/ddh_users/" + win.json.id + "?page=" + page);
	}
	xhr.onload = function() {
			hide_loading();
			if (wrapper.more_button){
				wrapper.remove(more_button);
			}
			
			var json = JSON.parse(this.responseText)
			if ((!json || json.length == 0) && page == 1){
				var label = Ti.UI.createLabel({
					text: "没有人申请",
					top: __l(10),
					left: __l(10),
					right: __l(10),
					textAlign: 'center',
					font:{
						fontSize: 14
					},
					color: '#333'
				})
				wrapper.add(label)
				return;
			}
			for(var i=0; i<json.length; i++){
				var button_wrapper = Titanium.UI.createView({
					top : __l(4),
					bottom : __l(4),
					left : (Ti.App.platform_width - __l(80)*3)/4,
					width : __l(80),
					height : __l(80),
					borderColor: "#9F8652",
					borderWidth: 1,
					borderRadius: __l(12)
				});
	
				var button = Titanium.UI.createButton({
					top : 2,
					left : 2,
					right : 2,
					bottom : 2,
					textAlign : "center",
					json : json[i],
					borderColor: "#ddd",
					borderRadius: __l(10),
					backgroundSelectedImage: "none",
					style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
				});
				
				button.addEventListener("click", function(e){
					show_window("user", {
						title: e.source.json.name,
					    id : e.source.json.id
					});
				});
				button_wrapper.add(button)
				
				var user_logo = Ti.UI.createImageView({
					top : __l(4),
					width : __l(38),
					height : __l(38),
					defaultImage : "./images/default.gif",
					hires : true,
					button: button,
					image : "http://www.mamashai.com" + encodeURI(json[i].logo_url_thumb140)
				});
				user_logo.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				button_wrapper.add(user_logo)

				var user_name = Ti.UI.createLabel({
					bottom : __l(21),
					left : __l(2),
					right : __l(2),
					height : __l(16),
					font : {
						fontSize : __l(12)
					},
					text : json[i].name,
					color: "#333",
					button: button,
					textAlign : "center"
				});
				user_name.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				button_wrapper.add(user_name);

				var kid_name = Ti.UI.createLabel({
					bottom : __l(6),
					left : __l(1),
					right : __l(1),
					height : __l(15),
					font : {
						fontSize : __l(11)
					},
					color: "#333",
					textAlign : "center",
					button: button,
					text : "备孕"
				});
				kid_name.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				if(json[i].user_kids && json[i].user_kids.length > 0) {
					var kid_json = json[i].user_kids[0]

					var str = "";
					if(kid_json.gender == 'm') {
						str += "儿子"
					} else if(kid_json.gender == 'f') {
						str += '女儿'
					}
					if (kid_json.birthday && kid_json.birthday.length > 4)
						str += detail_age_for_birthday(kid_json.birthday);
					kid_name.text = str;
				}
				button_wrapper.add(kid_name);
				
				wrapper.add(button_wrapper)
			}
			
			if (json.length == 12){
				wrapper.add(more_button)
				wrapper.more_button = more_button;
			}
	}
	
	var page = 1
	xhr.open('GET', Ti.App.mamashai + '/api/statuses/ddh_users/'+ win.json.id +'?page=' + page)
	xhr.send();
	
	return wrapper;
}

//成功用户
function create_view_2(){
	var wrapper = Ti.UI.createScrollView({
		top: 0, 
		left: 0,
		bottom: 0,
		right: 0,
		layout: 'horizontal',
		contentHeight: 'auto',
		contentWidth: Ti.App.platform_width
	})
	
	var more_button = Titanium.UI.createButton({
		top : __l(10),
		bottom : __l(6),
		left : (Ti.App.platform_width-__l(300))/2,
		width : __l(300),
		height : __l(40),
		title : "下一页",
		font : {fontSize: __l(18)}
	});
	pre_btn(more_button)
	more_button.addEventListener("click", function(){
		show_loading();
		page += 1;
		xhr.open('GET', Ti.App.mamashai + '/api/statuses/ddh_users/'+ win.json.id +"?status=success&page=" + page)
		xhr.send();
	})

	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/statuses/ddh_users/" + win.json.id + "?status=success&page=" + page);
	}
	xhr.onload = function() {
			hide_loading();
			if (wrapper.more_button){
				wrapper.remove(more_button);
			}
			
			var json = JSON.parse(this.responseText)
			if ((!json || json.length == 0) && page == 1){
				var label = Ti.UI.createLabel({
					text: "没有人申请成功",
					top: __l(10),
					left: __l(10),
					right: __l(10),
					textAlign: 'center',
					font:{
						fontSize: 14
					},
					color: '#333'
				})
				wrapper.add(label)
				return;
			}
			for(var i=0; i<json.length; i++){
				var button_wrapper = Titanium.UI.createView({
					top : __l(4),
					bottom : __l(4),
					left : (Ti.App.platform_width - __l(80)*3)/4,
					width : __l(80),
					height : __l(80),
					borderColor: "#9F8652",
					borderWidth: 1,
					borderRadius: __l(12)
				});
	
				var button = Titanium.UI.createButton({
					top : 2,
					left : 2,
					right : 2,
					bottom : 2,
					textAlign : "center",
					json : json[i],
					borderColor: "#ddd",
					borderRadius: __l(10),
					backgroundSelectedImage: "none",
					style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
				});
				
				button.addEventListener("click", function(e){
					show_window("user", {
						title: e.source.json.name,
					    id : e.source.json.id
					});
				});
				button_wrapper.add(button)
				
				var user_logo = Ti.UI.createImageView({
					top : __l(4),
					width : __l(38),
					height : __l(38),
					defaultImage : "./images/default.gif",
					hires : true,
					button: button,
					image : "http://www.mamashai.com" + encodeURI(json[i].logo_url_thumb140)
				});
				user_logo.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				button_wrapper.add(user_logo)

				var user_name = Ti.UI.createLabel({
					bottom : __l(21),
					left : __l(2),
					right : __l(2),
					height : __l(16),
					font : {
						fontSize : __l(12)
					},
					text : json[i].name,
					color: "#333",
					button: button,
					textAlign : "center"
				});
				user_name.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				button_wrapper.add(user_name);

				var kid_name = Ti.UI.createLabel({
					bottom : __l(6),
					left : __l(1),
					right : __l(1),
					height : __l(15),
					font : {
						fontSize : __l(11)
					},
					color: "#333",
					textAlign : "center",
					button: button,
					text : "备孕"
				});
				kid_name.addEventListener("click", function(e){
					if (e.source.button){
						e.source.button.fireEvent("click")
					}
				})
				if(json[i].user_kids && json[i].user_kids.length > 0) {
					var kid_json = json[i].user_kids[0]

					var str = "";
					if(kid_json.gender == 'm') {
						str += "儿子"
					} else if(kid_json.gender == 'f') {
						str += '女儿'
					}
					if (kid_json.birthday && kid_json.birthday.length > 4)
						str += detail_age_for_birthday(kid_json.birthday);
					kid_name.text = str;
				}
				button_wrapper.add(kid_name);
				
				wrapper.add(button_wrapper)
			}
			
			if (json.length == 12){
				wrapper.add(more_button)
				wrapper.more_button = more_button;
			}
	}
	
	var page = 1
	xhr.open('GET', Ti.App.mamashai + '/api/statuses/ddh_users/'+ win.json.id +"?status=success&page=" + page)
	xhr.send();
	
	return wrapper;
}

//试用报告
function create_view_3(){
	Mamashai = require("lib/mamashai_ui");
	var tableview = Mamashai.ui.make_weibo_tableview('ddh_report' + win.json.id, Ti.App.mamashai + "/api/statuses/public_timeline.json?cond1=`from`='ddh_report' and from_id=" + win.json.id, user_id(), "posts")
	tableview.no_empty_tip = true
	tableview.send()
	return tableview
}

wrapper.addView(create_view_1())
if (win.json.score <= 5){
	if (!Ti.App.is_android)
		win.setTitleControl(tab_title)
	
	wrapper.addView(create_view_2())
	wrapper.addView(create_view_3())
}
else{
	win.title = "兑换用户"
}

