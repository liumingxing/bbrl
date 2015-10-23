function TopicDetail(attr){
	Ti.include("public.js");
	var Mamashai = require("lib/mamashai_ui");
	var win = Titanium.UI.createWindow(attr);
	
	add_default_action_bar2(win, win.title, "参与话题", function(){
			win.join.fireEvent("click");
	});
	win.addEventListener("open", function(e){
		var wrapper = Ti.UI.createView({
				top: Ti.App.android_offset,
				left : 0,
				right : 0,
				bottom: 0,
				layout : 'vertical',
		});
		
		win.add(wrapper);
		
		//生成话题小界面
		var topic_view = Ti.UI.createView({
			left : 0,
			//height : __l(100),
			height: Ti.UI.SIZE,
			backgroundColor : '#eee',
			top : 0
		});
		
		var logo = Ti.UI.createImageView({
			image : "http://www.mamashai.com" + encodeURI(win.json.logo_url_thumb90),
			width : __l(45),
			height : __l(45),
			hires : true,
			top : 5,
			left : 5
		});
		topic_view.add(logo);
		
		var topic_text = Ti.UI.createView({
			left : __l(56),
			top : 0,
			height : Ti.UI.SIZE,
			layout : 'vertical'
		});
		topic_view.add(topic_text);
		
		var topic_summary = Ti.UI.createLabel({
			text : win.json.description,
			color : 'black',
			font : {
				fontSize : Titanium.Platform.osname == 'ipad' ? 20 : __l(13)
			},
			height : Ti.UI.SIZE,
			left : 0,
			right : 4,
			top : Ti.App.is_android ? 0 : 4,
			textAlign : 'left'
		});
		
		topic_text.add(topic_summary);
		
		wrapper.add(topic_view);
		
		if (win.json.tao_topic){
			var arr = win.json.tao_topic.desc.match(/#(.+)#/);
			if (arr.length > 1){
				var button_wrapper = Ti.UI.createView({
					top: __l(10),
					left: __l(6),
					right: __l(6),
					bottom: __l(6),
					height: Ti.UI.SIZE
				});
				wrapper.add(button_wrapper);
				
				var label = Ti.UI.createLabel({
					text : "    #" + arr[1] + "#    ",
					color: Ti.App.bar_color,
					value: win.json.title,
					height: __l(22),
					backgroundColor: '#FAD6E7',
					borderRadius: __l(11),
					font: {fontSize : __l(12)},
					json: win.json.tao_topic
				});
				label.addEventListener("click", function(e){
					var win = Titanium.UI.createWindow({
						title : arr[1],
						json : e.source.json,
						url : 'gou_topic.js',
						backgroundColor: 'white',
						backButtonTitle : ''
					});
					pre(win)
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				});
				
				button_wrapper.add(label)
			}	
		}
		
		var join = Titanium.UI.createButton({
			title : '参与话题',
			tag : win.title
		});
		win.join = join;
		join.addEventListener('click', function(e) {
			if (!check_login()) {
				to_login();
				return;
			}
			
			var WritePost = require("write_post");
			var win2 = new WritePost({
				text : "#" + win.tag + "#",
				backgroundColor : 'white',
				from : "wenzi",
				kind : "wenzi",
				backButtonTitle : '',
				title : '参与话题'
			});
			pre(win2);
			Ti.App.currentTabGroup.activeTab.open(win2, {
				animated : true
			});
		});
		
		if (!Ti.App.is_android)
			win.setRightNavButton(join);
			
		if (win.notice){
			/*
			win.addEventListener("open", function(e){
				show_notice(win.notice)
			})
			*/
			show_notice(win.notice);
		}
		
		
		Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab;
		var topic_tableview = Mamashai.ui.make_weibo_tableview('topic_' + win.title, Ti.App.mamashai + "/api/statuses/public_timeline.json?tag=" + win.title, user_id(), "posts");
		topic_tableview.top = __l(2);
		wrapper.add(make_tableview_pull(topic_tableview));
		
		topic_tableview.send();
		
		logEvent('topic'); 
	});
	
	return win;
}

module.exports = TopicDetail;