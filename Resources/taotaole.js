/*
 function Taotaole(attr){
 Ti.include("public.js")
 var win = Titanium.UI.createWindow(attr);
 win.backgroundImage = "/images/mbook_beijing.jpg"

 return win;
 }

 module.exports = Taotaole
 */

Ti.include("public.js")
var TabBar = require("lib/tab_bar")
var win = Titanium.UI.currentWindow;
win.backButtonTitle = "返回"
win.backgroundImage = "/images/mbook_beijing.jpg"

var tab_title = Titanium.UI.iOS.createTabbedBar({
	labels : ['热淘', '孕产', '宝宝'],
	index : 0,
	style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
	backgroundColor : Ti.App.bar_color,
	width : __l(180),
	height : 30
});

tab_title.addEventListener("click", function(e) {
	wrapper.scrollToView(e.index)
})

win.setTitleControl(tab_title)

//热淘
function create_hot_tao() {
	var wrapper = Ti.UI.createView({
		left : 0,
		width : Ti.App.platform_width,
		top : 0,
		bottom : 0,
		backgroundColor : 'blue'
	})

	return wrapper
}

//孕产
function create_yun_tao() {
	var wrapper = Ti.UI.createView({
		left : 0,
		width : Ti.App.platform_width,
		top : 0,
		bottom : 0
	})

	var container = Ti.UI.createScrollView({
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		left : 0,
		width : Ti.App.platform_width,
		bottom : 0,
		top : 0,
		layout : 'vertical'
	})
	wrapper.add(container)

	var xhr = Ti.Network.createHTTPClient({
		timeout : Ti.App.timeout,
		onerror : function() {
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/taotaole/yun_categories");
		},
		onload : function() {
			var json = JSON.parse(this.responseText)
			clear_window(container);
			var data = new Array();
			data.push(json)
			add_category_to_view(container, data)	
		}
	})

	xhr.open('GET', Ti.App.mamashai + '/api/taotaole/yun_categories')
	xhr.send();
	
	return wrapper
}

//宝宝
function create_baobao_tao() {
	var wrapper = Ti.UI.createView({
		left : 0,
		width : Ti.App.platform_width,
		top : 0,
		bottom : 0
	})

	var ages = [{
		text : '孕期',
		value : 2
	}, {
		text : '0-1岁',
		value : 3
	}, {
		text : '1-2岁',
		value : 4
	}, {
		text : '2-3岁',
		value : 5
	}, {
		text : '3-5岁',
		value : 6
	}, {
		text : '5-7岁',
		value : 7
	}, {
		text : '7岁以上',
		value : 8
	}]
	var age_container = TabBar.create_tab_bar(ages)
	age_container.zIndex = 100
	age_container.backgroundColor = 'transparent'
	age_container.backgroundImage = './images/template_selector.png';
	age_container.addEventListener("tab_click", function(e) {
		xhr.open('GET', Ti.App.mamashai + '/api/taotaole/baobao_categories/' + e.value)
		xhr.send();
		show_loading("正在加载")
	})
	wrapper.add(age_container)

	var container = Ti.UI.createScrollView({
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		left : 0,
		width : Ti.App.platform_width,
		bottom : 0,
		top : __l(44),
		layout : 'vertical'
	})
	wrapper.add(container)

	var xhr = Ti.Network.createHTTPClient({
		timeout : Ti.App.timeout,
		onerror : function() {
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/taotaole/baobao_categories");
		},
		onload : function() {
			container.opacity = 0;
			var json = JSON.parse(this.responseText)
			clear_window(container);

			add_category_to_view(container, json)

			container.animate({
				opacity : 1,
				duration : 400
			}, function(e) {
				hide_loading()
			})
		}
	})

	xhr.open('GET', Ti.App.mamashai + '/api/taotaole/baobao_categories')
	xhr.send();

	return wrapper
}

var wrapper = Ti.UI.createScrollableView({
	showPagingControl : false,
	left : 0,
	right : 0,
	top : 0,
	bottom : 0,
	width : Ti.App.platform_width
});

wrapper.addEventListener("scrollEnd", function(e) {
	if (e.currentPage == tab_title.index)
		return;
	
	if ((e.currentPage || e.currentPage == 0) && tab_title.index != e.currentPage){
		tab_title.index = e.currentPage
	}	
})

wrapper.addView(create_hot_tao())
wrapper.addView(create_yun_tao())
wrapper.addView(create_baobao_tao())

win.add(wrapper)

tab_title.fireEvent("click", {
	index : 0
})

////////////////////////////////公用函数////////////////////////////////////////
function add_category_to_view(container, json) {
	for (var i = 0; i < json.length; i++) {
		var section_json = json[i]
		var section_wrapper = Ti.UI.createView({
			left : __l(6),
			width : Ti.App.platform_width - __l(12),
			top : __l(8),
			bottom : __l(2),
			backgroundColor : 'white',
			borderRadius : __l(6),
			//height: 200,
			height : Ti.UI.SIZE
		});

		//标题
		var title = Ti.UI.createLabel({
			left : __l(16),
			top : __l(10),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(13),
				fontWeight : 'bold'
			},
			color : Ti.App.bar_color,
			text : section_json.name
		});
		section_wrapper.add(title)

		var category_wrapper = Ti.UI.createView({
			left : __l(4),
			right : __l(4),
			top : __l(28),
			bottom : __l(4),
			height : Ti.UI.SIZE,
			layout : 'horizontal'
		});
		section_wrapper.add(category_wrapper)
		//添加二级类目
		for (var j = 0; section_json.age_children && j < section_json.age_children.length; j++) {
			var category_json = section_json.age_children[j]
			var tiny_wrapper = Ti.UI.createView({
				width : __l(60) + 2,
				height : __l(76),
				left : (Ti.App.platform_width - __l(20) - __l(62) * 4) / 8,
				right : (Ti.App.platform_width - __l(20) - __l(62) * 4) / 8,
				top : __l(2),
				bottom : __l(2)
			});

			tiny_wrapper.addEventListener("click", function(e) {
				var win = Titanium.UI.createWindow({
					title : e.source.cname,
					id : e.source.id,
					barColor : Ti.App.bar_color,
					url : "taotaole_products.js"
				});

				pre(win)
				if (!Ti.App.is_android) {
					win.hideTabBar();
				}

				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			})
			var picture_wrapper = Ti.UI.createView({
				left : 0,
				top : 0,
				width : __l(60) + 2,
				height : __l(60),
				bottom : 0,
				borderColor : '#e8e8e8',
				borderWidth : 1,
				cname : category_json.name,
				id : category_json.id
			});

			var picture = Ti.UI.createImageView({
				left : 0,
				right : 0,
				hires : true,
				image : category_json.logo,
				cname : category_json.name,
				id : category_json.id
			})
			picture_wrapper.add(picture)
			tiny_wrapper.add(picture_wrapper)

			var label = Ti.UI.createLabel({
				top : __l(60),
				bottom : 0,
				left : 0,
				right : __l(4),
				height : __l(16),
				font : {
					fontSize : __l(9)
				},
				textAlign : 'center',
				color : "#636363",
				text : category_json.name
			})
			tiny_wrapper.add(label)

			category_wrapper.add(tiny_wrapper)
		}

		container.add(section_wrapper)
	}
}
