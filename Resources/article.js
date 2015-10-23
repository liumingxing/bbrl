function ArticleWindow(attr){
	Ti.include("public.js");
	var ZhinanAdv = require("lib/zhinan_adv");
	
	var win = Titanium.UI.createWindow(attr);
	
	if (!Ti.App.is_android)
		win.hideTabBar();
	
	var scroll_view = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true
	});
	
	win.add(scroll_view);
	
	var post = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : 0,
		top : 0,
		right : 0,
		bottom: __l(70)
	});
	scroll_view.add(post);
	
	var web_wrapper = Ti.UI.createView({
		top: 0,
		bottom: 2,
		left: 0,
		right: 0,
		height: Ti.UI.SIZE,
		touchEnabled: false
	});
	
	var webview = Ti.UI.createWebView({
		willHandleTouches : false,
		top : 0,
		bottom: 0,
		left: 0,
		right: 0,
		height: Ti.UI.SIZE,
		url : "article.html"
	});
	web_wrapper.add(webview);
	post.add(web_wrapper);
	
	var right_button = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.ACTION});
	right_button.addEventListener("click", function(e){
		var optionsDialogOpts = {
			options: [win.fav ? '取消收藏' : '收藏', '分享给微信好友', '发到微信朋友圈', '取消'],
			cancel: 3
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener('click',function(e)
		{
			if (e.index == 0){
				if (!check_login()){
					to_login();
					return;
				}
				
				var url = Ti.App.mamashai + "/api/statuses/favourite/" + win.id + "?tp=article&" + account_str();
				
				http_call(url, function(e){
					if (e.responseText == "ok"){
						show_notice("收藏成功")
					}
					else if (e.responseText == "cancel"){
						show_notice("取消收藏成功")
						
						require('/lib/mamashai_db').db.delete_one_json("favourites1_post", user_id())
					}
				});
			}
			else if (e.index == 1){												//发给微信好友
				var tiwechat = require('com.mamashai.tiwechat');
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareSession("分享一篇育儿宝典", win.title, "http://www.mamashai.com/mobile/article/" + win.id, "http://www.mamashai.com" + win.json.logo_url);
				logEvent('weixin_session');
			}
			else if (e.index == 2){											//分享微信朋友圈
				var tiwechat = require('com.mamashai.tiwechat');
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareTimeline(win.title, "分享一篇育儿宝典", "http://www.mamashai.com/mobile/article/" + win.id, "http://www.mamashai.com" + win.json.logo_url);
				
				logEvent('weixin_timeline');
				if (!Ti.App.is_android)
					show_notice("成功分享到微信朋友圈")
				var url = Ti.App.mamashai + "/api/statuses/make_weixin_score?" + account_str();
				var xhr = Ti.Network.createHTTPClient()
				xhr.timeout = Ti.App.timeout
				xhr.open("POST", url)
				xhr.send()
			}
		});
		dialog.show();
	});
	if (!Ti.App.is_android)
		win.setRightNavButton(right_button)
	
	var tuiguang_wrapper = Ti.UI.createView({
				height: Ti.UI.SIZE,
				bottom: 0,
				left: 0,
				right: 2
	});
	post.add(tuiguang_wrapper)
	
	function add_like(user_id, user_name){
		if (likes.like_count == 0){
			likes.text += "点赞：";
			likes_wrapper.add(likes);
		}
					
		if (likes.like_count > 0){
			likes.text += "，";
		}
		
		likes.text += user_name;
						
		likes.like_count += 1;
	}
			
	//post.add(webview)
	
	var comment_xhr = null;
	function set_webview_content(json) {
		Ti.App.fireEvent('setWebContent', {
			content : json.article_content.content,
			id: json.id,
			platform: Ti.App.osname,
			width: Ti.App.platform_width,
			factor: Ti.App.logicalDensityFactor
		});
		
		hide_loading();
		
		if (json.tuiguang_url && json.tuiguang_text){
			var button = Ti.UI.createButton({
				style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
				title : "推广：" + json.tuiguang_text,
				height: __l(20),
				left: __l(10),
				font : {fontSize : __l(13)},
				color: '#99F',
				selectedColor: '#99B',
				backgroundColor: "transparent"
			});
			button.addEventListener("click", function(e){
				Ti.App.fireEvent("open_url", {
						title: json.tuiguang_text,
						url: json.tuiguang_url
				})
			});
			tuiguang_wrapper.add(button)
		}
	
		comment_xhr = Ti.Network.createHTTPClient()
		comment_xhr.timeout = Ti.App.timeout
		comment_xhr.onerror = function(){
				
		};
		comment_xhr.onload = function() {
				if(!this.responseText || this.responseText.length == 0 || this.responseText == "null") {
					//comment_table_view.hide();
					return;
				}
				var json = JSON.parse(this.responseText);
				var json_size = json.comments.length;
				
				if (json.claps.length > 0){			//有人点了喜欢
					for(var i=0; i<json.claps.length; i++){
						add_like(json.claps[i].user_id, json.claps[i].user_name);
					}
					likes.show();
				}
				//comment_table_view.show();
				for(var i = 0; i < json_size; i++) {
					comment = json.comments[i];
					
					if (!comment.user)
						continue;
						
					var row_wrapper = null;
					if (Ti.App.is_android){
						row_wrapper = Ti.UI.createView({
							height : Ti.UI.SIZE,
							layout: 'vertical',
							top: 0,
							left: 0,
							right: 0,
							json: comment
						});
						
						row_wrapper.addEventListener("touchstart", function(e){
							e.source.backgroundColor = "#eee";
						});
						row_wrapper.addEventListener("touchend", function(e){
							e.source.backgroundColor = "white";
						});
						row_wrapper.addEventListener("touchcancel", function(e){
							e.source.backgroundColor = "white";
						});
					}
					else{
						row_wrapper = Ti.UI.createTableViewRow({
							height : Ti.UI.SIZE,
							selectedBackgroundColor : '#E8E8E8',
							top: 0,
							left: 0,
							right: 0,
							json: comment
						});
					}
					
					row_wrapper.addEventListener("click", function(e){
						var optionsDialogOpts = {
							options : ['回复', '查看用户', '取消'],
							cancel : 2
						};
						
						if (Ti.App.Properties.getString("is_mms_admin", "false") == "true"){	//是管理员
							optionsDialogOpts.options = ['回复', '查看用户', '取消', '删除评论'];
						}
						
						var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
						dialog.addEventListener("click", function(e1){
							if (e1.index == 0){		//回复
								if (!check_login()){
									to_login();
									return;
								}
								
								show_window("comment", {
									t : 'article',
									id : win.id,
									title : "评论",
									text : "回复@" + e.source.json.user.name + ":"
								});
							}
							else if (e1.index == 1){		//用户详情
								show_window("user", {
									id: e.source.json.user.id, 
									title: e.source.json.user.name
								});
							}
							else if (e1.index == 3){
									var alert_dialog = Titanium.UI.createAlertDialog({
										title : '提示',
										message : '确定要删除评论吗？',
										buttonNames : ['取消', '确定'],
										cancel : 0
									});
									alert_dialog.addEventListener("click", function(e3){
										if (e3.index == 1){
											http_call(Ti.App.mamashai + "/api/admin/delete_comment/" + e.source.json.id + "?tp=article&" + account_str(), function(e){
												show_notice(e.responseText);
											});
										}
									});
									alert_dialog.show();
							}
						});
						dialog.show();
					});
										
					var row = Ti.UI.createView({
							json: json.comments[i],
							tag : comment.content,
							id : comment.id,
							user_id : comment.user.id,
							height : Ti.UI.SIZE,
							top: __l(4),
							bottom: __l(4),
							left: 0,
							right: 0
					});
						
					var user_logo = Ti.UI.createImageView({
						top : __l(4),
						left : __l(4),
						width : Ti.App.is_ipad ? __l(26) : __l(30),
						height : Ti.App.is_ipad ? __l(26) : __l(30),
						defaultImage : "./images/default.gif",
						hires : true,
						id : comment.user.id,
						image : "http://www.mamashai.com" + encodeURI(comment.user.logo_url_thumb48),
						name : comment.user ? comment.user.name : ""
					});
					user_logo.addEventListener("click", function(e){
						show_window("user", {
							title : e.source.name,
							id : e.source.id
						});
						e.cancelBubble = true;
					});
					
					var user_name = Ti.UI.createLabel({
						top : __l(4),
						left : __l(40),
						height : Titanium.Platform.osname == 'ipad' ? 18:  __l(15),
						font : {
							fontSize : Titanium.Platform.osname == 'ipad' ? 18:  __l(13)
						},
						touchEnabled: false,
						color: "#333",
						text : ""
					});
					if(comment.user)
						user_name.text = comment.user.name;
		
					var refer = Ti.UI.createLabel({
						top : __l(4),
						right : 0,
						height : Ti.UI.SIZE,
						font : {
							fontSize :  Titanium.Platform.osname == 'ipad' ? 16:  __l(12)
						},
						color : "gray",
						touchEnabled: false,
						textAlign : "right",
						text : referTime(comment.created_at)
					});
					
					var content = Ti.UI.createLabel({
						top :  Titanium.Platform.osname == 'ipad' ? 38: __l(23),
						bottom : 4,
						height : Ti.UI.SIZE,
						font : {
							fontSize :  Titanium.Platform.osname == 'ipad' ? 18: __l(13)
						},
						left : __l(40),
						right : 0,
						textAlign : "left",
						touchEnabled: false,
						color: "#333",
						text : comment.content
					});
					var line = Ti.UI.createView({
						backgroundColor : "#eee",
						top : 2,
						left : 2,
						right : 2,
						height : 1,
					});
					
					row.add(user_logo);
					row.add(user_name);
					row.add(refer);
					row.add(content);
					row_wrapper.add(row);
					if (Ti.App.is_android){
						row_wrapper.add(line);
						comments.add(row_wrapper);
					}
					else{
						comments.appendRow(row_wrapper);
					}
				}
				
				if (!Ti.App.is_android){
					setTimeout(function(){
						comments.height = Ti.UI.SIZE
						comments.updateLayout({})
					}, 200)
				}
		};
		comment_xhr.open('GET', Ti.App.mamashai + '/api/statuses/comments_and_like?tp=article&id=' + win.id)
		comment_xhr.send();
	}
	
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function(){
				hide_loading();
				show_timeout_dlg(xhr, Ti.App.mamashai + "/api/articles/show/" + win.id);
	}
	xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			if(this.responseText.length > 0) {
				require('lib/mamashai_db').db.insert_json("article", win.id, this.responseText)
			}
	
			win.json = json
			set_webview_content(json);
	}
	
	var json_row = require('/lib/mamashai_db').db.select_with_check("article", win.id)
	if (json_row.blank){
		webview.addEventListener("load", function(e){
			xhr.open('GET', Ti.App.mamashai + "/api/articles/show/" + win.id);
			xhr.send();
			Titanium.App.fireEvent('show_indicator');	
		})
	}
	else{
		webview.addEventListener("load", function(e){
			var json = JSON.parse(json_row.json)
			win.json = json
			set_webview_content(json);
		})
	}
	
	function add_comment(e) {
		clear_window(likes)
		clear_window(comments)
		comment_xhr.open('GET', Ti.App.mamashai + '/api/statuses/comments_and_like?tp=article&id=' + win.id)
		comment_xhr.send();
	}
	Ti.App.addEventListener("add_comment", add_comment)
	win.addEventListener("close", function(e){
		Ti.App.removeEventListener("add_comment", add_comment)
	})
	
	var comment_view = Ti.UI.createView({
		top : 2,
		left : 0,
		right : 0,
		height : __l(48)
	});
	
	var heart_pic = Ti.UI.createButton({
			left : 50,
			height : Ti.App.is_android ? __l(26) : __l(44),
			width : Ti.App.is_android ? __l(26) : __l(44),
			top : __l(12),
			backgroundColor : "white",
			id : win.id,
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	
	if (Ti.App.is_android) {
		heart_pic.backgroundImage = "/images/hart@4x-100.png";
		heart_pic.backgroundSelectedImage = "/images/hart@2x_s.png";
	} else
		heart_pic.image = "/images/hart@4x-100.png";
		
	if (Ti.App.is_ipad){
		heart_pic = Ti.UI.createImageView({
				backgroundColor : "transparent",
				height : 44,
				width : 44,
				top :  __l(12),
				left : 50,
				image : "/images/hart@4x.png"
		});
	}
	
	heart_pic.addEventListener("click", function(e){
		if (!check_login()){
			to_login();
			return;
		}
		
		var shadow = Ti.UI.createImageView({
			top : __l(2),
			left : 70,
			width : __l(22),
			height : __l(22),
			image : "./images/hart" + Ti.App.pic_sufix + ".png",
			zIndex: 10
		});
		comment_view.add(shadow)
		
		var t = Titanium.UI.create2DMatrix();
		var animate = Titanium.UI.createAnimation({transform:t, height: 40, width: 40, opacity: 0,duration:500});
		animate.addEventListener('complete', function(){
	
		});
		shadow.animate(animate);
		
		url = Ti.App.mamashai + "/api/statuses/clap.json?tp=article&id=" + win.id +"&" + account_str();
		
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onload = function() {
			add_like(user_id(), decodeURI(Ti.App.Properties.getString("name")));
			likes.show();
		};
		xhr.open('POST', url);
		xhr.send();
		
		heart_pic.enabled = false;
	});
	comment_view.add(heart_pic);
	
	var comment_pic = Ti.UI.createButton({
			backgroundColor : "white",
			height : Ti.App.is_android ? __l(26) : __l(44),
			width : Ti.App.is_android ? __l(26) : __l(44),
			top : __l(12),
			right: 50,
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	if (Ti.App.is_android) {
		comment_pic.backgroundImage = "/images/pinglun@4x-100.png";
		comment_pic.backgroundSelectedImage = "/images/pinglun@2x_s.png";
	} else
		comment_pic.image = "/images/pinglun@4x-100.png";
	
	if (Ti.App.is_ipad) {
			comment_pic = Ti.UI.createImageView({
				backgroundColor : "white",
				height : 44,
				width : 44,
				top :  __l(12),
				right: 50,
				image : "/images/pinglun@4x.png"
			});
	}
	
	comment_pic.addEventListener("click", function() {
		if (!check_login()){
			to_login();
			return;
		}
		
		show_window("comment", {
			t : 'article',
			id : win.id,
			title : "评论"
		});
	});
	
	comment_view.add(comment_pic);
	
	post.add(comment_view)
	
	
	var line2 = Ti.UI.createView({
		backgroundColor : "#eee",
		top : 6,
		left : 0,
		right : 0,
		height : 1
	});
	post.add(line2)
	
	var likes_wrapper = Ti.UI.createView({
		left: 0,
		right: 0,
		height: Ti.UI.SIZE
	});
	var likes = Ti.UI.createLabel({
		height: Ti.UI.SIZE,
		top: __l(6),
		bottom: __l(6),
		color: "#333",
		left: __l(10),
		right: __l(10),
		like_count: 0,
		visible: false,
		font: {fontSize: __l(13)},
		text: ""
	});
	post.add(likes_wrapper);
	
	var comments = null;
	if (Ti.App.is_android){
		comments = Ti.UI.createView({
			height: Ti.UI.SIZE,
			layout: 'vertical',
			left : __l(8),
			top : 4,
			right : __l(8),
			bottom: __l(10)
		});
	}
	else{
		comments = Ti.UI.createTableView({
			height: Ti.UI.SIZE,
			left : __l(8),
			right : __l(8),
			scrollable: false
		});	
	}
	
	
	var comment_table_view = Ti.UI.createTableView({
		style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		top : 0,
		editable:true,
		allowsSelectionDuringEditing:true
	});
	
	post.add(comments);
	
	ZhinanAdv.zhinan_adv('article', scroll_view);
	
	logEvent('article');
	
	function set_height(e){
		if (Ti.App.is_android)
			return;
			
		if (win.id != e.id)
			return;
		
		if (Ti.App.is_android){
			webview.height = __l(e.height) + __l(10);
			web_wrapper.height = __l(e.height) + __l(10);
		}
		else{
			webview.height = e.height + __l(10);
			web_wrapper.height = e.height + __l(10);
		}
	}
	Ti.App.addEventListener("set_height", set_height)
	win.addEventListener("close", function(e){
		Ti.App.removeEventListener("set_height", set_height)
	})
	
	add_default_action_bar2(win, win.title, Ti.App.is_android ? Ti.Android.R.drawable.ic_menu_more : "", function(){
		right_button.fireEvent("click")
	});
	
	return win;
}

module.exports = ArticleWindow;
