function Articles(attr){
	Ti.include("public.js")
	
	var win = Titanium.UI.createWindow(attr);
	var tableview = Titanium.UI.createTableView({top: 0, separatorColor : "#ccc"});
	
	function insert_rows_to_tableview(json) {
		var json_size = json.length;
		var array = [];
		for(var i = 0; i < json_size; i++) {
			var row = Ti.UI.createTableViewRow({
				height : __l(54),
				name : json[i].title,
				id : json[i].id,
				hasChild : Ti.App.is_android ? false : true,
				selectedBackgroundColor : '#fEE',
				className : "article",
				left: 0,
				right: 0
			});
		
			var logo = Ti.UI.createImageView({
				top : __l(8),
				left : __l(8),
				width : __l(38),
				height : __l(38),
				touchEnabled: false,
				hires: true
			});
		
			if(json[i].logo_url_thumb99.length > 0) {
				logo.image = "http://www.mamashai.com" + encodeURI(json[i].logo_url);
			}
			row.add(logo);
		
			var screen_width = Ti.App.platform_width;
			var title = Ti.UI.createLabel({
				left : __l(54),
				top : __l(2),
				height : __l(30),
				width : screen_width - 90,
				font : {
					fontSize : __l(14),
					fontWeight : 'bold'
				},
				color: '#333',
				touchEnabled: false,
				text : json[i].title
			});
			row.add(title);
		
			var visits = Ti.UI.createLabel({
				font : {
					fontSize : __l(10),
					fontWeight : 'normal'
				},
				left : __l(54),
				top : __l(33),
				bottom : __l(2),
				height : Ti.UI.SIZE,
				width : __l(120),
				color: "#333",
				touchEnabled: false,
				text : "浏览次数: " + json[i].view_count
			});
			row.add(visits);
		
			var date = json[i].created_at.substr(0, 10);
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
				touchEnabled: false,
				text : "发布时间: " + date
			});
			row.add(publish_at);
	
			array.push(row)
		}
		tableview.setData(array)
	}
	
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function(){
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/articles?count=30&category_id=" + win.id);
	}
	xhr.onload = function() {
			tableview.data = [];
	
			var json = JSON.parse(this.responseText);
			if (json.length > 0){
				require('lib/mamashai_db').db.insert_json("articles", win.id, this.responseText)
			}
				
			insert_rows_to_tableview(json);
			Titanium.App.fireEvent('hide_indicator');
	}
	var json_row = require('/lib/mamashai_db').db.select_with_check("articles", win.id)
	if (json_row.blank){
		xhr.open('GET', Ti.App.mamashai + "/api/articles?count=30&category_id=" + win.id);
		xhr.send();	
		Titanium.App.fireEvent('show_indicator');
	}
	else{
		insert_rows_to_tableview(JSON.parse(json_row.json));
		Titanium.App.fireEvent('hide_indicator');
	}
	
	tableview.addEventListener('click', function(e) {
			cache_http_call(Ti.App.mamashai + "/bbrl_code/article.txt", "cache_article", function(e1){
				var ArticleWindow = eval(e1.responseText);
				var win = new ArticleWindow({
					id : e.rowData.id,
					t : 'article',
					backgroundColor : 'white',
					title : e.rowData.name,
					backButtonTitle: ""
				});
				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			});
			
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
	});
	
	win.add(tableview);
	
	logEvent('article_category_2');
	
	add_default_action_bar(win, win.title, true)
	return win;
}

module.exports = Articles;
