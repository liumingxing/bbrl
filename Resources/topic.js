function Topic(attr){
	Ti.include("public.js");
	var ZhinanAdv = require("lib/zhinan_adv");
	var TabBar = require("lib/tab_bar");
	
	var win = Titanium.UI.createWindow(attr);
	add_default_action_bar(win, win.title, true);
	
	win.addEventListener("open", function(){
		if (Ti.App.is_android){
			Ti.UI.Android.hideSoftKeyboard();
		}	
	
		var ages = [{text: '热点话题', value: 0}, {text: '孕期', value: 2}, {text: '0-1岁', value: 3}, {text: '1-2岁', value: 4}, {text: '2-3岁', value: 5}, {text: '3-5岁', value: 6}, {text: '5-7岁', value: 7}, {text: '7岁以上', value: 8}, {text: '备孕', value: 1}];
		var age_container = TabBar.create_tab_bar(ages);
		age_container.top = Ti.App.android_offset;
		age_container.addEventListener("tab_click", function(e) {
				require('lib/mamashai_db').db.insert_json("last_age_id", "0", e.value);
		
				if (e.value == 0){
					//clear_window(topic_container);
					var old_hot_topic = hot_topic;
					
					hot_topic = Ti.UI.createView({
						top : 0,
						width : Ti.App.platform_width,
						height: Ti.UI.SIZE,
						left : 0,
						right : 0,
						layout : 'horizontal'
					});
					
					var url = Ti.App.mamashai + "/api/statuses/the_hot_topic.json?version=2&limit=10";
					var page = 1;
					function call_back(e){
							if(this.responseText == "null") {
								show_alert("发生错误", "获取热点话题失败");
								return;
							}
			
							var json = JSON.parse(e.responseText);
							
							//构造本周热点话题
							var this_week = Ti.UI.createView({
								left: 0,
								width: Ti.App.platform_width,
								top: __l(5),
								height: __l(40)
							});
							var label = Ti.UI.createLabel({
								text : "当前热点话题：",
								font : {
									fontSize : __l(13)
								},
								color: "#333",
								height : __l(40),
								width: __l(110),
								top : __l(00),
								left : __l(10),
								textAlign : 'left'
							});
							
							var button = Ti.UI.createButton({
								title : "  " + json[0].short_tag_name + "  ",
								font : {
									fontSize : __l(14)
								},
								height : __l(30),
								top : __l(4),
								bottom: __l(4),
								left : __l(100),
								textAlign : 'center',
								selectedColor : '#003'
							});
							pre_btn(button);
							button.addEventListener("click", function(e){
								var win = show_window('topic_detail', {
									title : json[0].short_tag_name,
									tag: json[0].tag_name,
									notice: "参与本话题可赢晒豆哦",
									json: json[0]
								});
							});
							
							hot_topic.add(this_week);
							this_week.add(label);
							this_week.add(button);
							
							//构造本周热点话题
							var last_week = Ti.UI.createView({
								width: Ti.App.platform_width,
								height: __l(30)
							});
							var label = Ti.UI.createLabel({
								text : "往期热点话题：",
								font : {
									fontSize : __l(13)
								},
								color: "#333",
								height : __l(30),
								width: __l(110),
								top : __l(0),
								left : __l(10),
								textAlign : 'left'
							});
							hot_topic.add(last_week);
							last_week.add(label);
							
							for(var i=1; i<json.length; i++){
								var aButton = Ti.UI.createButton({
									title : "  " + json[i].short_tag_name + "  ",
									json : json[i],
									tag : json[i].tag_name,
									height : Ti.App.is_android ? __l(32) : __l(24),
									top : __l(0),
									bottom : __l(8),
									left : __l(8),
									width : Ti.UI.SIZE,
									font : {
										fontSize : __l(14)
									}
								});
								pre_btn(aButton);
								aButton.addEventListener('click', function(e) {
									var win = show_window("topic_detail", {
										title : e.source.title,
										tag: e.source.tag,
										json: e.source.json
									});
								});
								hot_topic.add(aButton);
							}
							
							var more = Ti.UI.createButton({
									title : "  >>  ",
									height : Ti.App.is_android ? __l(32) : __l(24),
									top : __l(0),
									bottom : __l(8),
									left : __l(8),
									width : Ti.UI.SIZE,
									font : {
										fontSize : __l(14)
									}
							});
							pre_btn(more);
							more.addEventListener('click', function(e) {
								page += 1;
								http_call(url + "&page=" + page, function(e){
									hot_topic.remove(more);
									var json = JSON.parse(e.responseText);
									for(var i=1; i<json.length; i++){
										var aButton = Ti.UI.createButton({
											title : "  " + json[i].short_tag_name + "  ",
											json : json[i],
											tag : json[i].tag_name,
											height : Ti.App.is_android ? __l(32) : __l(24),
											top : __l(0),
											bottom : __l(8),
											left : __l(8),
											width : Ti.UI.SIZE,
											font : {
												fontSize : __l(14)
											}
										});
										pre_btn(aButton);
										aButton.addEventListener('click', function(e) {
											var win = show_window("topic_detail", {
												title : e.source.title,
												tag: e.source.tag,
												json: e.source.json
											});
										});
										hot_topic.add(aButton);
									}
									
									if (json.length > 0)
										hot_topic.add(more);
								});
							});
							hot_topic.add(more);
								
							old_hot_topic.animate({opacity: 0, duration: 400}, function(e){
								topic_container.remove(old_hot_topic);
								topic_container.add(hot_topic);
							});
							if (win.adview){
								win.remove(win.adview);
							}
							ZhinanAdv.zhinan_adv('article', win);
							
							hide_loading();
					}
					http_call(url, call_back);
					
					return;
				};
				
				//取得话题话题
				var xhr = Ti.Network.createHTTPClient();
				xhr.timeout = Ti.App.timeout;
				xhr.onerror = function() {
						//show_alert("发生错误", "获取话题失败");
						show_timeout_dlg(xhr, url);
				};
				xhr.onload = function() {
						if(this.responseText == "null") {
							show_alert("发生错误", "获取话题失败");
							return;
						}
		
						make_topic_area(JSON.parse(this.responseText));
						require('lib/mamashai_db').db.insert_json("hot_topic", e.source.id, this.responseText);
						if (win.adview){
							win.remove(win.adview);
						}
						ZhinanAdv.zhinan_adv('article', win);
				};
				
				var record = require('/lib/mamashai_db').db.select_with_check('hot_topic', e.value);
				if(record.blank) {
					var url = Ti.App.mamashai + "/api/statuses/hot_topic.json?per_page=12&id=" + e.value;
					xhr.open('GET', url);
					xhr.send();
				} else {
					make_topic_area(JSON.parse(record.json));
				}
				
			});
		
		var topic_container = Titanium.UI.createScrollView({
			contentHeight : 'auto',
			contentWidth: Ti.App.platform_width,
			top : age_container.height + Ti.App.android_offset,
			bottom : __l(50),
			left : 0,
			right : 0,
			zIndex : 1,
			height: Ti.UI.FILL,
			width: Ti.App.platform_width,
			showVerticalScrollIndicator : true
		});
		
		var hot_topic = Ti.UI.createView({
			top : 0,
			width : Ti.App.platform_width,
			bottom: __l(0),
			left : 0,
			right : 0,
			layout : 'horizontal'
		});
		
		topic_container.add(hot_topic);
		
		function make_topic_area(json) {
			//clear_window(topic_container)
			//topic_container.remove(hot_topic)
			var old_hot_topic = hot_topic;
			hot_topic = Ti.UI.createView({
				top : __l(4),
				width : Ti.App.platform_width,
				height: Ti.UI.SIZE,
				left : 0,
				right : 0,
				layout : 'horizontal'
			});
			//topic_container.add(hot_topic)
		
			for(var i = 0; i < json.length; i++) {
				var aButton = Ti.UI.createButton({
					title : "  " + json[i].short_tag_name + "  ",
					json : json[i],
					tag : json[i].tag_name,
					height : __l(32),
					top : __l(4),
					bottom : __l(4),
					left : __l(8),
					width : Ti.UI.SIZE,
					font : {
						fontSize : __l(14)
					}
				});
				pre_btn(aButton)
				
				aButton.addEventListener('click', function(e) {
					var win = show_window("topic_detail", {
						title : e.source.title,
						tag: e.source.tag,
						json: e.source.json
					});
				});
				hot_topic.add(aButton);
			}
			
			old_hot_topic.animate({opacity: 0, duration: 400}, function(e){
				topic_container.remove(old_hot_topic);
				topic_container.add(hot_topic);
			});
			//topic_container.add(hot_topic);
			hot_topic.show();
			
			hide_loading()
		}
		
		var last_select = null;
		
		win.add(age_container);
		win.add(topic_container);
		
		age_container.fireEvent("click", {index: 0});
		
		logEvent('hot_topic');
		
		show_loading();
	});
	return win;
}

module.exports = Topic;
