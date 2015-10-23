//收藏的界面

Ti.include("public.js")
var win = Titanium.UI.currentWindow;
var Mamashai = require("lib/mamashai_ui")
Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab

var width = 160;
if(Ti.App.is_ipad) {
	width = 260;
}

function tab_click(index, no_animate) {
	for (var i = 0; i < 2; i++) {
		if (i == index) {
			if (!views[i].children || views[i].children.length == 0) {
				show_loading();
				var tableview = Mamashai.ui.make_weibo_tableview(views[i].arg1, views[i].arg2, views[i].arg3, views[i].arg4)
				if (i==1){
					tableview.make_row_callback = make_article_row;
				}
				tableview.no_cache = true;
				
				tableview.addEventListener('click', function(e) {
					if(e.rowData.url == "post.js"){
						return;
					}
					
					if(e.rowData.tag == "get_more" || e.rowData.name == "get_more" || e.rowData.tag == "get_new") {
						return;
					}
					
					var ArticleWindow = require('article')
					var win = new ArticleWindow({
						id : e.rowData.id,
						t : 'article',
						parent_id : e.rowData.parent_id,
						backgroundColor : 'white',
						title : e.rowData.name
					})
				
					var l = Ti.UI.createLabel({
						text : e.rowData.name,
						color : '#fff',
						font : {
							fontSize : 13,
							fontWeight : 'bold'
						}
					});
					win.titleControl = l;
				
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				});

					
				tableview.top = 0;
				tableview.bottom = 0;
				views[i].add(tableview);
				tableview.send();
			}
			views[i].show();

			if (!no_animate) {
				win.animate({
					view : views[i],
					transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
				})
			}
		}
	}

	for (var i = 0; i < 2; i++) {
		if (i != index)
			views[i].hide();
	}

	logEvent('posts', {
		kind : index
	});
}

if (!Ti.App.is_android){
	var tab_title = Titanium.UI.iOS.createTabbedBar({
		labels : ['记录', '宝典'],
		index : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor : Ti.App.bar_color,
		width : width,
		height : 30
	});
	
	tab_title.addEventListener("click", function(e) {
		tab_click(e.index, e.no_animate)
	})
	
	win.addEventListener("load", function() {
		win.setTitleControl(tab_title)
	})
}
else{
			add_tab_to_actionbar(win, win.title, [{
		           		title: '记录',
		           		selected: true,
		           		click: function(){
		           			tab_click(0);
		           		}
		           },
		           {
		           		title: '宝典',
		           		click: function(){
		           			tab_click(1);
		           		}
		           }
		    ]);
}


var views = new Array;
views[0] =  Ti.UI.createView({backgroundColor : 'white', arg1: "claps", arg2: Ti.App.mamashai + "/api/statuses/user_claps.json?id=" + win.user_id, arg3: user_id(), arg4 : "posts"});
views[1] =  Ti.UI.createView({backgroundColor : 'white', arg1: "article_claps", arg2: Ti.App.mamashai + "/api/statuses/user_clap_articles.json?1=1", arg3: user_id(), arg4 : "articles"});

function make_article_row(json) {
	var row = Ti.UI.createTableViewRow({
		height : __l(48),
		name : json.title,
		id : json.id,
		hasChild : true,
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

	if(json.logo_url_thumb99.length > 0) {
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
	return row;
}

for(var i=0; i<2; i++){
	views[i].hide();
	views[i].bottom = 0;
	views[i].top    = 0;
	win.add(views[i]);
}

if (Ti.App.is_android){
	tab_click(0, true)
}
else{
	tab_title.fireEvent("click", {index: 0, no_animate : true})
}
logEvent('user_claps');
