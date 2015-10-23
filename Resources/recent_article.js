function RecentArticle(attr){
	Ti.include("public.js");
	var ZhinanAdv = require("lib/zhinan_adv");
	
	var win = Titanium.UI.createWindow(attr);
	
	var categories = Titanium.UI.createButton({
			title : '分类'
	});
	categories.addEventListener('click', function(e) {
			var ArticleCategory = require("article_category");
			var win = new ArticleCategory({
				fontSize : 13,
				backgroundColor : 'white',
				title : '分类'
			});
			win.backButtonTitle = '';
			pre(win);
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
	});
		
	if (!Ti.App.is_android){
		win.setRightNavButton(categories);
	}
	else{
		add_default_action_bar2(win, win.title, "分类", function(e){
			categories.fireEvent("click");
		}, true);
	}
	
	win.addEventListener("open", function(e){
		var Mamashai = require("lib/mamashai_ui");
		var tableview = Mamashai.ui.make_weibo_tableview("recent_articles", Ti.App.mamashai + "/api/articles?1=1", user_id(), "articles");
		tableview.top = 0;
		tableview.bottom = Ti.App.is_android ? __l(54) : 0;
			
		function make_article_row(json) {
			var row = Ti.UI.createTableViewRow({
				height : __l(54),
				name : json.title,
				id : json.id,
				hasChild : Ti.App.is_android ? false : true,
				selectedBackgroundColor : '#E8E8E8',
				url : "article.js",
				className : 'article'
			});
			
			var logo = Ti.UI.createImageView({
				top : __l(8),
				left : __l(8),
				width : __l(38),
				height : __l(38),
				hires: true,
				touchEnabled : false
			});
		
			if(json.logo_url_thumb99.length > 0) {
				logo.image = "http://www.mamashai.com" + encodeURI(json.logo_url);
			}
			row.add(logo);
		
			var screen_width = Ti.App.platform_width;
			var title = Ti.UI.createLabel({
				left : __l(54),
				right : __l(8),
				top : __l(2),
				height : __l(32),
				//width : screen_width - 90,
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
				left : __l(54),
				top : __l(33),
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
			return row;
		}
		
		tableview.make_row_callback = make_article_row;
		
		tableview.addEventListener('click', function(e) {
			if(e.rowData.tag == "get_more" || e.rowData.name == "get_more" || e.rowData.tag == "get_new") {
				return;
			}
			
			cache_http_call(Ti.App.mamashai + "/bbrl_code/article.txt", "cache_article", function(e1){
				var ArticleWindow = eval(e1.responseText);
				var win = new ArticleWindow({
					id : e.rowData.id,
					t : 'article',
					parent_id : e.rowData.parent_id,
					backgroundColor : 'white',
					title : e.rowData.name,
					backButtonTitle: ""
				});
				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			});
		});
		
		function make_rect_btn(image, title, desc, click){
			var button_wrapper = Ti.UI.createView({
				top: __l(4),
				bottom: __l(4),
				width: __l(130),
				height: __l(50),
				borderRadius: __l(6)
			});
			button_wrapper.addEventListener("touchstart", function(e){
				e.source.backgroundColor = "#E5E7DF";
			});
			button_wrapper.addEventListener("touchend", function(e){
				e.source.backgroundColor = "transparent";
			});
			button_wrapper.addEventListener("click", function(e){
				click();
			});
			
			button_wrapper.add(Ti.UI.createImageView({
				top: __l(10),
				bottom: __l(10),
				left: __l(4),
				height: __l(30),
				width: __l(30),
				touchEnabled: false,
				image: image
			}));
			
			button_wrapper.add(Ti.UI.createLabel({
				top: __l(8),
				bottom: __l(10),
				left: __l(38),
				font: {fontSize: __l(15)},
				text: title,
				color: 'black',
				touchEnabled: false,
				height: __l(18)
			}));
			
			button_wrapper.add(Ti.UI.createLabel({
				text: desc,
				font: {fontSize: __l(10)},
				color: "gray",
				left: __l(38),
				top: __l(28),
				touchEnabled: false,
				height: __l(18)
			}));
			
			return button_wrapper;
		}
		
		var btn_yun = make_rect_btn("./images/find/zhinan_yun.png", "孕期指南", "胎儿每周发育情况", function(){
			show_window("jiance1", {title: "孕期指南"});
		});
		
		var btn_0_3 = make_rect_btn("./images/find/zhinan_0_3.png", "0~6岁指南", "宝宝每月成长情况", function(){
			show_window("jiance2", {title: "0到6岁成长指南"});
		});
		
		var line = Ti.UI.createImageView({
			width: __l(1),
			top: __l(4),
			bottom: __l(4),
			left: Ti.App.platform_width / 2,
			image: "/images/person_line.png"
		});
		
		var header = Ti.UI.createView({
			left: 0,
			right: 0,
			height: __l(58),
			backgroundColor: '#f2f2f2',
			width: Ti.App.platform_width
		});
		btn_yun.right = Ti.App.platform_width /2 + __l(8);
		btn_0_3.left = Ti.App.platform_width /2 + __l(8);
		header.add(btn_yun);
		header.add(line);
		header.add(btn_0_3);
		tableview.headerView = header;
		win.add(make_tableview_pull(tableview));
		show_loading();	
		setTimeout(function(){
			tableview.send();
		}, 200);
		
		logEvent('recent_article');
	});
	
	return win;
}

module.exports = RecentArticle;
