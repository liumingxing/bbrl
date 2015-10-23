function AlbumMv(attr){
	Ti.include("public.js")
	var win = Ti.UI.createWindow(attr)
	
	var wrapper = Ti.UI.createScrollView({
		left : 0,
		top : 0,
		right : 0,
		bottom : 0,
		contentWidth : Ti.App.platform_width,
		contentHeight : 'auto',
		width : Ti.App.platform_width,
		showVerticalScrollIndicator : true
	});
	win.add(wrapper)
	
	var user_logo = Ti.UI.createImageView({
		top : __l(8),
		left : __l(8),
		width : __l(36),
		height : __l(36),
		hires : true,
		defaultImage : "/images/default.gif",
		image : "http://www.mamashai.com" + encodeURI(win.json.user.logo_url_thumb48)
	});

	user_logo.addEventListener("click", function() {
		show_window("user", {
			id: win.json.user.id, 
			title: win.json.name
		});
	});

	wrapper.add(user_logo);

	var user = Ti.UI.createLabel({
		top : __l(6),
		left : __l(50),
		height : __l(19),
		font : {
			fontSize : __l(15),
		},
		color: "#333",
		text : win.json.user ? win.json.user.name : ""
	});

	wrapper.add(user);
	
	var now = new Date;
	var now_year = now.getFullYear();
	var now_month = now.getMonth() + 1;
	var now_date = now.getDate();
	var now_text = now_year + '-' + now_month + '-' + now_date;
	
	var refer = Ti.UI.createLabel({
			top : __l(28),
			left : __l(50),
			right : __l(6),
			textAlign : 'left',
			height : __l(17),
			font : {
				fontSize : __l(13)
			},
			color : "#444",
			text : win.json.created_at ? referMinute(win.json.created_at) + " " + kid_desc(win.json.user.user_kids[0], win.json.created_at) : now_text
	});
	
	wrapper.add(refer);
	
	var line = Ti.UI.createView({
		backgroundColor : "#eee",
		top : __l(54),
		left : 8,
		right : 8,
		height : 1,
	});

	wrapper.add(line);
	
	var web = Ti.UI.createWebView({
		top : __l(66),
		backgroundColor: '#78A1A7',
		url: Ti.App.mamashai + "/mobile/album_book/" + win.id,
		hideLoadIndicator: true,
		width : Ti.App.is_android > Ti.App.platform_width > 600 ? 600 : __l(300),
		height: Ti.App.is_android > Ti.App.platform_width > 600 ? 600 : __l(300)
	});
	if (web.width >= 600){
		web.url = Ti.App.mamashai + "/mobile/album_book/" + win.id + "?scale=1&density=" + Ti.App.dpi + "&width=" + Ti.App.platform_width;
	}
	else{
		web.url = Ti.App.mamashai + "/mobile/album_book/" + win.id + "?scale=0.5&density=" + Ti.App.dpi + "&width=" + Ti.App.platform_width;
	}
	
	wrapper.add(web)
	
	var right_button = Ti.UI.createButton({
		border: 0,
		backgroundColor: 'transparent',
		width : __l(22),
		height : __l(22),
		hires : true,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
		image: "/images/weixin" + Ti.App.pic_sufix + ".png"
	});
	var tiwechat = require('com.mamashai.tiwechat');
	right_button.addEventListener("click", function(e){
		var optionsDialogOpts = {
			options:['分享给微信好友', '发到微信朋友圈', '取消'],
			cancel:2
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener('click',function(e)
		{
			if (e.index == 0){												//发给微信好友
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareSession("分享微电影", win.json.name, "http://www.mamashai.com/mobile/album_book/" + win.id, "http://www.mamashai.com" + win.json.logo_url_thumb150);
				logEvent('weixin_session');
			}
			else if (e.index == 1){											//分享微信朋友圈
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareTimeline(win.json.name, "分享微电影", "http://www.mamashai.com/mobile/album_book/" + win.id, "http://www.mamashai.com" + win.json.logo_url_thumb150);
				
				logEvent('weixin_timeline');
				if (!Ti.App.is_android)
					show_notice("成功分享到微信朋友圈")
				
				var url = Ti.App.mamashai + "/api/statuses/make_weixin_score?" + account_str();
				var xhr = Ti.Network.createHTTPClient()
				xhr.timeout = Ti.App.timeout
				xhr.open("POST", url)
				xhr.send()
			}
		})
		dialog.show()
	})
	if (!Ti.App.is_android){
		if (tiwechat.isWeixinInstalled() == "yes")
			win.setRightNavButton(right_button)
	}	
	else{
		add_default_action_bar2(win, win.title, "分享微信", function(){
			right_button.fireEvent("click");
		});
	}
	
	//喜欢和评论区域
	var like_wrapper = Ti.UI.createView({
		left : 0,
		right : 0,
		top : web.height + __l(76),
		height : __l(32)
	})
	var heart_pic = Ti.UI.createButton({
		top : __l(2),
		left : __l(40),
		width : __l(20),
		height : __l(20),
		id : win.json.id,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	if (Ti.App.is_android){
		heart_pic.backgroundImage = "./images/hart@2x.png"
		heart_pic.backgroundSelectedImage = "/images/hart@2x_s.png"
	}	
	else
		heart_pic.image = "./images/hart@2x.png"
		
	if (Ti.App.is_ipad){
		heart_pic = Ti.UI.createImageView({
			top : __l(2),
			left : __l(40),
			width : __l(20),
			height : __l(20),
			id : win.json.id,
			image : "./images/hart@2x.png"
		});
	}
	
	heart_pic.addEventListener("click", function(e) {
		if (!check_login()) {
			to_login();
			return;
		}
	
		var shadow = Ti.UI.createImageView({
			top : __l(2),
			left : __l(42),
			width : __l(18),
			height : __l(18),
			image : "./images/hart@2x.png",
			zIndex : 10
		});
		like_wrapper.add(shadow)
	
		var t = Titanium.UI.create2DMatrix();
		var animate = Titanium.UI.createAnimation({
			transform : t,
			height : __l(40),
			width : __l(40),
			opacity : 0,
			duration : 600
		});
		animate.addEventListener('complete', function() {
	
		});
		shadow.animate(animate);
	
		url = Ti.App.mamashai + "/api/statuses/clap.json?tp=album&id=" + win.id + "&" + account_str();
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onload = function() {
				clap_count.text = this.responseText
		}
		xhr.open('POST', url);
		xhr.send();
		clap_count.text = parseInt(clap_count.text) + 1
	})
	var clap_count = Ti.UI.createLabel({
		top : __l(2),
		left : __l(66),
		height : __l(20),
		font : {
			fontSize : __l(13)
		},
		color : "black",
		text : win.json.like_count
	});
	
	var comment_pic = Ti.UI.createButton({
		top : __l(2),
		right : __l(60),
		width : __l(20),
		height : __l(20),
		id : win.json.id,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	
	if (Ti.App.is_android){
		comment_pic.backgroundImage = "./images/pinglun@2x.png"
		comment_pic.backgroundSelectedImage = "/images/pinglun@2x_s.png"
	}	
	else
		comment_pic.image = "./images/pinglun@2x.png"
	
	if (Ti.App.is_ipad){
		comment_pic = Ti.UI.createImageView({
			top : __l(2),
			right : __l(60),
			width : __l(20),
			height : __l(20),
			id : win.json.id,
			image : "./images/pinglun@2x.png"
		});
	}
		
	comment_pic.addEventListener("click", function(e) {
		if (!check_login()) {
			to_login();
			return;
		}
	
		var win = show_window("comment", {
			id : e.source.id,
			t : 'album',
			title : "评论微电影",
			//backgroundImage : Ti.App.ios7 ? null : "/images/mbook_beijing.jpg"
		});
	});
	var comment_count = Ti.UI.createLabel({
		top : __l(2),
		right : __l(44),
		height : __l(20),
		font : {
			fontSize : __l(13)
		},
		color : "black",
		text : win.json.comment_count
	});
	
	//评论区域
	var comments = Ti.UI.createView({
		left : 0,
		right : 0,
		bottom: __l(10),
		top : web.height + __l(108),
		height : Ti.UI.SIZE,
		layout : 'vertical',
	})
	
	var comment_table_view = Ti.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor : 'transparent',
		top : 0,
		editable : true,
		allowsSelectionDuringEditing : true
	});
	
	if (win.json.created_at){
		like_wrapper.add(heart_pic)
		like_wrapper.add(clap_count)
		like_wrapper.add(comment_pic)
		like_wrapper.add(comment_count)
		
		wrapper.add(like_wrapper)
		if (!win.local)
			wrapper.add(comments)
	}
	
	Ti.App.addEventListener("add_comment", function(e) {
		if (e.id == win.json.id) {
			clear_window(comments)
			comment_xhr.open('GET', Ti.App.mamashai + '/api/statuses/comments?tp=album&id=' + win.json.id)
			comment_xhr.send();
			comment_count.text = parseInt(comment_count.text) + 1
		}
	})
	var comment_xhr = Ti.Network.createHTTPClient()
	comment_xhr.timeout = Ti.App.timeout
	comment_xhr.onerror = function() {
			hide_loading();
	}
	comment_xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			if (json.length == 0) {
				return;
			}
	
			var json_size = json.length;
			comment_count.text = json_size + "";
			for (var i = 0; i < json_size; i++) {
				comment = json[i]
				var row_wrapper = Ti.UI.createView({
					height : Ti.UI.SIZE,
					layout : 'vertical',
					top : 0,
					left : 0,
					right : 0
				})
	
				var row = Ti.UI.createView({
					tag : comment.content,
					id : comment.id,
					user_id : comment.user.id,
					height : Ti.UI.SIZE,
					top : 0,
					bottom : 0,
					left : 0,
					right : 0
				})
	
				var user_logo = Ti.UI.createImageView({
					top : __l(4),
					left : __l(4),
					width : __l(30),
					height : __l(30),
					defaultImage : "./images/default.gif",
					hires : true,
					id : comment.user.id,
					image : "http://www.mamashai.com" + encodeURI(comment.user.logo_url_thumb48)
				});
				user_logo.addEventListener("click", function(e) {
					show_window("user", {
						id: e.source.id, 
						title: comment.user.name
					});
				});
				var user_name = Ti.UI.createLabel({
					top : __l(4),
					left : __l(40),
					height : Titanium.Platform.osname == 'ipad' ? 28 : __l(15),
					font : {
						fontSize : Titanium.Platform.osname == 'ipad' ? 18 : __l(13)
					},
					color : "#000",
					text : ""
				});
				if (comment.user)
					user_name.text = comment.user.name;
	
				var refer = Ti.UI.createLabel({
					top : __l(4),
					right : __l(40),
					height : Ti.UI.SIZE,
					font : {
						fontSize : Titanium.Platform.osname == 'ipad' ? 16 : __l(12)
					},
					color : "#333",
					textAlign : "right",
					text : referTime(comment.created_at)
				});
	
				var reply_button = Ti.UI.createButton({
					height : __l(20),
					width : __l(20),
					top : 0,
					right : __l(4),
					name : comment.user.name,
					id : win.json.id,
					style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
				});
				if (Ti.App.is_android)
					reply_button.backgroundImage = "./images/pinglun@2x.png";
				else
					reply_button.image = "./images/pinglun@2x.png";
				
				if (Ti.App.is_ipad){
					reply_button = Ti.UI.createImageView({
						height : __l(20),
						width : __l(20),
						top : 0,
						right : __l(4),
						name : comment.user.name,
						id : win.json.id,
						image : "./images/pinglun@2x.png"
					});
				}
					
				reply_button.addEventListener("click", function(e) {
					if (!check_login()){
						to_login();
						return;
					}
					
					show_window("comment", {
						text : "回复@" + e.source.name + ":",
						id : e.source.id,
						t : 'album',
						title : "评论微电影",
						//backgroundImage : Ti.App.ios7 ? null : "/images/mbook_beijing.jpg"
					});
				});
				var content = Ti.UI.createLabel({
					top : Titanium.Platform.osname == 'ipad' ? 38 : __l(23),
					bottom : 4,
					height : Ti.UI.SIZE,
					font : {
						fontSize : Titanium.Platform.osname == 'ipad' ? 18 : __l(13)
					},
					left : __l(40),
					right : 0,
					textAlign : "left",
					color : "#000",
					text : comment.content
				});
				var line = Ti.UI.createView({
					backgroundColor : "#eee",
					top : __l(2),
					left : __l(2),
					right : __l(2),
					height : 1,
				});
	
				row.add(user_logo);
				row.add(user_name);
				row.add(refer)
				row.add(reply_button)
				row.add(content)
				row_wrapper.add(row)
				row_wrapper.add(line)
				comments.add(row_wrapper)
			}
			wrapper.remove(comments)
			wrapper.add(comments)
	};
	comment_xhr.open('GET', Ti.App.mamashai + '/api/statuses/comments?tp=album&id=' + win.id)
	if (!win.local)
		comment_xhr.send();
	
	logEvent('album_mv_preview');
	
	win.addEventListener("androidback", function(){
		web.url = "/local.html";
		win.close()
	})
	
	return win;
}


module.exports = AlbumMv;
