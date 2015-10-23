function Message(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	var Mamashai = require("lib/mamashai_ui");
	
	var s1 = '消息';
	var s4 = '私信';
	var record = require('/lib/mamashai_db').db.select_one_json("mention", 0);
	var json = null;
	if(!record.blank) {
		var json = JSON.parse(record.json);
		var msg_count = json.comments + json.mentions + json.gifts + json.followers + parseInt(json.claps);
				
		if (msg_count > 0){
			s1 = '消息 (' + msg_count + ")";
		}
		if (json.dm >0){
			s4 = '私信 (' + json.dm + ')';
		}
	}
	
	if (!Ti.App.is_android){
			win.title = '';
			var tab_title = Titanium.UI.iOS.createTabbedBar({
				labels : [s1, s4],
				index : 0,
				style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
				backgroundColor : Ti.App.bar_color,
				width : __l(160),
				height : 30,
				left: __l(100),
				right: __l(100)
			});
		
			tab_title.addEventListener("click", function(e) {
				win.tab_click(e.index);
			});
			setTimeout(function(){
				win.setTitleControl(tab_title);
			}, 400);
		}
		else{
				add_tab_to_actionbar(win, win.title, [{
			           		title: s1,
			           		selected: true,
			           		click: function(){
			           			win.tab_click(0);
			           		}
			           },
			           {
			           		title: s4,
			           		click: function(){
			           			win.tab_click(1);
			           		}
			           }
			    ]);
		}
		
	win.addEventListener("open", function(e){
		function refresh_mention(){
			var record = require('/lib/mamashai_db').db.select_one_json("mention", 0);
			var json = null;
			if(!record.blank) {
				var json = JSON.parse(record.json);
				var s1 = '消息';
				var s4 = '私信';
				
				var msg_count = json.comments + json.mentions + json.gifts + json.followers + parseInt(json.claps);
				
				if (msg_count > 0){
					s1 = '消息 (' + msg_count + ")";
				}
				if (json.dm >0){
					s4 = '私信 (' + json.dm + ')';
				}
				
				if (!Ti.App.is_android){
					tab_title.labels = [s1, s4];
				}
			}
		}
		
	
		function make_remind_row(json){
			if (!json.author)
				return false;
	
			var row = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				json : json,
				selectedBackgroundColor: "#E8E8E8",
				className: json.tp
			});
			var user_logo = Ti.UI.createImageView({
				top : __l(8),
				left : __l(8),
				width : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
				height : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
				defaultImage : "/images/default.gif",
				hires : true,
				json : json.author
				//touchEnabled : false
			});
			user_logo.addEventListener("click", function(e) {
				show_window("user", {
					title: e.source.json.name,
					id: e.source.json.id
				});
							
				return false;
			});
			if(json.author.logo_url_thumb140.length > 0) {
				user_logo.image = Ti.App.aliyun + encodeURI(json.author.logo_url_thumb140)
			}
			
			var post = Ti.UI.createView({
				height : Ti.UI.SIZE,
				layout : 'vertical',
				left : Titanium.Platform.osname == 'ipad' ? 76 : __l(46),
				top : 0,
				bottom : __l(2),
				right : 0,
				touchEnabled : false
			});
		
			var top_section = Ti.UI.createView({
				height : __l(20),
				left : 0,
				top : 0,
				right : 0,
				touchEnabled : false
			});
		
			var user = Ti.UI.createLabel({
				top : Ti.App.is_android ? 2 : __l(4),
				left : 0,
				height : __l(18),
				font : {
					fontSize : __l(14)
				},
				color: "#333",
				text : json.author.name,
				touchEnabled : false
			});
		
			var refer = Ti.UI.createLabel({
				top : __l(6),
				left : __l(150),
				right : __l(6),
				textAlign : 'right',
				height : Ti.UI.SIZE,
				font : {
					fontSize : Ti.App.is_android ? __l(11) : __l(13)
				},
				color : "gray",
				text : referTime(json.created_at),
				touchEnabled : false
			});
		
			top_section.add(user);
			top_section.add(refer);
			post.add(top_section);
		
			var content = Ti.UI.createLabel({
				top : __l(4),
				left : 0,
				right : __l(4),
				bottom : __l(2),
				height : Ti.UI.SIZE,
				font : {
					fontSize : __l(15)
				},
				color: "#333",
				text : "",
				touchEnabled : false
			});
			post.add(content);
			row.add(user_logo)
			row.add(post)
			
			switch(json.tp){
				case "comment":          //评论
					if (json.comment && json.comment.content)
						content.text = json.comment.content;
					else
						content.text = ""
					break;
				case "post":             //转发
					content.text = json.post.content
					if (json.post.forward_post)
						content.text = "转发：" + content.text
					break;
				case "gift":             //送礼物
					content.text = json.gift_get.content
					break;
				case "clap":             //点赞
					content.text = "      赞"
					break;
				case "follow":
					content.text = "关注了你"
					break;
				case "unfollow":
					content.text = "取消了对你的关注"
					break;
			}
			
			if (json.tp == "comment" || json.tp == "clap" || (json.tp == "post" && json.post.forward_post)){
				var forward_jian = Ti.UI.createImageView({
					width : __l(11),
					height : __l(9),
					left : __l(30),
					top : 0,
					image : "/images/jian.png",
					touchEnabled : false
				})
				post.add(forward_jian);
		
				var forward = Ti.UI.createView({
					height : Ti.UI.SIZE,
					left : 0,
					top : 0,
					bottom : __l(4),
					right : __l(8),
					border : 1,
					borderRadius : __l(4),
					backgroundColor : "#eee",
					borderColor : "#eee",
					layout : 'vertical',
					zIndex : 1,
					touchEnabled : false
				});
		
				var forward_content = Ti.UI.createLabel({
					top : __l(6),
					left : __l(6),
					right : __l(6),
					bottom : __l(6),
					height : Ti.UI.SIZE,
					font : {
						fontSize : __l(14)
					},
					color: "#333",
					text : "原文",
					touchEnabled : false
				});
				forward.add(forward_content);
				post.add(forward)
				
				if (json.tp == "comment"){
					forward_content.text = json.comment.post.content 
				}
				else if (json.tp == "post"){
					forward_content.text = json.post.forward_post.content
				}
				else if (json.tp == "clap"){
					forward_content.text = json.clap_post.content
				}
			}
			
			if (json.tp == "gift"){
				//有图片
				var logo = Ti.UI.createImageView({
					left : __l(30),
					top: __l(8),
					bottom : __l(8),
					width : __l(50),
					height : __l(50),
					image : "http://www.mamashai.com" + encodeURI(json.gift_get.gift.logo_url),
					hires : true
				});
				
				post.add(logo);
				
				var gift_button = Ti.UI.createButton({
						top: __l(-45),
						right: __l(30),
						width: __l(100),
						height: __l(28),
						title : "回赠",
						id : json.author.id,
						font : {fontSize: __l(15)}
				})
				pre_btn(gift_button)
				gift_button.addEventListener("click", function(e){
						var gift_win = Titanium.UI.createWindow({
							url : "gifts.js",
							title : "送礼物",
							id : e.source.id
						});
						gift_win.backButtonTitle = '返回'
						pre(gift_win)
						Ti.App.currentTabGroup.activeTab.open(gift_win, {
							animated : true
						});
						show_loading()
				});
				post.add(gift_button);
				post.touchEnabled = true;
			}
			
			return row;
		}
	
		function tab_click(index){
			if (index != 0 && index != 1)
				return;
				
			if (win.tableview){
				win.remove(win.tableview);
				win.tableview = null;
			}
			if (!Ti.App.is_android)	
				show_loading();
				
			if(index == 0) {
				//tableview = Mamashai.ui.make_weibo_tableview("comments", Ti.App.mamashai + "/api/statuses/comments_to_me.json?1=1", user_id(), "comments")
				tableview = Mamashai.ui.make_weibo_tableview("reminds8", Ti.App.mamashai + "/api/statuses/user_reminds.json?1=1", user_id(), "comment_at_reminds")
				tableview.make_row_callback = make_remind_row;
				tableview.addEventListener("click", function(e){
					if (e.source.defaultImage){
						return;
					}
					
					if (e.source.name == "get_more" || e.source.name == "get_new"){
						return;
					}
					
					var json = e.rowData.json 
					var post_json = null;
					if(json.tp == "clap"){
						post_json = json.clap_post;
					}
					else if (json.tp == "comment"){
						post_json = json.comment.post
						
						var optionsDialogOpts = {
							options: e.rowData.json.comment.post.user_id == parseInt(user_id()) ? ['个人资料', '查看记录原文', '回复评论', '回复全部', '取消'] : ['个人资料', '查看记录原文', '回复评论', '取消'], 
							cancel: e.rowData.json.comment.post.user_id == parseInt(user_id()) ? 4 : 3
						};
						var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
						dialog.addEventListener('click',function(e2)
						{
							if (e2.index == 0){				//作者资料
								show_window("user", {
									title: e.rowData.json.author.name,
									id : e.rowData.json.author.id
								});
								
								return;
							}
							else if (e2.index == 1){
								var url = Ti.App.mamashai + '/api/statuses/show/' + e.rowData.json.comment.post.id;
								http_call(url, function(e){
									cache_http_call(Ti.App.mamashai + "/bbrl_code/post.txt", "code_post", function(e3){
										var Post = eval(e3.responseText);
										var json = JSON.parse(e.responseText)
										var win = new Post({
											title: "记录详情",
											json : json,
											backgroundColor : 'white',
											backButtonTitle : '返回',
											id: json.id
										});
										if (!Ti.App.is_android) {
											win.hideTabBar();
										}
										Ti.App.currentTabGroup.activeTab.open(win, {
											animated : true
										});			
									});
									
									
									/*
									var json = JSON.parse(e.responseText)
									var win = Titanium.UI.createWindow({
										title: "记录详情",
										json : json,
										backgroundColor : 'white',
										backButtonTitle : '返回',
										id: json.id
									});
									pre(win)
									Mamashai.ui.make_post_win(win)
										
									Ti.App.currentTabGroup.activeTab.open(win, {
											animated : true
									});
									*/
								});
							}
							else if (e2.index == 2){
								show_window("comment", {
									json : e.rowData.json.comment.post,
									o_content: e.rowData.json.comment.post.content,
									id: e.rowData.json.comment.post.id,
									text : "回复@" + e.rowData.json.author.name + "：",
									title : "评论"
								})
							}
							else if (e.rowData.json.comment.post.user_id == parseInt(user_id()) && e2.index == 3){
								show_window("comment", {
									json : e.rowData.json.comment.post,
									o_content: e.rowData.json.comment.post.content,
									reply_all : true,
									id: e.rowData.json.comment.post.id,
									text : "",
									title : "回复全部评论"
								})
							}
						});
						dialog.show();
						return;
					}
					else if (json.tp == "post"){
						post_json = json.post
					}
					if (post_json && post_json.from == 'album_book'){
						var xhr = Ti.Network.createHTTPClient()
						xhr.timeout = Ti.App.timeout
						xhr.onerror = function(e) {
								hide_loading()
								show_notice("获取照片书失败")
						};
						xhr.onload = function() {
								hide_loading()
								var json = JSON.parse(this.responseText)
								var AlbumMv = require('album_mv')
								var win = new AlbumMv({
									title : json.name,
									backgroundColor : '#78A1A7',
									json : json,
									id : json.id,
									backButtonTitle: '返回'
								});
								pre(win)
								Ti.App.currentTabGroup.activeTab.open(win, {
									animated : true
								});
						};
						
						var url = Ti.App.mamashai + "/api/mbook/album_book.json?id=" + post_json.from_id;
						xhr.open("GET", url)
						xhr.send()
						show_loading()
						return;
					}
					
					if (post_json){
						var url = Ti.App.mamashai + '/api/statuses/show/' + post_json.id
						http_call(url, function(e){
							var win = Titanium.UI.createWindow({
								title: "记录详情",
								json : JSON.parse(e.responseText),
								barImage : '/images/hua.png',
								backgroundColor : 'white',
								backButtonTitle : '返回',
								id: post_json.id
							});
							pre(win)
							Mamashai.ui.make_post_win(win)
								
							Ti.App.currentTabGroup.activeTab.open(win, {
									animated : true
							});
						});
					}
				});
			}
			else if(index == 1) {
				/////////////////////////我收到的私信////////////////////////
				tableview = Mamashai.ui.make_weibo_tableview("private", Ti.App.mamashai + "/api/direct_messages.json?1=1", user_id(), "message_topics");
				tableview.no_empty_tip = true;
				tableview.no_cache = true;
				tableview.no_new = true;
			}
			tableview.bottom = 0;
			tableview.top = Ti.App.android_offset;
			var v = make_tableview_pull(tableview);
			win.add(v);
			win.tableview = v;
			tableview.pull_callback = get_mentions;
			tableview.send();
		}
		
		win.tab_click = tab_click;
		refresh_mention();
		
		//////////////////////@我的view构造///////////////////
		tab_click(0);
		logEvent('message');
	});
	return win;
}

module.exports = Message;
