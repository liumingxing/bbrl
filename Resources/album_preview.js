function AlbumPreview(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	if (!Ti.App.is_android) {
		win.hideTabBar();
	}
	win.mode = "preview"
	Ti.App.album_mode = "preview"
	var Page = require('lib/album_page')
	var json = JSON.parse(win.json.content)
	//var book_json = json;
	Ti.App.book_json = json;
	
	var user = Titanium.UI.createButton({
		title : win.json.user.name,
		json: win.json
	})
	
	user.addEventListener("click", function(e) {
		show_window("user", {
			id: e.source.json.user.id, 
			title: e.source.json.user.name
		});
	});
	
	var edit = Titanium.UI.createButton({
		title : "编辑",
	})
		
	edit.addEventListener("click", function(e){
		var edit_win = Titanium.UI.createWindow({
				url : "album_new.js",
				title : "编辑微电影",
				mode : 'edit',
				id : win.id,
				template_id : win.json.template_id,
				name : win.json.name,
				kid_json: win.kid_json,
				backgroundColor : '#fff',
				backButtonTitle : '',
				json : json,
				_parent: win
		});
		if (!Ti.App.is_android) {
			edit_win.hideTabBar();
		}
		pre(edit_win)
		
		Ti.App.album_mode = "edit"
		Ti.App.currentTabGroup.activeTab.open(edit_win, {
				animated : true
		});
	})
			
	//本人浏览
	if (json.user_id == user_id() && win.local){
		if (!Ti.App.is_android)
			win.setRightNavButton(edit)
		else{
			add_default_action_bar2(win, win.title, "编辑", function(){
				edit.fireEvent("click");
			});
		}
	}
	else{
		if (!Ti.App.is_android)
			win.setRightNavButton(user)
		else{
			add_default_action_bar2(win, win.title, win.json.user.name, function(){
				user.fireEvent("click");
			});
		}
	}
	
	
	var kid_json = win.json.kid;
	
	var scale_ratio = 1;
	if (Ti.App.is_ipad){
		scale_ratio = 1.2
	}
	else if (Ti.App.is_android){
		scale_ratio = Ti.App.platform_width*0.9/__l(300)
	}
	
	var wrapper = Ti.UI.createScrollView({
		left : 0,
		top : 0,
		right : 0,
		bottom : 0,
		contentWidth : Ti.App.platform_width,
		contentHeight : 'auto',
		width : Ti.App.platform_width,
		showVerticalScrollIndicator : true
	})
	win.add(wrapper)
	
	pic_container = Ti.UI.createScrollView({
		width : __l(300)*scale_ratio,
		height : __l(300)*scale_ratio,
		contentHeight : __l(300)*scale_ratio,
		contentWidth : __l(300)*scale_ratio,
		top : __l(10),
		backgroundColor: 'white'
	})
	wrapper.add(pic_container)
	
	
	ind3 = Titanium.UI.createProgressBar({
				width:100,
				min:0,
				max:json.pages.length,
				value:0,
				color:'#fff',
				message:'正在生成：0/' + json.pages.length,
				font:{fontSize:14, fontWeight:'bold'},
				style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN
	});
	ind3.show()
	if (!Ti.App.is_android)
		win.setTitleControl(ind3);
	
	function add_foot(i, length, page){
		var foot1 = Ti.UI.createLabel({
				bottom : 4,
				right : 4,
				height : __l(16),
				font : {
					fontSize : __l(11)
				},
				color : '#FFF',
				zIndex : 10000,
				text : (i + 1) + "/" + json.pages.length
			});
			var foot2 = Ti.UI.createLabel({
				bottom : 3,
				right : 3,
				height : __l(16),
				font : {
					fontSize : __l(11)
				},
				color : 'gray',
				zIndex : 10000,
				text : (i + 1) + "/" + json.pages.length
			});
			page.add(foot1)
			page.add(foot2)
	}
	
	win.addEventListener("open", function(){
		var page_count = 0;
		for (var i = 0; i < json.pages.length; i++) {
			ind3.value = i + 1
			ind3.message = '正在生成：' + (i+1) + '/' + json.pages.length
			
			if (json.user_id != user_id () && !json.pages[i].picture){
				continue;
			}
			page_count += 1
			
			var page = null;
			if (i < 2){
				page = Page.album_page(win, json.pages[i], kid_json, __l(300)*scale_ratio, __l(300)*scale_ratio, i, null)	
				page.json = json.pages[i]
			}
			else{
				page = Ti.UI.createView({
					width: __l(300)*scale_ratio,
					height: __l(300)*scale_ratio,
					backgroundColor: "#ddd",
					index: i,
					json: json.pages[i],
					blank: true
				})
			}
			
			page.left = 0;
			page.touchEnabled = false;
			page.zIndex = json.pages.length - i
		
			add_foot(i, json.pages.length, page)
			pic_container.add(page)
		}
		if (!Ti.App.is_android)
			win.setTitleControl(null)
		
		if (page_count==0){
			show_alert("对不起", "没有可以展示的页。")
		}
	})
	//翻页
	var current_page = 0
	function switch_to(index) {
		var old_current = current_page;
		var current_view = pic_container.children[current_page];
		var new_view = pic_container.children[index]
	
		var t = Titanium.UI.create2DMatrix();
		if (index > current_page) {
				new_view.show();
				current_view.hide();
		} else {
				new_view.show();
				current_view.hide();
		}
	
		current_page = index;
		if (index == 0) {
			left.hide();
		} else if (index == pic_container.children.length - 1) {
			right.hide();
		} else {
			left.show();
			right.show();
		}
		
		clear_old_and_make_candidate(old_current, index)
	}
	
	function clear_old_and_make_candidate(old_current, new_index){
			for(var i=new_index-1; i<=new_index+1; i++){
				if (i>=0 && i<pic_container.children.length && pic_container.children[i].blank){
					Page.album_page(win, pic_container.children[i].json, kid_json, __l(300)*scale_ratio, __l(300)*scale_ratio, pic_container.children[i].index, null, pic_container.children[i])
					pic_container.children[i].blank = false
					add_foot(pic_container.children[i].index, json.pages.length, pic_container.children[i])
				}
			}
			for(var i=old_current-1; i<=old_current + 1; i++){
				if (i>=0 && i<pic_container.children.length && Math.abs(i-new_index) > 1){
					clear_window(pic_container.children[i])
					pic_container.children[i].blank = true
				}	
			}
	}
	
	if (!Ti.App.is_android){
		pic_container.addEventListener("swipe", function(e){
			pic_container.fireEvent("swipe1", e)
		})
	}
	
	pic_container.addEventListener("swipe1", function(e) {
		if (e.direction == "left") {
			if (current_page < pic_container.children.length - 1)
				switch_to(current_page + 1)
			else
				show_alert("提示", "已经是最后一页了")
		} else if (e.direction == "right") {
			if (current_page > 0)
				switch_to(current_page - 1)
			else
				show_alert("提示", "已经是第一页了")
		}
	})
	
	var left = Ti.UI.createButton({
			backgroundImage : "./images/left.png",
			left: __l(1),
			top : __l(140)*scale_ratio,
			height : __l(47),
			width : __l(38),
			hires: true
	})
	left.hide();
	left.addEventListener("click", function(e){
		pic_container.fireEvent("swipe1", {direction: 'right'})
	})
	var right = Ti.UI.createButton({
			backgroundImage : "./images/right.png",
			right: __l(1),
			top : __l(140)*scale_ratio,
			height : __l(47),
			width : __l(38),
			hires: true
	})
	right.addEventListener("click", function(e){
			pic_container.fireEvent("swipe1", {direction: 'left'})
	})
	wrapper.add(left)
	wrapper.add(right)
	
	//喜欢和评论区域
	var like_wrapper = Ti.UI.createView({
		left : 0,
		right : 0,
		top : __l(300) * scale_ratio + __l(16),
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
		
	comment_pic.addEventListener("click", function(e) {
		if (!check_login()) {
			to_login();
			return;
		}
	
		show_window("comment", {
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
	
	like_wrapper.add(heart_pic)
	like_wrapper.add(clap_count)
	like_wrapper.add(comment_pic)
	like_wrapper.add(comment_count)
	
	if (!win.local)
		wrapper.add(like_wrapper)
	
	//评论区域
	var comments = Ti.UI.createView({
		left : 0,
		right : 0,
		bottom: __l(10),
		top : __l(300) * scale_ratio + __l(50),
		height : Ti.UI.SIZE,
		layout : 'vertical',
	})
	
	var actInd = Titanium.UI.createActivityIndicator({
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
		top : 10,
		left : __l(150),
		height : 20,
		width : 20
	});
	
	var no_comment_notice = Ti.UI.createLabel({
		top : __l(0),
		height : __l(15),
		font : {
			fontSize : __l(12)
		},
		left : 0,
		right : 0,
		textAlign : "center",
		color : "#000",
		text : "暂时还没有评论"
	});
	
	var comment_table_view = Ti.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor : 'transparent',
		top : 0,
		editable : true,
		allowsSelectionDuringEditing : true
	});
	
	comments.add(actInd)
	if (!Ti.App.is_android) {
		actInd.show()
	}else{
		actInd.hide()
	}
	
	if (!win.local)
		wrapper.add(comments)
	
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
			actInd.hide();
	}
	comment_xhr.onload = function() {
			actInd.hide();
			comments.remove(actInd)
	
			if (this.responseText == "null") {
				comments.add(no_comment_notice)
				wrapper.remove(comments)
				wrapper.add(comments)
				return;
			}
	
			comments.remove(no_comment_notice)
	
			no_comment_notice.hide();
			var json = JSON.parse(this.responseText);
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
					borderRadius : __l(4),
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
					reply_button.backgroundImage = "./images/pinglun@2x.png"
				else
					reply_button.image = "./images/pinglun@2x.png"
					
				reply_button.addEventListener("click", function(e) {
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
	comment_xhr.open('GET', Ti.App.mamashai + '/api/statuses/comments?tp=album&id=' + win.json.id)
	if (!win.local)
		comment_xhr.send();
	
	logEvent('album_book_preview');
	
	return win;
}

module.exports = AlbumPreview
