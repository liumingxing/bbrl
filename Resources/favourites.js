function FavouritesWindow(attr){
	Ti.include("public.js");
	
	var Mamashai = require("lib/mamashai_ui");
	var win = Titanium.UI.createWindow(attr);
	add_default_action_bar(win, win.title, true);
	
	win.addEventListener("open", function(e){	
		function make_favourite_row(json){
			if (json.tp == "post"){
				var row = Mamashai.ui.make_weibo_row(json.post)
				row.tag = 'post';
				return row
			}
			else if (json.tp == "article"){
				var row = Ti.UI.createTableViewRow({
					height : __l(52),
					name : json.article.title,
					id : json.article.id,
					hasChild : Ti.App.is_android ? false : true,
					selectedBackgroundColor : '#fEE',
					url : "article.js",
					tag : 'article',
					className : 'article'
				});
				
				var logo = Ti.UI.createImageView({
					top : __l(7),
					left : __l(5),
					width : __l(38),
					height : __l(38),
					borderRadius : __l(4),
					hires: true,
					touchEnabled : false
				});
			
				if(json.article.logo_url_thumb99.length > 0) {
					logo.image = "http://www.mamashai.com" + encodeURI(json.article.logo_url);
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
					text : json.article.title,
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
					text : "浏览次数: " + json.article.view_count,
					touchEnabled : false
				});
				row.add(visits);
			
				var date = json.article.created_at.substr(0, 10);
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
				return row;
			}
			else if (json.tp == "dianping"){
					var json = JSON.parse(json.place.json);
					var row = Ti.UI.createTableViewRow({
						height : __l(80),
						json: json,
						selectedBackgroundColor: "#E8E8E8",
						className: 'business',
						tag: 'business'
					});
					
					var logo = Ti.UI.createImageView({
						top: __l(10),
						bottom: __l(10),
						left: __l(10),
						height: __l(60),
						width: __l(80),
						hires: true,
						touchEnabled: false,
						image: json.s_photo_url
					});
					
					var label = Ti.UI.createLabel({
						text: json.name + (json.branch_name && json.branch_name.length > 0 ? "（" + json.branch_name +"）" : ""),
						left: __l(100),
						right: __l(4),
						top: __l(10),
						font: {fontSize: __l(13)},
						touchEnabled: false,
						height: __l(18)
					});
					
					var rate = Ti.UI.createImageView({
						top: __l(36),
						left: __l(100),
						width: __l(60),
						height: __l(10),
						hires: true,
						touchEnabled: false,
						image: json.rating_img_url
					});
					
					var price = Ti.UI.createLabel({
						text: "人均：￥" + json.avg_price,
						top: __l(40),
						right: __l(4),
						font: {fontSize: __l(10)},
						touchEnabled: false,
						color: "#ccc"
					});
					
					var category = Ti.UI.createLabel({
						text: "",
						left: __l(100),
						bottom: __l(8),
						font: {fontSize: __l(10)},
						touchEnabled: false,
						color: "#ccc"
					});
					if (json.regions.length > 1)
						category.text += json.regions[1];
					if (json.categories.length > 0)
						category.text += "  " + json.categories[0];
						
					row.add(logo);
					row.add(label);
					row.add(rate);
					row.add(price);
					row.add(category);
					return row;
			}
		}
		
		var tableview = Mamashai.ui.make_weibo_tableview("favourites1", Ti.App.mamashai + "/api/statuses/user_favourites.json?1=1", user_id(), "favourites");
		//tableview.no_cache = true;
		tableview.top = Ti.App.android_offset;
		tableview.make_row_callback = make_favourite_row;
		tableview.addEventListener('click', function(e) {
			if (e.rowData.tag == 'post'||e.source.tag == 'post'){
						var win = Titanium.UI.createWindow({
								json : e.rowData.json,
								id : e.rowData.json.id,
								title : "记录详情",
								backButtonTitle : '',
								backgroundColor : 'white',
								fav: true
						});
						
						pre(win)
							
						Mamashai.ui.make_post_win(win)
							
						Ti.App.currentTabGroup.activeTab.open(win, {
							animated : true
						});
			}
			else if (e.rowData.tag == 'article'){
				var ArticleWindow = require('/article')
				var win = new ArticleWindow({
					id : e.rowData.id,
					t : 'article',
					parent_id : e.rowData.parent_id,
					backgroundColor : 'white',
					title : e.rowData.name,
					backButtonTitle: "",
					fav: true
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
				
				pre(win)
			
				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			}
			else if (e.rowData.tag == 'business'){
				var url = Ti.App.mamashai + "/api/statuses/qinzi_detail?osname=" + Ti.App.osname + "&osversion=" + Ti.App.osversion + "&appversion=" + Titanium.App.version;
				cache_http_call(url, "qinzi_detail", function(e1){
					var DetailWin = eval(e1.responseText);
					var detail_win = new DetailWin({
						backButtonTitle: "",
						backgroundColor: "white",
						json: e.rowData.json,
						fav: true
					});
					Ti.App.currentTabGroup.activeTab.open(detail_win, {
						animated : true
					});
				})
			}
		});
		win.add(tableview);
		tableview.send();
	});
	
	return win;
}
module.exports = FavouritesWindow;