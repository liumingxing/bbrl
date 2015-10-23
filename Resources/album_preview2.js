function AlbumPreview2(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	if (!Ti.App.is_android) {
		win.hideTabBar();
	}
	win.tag = 'preview';
	win.mode = "auto_preview";
	Ti.App.album_mode = "auto_preview";
	var Page = require('lib/album_page');
	
	win.addEventListener("mbook.new2", function(e) {
		win.close();
		
		setTimeout(function(){
			show_window("album_new.js", {
				title: "编辑微电影",
				mode: "new",
				template_id : win.template_id,
				kid_json : win.kid_json,
				name : win.name,
				sucai : e.sucai,
			})
			
			Ti.App.album_mode = "new";	
		}, 800)
	});
	
	var kid_json = get_kid_json();
	
	function add_foot(i, length, page){
		var foot1 = Ti.UI.createLabel({
				bottom : 4,
				right : 4,
				height : __l(16),
				font : {
					fontSize : __l(11)
				},
				color : '#FFF',
				zIndex : 10000,
				text : (i + 1) + "/" + length
			});
			var foot2 = Ti.UI.createLabel({
				bottom : 3,
				right : 3,
				height : __l(16),
				font : {
					fontSize : __l(11)
				},
				color : 'gray',
				zIndex : 10000,
				text : (i + 1) + "/" + length
			});
			page.add(foot1)
			page.add(foot2)
	}
	
	var user = Titanium.UI.createButton({
			title : "编辑",
			json : win.json
	})
		
	user.addEventListener("click", function(e) {
		show_window("album_sucai", {
			title : '选择素材',
			name : win.name,
			template_id : win.template_id,
			json : win.sucai.reverse()
		})
		Ti.App.parent = win;
	});
	
	if (!Ti.App.is_android)
		win.setRightNavButton(user)
	else{
		add_default_action_bar2(win, win.title, "编辑", function(){
			user.fireEvent("click");
		});
	}
		
	win.addEventListener("open", function(e) {
		if (e.source.tag != "preview")
			return;
			
		var wrapper = Ti.UI.createScrollView({
			left : 0,
			top : 1 + Ti.App.android_offset,
			right : 0,
			bottom : 0,
			contentWidth : Ti.App.platform_width,
			contentHeight : 'auto',
			width : Ti.App.platform_width,
			showVerticalScrollIndicator : true
		})
		win.add(wrapper)
	
		var ratio = 1;
		if (Ti.App.is_ipad)
			ratio = 1.2
		else if (Ti.App.is_android){
			ratio = Ti.App.platform_width*0.9/__l(300)
		}
			
		pic_container = Ti.UI.createScrollView({
			width : __l(300)*ratio,
			height : __l(300)*ratio,
			contentHeight : __l(300)*ratio,
			contentWidth : __l(300)*ratio,
			top : __l(10),
			anchorPoint : {
				x : 0.5,
				y : 0
			}
		})
		
		wrapper.add(pic_container)
		
		var left = Ti.UI.createButton({
			backgroundImage : "./images/left.png",
			left: __l(1),
			top : __l(140)*ratio,
			height : __l(47),
			width : __l(38),
			hires: true
		})
		left.hide();
		left.addEventListener("click", function(e){
			pic_container.fireEvent("swipe", {direction: 'right'})
		})
		var right = Ti.UI.createButton({
			backgroundImage : "./images/right.png",
			right: __l(1),
			top : __l(140)*ratio,
			height : __l(47),
			width : __l(38),
			hires: true
		})
		right.addEventListener("click", function(e){
			pic_container.fireEvent("swipe", {direction: 'left'})
		})
		wrapper.add(left)
		wrapper.add(right)
		
	
		var page_count = 0;
		var len = win.sucai.length;
		var template_len = win.template_json.length;
		
		ind3 = Titanium.UI.createProgressBar({
				width:100,
				min:0,
				max:len,
				value:0,
				color: Ti.App.ios7 ? '#000' : '#fff',
				message:'正在生成：0/' + len,
				font:{fontSize:14, fontWeight:'bold'},
				style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN
		});
		ind3.show();
		if (!Ti.App.is_android)
			win.setTitleControl(ind3);
				
		var pages = [] 
		for (var i = 0; i < len; i++) {
			ind3.setValue(i)
			ind3.message = '正在生成：' + (i+1) + "/" + len;
			var sucai = win.sucai[i];
			var page = new Object();
			page.from = sucai.from
			page.text = sucai.content
			page.picture = sucai.logo_url_thumb400
			page.created_at = sucai.created_at
			page.scroll = new Object(); 
			
			var from = win.sucai[i].from
			if (from == "caiyi" || from == "shijian" || from == "bbyulu" || from == "biaoqing" || (from && from.indexOf('lama') >= 0)) {
				page.template = {
					logo_url : "http://www.mamashai.com/images/album_book/template/" + (parseInt(Math.random() * 10) % 6 + 1) + ".png"
				}
			} else {
				//设模板
				page.template = win.template_json[i % template_len]
			}
			pages.push(page)
			page_count += 1
			var page_view = null;
			if (i<2){
				page_view = Page.album_page(win, page, win.kid_json, __l(300)*ratio, __l(300)*ratio, i, null)
				page_view.finished = "true";
				page_view.ratio = ratio
				page_view.json = page
			}
			else{
				page_view = Ti.UI.createView({
					width: __l(300)*ratio,
					height: __l(300)*ratio,
					backgroundColor: "#ddd",
					index: i,
					ratio: ratio,
					json: page,
					blank: true
				})
			}
			
			page_view.touchEnabled = false;
			page_view.enabled = false;
			page_view.zIndex = len - i
			
			add_foot(i, len, page_view)
			
			pic_container.add(page_view)
		}
		Ti.App.book_json = {
			name : win.name,
			user_id : user_id(),
			pages : pages
		}
		
		if (!Ti.App.is_android)
			win.setTitleControl(null);
		
		ind3.hide()
		
		if (page_count == 0) {
			show_alert("对不起", "没有可以展示的页。")
		}
	
		//翻页
		var current_page = 0
		function switch_to(index) {
			var old_current = current_page
			var current_view = pic_container.children[current_page];
			var new_view = pic_container.children[index]
	
			if (index > current_page) {
				new_view.show();
				current_view.hide();
			} else {
				new_view.show();
				current_view.hide();
			}
	
			current_page = index;
	
			if (index == 0) {
				left.hide();
			} else if (index == pic_container.children.length - 1) {
				right.hide();
			} else {
				left.show();
				right.show();
			}
			
			clear_old_and_make_candidate(old_current, index)
		}
		
		function clear_old_and_make_candidate(old_current, new_index){
			for(var i=old_current-1; i<=old_current + 1; i++){
				if (i>0 && i<pic_container.children.length && Math.abs(i-new_index) > 1){
					clear_window(pic_container.children[i])
					pic_container.children[i].blank = true
				}	
			}
			for(var i=new_index-1; i<=new_index+1; i++){
				if (i>0 && i<pic_container.children.length && pic_container.children[i].blank){
					var ratio = pic_container.children[i].ratio
					Page.album_page(win, pic_container.children[i].json, win.kid_json, __l(300)*ratio, __l(300)*ratio, pic_container.children[i].index, null, pic_container.children[i])
					pic_container.children[i].blank = false
					add_foot(pic_container.children[i].index, Ti.App.book_json.pages.length, pic_container.children[i])
				}
			}
		}
	
		pic_container.addEventListener("swipe", function(e) {
			if (e.direction == "left") {
				if (current_page < pic_container.children.length - 1)
					switch_to(current_page + 1)
				else
					show_alert("提示", "已经是最后一页了")
			} else if (e.direction == "right") {
				if (current_page > 0)
					switch_to(current_page - 1)
				else
					show_alert("提示", "已经是第一页了")
			}
		})
	})
		
	
	logEvent('album_book_preview2');
	return win;
}

module.exports = AlbumPreview2;
