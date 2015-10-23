Ti.include("public.js")
var win = Titanium.UI.currentWindow;
//win.backgroundImage = Ti.App.ios7 ? null : "/images/mbook_beijing.jpg"
var Page = require('lib/album_page')

var page_count = 16

function save_local() {
	if (!pic_container.children || pic_container.children.length == 0 || !pic_container.children[0]){
		//clearInterval(interval);
		return;
	}
	
	var blob = null;
	if (!Ti.App.is_android){
		pic_container.children[0].show()
		blob = pic_container.children[0].toImage(null, true);	
	}
	else{
		pic_container.children[0].show()
		blob = pic_container.children[0].toImage().media;
	}
	
	var now = new Date();

	var fm_logo = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "fm_" + (win.id ? win.id : now.getTime()) + ".png");
	fm_logo.write(blob)
	var json = JSON.stringify(Ti.App.book_json)
	var mode = "edit"
	if (win.id)//更新
	{
		Ti.App.db.execute('update album_books set logo = ?, json = ?, updated_at = ? where rowid = ?', fm_logo.nativePath, json, now.getTime(), win.id);

		var record = Ti.App.db.execute('select * from album_books where rowid = ?', win.id)
		if (record.rowCount == 0){
			record.close()
			Ti.App.db.execute('INSERT INTO album_books (rowid, book_id, user_id, template_id, kid_id, logo, name, json, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)', win.id, win.book_id, win.user_id, win.template_id, (win.kid_json ? win.kid_json.id : win.kid_id), fm_logo.nativePath, win.name, json, now.getTime(), now.getTime());
		}
	} else {//创建
		Ti.App.db.execute('INSERT INTO album_books (user_id, template_id, kid_id, logo, name, json, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)', user_id(), win.template_id, (win.kid_json ? win.kid_json.id : win.kid_id), fm_logo.nativePath, win.name, json, now.getTime(), now.getTime());
		
		var record = Ti.App.db.execute('select * from album_books where created_at = ?', now.getTime())
		if (record.isValidRow) {
			win.id = record.fieldByName('rowid')
		}
		record.close()
		mode = "new"
	}

	Ti.App.fireEvent("mbook.save", {
		id : win.id,
		logo : fm_logo.nativePath,
		name : win.name,
		template_id : win.template_id,
		mode : mode,
		content : json,
		book_id : win.book_id
	})
	
	fm_logo = null;
	blob = null;
}

function buy_book() {
	if (Ti.App.book_json.pages.length < 36) {
		show_alert("无法下单", "亲，完成36页才可印刷，现在是" + Ti.App.book_json.pages.length + "页，还差" + (36 - Ti.App.book_json.pages.length) + "页，加油。")
		Ti.App.removeEventListener("mbook.save", buy_book)
		return;
	} else if (Ti.App.book_json.pages.length > 36) {
		show_alert("无法下单", "亲，完成36页才可印刷，现在是" + Ti.App.book_json.pages.length + "页，超出" + (Ti.App.book_json.pages.length - 36) + "页。")
		Ti.App.removeEventListener("mbook.save", buy_book)
		return;
	}
	
	for (var i = 0; i < Ti.App.book_json.pages.length; i++) {
		if (!Ti.App.book_json.pages[i].picture) {
			show_alert("无法下单", "亲，您还有图片未填满，不能下单哦，加油。")
			Ti.App.removeEventListener("mbook.save", buy_book)
			return
		}
	}
	var id = Titanium.UI.currentWindow.id;

	var win = Titanium.UI.createWindow({
		url : "album_buy.js",
		id : id,
		title : "请填写订单信息",
		backButtonTitle : '',
		//backgroundImage : Ti.App.ios7 ? null : "/images/mbook_beijing.jpg",
	});

	Ti.App.currentTabGroup.activeTab.open(win, {
		animated : true
	});
	Ti.App.removeEventListener("mbook.save", buy_book)
}
	
var win = Ti.UI.currentWindow;
var b = Titanium.UI.createButton({
	title : '返回'
});
b.addEventListener('click', function() {
	clearInterval(interval)
	save_local()
	win.close({animated: true})
	
	if (win._parent){
		win._parent.close();
	}
});

if (!Ti.App.is_android)
	win.leftNavButton = b;

win.addEventListener("android:back", function(e){
	b.fireEvent("click")
})
//20秒保存1次
var interval = setInterval(function() {
	save_local();
}, 20000)


//mbook的json体
Ti.App.book_json = null;
var kid_json = win.kid_json;
var ratio = 1
if (Ti.App.is_ipad)
	ratio = 1.2
else if (Ti.App.is_android){
	ratio = Ti.App.platform_width*0.9/__l(300)
}

var thumb_container = null;
var ind_container = null;
var ind = null;
var pic_container = null;
function make_pic_view() {
	thumb_container = Ti.UI.createScrollView({
		top : 1,
		height : __l(66),
		width : Ti.App.platform_width,
		contentHeight : __l(62),
		contentWidth : 'auto',
		showHorizontalScrollIndicator : true,
		backgroundImage : "./images/template_selector.png",
		layout : 'horizontal'
	})
	win.add(thumb_container)
	
	ind_container = Ti.UI.createView({
		left: 0,
		right: 0,
		top: 0,
		height: __l(66),
		backgroundImage : "./images/template_selector.png",
	})
	
	ind = Titanium.UI.createProgressBar({
		min:0,
		max:1,
		left: __l(80),
		right: __l(80),
		message: "正在上传",
		top: __l(14),
		value:0,
		color:'#888'
	});
	ind_container.add(ind);
	win.add(ind_container);
	ind.hide();
	ind_container.hide();

	//pic_container = Ti.UI.createScrollView({
	if (Ti.App.is_android){
		pic_container = Ti.UI.createView({
			width : __l(300) * ratio,
			height : __l(300) * ratio,
			top : __l(70)
		});
	}
	else{
		pic_container = Ti.UI.createScrollView({
			width : __l(300) * ratio,
			height : __l(300) * ratio,
			contentHeight : __l(300) * ratio,
			contentWidth : __l(300) * ratio,
			top : __l(70)
		});
	}
	
	pic_container.addEventListener("swipe1", function(e) {
		Ti.API.log("-------------memory:" + Ti.Platform.availableMemory);
		if (e.direction == "right") {
			if (pic_container.current_index == 1) {
				left.hide();
			}
			
			if (pic_container.current_index == 0) {
				show_alert("对不起", "已经到第一页了");
			} else {
				thumb_container.children[pic_container.current_index - 1].fireEvent("click");
				right.show();
			}
			
		} else {
			if (pic_container.current_index + 1 == thumb_container.children.length - 1) {
				right.hide();
			}
			
			if (pic_container.current_index == thumb_container.children.length - 1) {
				show_alert("对不起", "已经到最后一页了");
			} else {
				thumb_container.children[pic_container.current_index + 1].fireEvent("click");
				left.show();
			}
		}
	});
	win.add(pic_container);
	win.pic_container = pic_container;

	var left = Ti.UI.createButton({
		backgroundImage : "./images/left.png",
		left : __l(1),
		top : __l(70) + __l(140) * ratio,
		height : __l(47),
		width : __l(38),
		hires : true
	});
	
	pic_container.left_btn = left;
	left.hide();
	left.addEventListener("click", function(e) {
		pic_container.fireEvent("swipe1", {
			direction : 'right'
		});
	});
	var right = Ti.UI.createButton({
		backgroundImage : "./images/right.png",
		right : __l(1),
		top : __l(70) + __l(140) * ratio,
		height : __l(47),
		width : __l(38),
		hires : true
	});
	pic_container.right_btn = right;
	right.addEventListener("click", function(e) {
		pic_container.fireEvent("swipe1", {
			direction : 'left'
		})
	})
	win.add(left)
	win.add(right)

	var toolbar = Titanium.UI.createView({
		height : __l(42),
		width : Ti.App.platform_width,
		left : 0,
		right : 0,
		bottom : 0,
		borderWidth : 0,
		backgroundImage : "./images/toolbar.png",
		zIndex : 2,
		textAlign : 'center'
	})
	var toolbar_wrapper = Titanium.UI.createView({
		height : __l(42),
		width : __l(320),
		bottom : 0,
		zIndex : 2,
		layout : 'horizontal'
	})
	var button1 = Ti.UI.createButton({
		title : "加一页",
		font : {
			fontSize : __l(15)
		},
		left : __l(20),
		right : __l(20),
		top : __l(6),
		width : __l(66),
		height : __l(32)
	})
	pre_btn(button1)
	button1.addEventListener("click", function(e) {
		var Picker = require('lib/album_page_template_picker')
		Picker.album_page_template_picker(win, 'add', pic_container.current_index)
		Ti.App.modified = true;
	})
	var button2 = Ti.UI.createButton({
		title : "删本页",
		font : {
			fontSize : __l(15)
		},
		left : __l(20),
		right : __l(20),
		top : __l(6),
		width : __l(66),
		height : __l(32)
	})
	pre_btn(button2)
	button2.addEventListener("click", function(e) {
		if (pic_container.children.length == 1) {
			show_alert("对不起", "再删就没了，留一张吧！")
			return;
		}
		var alert_dialog = Titanium.UI.createAlertDialog({
			title : "提示",
			message : '确定删除吗！',
			buttonNames : ['再想想', '确定'],
		});
		alert_dialog.addEventListener("click", function(e) {
			if (e.index == 1) {
				index = pic_container.current_index;
				if (index == 0){
					show_alert('对不起', '第一页不可删除')
					return;
				}

				var data = Ti.App.book_json;
				data.pages.splice(index, 1)
				Ti.App.book_json = data
				thumb = thumb_container.children[index]
				function delete_(e) {
					thumb_container.children[index].hide()
					thumb_container.remove(thumb_container.children[index])
					pic_container.remove(pic_container.children[index])
					setTimeout(function(e){
						filter_index()
					}, 200)
					
					thumb_container.children[index - 1].fireEvent("click")
					
					thumb_container.contentWidth = Ti.App.book_json.pages.length*__l(62);
				}
				if (Ti.App.is_android){
					delete_()
				}
				else{
					thumb.animate({
						opacity : 0,
						duration : 800
					}, delete_)
				}
				pic_container.children[pic_container.current_index - 1].zIndex = 90
				pic_container.children[pic_container.current_index].animate({
					opacity : 0,
					duration : 800
				})
				Ti.App.modified = true;
			}
		})
		alert_dialog.show();
	})
	var button3 = Ti.UI.createButton({
		title : "换模板",
		font : {
			fontSize : __l(15)
		},
		left : __l(20),
		right : __l(20),
		top : __l(6),
		width : __l(66),
		height : __l(32)
	})
	pre_btn(button3)
	button3.addEventListener("click", function(e) {
		var from = Ti.App.book_json.pages[pic_container.current_index].from
		if (from == "caiyi" || from == "shijian" || from == "bbyulu" || from == "biaoqing" || (from && from.indexOf('lama') >= 0)) {
			show_alert("提示", "对不起，这张图片不可换模板")
			return;
		}
		var Picker = require('lib/album_page_template_picker')
		Picker.album_page_template_picker(win, 'change', pic_container.current_index)
		Ti.App.modified = true;
	})

	toolbar_wrapper.add(button1)
	toolbar_wrapper.add(button2)
	toolbar_wrapper.add(button3)
	toolbar.add(toolbar_wrapper)
	win.add(toolbar)
}

make_pic_view();

var url = Ti.App.mamashai + "/api/mbook/album_template/" + win.template_id;
var xhr = Ti.Network.createHTTPClient()
xhr.timeout = Ti.App.timeout
xhr.onerror = function() {
		show_timeout_dlg(xhr, url);
}
xhr.onload = function() {
		var text = this.responseText;
		if (text == "null")
			return;

		Ti.App.modified = true;
		var json = JSON.parse(this.responseText);
		
		var datas = []
		for (var i = 0; i < page_count; i++) {
			datas.push({
				from : null,
				text : "文字",
				picture : null,
				scroll : {},
				//template: json[i % json.length]
			})
		}
		
		var book_json = {
			name : win.name,
			user_id : user_id(),
			pages : datas
		}
		
		for (var i = 0; i < win.sucai.length && i < page_count; i++) {

			book_json.pages[i].text = win.sucai[i].content
			book_json.pages[i].picture = win.sucai[i].logo_url
			book_json.pages[i].created_at = win.sucai[i].created_at
			book_json.pages[i].from = win.sucai[i].from

			var from = win.sucai[i].from
			if (from == "caiyi" || from == "shijian" || from == "bbyulu" || from == "biaoqing" || (from && from.indexOf('lama') >= 0)) {
				book_json.pages[i].template = {
					logo_url : "http://www.mamashai.com/images/album_book/template/" + (parseInt(Math.random() * 10) % 6 + 1) + ".png"
				}
			}
		}
		
		var index = 0;
		for (var i = 0; i < page_count; i++) {
			if (i < win.sucai.length) {
				var from = win.sucai[i].from
				if (from == "caiyi" || from == "shijian" || from == "bbyulu" || from == "biaoqing" || (from && from.indexOf('lama') >= 0)) {
					//不管
				} else {
					if (win.sucai[i].imageSize) {
						if (win.sucai[i].imageSize.width > win.sucai[i].imageSize.height) {//要找横模板
							while (json[index % json.length].pic_width && json[index % json.length].pic_width < json[index % json.length].pic_height) {
								index += 1
							}
							book_json.pages[i].template = json[index % json.length]
						} else {//要找竖模板或全屏模板
							while (json[index % json.length].pic_width && json[index % json.length].pic_width > json[index % json.length].pic_height) {
								index += 1
							}
							book_json.pages[i].template = json[index % json.length]
						}
					} else {
						book_json.pages[i].template = json[index % json.length]
					}
					index += 1
				}
			} else {
				book_json.pages[i].template = json[index % json.length]
				index += 1
			}
		}
		
		Ti.App.book_json = null;
		Ti.App.book_json = book_json

		make_book_from_json(Ti.App.book_json)
		hide_loading()
		
		//upload_local_image()
}

if (win.json) {
	Ti.App.book_json = win.json
	
	make_book_from_json(win.json)
	//upload_local_image()
	Ti.App.modified = false;
} else {
	xhr.open('GET', encodeURI(url));
	xhr.send();
}


//整理pic_container和thumb_container子窗体的序号
function filter_index() {
	for (var i = 0; i < thumb_container.children.length; i++) {
		thumb_container.children[i].fireEvent("refresh", {index: i})
	}
	for (var i = 0; i < pic_container.children.length; i++) {
		pic_container.children[i].index = i
	}
}

function thumb_click(e) {
	if (pic_container.current_index == e.source.index) {
		return;
	}
	clear_old_and_make_new(pic_container.current_index, e.source.index)
	pic_container.children[e.source.index].zIndex = 100;
	pic_container.children[e.source.index].show()
	if (pic_container.children[pic_container.current_index]){
		pic_container.children[pic_container.current_index].zIndex = 0;
		pic_container.children[pic_container.current_index].hide();
	}	

	if (pic_container.current_index >= 0) {
		if (thumb_container.children[pic_container.current_index])
			thumb_container.children[pic_container.current_index].fireEvent("unselected")
	}
	pic_container.current_index = e.source.index;

	thumb_container.children[pic_container.current_index].fireEvent("selected")

	thumb_container.scrollTo(pic_container.current_index * __l(62) - Ti.App.platform_width / 2 + __l(31), 0)

	make_candidate(e.source.index)

	if (e.source.index == 0)
		pic_container.left_btn.hide()
	else
		pic_container.left_btn.show()
		
	if (e.source.index >= Ti.App.book_json.pages.length-1)
		pic_container.right_btn.hide()
	else
		pic_container.right_btn.show()
}

function make_a_thumb(index) {
	var thumb = Ti.UI.createView({
		top : __l(2),
		left : __l(4),
		right : __l(4),
		height : __l(54),
		width : __l(54),
		backgroundColor : 'white',
		borderWidth: 1,
		borderColor: "#ccc",
		index : index
	})
	
	thumb.addEventListener("refresh", function(e){
		e.source.index = e.index
	})

	thumb.addEventListener("set_status", function(e) {
		clear_window(e.source)
		e.source.status = e.status
		if (e.status == "normal"){
			var page_index = Ti.UI.createLabel({
				top : 0,
				left : 0,
				width : __l(54),
				height : __l(54),
				textAlign : 'center',
				font : {
					fontSize : __l(26),
					fontWeight : 'bold'
				},
				color : "#888",
				index : e.source.index,
				text : e.source.index + 1,
				touchEnabled : false,
				zIndex : 2
			});
			e.source.page_index_center = page_index
			e.source.add(page_index)
			var page_index_shadow = Ti.UI.createLabel({
				top : __l(1),
				left : __l(1),
				width : __l(54),
				height : __l(54),
				textAlign : 'center',
				font : {
					fontSize : __l(26),
					fontWeight : 'bold'
				},
				color : "white",
				index : e.source.index,
				text : e.source.index + 1,
				touchEnabled : false,
				zIndex : 1
			});
			e.source.add(page_index_shadow)
		}
		else if (e.status == "no_picture"){
			var page_index = Ti.UI.createLabel({
				bottom : __l(4),
				left : 0,
				right : 0,
				height : __l(16),
				textAlign : 'center',
				font : {
					fontSize : __l(14),
					fontWeight : 'bold'
				},
				backgroundColor : 'white',
				color : "#BBB",
				index : e.source.index,
				touchEnabled : false,
				text : e.source.index + 1
			});
			e.source.page_index_bottom = page_index
			var label_text = Ti.UI.createLabel({
				top : 0,
				left : 0,
				width : __l(50),
				height : __l(30),
				textAlign : 'center',
				font : {
					fontSize : __l(16),
					fontWeight : 'bold'
				},
				backgroundColor : 'white',
				color : "#BBB",
				index : e.source.index,
				text : "缺图",
				touchEnabled : false
			});
			e.source.add(page_index)
			e.source.add(label_text)
		}
	})

	thumb.addEventListener("selected", function(e) {
		if (e.source.status == "normal") {
			e.source.page_index_center.color = '#333'
		}
		else if (e.source.status == "no_picture"){
			e.source.page_index_bottom.color = '#333'
		}
	})

	thumb.addEventListener("unselected", function(e) {
		if (e.source.status == "normal") {
			e.source.page_index_center.color = '#bbb'
		}
		else if (e.source.status == "no_picture"){
			e.source.page_index_bottom.color = '#bbb'
		}
	})
	//切换一页
	thumb.addEventListener("click", thumb_click)
	return thumb;
}

function make_book_from_json(book) {
	var ind3 = null;
	if (!Ti.App.is_android){
		ind3 = Titanium.UI.createProgressBar({
			width : 100,
			min : 0,
			max : book.pages.length,
			value : 0,
			color : '#fff',
			message : '正在生成：0/' + book.pages.length,
			font : {
				fontSize : 14,
				fontWeight : 'bold'
			},
			style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN
		});
		ind3.show()	
		win.setTitleControl(ind3);
	}
	else{
		ind3 = Titanium.UI.createActivityIndicator({
			location:Titanium.UI.ActivityIndicator.DIALOG,
			type:Titanium.UI.ActivityIndicator.DETERMINANT,
			min:0,
			max:book.pages.length,
			value:0
		});
	}
		
	thumb_container.contentWidth = book.pages.length*__l(62);
	for (var i = 0; i < book.pages.length; i++) {
		var thumb = make_a_thumb(i)

		thumb_container.add(thumb)
	}

	for (var i = 0; i < book.pages.length; i++) {
		ind3.value = i + 1
		ind3.message = '正在生成：' + (i + 1) + '/' + book.pages.length

		var page = null;
		if (i < 2){
			page = Page.album_page(win, book.pages[i], kid_json, __l(300) * ratio, __l(300) * ratio, i, thumb_container.children[i])
		}
		else{
			page = Ti.UI.createView({
				width: __l(300)*ratio,
				height: __l(300)*ratio,
				backgroundColor: "white",
				index: i,
				blank : true
			})
			if (thumb_container.children[i]){
				thumb_container.children[i].fireEvent("set_status", {status: book.pages[i].picture ? 'normal' : 'no_picture'})
			}
		}
		page.ratio = ratio
		page.hide()
		pic_container.add(page)
		if (i == 0) {
			page.zIndex = 100
		}
	}
	pic_container.current_index = -1

	thumb_container.children[0].fireEvent("click")
	if (!Ti.App.is_android)
		win.setTitleControl(null)
	
	ind3.hide()
	ind3 = null;
	hide_loading()
}

win.addEventListener("select_page_template", function(e) {
	if (e.mode == "add") {//加一页
		
		if (Ti.App.is_android){
			e.index = Ti.App.book_json.pages.length -1 
		}
		
		//先改变json
		var page = {
			from : null,
			text : "文字",
			picture : null,
			scroll : {},
			template : e.json
		}
		var data = Ti.App.book_json 
		data.pages.splice(e.index + 1, 0, page)
		Ti.App.book_json = data
		//生成缩略图
		var thumb = make_a_thumb(e.index + 1)

		//生成大图
		var view = Page.album_page(win, Ti.App.book_json.pages[e.index + 1], kid_json,  __l(300) * ratio, __l(300) * ratio, e.index + 1, thumb)

		//把右边的view都暂时移除，加入新view，再加回新view
		var len = thumb_container.children.length;
		for (var i = len - 1; i > e.index; i--) {
			var thumb_t = thumb_container.children[i];
			var pic = pic_container.children[i]
			thumb_container.remove(thumb_t);
			pic_container.remove(pic);
			clear_window(pic)
			thumb_t = null;
			pic = null;
		}
		thumb_container.add(thumb)
		
		pic_container.add(view)
		thumb.fireEvent("click")

		thumb_container.contentWidth = Ti.App.book_json.pages.length*__l(62);
		
		for (var i = e.index + 2; i <= len; i++) {
			var thumb = make_a_thumb(i)

			thumb_container.add(thumb)

			var page = null;
			if (i == e.index + 2){
				page = Page.album_page(win, Ti.App.book_json.pages[i], kid_json, __l(300) * ratio, __l(300) * ratio, i, thumb)
			}
			else{
				page = Ti.UI.createView({
					width: pic_container.width,
					height: pic_container.width,
					backgroundColor: "white",
					index: i,
					blank : true
				})
				thumb.fireEvent("set_status", {status: Ti.App.book_json.pages[i].picture ? 'normal' : 'no_picture'})
				
			}
			
			pic_container.add(page)
		}
		
	} 
	else if (e.mode == "change") {//换模板
		var json = Ti.App.book_json;
		json.pages[e.index].template = e.json
		Ti.App.book_json = json
		var view = pic_container.children[e.index]
		show_loading();
		Page.album_page(win, Ti.App.book_json.pages[e.index], kid_json, pic_container.width, pic_container.height, e.index, thumb_container.children[e.index], view)
		view.animate({
			opacity : 1,
			duration : 800
		}, function(e) {
			hide_loading();
		})
	}
})

function clear_old_and_make_new(old_index, new_index){
	if (Math.abs(new_index-old_index) > 1){		//新选旧选差别大
		//先生成新选
		Page.album_page(win, Ti.App.book_json.pages[new_index], kid_json, __l(300) * ratio, __l(300) * ratio, new_index, thumb_container.children[new_index], pic_container.children[new_index])
		pic_container.children[new_index].blank = false;
	}
	for(var i=old_index-1; i<=old_index+1; i++){
		if (Math.abs(new_index-i) > 1 && i>0 && i<Ti.App.book_json.pages.length){
			clear_window(pic_container.children[i])
			pic_container.children[i].blank = true;
		}
	}
}

function make_candidate(new_index){
	for(var i=new_index-1; i<=new_index+1; i++){
		if (i>=0 && i<Ti.App.book_json.pages.length && i<pic_container.children.length && pic_container.children[i].blank){
			Page.album_page(win, Ti.App.book_json.pages[i], kid_json, __l(300) * ratio, __l(300) * ratio, i, thumb_container.children[i], pic_container.children[i])
			pic_container.children[i].blank = false
		}
	}
}

//上传本地图片
function upload_local_image(){
	for (var i = 0; i < Ti.App.book_json.pages.length; i++) {
		var path = Ti.App.book_json.pages[i].picture;
		//发现本地图片了
		if (path && path.indexOf('file') >= 0) {
			var file = Ti.Filesystem.getFile(path);
			var blob = file.read();
			//将新图片提交到服务器
			var xhr = Ti.Network.createHTTPClient()
			xhr.onsendstream = function(e) {
					//show_loading("上传:" + parseInt(e.progress*100) + "%")
					//parent.waiting.value = e.progress;
			}
			xhr.onerror = function(e){
					//show_notice("保存图片到服务器失败")
					upload_local_image()
			}
			xhr.onload = function(){
					var json = JSON.parse(this.responseText);
					var data = Ti.App.book_json 
					data.pages[this.index].picture = json.logo_url_thumb400;
					Ti.App.book_json = data
					blob = null;
					file = null;
					
					if (win.id){
						var now = new Date();
						Ti.App.db.execute('update album_books set json = ?, updated_at = ? where rowid = ?', JSON.stringify(Ti.App.book_json), now.getTime(), win.id);
					}
					upload_local_image()
			}
			xhr.index = i
			
			var url = Ti.App.mamashai + "/api/mbook/album_upload_page?" + account_str();
			xhr.open('POST', url)
								
			xhr.send({
				logo : blob
			})
			return;
		}
	}
	
	setTimeout(upload_local_image, 8000)
}

function page_load(e){
	Ti.API.log("-----------------page_load_album_new:" + e.url)
	Ti.API.log("-----------------page_load_album_new win.name:" + win.name)
	if (e.url.indexOf('mamashai') > 0){
		win.close();
	}
}
Ti.App.addEventListener("page_load", page_load)
win.addEventListener("close", function(){
	Ti.App.removeEventListener("page_load", page_load)
})

var done = Titanium.UI.createButton({
	title : '完成'
})
done.addEventListener("click", function(e) {
	save_local();
	
	var json = Ti.App.book_json
	if (json.pages.length < page_count){
			show_alert("无法发布", "亲，页数未达到16页，无法分享。")
			return;
	}
	for(var i=0; i<json.pages.length; i++){
		if (!json.pages[i].picture){
			show_alert("无法发布", "亲，您还有图片有待填满。")
			return
		}	
	}
	
	var max = 1;
	for (var i = 0; i < json.pages.length; i++) {
		var path = json.pages[i].picture;
		if (path && path.indexOf('file') >= 0) {
			max += 1
		}
	}
	ind.max = max
	
	thumb_container.hide()
	ind_container.show();
	ind.show()
	
	upload_album_book(ind)
})

//点击完成，上传书
function upload_album_book(ind){
	var json = Ti.App.book_json
	
	//传素材
	for (var i = 0; i < json.pages.length; i++) {
		var path = json.pages[i].picture;
		if (path && path.indexOf('file') >= 0) {
			path = real_path(path)
			Ti.API.log('begin upload page' + i + " path: " + path)
			var file = Ti.Filesystem.getFile(path.replace("_small_", ""));			//android下用小图展示避免占用过多内存
			var blob = file.read();
	
			//将新图片提交到服务器
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = 240000 //4分钟超时
			xhr.onerror = function(e) {
					ind.message = "上传失败，点此重传"
			}
			xhr.onload = function() {
					var pic_json = JSON.parse(this.responseText);
					var json = Ti.App.book_json
					json.pages[this.index].picture = pic_json.logo_url_thumb400;
					Ti.App.book_json = json
					var now = new Date();
					//var res = Ti.App.db.execute('update album_books set json = ?, updated_at = ? where rowid = ?', JSON.stringify(json), now.getTime(), id);
					logo = null;
					file = null;
					
					ind.value = ind.value + 1
					
					upload_album_book(ind)
			}
			xhr.index = i
			
			var url = Ti.App.mamashai + "/api/mbook/album_upload_page?" + account_str();
			xhr.open('POST', url)
	
			xhr.send({
				logo : blob
			})
			return;
		}
	}
	
	//传书本身
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = 240000
	xhr.onerror = function(){
			ind.message = "上传失败，点此重传"
	}
	xhr.onload = function(){
			var json = JSON.parse(this.responseText)
			var now = new Date();
			Ti.App.db.execute('update album_books set book_id = ?, updated_at = ? where rowid = ?', json.id, now.getTime(), win.id);
						
			ind.value = ind.value + 1
			
			ind.hide()
			ind_container.hide()
			thumb_container.show()
			win.book_id = json.id
			
			b.fireEvent("click")
			show_alert("提示", "亲，上传完成啦！")
	}
	var url = Ti.App.mamashai + "/api/mbook/album_upload.json?kid_id=" + (win.kid_json ? win.kid_json.id : win.kid_id) + "&name=" + encodeURI(win.name) + "&template_id=" + win.template_id + "&" + account_str();
	if (win.book_id){
	    	url += "&id=" + win.book_id
	}
	xhr.open('POST', url)
	
	xhr.send({
		json: JSON.stringify(Ti.App.book_json)
	})
}

	//右上角按钮
	if (!Ti.App.is_android){
		win.setRightNavButton(done)
	}
	else{
		add_default_action_bar2(win, "编辑微电影", "完成", function(){
			done.fireEvent("click");
		});
	}

logEvent('album_' + Ti.App.album_mode);

