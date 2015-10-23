function ArticleCategory(attr){
	Ti.include("public.js")
	
	var tableview = Titanium.UI.createTableView({top: 0, separatorColor : "#ccc"});
	var win = Titanium.UI.createWindow(attr);
	
	function insert_rows_to_tableview(json) {
		var json_size = json.length;
		for(var i = 0; i < json_size; i++) {
			if(win.parent_id)
				row = Ti.UI.createTableViewRow({
					id : json[i].id,
					name: json[i].name,
					color : '#576996',
					hasChild : Ti.App.is_android ? false : true,
					selectedBackgroundColor : '#fEE',
					url : "articles.js",
					height : __l(44),
					className : "category"
				});
			else
				row = Ti.UI.createTableViewRow({
					id : json[i].id,
					name: json[i].name,
					color : '#576996',
					parent_id : json[i].id,
					hasChild : Ti.App.is_android ? false : true,
					selectedBackgroundColor : '#fEE',
					height : __l(44),
					url : "article_category.js"
				});
				
			var label1 = Ti.UI.createLabel({
				color : Ti.App.bar_color,
				left : __l(10),
				top : 0,
				height : __l(44),
				width : __l(160),
				font : {
					fontSize : __l(18),
					fontWeight : 'bold'
				},
				touchEnabled: false,
				text : json[i].name
			});
			row.add(label1)
			tableview.appendRow(row);
		}
	}
	
	var parent_id = 0;
	if (win.parent_id)
		parent_id = win.parent_id;
		
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			if(win.parent_id)
				show_timeout_dlg(xhr, Ti.App.mamashai + "/api/statuses/article_category/" + win.parent_id);
			else
				show_timeout_dlg(xhr, Ti.App.mamashai + "/api/statuses/article_category");
	}
	xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			if (json.length > 0){
				require('lib/mamashai_db').db.insert_json("article_category", parent_id, this.responseText)
			}
				
			insert_rows_to_tableview(json)
			Titanium.App.fireEvent('hide_indicator');
	}
	
	var json_row = require('/lib/mamashai_db').db.select_with_check("article_category", parent_id)
	if (json_row.blank){	
		if(win.parent_id)
			xhr.open('GET', Ti.App.mamashai + "/api/statuses/article_category/" + win.parent_id);
		else
			xhr.open('GET', Ti.App.mamashai + "/api/statuses/article_category");
		xhr.send();
		Titanium.App.fireEvent('show_indicator');	
	}
	else{
		insert_rows_to_tableview(JSON.parse(json_row.json));
		Titanium.App.fireEvent('hide_indicator');
	}
	
	tableview.addEventListener('click', function(e) {
		if(e.rowData.url) {
			var ArticleWindow = require(e.rowData.url.replace('.js', ''))
			var win = new ArticleWindow({
					title : e.rowData.name,
					id : e.rowData.id,
					t : 'article',
					parent_id : e.rowData.parent_id,
					backgroundColor : 'white',
					backButtonTitle: ''
			})
			
			pre(win)
	
			if(recent && !Titanium.UI.currentWindow.parent_id && recent.title == "显示分类") {
				var l = Ti.UI.createLabel({
					text : e.rowData.name,
					color : '#fff',
					font : {
						fontSize : 13,
						fontWeight : 'bold'
					}
				});
				win.titleControl = l;
				
				if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
					win.hideTabBar();
				}
			}
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		}
	});
	var recent = null;
	if(!win.parent_id) {
		var replace_data = []
		function recent_click() {
			if(replace_data.length > 0) {
				var t = tableview.data;
				tableview.data = replace_data;
				replace_data = t;
	
				if(recent.title == "最近更新") {
					recent.title = "显示分类";
				} else {
					recent.title = "最近更新";
				}
				return;
			}
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout
			xhr.onerror = function() {
					show_timeout_dlg(xhr, Ti.App.mamashai + "/api/articles?page=1&count=30");
			}
			xhr.onload = function() {
					var json = JSON.parse(this.responseText);
					replace_data = tableview.data;
					tableview.data = [];
					recent.title = "显示分类"
					var json_size = json.length;
					for(var i = 0; i < json_size; i++) {
						row = Ti.UI.createTableViewRow({
							height : 54,
							name : json[i].title,
							id : json[i].id,
							hasChild : Ti.App.is_android ? false : true,
							selectedBackgroundColor : '#fEE',
							url : "article.js"
						})
	
						var logo = Ti.UI.createImageView({
							top : 2,
							left : 4,
							width : 50,
							height : 50
						});
	
						if(json[i].logo_url_thumb99.length > 0) {
							logo.image = "http://www.mamashai.com" + json[i].logo_url;
						}
						row.add(logo);
	
						var screen_width = Ti.App.platform_width;
						var title = Ti.UI.createLabel({
							left : 60,
							top : 2,
							height : 30,
							width : screen_width - 90,
							font : {
								fontSize : 14,
								fontWeight : 'bold'
							},
							text : json[i].title
						});
						row.add(title);
	
						var visits = Ti.UI.createLabel({
							font : {
								fontSize : 10,
								fontWeight : 'normal'
							},
							left : 62,
							top : 31,
							bottom : 2,
							height : 'auto',
							width : 120,
							text : "浏览次数: " + json[i].view_count
						});
						row.add(visits);
	
						var date = json[i].created_at.substr(0, 10);
						var publish_at = Ti.UI.createLabel({
							font : {
								fontSize : 10,
								fontWeight : 'normal'
							},
							left : 142,
							top : 31,
							bottom : 2,
							height : 'auto',
							width : 110,
							text : "发布时间: " + date
						});
						row.add(publish_at);
	
						tableview.appendRow(row, {
							animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
						});
					}
					Titanium.App.fireEvent('hide_indicator');
			}
			xhr.open('GET', Ti.App.mamashai + "/api/articles?page=1&count=30");
			xhr.send();
			Titanium.App.fireEvent('show_indicator');
		}
	}
	
	win.add(tableview);
	
	logEvent('article_category');
	
	add_default_action_bar(win, win.title, true)
	return win;
}

module.exports = ArticleCategory;
