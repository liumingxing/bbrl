function Search(attr){
 	Ti.include("public.js");
 	var Mamashai = require("lib/mamashai_ui");
 	var win = Titanium.UI.createWindow(attr);
 	add_default_action_bar(win, win.title, true);
 	
 	win.addEventListener("open", function(e){
	 	var search_wrapper = Ti.UI.createView({
	 		top: Ti.App.android_offset,
	 		left: 0,
	 		right: 0,
	 		height: Ti.App.is_android ? __l(44) : 40,
	 		backgroundColor: Ti.App.ios7 ? "#eee" : Ti.App.bar_color,
	 	});
	 	win.add(search_wrapper);
	 	var picker = null;
	 	if (Ti.App.is_android){
	 		picker = Ti.UI.createPicker({
	 			top: 0,
	 			left: 0,
	 			bottom: 0,
	 			width: __l(100)
	 		});
	 		picker.addEventListener("change", function(e){
	 			search_field.blur()
	 			picker.rowIndex = e.rowIndex
				search(search_field.value, e.rowIndex)
	 		});
		
			var column = Ti.UI.createPickerColumn();
			column.addRow(Ti.UI.createPickerRow({title:'记录',custom_item:0}));
			column.addRow(Ti.UI.createPickerRow({title:'用户',custom_item:1}));
			column.addRow(Ti.UI.createPickerRow({title:'宝典',custom_item:2}));
			if (check_login())
				column.addRow(Ti.UI.createPickerRow({title:'我的',custom_item:3}));
			picker.add(column);
			
			// turn on the selection indicator (off by default)
			picker.selectionIndicator = true;
			search_wrapper.add(picker)
	 	}
		var search_field = Ti.UI.createSearchBar({
			top: 0,
			left: Ti.App.is_android ? __l(100) : 0,
			right: 0,
			backgroundColor: 'transparent',
			barColor: Ti.App.ios7 ? "#eee" : Ti.App.bar_color,
			hintText: '输入要搜索的内容',
			showCancel : Ti.App.is_android ? false : true,
			height: Ti.App.is_android ? __l(44) : 40
		});
		search_wrapper.add(search_field);
		
		if (!Ti.App.is_android){
			var tab_wrapper = Ti.UI.createView({
				backgroundColor: Ti.App.ios7 ? "#eee" : Ti.App.bar_color,
				height: 30 + __l(10),
				left: 0,
				right: 0,
				top: 40
			});
			
			var tabbedBar = Ti.UI.iOS.createTabbedBar({
				labels: check_login() ? ['记录','用户', '宝典', '我的'] : ['记录','用户', '宝典'],
				backgroundColor : Ti.App.bar_color,
				style: Ti.UI.iPhone.SystemButtonStyle.BAR,
				height: 30,
				width: '94%',
				top: __l(5),
				index:0
			});
			tabbedBar.addEventListener("click", function(e){
				search_field.blur()
				search(search_field.value, tabbedBar.index)
			})
			tab_wrapper.add(tabbedBar);
			win.add(tab_wrapper)
		}
		else{
			var ok = Ti.UI.createButton({
				right: __l(6),
				top: __l(6),
				width: __l(50),
				height: __l(32),
				title: "搜索"
			});
			ok.addEventListener("click", function(e){
				search_field.blur();
				search_field.fireEvent("return");
			});
			pre_btn(ok);
			if (Ti.App.is_android){
				search_field.right = __l(62);
				search_wrapper.add(ok);
			}
		}
		
		search_field.addEventListener("return", function(e){
			search_field.blur();
			if (Ti.App.is_android)
				search(search_field.value, picker.rowIndex||0)
			else
				search(search_field.value, tabbedBar.index)
		})
		search_field.addEventListener("cancel", function(e){
			win.close({animated: true})
		})
		
		var section = Titanium.UI.createTableViewSection({
			headerTitle : "最近搜索"
		});
		var find_log = Ti.App.Properties.getString("find_log", "");
		var logs = find_log.split("|");
		for(var i=0; i<logs.length; i++){
			var row = Ti.UI.createTableViewRow({
				height : __l(40),
				_title: logs[i],
				selectedBackgroundColor : '#fEE',
				className : 'logs'
			}) 
			var title = Ti.UI.createLabel({
				left : __l(6),
				top : __l(0),
				height : __l(40),
				right: 0,
				font : {
					fontSize : __l(14),
				},
				touchEnabled: false,
				color: '#333',
				text : logs[i]
			});
			row.add(title)
			section.add(row)
		}
		var recent_tableview = Ti.UI.createTableView({
			top: Ti.App.is_android ? __l(40) + Ti.App.android_offset : 70 + __l(10),
			bottom: 0,
			data: [section]
		})
		recent_tableview.addEventListener("click", function(e){
			search_field.value = e.rowData._title
			search_field.fireEvent("return")
		})
		
		recent_tableview.addEventListener("scroll", function(e){
			search_field.blur()
		})
	
		win.tableview = recent_tableview;
		if (!Ti.App.is_android)
			win.add(recent_tableview);
		
		if (attr.text){
			search_field.value = attr.text;
			search(search_field.value, 0);
		}	
				
		//if (logs.length <= 3 && !Ti.App.is_android)
		setTimeout(function(){
			search_field.focus();
		}, 500);
		
		
		win.tableview = null;
		function search(text, index){
			if (!text || text == "")
				return;
			
			var logs = Ti.App.Properties.getString("find_log", "");
			var logs_array = logs.split("|");
			var has = false;
			for(var i=0; i<logs_array.length; i++){
				if (logs_array[i] == text)
					has = true;
			}
			if (!has){
				if (logs.length > 0)
					logs = text + "|" + logs
				else
					logs = text;
			}
			
			Ti.App.Properties.setString("find_log", logs);
				
			if (win.tableview){
				win.remove(win.tableview)
				win.tableview = null;
			}
			
			Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab
			var tableview = null;
			if (index == 0){
				tableview = Mamashai.ui.make_weibo_tableview("find_posts", Ti.App.mamashai + "/api/statuses/find_posts?text=" + text, null, "posts")
			}
			else if (index == 1){
				tableview = Mamashai.ui.make_weibo_tableview("find_users", Ti.App.mamashai + "/api/statuses/find_users?text=" + text, null, "users")
				tableview.make_row_callback = make_user_row;
				tableview.no_new = true
				tableview.no_more = true
				tableview.addEventListener("click", function(e){
					var json = e.rowData.json;
					show_window("user", {
						title : json.name,
						id : json.id
					});
				});
			}
			else if (index == 2){
				tableview = Mamashai.ui.make_weibo_tableview("find_articles", Ti.App.mamashai + "/api/statuses/find_articles?text=" + text, null, "articles")
				tableview.make_row_callback = make_article_row;
				tableview.addEventListener("click", function(e){
					if (e.rowData.tag == "get_more" || e.rowData.name == "get_more" || e.rowData.tag == "get_new"){
						return;
					}
					
					var win = show_window('article', {
						id : e.rowData.id,
						t: 'article',
						parent_id : e.rowData.parent_id,
						title : e.rowData.name
					})
					
					var l = Ti.UI.createLabel({
						text : e.rowData.name,
						color : '#000',
						font : {
							fontSize : 13,
							fontWeight : 'bold'
						}
					});
					win.titleControl = l;
					
					return;
				})
			}
			else if (index == 3){
				tableview = Mamashai.ui.make_weibo_tableview("find_posts", Ti.App.mamashai + "/api/statuses/find_posts?user_id=" + user_id() +"&text=" + text, null, "posts")
			}
			tableview.top = Ti.App.is_android ? Ti.App.android_offset + __l(40) : 70 + __l(10)
			tableview.bottom = 0
			tableview.no_new = true
			win.tableview = tableview;
			win.add(tableview)
			
			show_loading();
			tableview.send();
		}
		
		function make_user_row(json){
			var row = Ti.UI.createTableViewRow({
				height : __l(64),
				id : json.id,
				selectedBackgroundColor : '#fEE',
				url : "user.js",
				json: json,
				className : 'user'
			})
			
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
				right : __l(10),
				height : Ti.UI.SIZE,
				font : {
					fontSize : __l(14)
				},
				textAlign: "left",
				color: "#333",
				text : kid_desc(kid_json, datetime_str(new Date)),
				touchEnabled: false
			});
			
			row.add(user_logo);
			row.add(user_name);
			row.add(user_posts);
			
			return row;
		}
		
		function make_article_row(json){
			var row = Ti.UI.createTableViewRow({
				height : __l(48),
				name : json.title,
				id : json.id,
				hasChild : Ti.App.is_android ? false : true,
				selectedBackgroundColor : '#fEE',
				url : "article.js",
				className : 'article'
			})
			
			var logo = Ti.UI.createImageView({
				top : __l(5),
				left : __l(5),
				width : __l(38),
				height : __l(38),
				borderRadius : __l(4),
				hires: true,
				touchEnabled : false
			});
		
			if(json.logo_url && json.logo_url_thumb99.length > 0) {
				logo.image = "http://www.mamashai.com" + encodeURI(json.logo_url);
			}
			row.add(logo);
		
			var screen_width = Ti.App.platform_width;
			var title = Ti.UI.createLabel({
				left : __l(50),
				top : __l(2),
				height : __l(30),
				width : screen_width - 90,
				font : {
					fontSize : __l(14),
					fontWeight : 'bold'
				},
				color: "#333",
				text : json.title,
				touchEnabled : false
			});
			row.add(title);
		
			var visits = Ti.UI.createLabel({
				font : {
					fontSize : __l(10),
					fontWeight : 'normal'
				},
				left : __l(52),
				top : __l(31),
				bottom : __l(2),
				height : Ti.UI.SIZE,
				width : __l(120),
				color: "#333",
				text : "浏览次数: " + json.view_count,
				touchEnabled : false
			});
			row.add(visits);
		
			var date = json.created_at.substr(0, 10);
			var publish_at = Ti.UI.createLabel({
				font : {
					fontSize : __l(10),
					fontWeight : 'normal'
				},
				left : __l(142),
				top : __l(31),
				bottom : __l(2),
				height : Ti.UI.SIZE,
				width : __l(110),
				color: "#333",
				text : "发布时间: " + date,
				touchEnabled : false
			});
			row.add(publish_at);
			
			return row
		}
		
		logEvent("search");
	});
	return win;
}

module.exports = Search