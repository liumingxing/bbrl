Ti.include("public.js");
var win = Titanium.UI.currentWindow;

var tableview = Ti.UI.createTableView({
	top : 0,
	bottom : 0,
	left: 0,
	width: Ti.App.platform_width
});
win.add(tableview);

var get_more_row = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE,
	selectedBackgroundColor : '#eee',
	tag : 'get_more',
	textAlign: "center",
	name: 'get_more'
});

var get_more_row_center = Ti.UI.createView({
	top : 0,
	bottom : 0,
	width : __l(160),
	height : __l(64)
})

var get_more_title = Ti.UI.createLabel({
	top : __l(18),
	bottom : __l(12),
	left : __l(26),
	right : __l(10),
	textAlign : 'center',
	height : Ti.UI.SIZE,
	font : {
		fontSize : __l(22)
	},
	width: __l(90),
	color: "#333",
	text : '下一页'
});

var navActInd = Titanium.UI.createActivityIndicator({
	left : __l(2),
	top : __l(22),
	width : __l(12),
	style : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
});

get_more_row_center.add(get_more_title);
get_more_row_center.add(navActInd);
get_more_row.navActInd = navActInd;


get_more_row.add(get_more_row_center);
get_more_row.addEventListener("click", function(e){
	navActInd.show();
	page += 1;
	var url = "https://api.weibo.com/2/friendships/friends/bilateral.json?count=50&access_token=" + token + "&uid=" + uid + "&page=" + page;
	xhr.open('GET', url);
	xhr.send();
});


// Create a Button.
var done = Ti.UI.createButton({
	title : '邀请'
});

// Listen for click events.
done.addEventListener('click', function() {
	if(!tableview.data || tableview.data[0].length == 0) {
		show_notice("对不起，没有粉丝可邀请");
		return;
	}

	var data = tableview.data[0];
	var result = ""
	for(var i = 0; i < data.rowCount; i++) {
		var row = data.rows[i];
		if(row.value == 1) {
			result += "@" + row.filter + "，";
		}
	}
	if(result == "") {
		show_notice("请选择粉丝");
		return;
	}

	var WritePost = require("write_post")
	var win = new WritePost({
		title : "邀请微博好友",
		backgroundColor : '#fff',
		text : result + "快给你的手机装个宝宝日历，养育要点和记录结合，很贴心！下载地址：http://t.cn/zHIAP2N，",
		from : "wenzi"
	});
	win.backButtonTitle = ''
	pre(win)
	Ti.App.currentTabGroup.activeTab.open(win, {
		animated : true
	});

});
var token = Ti.App.Properties.getString("token", '');

var page = 1;
var xhr = null;
var uid = null;
var account_xhr = Ti.Network.createHTTPClient({
	timeout: Ti.App.timeout,
	onerror: function(){
		hide_loading();
	},
	onload : function() {
		var json = JSON.parse(this.responseText)
		uid = json.uid
		
		xhr = Ti.Network.createHTTPClient({
			timeout: Ti.App.timeout,
			onerror : function() {
				hide_loading()
				show_notice("获取好友失败")
			},
			onload : function() {
				hide_loading();
				
				var pre_length = get_row_count(tableview);
				
				if (get_row_count(tableview) > 0)
					tableview.deleteRow(get_row_count(tableview) - 1);
					
				var json = JSON.parse(this.responseText)
					
				var CheckBox = require("lib/checkbox").CheckBox

				for(var i = 0; i < json.users.length; i++) {
					var user = json.users[i];
					var row = Ti.UI.createTableViewRow({
						//selectedBackgroundColor : "white",
						filter : user.screen_name,
						value : 0,
						
						height : Ti.UI.SIZE,
						color: '#333',
						selectedBackgroundColor: '#ccc'
					});

					var user_logo = Ti.UI.createImageView({
						top : __l(5),
						bottom : __l(5),
						left : __l(5),
						width : __l(30),
						height : __l(30),
						defaultImage : "./images/default.gif",
						image : user.profile_image_url,
						hires : true
					});

					var label = Ti.UI.createLabel({
						text : user.screen_name,
						top : __l(5),
						left : __l(44),
						bottom : __l(5),
						color : '#666666',
						font : {
							fontSize : __l(15)
						},
						height : 'auto',
						width : __l(200)
					});
					
					var check = new CheckBox({
							top : 0,
							height : 44,
							width : 44,
							right : 20,
							row: row
					})	
					
					check.view.addEventListener("click", function(e){
						if (e.source.value == 1)
							e.source.row.value = 1;
						else
							e.source.row.value = 0;
					})
					
					row.add(user_logo)

					row.add(label)

					row.add(check.view)

					tableview.appendRow(row)					
				}

				hide_loading();

				navActInd.hide();
				
				if(json.total_number > get_row_count(tableview)) {
					tableview.appendRow(get_more_row)
					tableview.scrollToIndex(pre_length-1)
				}
				/*
				 if(json.users.length > 0) {
				 page += 1
				 var url = "https://api.weibo.com/2/friendships/followers.json?count=200&access_token=" + token + "&uid=" + uid + "&page=" + page
				 xhr.open('GET', url)
				 xhr.send()
				 }
				 */
			}
		})

		var url = "https://api.weibo.com/2/friendships/friends/bilateral.json?count=50&access_token=" + token + "&uid=" + uid + "&page=" + page
		xhr.open('GET', url)
		xhr.send()
	}
})
account_xhr.open("GET", "https://api.weibo.com/2/account/get_uid.json?access_token=" + token)
account_xhr.send();
show_loading();

					if (!Ti.App.is_android){
						win.setRightNavButton(done);
					}
					else{
						add_default_action_bar2(win, win.title, Ti.Android.drawable.ic_menu_invite, function(){
							done.fireEvent("click");
						});
					}

logEvent('weibo_invite');
