function AlbumWindow(attr){
	Ti.include("public.js");
	
	var win = Titanium.UI.createWindow(attr);
	win.name = "album";
	
	if (Ti.App.is_android){
					add_tab_to_actionbar(win, win.title, [{
				           		title: '展厅',
				           		selected: true,
				           		click: function(){
				           			win.tab_click(0, true);
				           		}
				           },
				           {
				           		title: '我的',
				           		click: function(){
				           			win.tab_click(1, true);
				           		}
				           }
				    ]);
			
		}
		else{
			var tab_title = Titanium.UI.iOS.createTabbedBar({
				labels : ['展厅', '我的'],
				index : 0,
				style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
				backgroundColor : Ti.App.bar_color,
				width : __l(150),
				height : 30
			});
			
			tab_title.addEventListener("click", function(e) {
				win.tab_click(e.index, e.no_animate);
			});
			win.setTitleControl(tab_title);
		}
		
	win.addEventListener("open", function(e){		
		Ti.App.parent = win;
		
		var page_count = 16;
		
		var kid_json = null;	
		var user_json = null;
		var current_kid_id = Ti.App.Properties.getString("current_kid_id", "");
		record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
		if (!record.blank){
				var json = JSON.parse(record.json);
				user_json = json;
				kids = json.user_kids;
				kid_json = json.user_kids[0];
				if (current_kid_id != ""){
					for(var i=0; i<json.user_kids.length; i++){
						if (json.user_kids[i].id == parseInt(current_kid_id)){
							kid_json = json.user_kids[i];
							break;
						}
					}
				}
		}
		
		var current_view = null;
		function tab_click(index, no_animate) {
			if (index != 0 && index != 1)
				return;
				
			if (index >= 1 && !user_id()) {
				if (!Ti.App.is_android){
					tab_title.index = 0
				}
				
				to_login();
				return;
			}
			
			if (current_view == views[index])
				return;
		
			var t = Titanium.UI.create2DMatrix();
			
			if (index > current_view.index){
				views[index].left = Ti.App.platform_width;
				current_view.animate({transform:t, left: 0-Ti.App.platform_width, duration: 400})
			}
			else{
				views[index].left = 0-Ti.App.platform_width;
				current_view.animate({transform:t, left: Ti.App.platform_width, duration: 400})
			}
			
			views[index].animate({transform: t, left: 0, duration: 400})
			
			current_view = views[index]
		}
		
		win.tab_click = tab_click;
		//所有封面集合，便于修改操作后更换图片
		var my_faces = []
		
		function make_book_logo(json){
			var tiny_wrapper = Ti.UI.createView({
				width : __l(166),
				height : __l(158),
				left : Ti.App.is_ipad ? 70 : __l(20),
				top : __l(8)
			});
			
			var bg = Ti.UI.createImageView({
				hires: true,
				image: "/images/album_book_bg.png",
				width: __l(166),
				height: __l(158),
				left: 0,
				top: 0,
				zIndex: 2,
				touchEnabled: false
			});
			tiny_wrapper.add(bg);
		
			var face = Ti.UI.createImageView({
				width : __l(150),
				height : __l(150),
				top : __l(4),
				left: __l(8),
				hires : true,
				id: json.id,
				templaet_id: json.template_id,
				json : json,
				zIndex: 1,
				backgroundColor: "gray",
				image : real_cache_path(json.logo)
			});
			
			my_faces.push(face);
			tiny_wrapper.face = face;
			
			if (json.book_id){
				var shadow = Ti.UI.createImageView({
						top : __l(59),
						left : __l(63),
						width : __l(40),
						height : __l(40),
						image : "/images/video_mask.png",
						zIndex : 11,
						touchEnabled: false
				});
				tiny_wrapper.add(shadow);
				face.addEventListener("click", function(e){
							var AlbumMv = require('album_mv');
							var win = new AlbumMv({
								title : e.source.json.name,
								backgroundColor : '#78A1A7',
								json : e.source.json,
								id : e.source.json.book_id,
								backButtonTitle: ''
							});
							pre(win);
									
							Ti.App.currentTabGroup.activeTab.open(win, {
								animated : true
							});
				});
			}
			
			var name_wrapper = Ti.UI.createView({
				width : __l(150),
				height : __l(30),
				top : __l(124),
				left: __l(8),
				zIndex: 1,
				backgroundColor: 'black',
				opacity: 0.5,
				zIndex: 3,
				json: json
			});
			var name = Ti.UI.createLabel({
				font:{fontSize:__l(13)},
				text: json.name,
				color:'white',
				textAlign:'center',
				width : __l(150),
				height : __l(30),
				top : __l(124),
				left: __l(8),
				zIndex: 400
			});
			name_wrapper.addEventListener("click", function(e){
				var Popup = require("lib/album_popup_name").album_popup_name;
				var popup = new Popup(win, e.source.json.id, e.source.name.text, e.source.json.template_id);
			});
			tiny_wrapper.add(name_wrapper);
			tiny_wrapper.add(name);
			
			tiny_wrapper.add(face);
			tiny_wrapper.add(bg);
			return tiny_wrapper;
		}
		//mbook修改了，要更改json
		function mbook_save(e){
			Ti.API.log("~~~~~~~~~~mbook.save: " + e)
			var current_kid_id = Ti.App.Properties.getString("current_kid_id", "")
			record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
			var j = JSON.parse(record.json)
			
			var json = {content: e.content,
						logo: e.logo,
						name: e.name,
						id: e.id,
						kid: kid_json,
						user: j,
						template_id: e.template_id,
						book_id : e.book_id
			}
						  			
			if (e.mode == "edit"){
				for(var i=0; i<views[1].view_my.data.length; i++){
					for(var j=0; j<views[1].view_my.data[i].rows.length; j++){
						if (views[1].view_my.data[i].rows[j].id == e.id){
							
							var table_view_row = make_mbook_my_row(json)
							views[1].view_my.insertRowAfter(j, table_view_row)
							views[1].view_my.deleteRow(j)		
							//views[1].view_my.data[i].rows[j].face.json = json
							//views[1].view_my.data[i].rows[j].face.image = e.logo
							return;
						}
					}
				}
			}
		
			
			var table_view_row = make_mbook_my_row(json);
			if (get_row_count(views[1].view_my) > 0)
				views[1].view_my.insertRowBefore(0, table_view_row);
			else
				views[1].view_my.appendRow(table_view_row);
		}
		Ti.App.addEventListener("mbook.save", mbook_save);
		
		//我的mbook
		var g_button_share = null;
		function make_mbook_my_row(json) {
			row = Ti.UI.createTableViewRow({
				height : __l(195),
				name : json.name,
				id : json.id,
				selectionStyle : 'NONE'
			});
			
			var tiny_wrapper = make_book_logo(json);
			row.face = tiny_wrapper.face;
			
			var button_wrapper = Ti.UI.createView({
				left : Ti.App.is_ipad ? __l(235) : __l(200),
				right: 0,
				top: 0,
				height: __l(160),
				layout: 'vertical'
			});
			
			var button1 = Ti.UI.createButton({
					title : "编  辑",
					font : {fontSize: __l(15), fontWeight: 'bold'},
					backgroundImage: "/images/mbook_my_2.png",
					backgroundSelectedImage: "/images/mbook_my_2_1.png",
					focusable : true,
					left : 0,
					top : __l(10),
					bottom : __l(0),
					width : __l(104),
					height : __l(30),
					json: json,
					face : tiny_wrapper.face
			});
			pre_btn(button1);
			button1.addEventListener("click", function(e) {
					var record = Ti.App.db.execute("select * from album_books where rowid = ?", e.source.face.json.id);
					var json = JSON.parse(record.fieldByName("json"));
					record.close();
					
					if (!json){
						http_call(Ti.App.mamashai + "/api/mbook/album_book/" + e.source.face.json.book_id, function(h){
							full_json = JSON.parse(h.responseText);
							json = JSON.parse(full_json.content);
							
							var win = Titanium.UI.createWindow({
								url : "album_new.js",
								title : "编辑微电影",
								id : e.source.face.json.id,
								template_id : e.source.face.json.template_id,
								book_id : e.source.face.json.book_id,
								name : e.source.face.json.name,
								kid_json: e.source.face.json.kid,
								backgroundColor : '#fff',
								backButtonTitle : '',
								json: json
							});
							Ti.App.album_mode = "edit";
						
							pre(win);
							
							if (!Ti.App.is_android) {
								win.hideTabBar();
							}
							else{
								win.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
							}
							
							Ti.App.currentTabGroup.activeTab.open(win, {
								animated : true
							});
							return;
						});
					}
					else{
						var win = Titanium.UI.createWindow({
							url : "album_new.js",
							title : "编辑微电影",
							id : e.source.face.json.id,
							template_id : e.source.face.json.template_id,
							book_id : e.source.face.json.book_id,
							name : e.source.face.json.name,
							kid_json: e.source.face.json.kid,
							backgroundColor : '#fff',
							backButtonTitle : '',
							json: json
						});
						Ti.App.album_mode = "edit"
					
						pre(win)
						
						if (!Ti.App.is_android) {
							win.hideTabBar();
						}
						else{
							win.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
						}
						
						Ti.App.currentTabGroup.activeTab.open(win, {
							animated : true
						});
					}
			});
			button_wrapper.add(button1);
			
			if (json.book_id){
				var button_delete = Ti.UI.createButton({
					title : "删  除",
					font : {fontSize: __l(15), fontWeight: 'bold'},
					backgroundImage: "/images/mbook_my_2.png",
					backgroundSelectedImage: "/images/mbook_my_2_1.png",
					left : 0,
					top : __l(10),
					bottom : __l(0),
					width : __l(104),
					height : __l(30),
					face : tiny_wrapper.face,
					book_id: json.book_id,
					local_id: json.id
				});
				pre_btn(button_delete);
				button_delete.addEventListener("click", function(e){
					var alert_dialog = Titanium.UI.createAlertDialog({
						message:'确定删除吗？',
						buttonNames: ['确定', '再想想']
					});
					alert_dialog.addEventListener("click", function(e1){
						if (e1.index == 0){
							var url = Ti.App.mamashai + "/api/mbook/hide_book/" + e.source.book_id + "?" + account_str();
							var xhr = Ti.Network.createHTTPClient();
							xhr.timeout = Ti.App.timeout;
							xhr.onload = function(){
								if (this.responseText == "success"){
									var tableview = views[1].view_my;
									var rowIndex = 0;
									for(var i=0; i<tableview.data.length; i++){
										var section = tableview.data[i];
										for(var j=0; j<section.rows.length; j++){
											row = section.rows[j];
											if (row.id == parseInt(e.source.local_id)){
												tableview.deleteRow(rowIndex);
												Ti.App.db.execute("delete from album_books where rowid = ?", e.source.local_id);
												break;
											}
											
											rowIndex ++;
										}
									}
								}
								else{
									show_alert("提示", "对不起，删除错误。");
								}
							};
							xhr.open("POST", url);
							xhr.send();
						}
					});
					alert_dialog.show();
				});
				
				button_wrapper.add(button_delete);
				
				//分享之展厅，分享至微信
				var button_share = Ti.UI.createButton({
					title : "分享至展厅",
					font : {fontSize: __l(13), fontWeight: 'bold'},
					backgroundImage: "/images/mbook_my_2.png",
					backgroundSelectedImage: "/images/mbook_my_2_1.png",
					left : 0,
					top : __l(10),
					bottom : __l(0),
					width : __l(104),
					height : __l(30),
					face : tiny_wrapper.face,
					json: json
				})
				pre_btn(button_share)
				button_share.addEventListener("click", function(e){
					var json = e.source.json; 
					var file = Ti.Filesystem.getFile(json.logo);
					var blob = file.read();
					var WritePost = require("write_post")
					var win = new WritePost({
						title : '发布微电影',
						backgroundColor : '#fff',
						text : '#宝宝日历微电影#我做的微电影《' + json.name + '》出炉了！邀请亲们共同欣赏：）',
						kind : 'album_book',
						image : blob,
						from : 'album_book',
						from_id : json.book_id,
						local_book_id : json.id,
						noaviary : true
					});
					file = null;
					blob = null;
					pre(win)
					win.backButtonTitle = ''
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				})
				button_wrapper.add(button_share)
				
				var tiwechat = require('com.mamashai.tiwechat');
				var button_weixin = Ti.UI.createButton({
					title : "分享至微信",
					font : {fontSize: __l(13), fontWeight: 'bold'},
					backgroundImage: "/images/mbook_my_2.png",
					backgroundSelectedImage: "/images/mbook_my_2_1.png",
					left : 0,
					top : __l(10),
					bottom : __l(0),
					width : __l(104),
					height : __l(30),
					face : tiny_wrapper.face,
					json: json
				})
				pre_btn(button_weixin)
				button_weixin.addEventListener("click", function(e){
					var optionsDialogOpts = {
						options:['分享给微信好友', '发到微信朋友圈', '取消'],
						cancel:2
					};
					
					var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
					dialog.addEventListener('click',function(e1)
					{
						if (e1.index == 0){	
							tiwechat.exampleProp = Ti.App.wechat_key;
							tiwechat.shareSession("分享我的微电影", e.source.json.name, "http://www.mamashai.com/mobile/album_book/" + e.source.json.book_id, "http://www.mamashai.com" + e.source.json.logo_url_thumb150);
							logEvent('weixin_session');
						}
						else if (e1.index == 1){											//分享微信朋友圈
							tiwechat.exampleProp = Ti.App.wechat_key;
							tiwechat.shareTimeline(e.source.json.name, "分享我的微电影", "http://www.mamashai.com/mobile/album_book/" + e.source.json.book_id, "http://www.mamashai.com" + e.source.json.logo_url_thumb150);
							
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
				
				if (tiwechat.isWeixinInstalled() == "yes")
					button_wrapper.add(button_weixin)
			}
			else{
				//编辑，删除
				var button2 = Ti.UI.createButton({
					title : "删  除",
					font : {fontSize: __l(15), fontWeight: 'bold'},
					backgroundImage: "/images/mbook_my_3.png",
					backgroundSelectedImage: "/images/mbook_my_3_1.png",
					left : 0,
					top : __l(20),
					bottom : __l(0),
					width : __l(104),
					height : __l(30),
					json: json
				})
				pre_btn(button2)
				button2.addEventListener("click", function(e1){
					var alert_dialog = Titanium.UI.createAlertDialog({
						message:'确定删除吗？',
						buttonNames: ['确定', '再想想']
					});
					alert_dialog.addEventListener("click", function(e){
						if (e.index == 0){
							var tableview = views[1].view_my;
							var rowIndex = 0;
							for(var i=0; i<tableview.data.length; i++){
								var section = tableview.data[i];
								for(var j=0; j<section.rows.length; j++){
									row = section.rows[j];
									if (row.id == parseInt(e1.source.json.id)){
										tableview.deleteRow(rowIndex);
										Ti.App.db.execute("delete from album_books where rowid = ?", e1.source.json.id)
										break;
									}
									
									rowIndex ++;
								}
							}
						}
					});
					alert_dialog.show();
				});
				
				button_wrapper.add(button2);
			}
			
		
			row.add(tiny_wrapper)
			row.add(button_wrapper)
			return row;
		}
		
		//生成书展上方的模板选择区域
		var last_select = null;
		function template_click(index){
			show_loading();
			var old_book_wrapper = null;
			for(var i=0; i<views[0].children.length; i++){
				if (views[0].children[i].tp == 'book_wrapper')
					old_book_wrapper = views[0].children[i]; 
			}
			
			var book_wrapper = Ti.UI.createScrollView({
				left: 0,
				top: __l(46),
				right: 0,
				contentWidth: Ti.App.platform_width,
				contentHeight: 'auto',
				showVerticalScrollIndicator: true,
				showHorizontalScrollIndicator : false,
				bottom: 0,
				tp: 'book_wrapper',
				layout: "vertical"
			});
			if (old_book_wrapper){
				old_book_wrapper.animate({opacity: 0, duration: 400}, function(e){
					views[0].remove(old_book_wrapper);
					views[0].add(book_wrapper);
				});
			}
			
			var more_button = Titanium.UI.createButton({
				top : __l(20),
				left : __l(40),
				right: __l(40),
				bottom: __l(20),
				width : Ti.App.platform_width - __l(80),
				height : __l(40),
				title : "更多",
				font : {fontSize: __l(18)}
			});
			pre_btn(more_button);
			var page = 1;
			more_button.addEventListener("click", function(){
				show_loading();
				page += 1;
				var url2 = url + "&page=" + page;
				http_call(url2, load_callback);
			});
					
			//过滤书展上的照片书
			var url = "";
			if (index == 0){
				url = Ti.App.mamashai + "/api/mbook/album_list2/?1=1";
			}
			else if (index >= 100){
				url = Ti.App.mamashai + "/api/mbook/album_list2/" + index;
			}
			else{
				url = Ti.App.mamashai + "/api/mbook/album_list2/?template_id=" + index;
			}
			
			function load_callback(e){
					hide_loading();
					if (e.responseText == "null"){
						return;
					}	
					
					var json = JSON.parse(e.responseText);
					var w = Ti.UI.createView({
						left : 0,
						right : 0,
						top : 0,
						height : Ti.UI.SIZE,
						width: Ti.App.platform_width,
						layout : 'horizontal'
					});
					for(var i=0; i<json.length; i++){
						var tiny_wrapper = Ti.UI.createView({
							width : __l(150),
							height : __l(183),
							left : Ti.App.is_ipad ? __l(20) : __l(5),
							right : Ti.App.is_ipad ? __l(20) : __l(5),
							top : __l(8),
							//borderColor: "red",
							borderColor: "white",
							borderWidth: 1
						});
						
						if (Ti.App.is_android && Ti.App.platform_width > __l(310)){
							var diff = (Ti.App.platform_width-__l(151)*2)/4;
							tiny_wrapper.left = diff;
							tiny_wrapper.right = diff; 
						}
						
						var bg = Ti.UI.createImageView({
							hires: true,
							image: "/images/album_book_bg2.png",
							width: __l(150),
							height: __l(143),
							left: 0,
							top: 0,
							zIndex: 2,
							touchEnabled: false
						});
						
						var face = Ti.UI.createImageView({
							width : __l(135),
							height : __l(135),
							top : __l(4),
							left: __l(7.5),
							hires : true,
							id: json[i].id,
							json : json[i],
							zIndex: 1,
							defaultImage : '/images/default.gif',
							image : "http://www.mamashai.com" + json[i].logo_url_thumb300
						});
						tiny_wrapper.face = face;
						
						var name_wrapper = Ti.UI.createView({
							width : __l(135),
							height : __l(26),
							top : __l(114),
							left: __l(7),
							backgroundColor: 'black',
							opacity: 0.5,
							zIndex: 3
						});
						
						var name = Ti.UI.createLabel({
							font:{fontSize:__l(13)},
							text: json[i].name,
							color:'white',
							textAlign:'center',
							width : __l(135),
							height : __l(26),
							top : __l(114),
							left: __l(7),
							zIndex: 4
						});
						tiny_wrapper.add(name_wrapper);
						tiny_wrapper.add(name);
						
						face.addEventListener("click", function(e) {
							var AlbumMv = require('album_mv');
							var win = new AlbumMv({
								title : e.source.json.name,
								backgroundColor : '#78A1A7',
								json : e.source.json,
								id : e.source.id,
								backButtonTitle: ''
							});
							pre(win);
									
							Ti.App.currentTabGroup.activeTab.open(win, {
								animated : true
							});
							
						});
					
						tiny_wrapper.add(face);
						tiny_wrapper.add(bg);
						
						var shadow = Ti.UI.createImageView({
							top : __l(50),
							left : __l(55),
							width : __l(40),
							height : __l(40),
							image : "/images/video_mask.png",
							zIndex : 11,
							touchEnabled: false
						});
						
						tiny_wrapper.add(shadow);
						
						var bottom_wrapper = Ti.UI.createView({
							width : __l(150),
							height : __l(58),
							top : __l(146)
						});
						var name_bg = Ti.UI.createView({
							backgroundColor: "white",
							top: 0,
							left: __l(6),
							right: __l(2),
							bottom: 0,
							opacity: 0.6
						});
						bottom_wrapper.add(name_bg);
						
						var user_logo = Ti.UI.createImageView({
							top : __l(4),
							left : __l(10),
							width : __l(30),
							height : __l(30),
							hires : true,
							borderRadius : __l(4),
							json : json[i],
							borderColor: 'white',
							borderWidth: 0,
							defaultImage : '/images/default.gif',
							image : "http://www.mamashai.com" + encodeURI(json[i].user.logo_url_thumb140)
						});
						user_logo.addEventListener("click", function(e) {
								var UserWin = require('/user');
								var win = new UserWin({
									title : e.source.json.user.name,
									backgroundColor : '#fff',
									id : e.source.json.user.id
								});
								
								win.backButtonTitle = '';
						
								Ti.App.currentTabGroup.activeTab.open(win, {
									animated : true
								});
						});
						
						var user_name = Ti.UI.createLabel({
							top : __l(2),
							left : __l(46),
							height : __l(16),
							font : {
								fontSize : __l(12)
							},
							color: '#C25178',
							text : json[i].user.name
						});
						
						//detail_age_for_birthday
						
						var text = "没有宝宝";
						if (json[i].user.user_kids && json[i].user.user_kids.length > 0){
							text = json[i].user.user_kids[0].name + detail_age_for_birthday(json[i].user.user_kids[0].birthday);
						}
						var kid_desc = Ti.UI.createLabel({
							top : __l(18),
							left : __l(46),
							right : __l(6),
							textAlign : 'left',
							height : __l(15),
							width: __l(100),
							font : {
								fontSize : __l(11)
							},
							color : "#000",
							text : text
						});
						
						bottom_wrapper.add(user_logo);
						bottom_wrapper.add(user_name);
						bottom_wrapper.add(kid_desc);
						tiny_wrapper.add(bottom_wrapper);
						
						w.add(tiny_wrapper);
						
						
					}
					
					if (book_wrapper.has_more){
						book_wrapper.remove(more_button);
						book_wrapper.has_more = false;
					}
					book_wrapper.add(w);
					
					hide_loading();
					
					if (json.length == 10){
						book_wrapper.add(more_button);
						more_button.title = "更多";
						book_wrapper.has_more = true;
					}
			}
			http_call(url, load_callback);
		}
		function make_template_selector(json){
			var TabBar = require("lib/tab_bar");
			var options = [];
			for(var i=0; i<json.length; i++){
				options.push({text: json[i].name, value: json[i].id});
			}
			
			var container = TabBar.create_tab_bar(options, false);
			container.addEventListener("tab_click", function(e){
				template_click(e.value);
			});
			setTimeout(function(){
				container.fireEvent("click", {index: 0});
			}, 200);
			
			return container;
		}
		//书展
		function create_view_0(){
			var view = Ti.UI.createView({
				left: 0,
				top: 0,
				width: Ti.App.platform_width,
				bottom: 0,
				index: 0
			});
			
			var url = Ti.App.mamashai + "/api/mbook/album_templates";
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout
			xhr.onerror = function() {
					hide_loading()
					show_timeout_dlg(xhr, url);
			};
			xhr.onload = function() {
					if (this.responseText == "null")
						return;
					var json = JSON.parse(this.responseText)
					require('/lib/mamashai_db').db.insert_json('album_templates', 0, this.responseText)
					view.add(make_template_selector(json))
			};
			
			var record = require('/lib/mamashai_db').db.select_with_check('album_templates', 0);
			if (!record.blank){
				view.add(make_template_selector(JSON.parse(record.json)));
			}
			else{
				xhr.open('GET', url);
				xhr.send();
			}
			var book_wrapper = Ti.UI.createScrollView({
				left: 0,
				top: __l(46),
				right: 0,
				bottom: 0,
				contentWidth: Ti.App.platform_width,
				contentHeight: 'auto',
				width: Ti.App.platform_width,
				showVerticalScrollIndicator: true,
				layout: "vertical",
				tp: 'book_wrapper'
			});
			view.add(book_wrapper);
			
			return view;
		}
		
		//我的书
		var row_add = null;
		function create_view_1(){
			var current_kid_id = Ti.App.Properties.getString("current_kid_id", "")
			record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
			if (!record.blank){
				var json = JSON.parse(record.json)
				user_json = json;
				kids = json.user_kids;
				kid_json = json.user_kids[0];
				if (current_kid_id != ""){
					for(var i=0; i<json.user_kids.length; i++){
						if (json.user_kids[i].id == parseInt(current_kid_id)){
							kid_json = json.user_kids[i];
							break;
						}
					}
				}
			}
		
			var view_2 = Ti.UI.createView({
				left: Ti.App.platform_width,
				top: win.has_actionbar ? __l(40) : 0,
				width: Ti.App.platform_width,
				bottom: 0,
				//height: Ti.App.platform_height,
				layout: 'vertical'
			})
			
			row_add = Ti.UI.createView({
				height: Ti.UI.SIZE,
				layout: 'vertical',
				left: 0,
				right: 0,
				top: 0
			})
			view_2.add(row_add)
			
			//我的书从网络获取变成从本地获取
			view_my = Ti.UI.createTableView({
				top: 0,
				left: 0,
				bottom: 0,
				width: Ti.App.platform_width,
				backgroundColor: 'transparent',
				separatorColor : 'transparent'
			})
			if (Ti.App.is_android){
				view_my.width = __l(320);
				view_my.left = (Ti.App.platform_width - __l(320))/2
			}
			function show_uploading_label(e){
				for(var i = 0; i < view_my.data.length; i++) {
					var section = view_my.data[i];
					for(var j=0; j<section.rows.length; j++){
						var row = section.rows[j]
						if (row.id == e.id && !row.waiting_label){
							/////////////////////////////
							Ti.API.log("!!!!!!!!!!!!!!-------------------------show_uploading_label---:" + e.id)
							
							var record = Ti.App.db.execute("select * from album_books where rowid = ?", e.id)
							var json = JSON.parse(record.fieldByName("json"))
							record.close();
							
							if (!json)
								continue;
							
							//传素材
							var max = 1;
							for (var i = 0; i < json.pages.length; i++) {
								var path = json.pages[i].picture;
								if (path && path.indexOf && path.indexOf('file') >= 0) {
									max += 1
								}
							}
							json = null;
							
							if (!e.local_auto || max > 1){		//非本地自动上传或者有本地照片未上传
								var waiting_label = Titanium.UI.createProgressBar({
										width : __l(150),
										left: Ti.App.is_ipad ? __l(42) : __l(30),
										min : 0,
										max : max,
										value : 0,
										height: __l(28),
										bottom: __l(0),
										color : "#c22",
										message : '请勿退出，正在上传...',
										font : {
											fontSize : __l(11)
										},
										id: e.id
								});
								waiting_label.addEventListener("click", function(e){
										e.source.message = '请勿退出，正在上传...'
										upload_album_book(e.source.id, waiting_label)
								})
									
								row.add(waiting_label)
								row.waiting_label = waiting_label
								waiting_label.show()
								upload_album_book(e.id, waiting_label)
							}
								
							return true;
						}
					}
				}
				return false;
			}
		
			Ti.App.addEventListener("uploading_album_book", show_uploading_label)
			win.addEventListener("close", function(e){
				if (e.source.name == "album")
					Ti.App.removeEventListener("uploading_album_book", show_uploading_label)
			})
			
			view_2.view_my = view_my
			
			//将服务器上的书同步到本地
			if (check_login()){
				http_call(Ti.App.mamashai + "/api/mbook/album_list2?per_page=30&all=true&cond=user_id=" + user_id(), function(e){
					var json = JSON.parse(e.responseText)
					for (var i=0; i<json.length; i++){
						var book_json = json[i]
						//Ti.App.db.execute('INSERT INTO album_books (rowid, book_id, user_id, template_id, kid_id, logo, name, json, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)', win.id, win.book_id, win.user_id, win.template_id, (win.kid_json ? win.kid_json.id : win.kid_id), fm_logo.nativePath, win.name, json, now.getTime(), now.getTime());
						
						var now = new Date();
						var rows = Ti.App.db.execute('select * from album_books where book_id = ?', book_json.id);
						if (!rows.isValidRow()){
							Ti.App.db.execute('INSERT INTO album_books (book_id, user_id, template_id, kid_id, logo, name, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)', 
												book_json.id, book_json.user.id, book_json.template_id, book_json.kid_id, Ti.App.mamashai + book_json.logo_url_thumb300, book_json.name, now.getTime(), now.getTime());
						}
						rows.close();
					}
					
					//var rows = null;
					if (user_id() == 270|| user_id() == 431){
						rows = Ti.App.db.execute('select * from album_books order by rowid desc');
					}
					else{
						rows = Ti.App.db.execute('select * from album_books where user_id = ? order by rowid desc', user_id());
					}
					
					var data = [];
					while (rows.isValidRow()){
					  var date = new Date();
					  date.setTime(rows.fieldByName('created_at'));
					  
					  var json = {content: rows.fieldByName('json'),
					  				logo: rows.fieldByName('logo'),
					  				name: rows.fieldByName('name'),
					  				id: rows.fieldByName("rowid"),
					  				book_id: rows.fieldByName("book_id"),
					  				kid: kid_json,
					  				user: user_json,
					  				created_at: datetime_str(date),
					  				template_id: rows.fieldByName('template_id')}
					  
					  data.push(make_mbook_my_row(json));
					  
					  //Ti.App.fireEvent("uploading_album_book", {id: json.id})
					  if (rows.fieldByName("book_id")){
					  	Ti.App.fireEvent("uploading_album_book", {id: rows.fieldByName("rowid"), local_auto: true})
					  }
					  rows.next();
					}
					view_my.data = data;
					rows.close();
				})
			}
			
			view_2.add(view_my)
			
			/////////////////////////////
			var button_add = Ti.UI.createButton({
				title : "制作新微电影",
				font : {fontSize: __l(14), fontWeight: 'bold'},
				backgroundImage: "/images/mbook_my_1.png",
				backgroundSelectedImage: "/images/mbook_my_1_1.png",
				color: 'white',
				left : Ti.App.platform_width/2 - __l(70),
				top : __l(6),
				bottom: __l(6),
				width : __l(140),
				height : __l(36)
			})
			pre_btn(button_add)
			button_add.addEventListener("click", function() {
				var Popup = require("lib/album_popup_name").album_popup_name
				var popup = new Popup(win)
			
				Ti.App.addEventListener("mbook.new", mbook_new)
				win.addEventListener("close", function(){
					Ti.App.removeEventListener("mbook.new", mbook_new)
				})
			});
			
			function make_auto_book(json){
				Ti.API.log("---make_auto_book---")
					if (json.length > 0){
						var label = Ti.UI.createLabel({
							top: __l(6),
							height: __l(20),
							left: __l(6),
							right: 0,
							font: {fontSize: __l(14)},
							color: "#333",
							text: "系统结合您的记录，凝聚微电影如下："
						})
						row_add.add(label)
				Ti.API.log("---make_auto_book1---")		
						var thumb_container = Ti.UI.createScrollView({
							top : 0,
							height : __l(118),
							width : Ti.App.platform_width,
							contentHeight : __l(118),
							contentWidth : json.length*__l(122),
							layout : 'horizontal'
						})
						
			Ti.API.log("---make_auto_book2---")			
						 for(var i=0; i<json.length; i++){
						 	var tiny_wrapper = Ti.UI.createView({
								width : __l(113),
								height : __l(109),
								left : __l(4),
								right : __l(4),
								top : __l(6),
								backgroundImage: "/images/album_book_bg.png"
							})
			Ti.API.log("---make_auto_book---" + i)				
							
							var colors = ["#EA609E", "#EA609E", "#6BB939", "#96D1D6", "#DE6500", "#F3C91D", "#9DD2EE","#EA609E", "#6BB939", "#96D1D6"]
							var color = "#EA609E";
							if (json[i].template_id >=0 && json[i].template_id<10){
								color = colors[json[i].template_id];
							}
							var name = Ti.UI.createLabel({
								font:{fontSize:__l(9)},
								text: json[i].name,
								//color:'#333',
								color: color,
								textAlign:'center',
								left: __l(4),
								right: 0,
								height : __l(20),
								top : __l(19),
								zIndex: 4
							});
							
			Ti.API.log("---make_auto_book-4--" + i)
							var face = Ti.UI.createImageView({
								width : __l(103),
								height : __l(103),
								top : __l(3),
								left: __l(6),
								hires : true,
								id: json.id,
								templaet_id: json[i].template_id,
								json : json[i],
								zIndex: 1,
								defaultImage : '/images/default.gif',
								image : "http://www.mamashai.com" + json[i].logo_thumb300
							})
							face.addEventListener("click", function(e){
								//var url = Ti.App.mamashai + "/api/statuses/user_album_book_timeline.json?1=1&count=1000&kid_id=" + kid_json.id + "&no_user_json=true&cond=forward_post_id is null and posts.created_at>='" + e.source.json.from + "' and posts.created_at<='" + e.source.json.to + "'&" + account_str();
								var url = Ti.App.mamashai + "/api/statuses/user_album_book_timeline.json?count=1000&kid_id=" + kid_json.id + "&no_user_json=true&cond=forward_post_id is null&from_day=" + e.source.json.from + "&to_day=" + e.source.json.to + "&" + account_str();
								var xhr = Ti.Network.createHTTPClient()
								xhr.timeout = Ti.App.timeout
								xhr.onerror = function(){},
								xhr.onload = function(){
										hide_loading()
										var sucai = JSON.parse(this.responseText)
										
										//缓存
										//insert_json(e.source.json.name, user_id(), this.responseText)
										var AlbumPreview = require('album_preview2')
										var win = new AlbumPreview({
											title : e.source.json.name,
											template_id : e.source.json.template_id,
											template_json : e.source.json.template_json,
											kid_json: kid_json,
											name : e.source.json.name,
											sucai: sucai.reverse(),
											backgroundColor : '#fff',
											//backgroundImage : Ti.App.ios7 ? null : "/images/mbook_beijing.jpg",
											backButtonTitle : ''
										});
										Ti.App.album_mode = "preview"
										
										pre(win)
				
										Ti.App.currentTabGroup.activeTab.open(win, {
											animated : true
										});
								}
								var record = require('/lib/mamashai_db').db.select_one_json(e.source.json.name, user_id())
								if (true || record.blank){
									xhr.open("GET", url)
									xhr.send()
									show_loading("正在下载")
								}
								else{
									var url2 = Ti.App.mamashai + "/api/statuses/public_timeline_count.json?cond=user_id=" + user_id() + " and forward_post_id is null and posts.created_at>='" + e.source.json.from + "' and posts.created_at<='" + e.source.json.to + "'";
									var xhr2 = Ti.Network.createHTTPClient()
									xhr2.timeout = Ti.App.timeout
									xhr2.onerror = function(e){
											xhr.open("GET", url)
											xhr.send()
											show_loading("正在下载")
									}
									xhr2.onload = function(){
											var count = parseInt(this.responseText)
											var sucai = JSON.parse(record.json)
											if (count == sucai.length){
												var AlbumPreview = require('album_preview2')
												var win = new AlbumPreview({
													title : e.source.json.name,
													template_id : e.source.json.template_id,
													template_json : e.source.json.template_json,
													kid_json: kid_json,
													name : e.source.json.name,
													sucai: sucai.reverse(),
													backgroundColor : '#fff',
													//backgroundImage : Ti.App.ios7 ? null : "/images/mbook_beijing.jpg",
													backButtonTitle : ''
												});
												Ti.App.album_mode = "preview"
						
												pre(win)
												Ti.App.currentTabGroup.activeTab.open(win, {
													animated : true
												});
											}
											else{
												xhr.open("GET", url)
												xhr.send()
												show_loading("正在下载")
											}
									}
									xhr2.open("GET", url2)
									xhr2.send()
								}
							})
			Ti.API.log("---make_auto_book-5--" + i)				
							var name_wrapper = Ti.UI.createView({
								width : __l(100),
								height : __l(20),
								top : __l(86),
								left: __l(6),
								backgroundColor: 'black',
								opacity: 0.5,
								zIndex: 3
							})
							var name = Ti.UI.createLabel({
								font:{fontSize:__l(10)},
								text: json[i].name,
								color:'white',
								textAlign:'center',
								width : __l(100),
								height : __l(20),
								top : __l(86),
								left: __l(6),
								zIndex: 4
							});
							tiny_wrapper.add(face)
							tiny_wrapper.add(name_wrapper)
							tiny_wrapper.add(name)
				Ti.API.log("---make_auto_book-6--" + i)			
							thumb_container.add(tiny_wrapper)
						}
						row_add.add(thumb_container)
					}
					row_add.add(button_add)
			}
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout		//2分钟超时
			xhr.onerror = function(e){
					hide_loading()
					show_timeout_dlg(xhr, url);
			}
			xhr.onload = function(){
					//生成默认书
					var json = JSON.parse(this.responseText)
					require('/lib/mamashai_db').db.insert_json('auto_books_cache', kid_json.id, this.responseText)
					make_auto_book(json)
			}
						
			if (kid_json && !Ti.App.is_android){
				var url = Ti.App.mamashai + "/api/mbook/auto_books?kid_id=" + kid_json.id + "&" + account_str();
				var record = require('/lib/mamashai_db').db.select_with_check('auto_books_cache', kid_json.id);
				if (!record.blank){
					make_auto_book(JSON.parse(record.json))
				}
				else{
					xhr.open('GET', url)
					xhr.send()
				}
			}
			else if (Ti.App.is_android){
				button_add.top = __l(12)
				row_add.add(button_add)
			}
			
			
			return view_2;
		}
		
		var views = [];
		views[0] = create_view_0();
		views[1] = create_view_1();
		views[1].left = Ti.App.platform_width;
		
		views[0].top = Ti.App.android_offset;
		views[1].top = Ti.App.android_offset;
		
		win.add(views[1])
		win.add(views[0])
		
		function change_kid(e){
			win.remove(views[1])
			views[1] = null;
			views[1] = create_view_1();
			win.add(views[1])
			tab_title.index = 0
			tab_click(0, true)
		}
		Titanium.App.addEventListener("change_kid", change_kid);
		
		function logged_in(e){
			win.remove(views[1])
			views[1] = null;
			views[1] = create_view_1();
			win.add(views[1])
			if (!Ti.App.is_android)
				tab_title.index = 0
			tab_click(0, true)
		}
		Titanium.App.addEventListener('logged_in', logged_in);
		
		win.addEventListener("close", function(){
			Ti.App.removeEventListener("mbook.save", mbook_save);
			Ti.App.removeEventListener("mbook.save", change_kid);
			Ti.App.removeEventListener("mbook.save", logged_in);
		});
		
		current_view = views[0]
		
		if (Ti.App.is_android){
			tab_click(0, true)
		}
		else{
			tab_title.fireEvent("click", {
				index : 0,
				no_animate : true
			})
		}
		
		
		///////////////////////////////////////////////
		win.addEventListener("mbook.new", mbook_new)
		win.addEventListener("mbook.new2", mbook_new2)
		
		//新建一本书，输入书名，选择主题
		function mbook_new(e) {
			//e.name：书名
			//e.template: 模板json
			
			//该选择素材了
			var AlbumSucai = require('album_sucai')
			var win = new AlbumSucai({
				title : '选择素材',
				backgroundColor : '#fff',
				name: e.name,
				template_id: e.template_id,
				//hideTitleBar: true,
				//parent : Titanium.UI.currentWindow
			});
			pre(win)
			
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});	
		}
		
		//新建一本书，选择好了素材
		function mbook_new2(e){
			var win = Titanium.UI.createWindow({
				url : "album_new.js",
				title : "编辑微电影",
				template_id : e.template_id,
				name : e.name,
				kid_json: kid_json,
				sucai: e.sucai,
				backgroundColor : '#fff',
				backButtonTitle : ''
			});
			Ti.App.album_mode = "new"
			if (!Ti.App.is_android) {
				win.hideTabBar();
			}
			
			pre(win)
			
			Ti.App.currentTabGroup.activeTab.open(win, {
				//navBarHidden : true,
				animated : true
			});
		}
		
		win.addEventListener("mbook.change_name", function(e){
			Ti.App.db.execute("update album_books set name=? where rowid=?", e.name, e.id);
			for(var i=0; i<my_faces.length; i++){
				if (my_faces[i].json.id == e.id){
					my_faces[i].name.text = e.name;
					show_notice("修改名字成功！");
					
					break;
				}
			}
		});
		
		//上传书
		function upload_album_book(id, ind){
			Ti.API.log('-------upload_album_book:' + id);
			var record = Ti.App.db.execute("select * from album_books where rowid = ?", id);
			var json = JSON.parse(record.fieldByName("json"));
			record.close();
			
			//传素材
			for (var i = 0; i < json.pages.length; i++) {
				var path = json.pages[i].picture;
				if (path && path.indexOf('file') >= 0) {
					path = real_path(path)
					Ti.API.log('begin upload page' + i + " path: " + path)
					var file = Ti.Filesystem.getFile(path.replace("_small_", ""));			//android下用小图展示避免占用过多内存
					var blob = file.read();
			
					//将新图片提交到服务器
					var xhr = Ti.Network.createHTTPClient()
					xhr.timeout = 240000 //4分钟超时
					xhr.onerror = function(e) {
							ind.message = "上传失败，点此重传"
					}
					xhr.onload = function() {
							var pic_json = JSON.parse(this.responseText);
							var record = Ti.App.db.execute("select * from album_books where rowid = ?", id)
							var json = JSON.parse(record.fieldByName("json"))
							json.pages[this.index].picture = pic_json.logo_url_thumb400;
							record.close()
							var now = new Date();
							var res = Ti.App.db.execute('update album_books set json = ?, updated_at = ? where rowid = ?', JSON.stringify(json), now.getTime(), id);
							logo = null;
							file = null;
							
							ind.value = ind.value + 1
							
							if (ind.value > ind.max + 1){
								ind.message = "上传失败，点此重传"
								return;
							}
							upload_album_book(id, ind)
					}
					xhr.index = i
					
					var url = Ti.App.mamashai + "/api/mbook/album_upload_page?" + account_str();
					xhr.open('POST', url)
			
					xhr.send({
						logo : blob
					})
					return;
				}
			}
			
			//传书本身
			Ti.API.log('begin to upload page' + i + " path: " + path)
			var record = Ti.App.db.execute("select * from album_books where rowid = ?", id)
			var json = JSON.parse(record.fieldByName("json"))	
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = 240000
			xhr.onerror = function(){
					ind.message = "上传失败，点此重传"
			}
			xhr.onload = function(){
					var json = JSON.parse(this.responseText)
					var from_id = json.id
					var now = new Date();
					Ti.App.db.execute('update album_books set book_id = ?, updated_at = ? where rowid = ?', json.id, now.getTime(), id);
								
					ind.value = ind.value + 1
					ind.message = "上传成功"
					
					if (g_button_share){
						g_button_share.fireEvent("click");
						g_button_share = null;
					}
			}
			var url = Ti.App.mamashai + "/api/mbook/album_upload.json?kid_id=" + record.fieldByName("kid_id") + "&name=" + encodeURI(record.fieldByName("name")) + "&template_id=" + record.fieldByName("template_id") + "&" + account_str();
			if (record.fieldByName("book_id")){
			    	url += "&id=" + record.fieldByName("book_id")
			}
			xhr.open('POST', url)
			
			xhr.send({
				json: JSON.stringify(json)
			})
			record.close();
		}
		
		
		logEvent('album');	
	});

	return win;
}

module.exports = AlbumWindow;
