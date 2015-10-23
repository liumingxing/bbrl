Ti.include("/public.js")

function album_page_template_picker(win, mode, page_index) {
	var PickerView = require('/lib/picker_view')
	
	var picker_view = Titanium.UI.createView({
		top: 0,
		height : __l(124),
		bottom : -__l(124),
		backgroundColor : 'white',
		zIndex : 1000,
		label : "请选择一张模板吧！"
	});

	var scroll = Ti.UI.createScrollView({
		top : __l(2),
		left : 0,
		right : 0,
		contentHeight : __l(70),
		height : __l(72),
		contentWidth : 'auto',
		showHorizontalScrollIndicator : true,
		layout : 'horizontal',
	})
	picker_view.add(scroll)

	function make_thumb_from_json(json) {
		scroll.contentWidth = json.length*__l(73)
		for (var i = 0; i < json.length; i++) {
			var thumb_wrapper = Ti.UI.createView({
				top : __l(10),
				left : __l(5),
				right : __l(5),
				width : __l(62.5),
				height : __l(62.5),
				json : json[i]
			})
			
			var thumb = Ti.UI.createImageView({
				top : __l(0),
				left : __l(0),
				right : __l(0),
				bottom: __l(0),
				width : __l(62.5),
				height : __l(62.5),
				hires : true,
				image : "http://www.mamashai.com" + json[i].logo_url,
				touchEnabled: false
			})
			thumb_wrapper.add(thumb)
			thumb_wrapper.addEventListener("click", function(e) {
				win.fireEvent("select_page_template", {
					mode : mode,
					json : e.source.json,
					index : win.pic_container.current_index
				})
				//加页
				if (mode == "add") {
					view.animate(PickerView.picker_slide_out)
				}
			})
			if (json[i].json) {
				var json2 = JSON.parse(json[i].json)
				if (json2 && json2.picture) {
					var tiny = Ti.UI.createImageView({
						top : __l(json2.picture.top / 9.6),
						left : __l(json2.picture.left / 9.6),
						width : __l(json2.picture.width / 9.6),
						height : __l(json2.picture.height / 9.6),
						backgroundColor : "#ddd",
						json : json[i],
						touchEnable : false
					})
					thumb_wrapper.add(tiny)
				}

				if (json2 && json2.text) {
					var tiny = Ti.UI.createImageView({
						top : __l(json2.text.top / 9.6),
						left : __l(json2.text.left / 9.6),
						height : __l(json2.text.height / 9.6),
						backgroundColor : "#eee",
						json : json[i],
						touchEnable : false
					})

					if (json2.text.right) {
						tiny.right = __l(json2.text.right / 9.6)
					}
					if (json2.text.width) {
						tiny.width = __l(json2.text.width / 9.6)
					}
					thumb_wrapper.add(tiny)
				}
			}

			scroll.add(thumb_wrapper)
		}
	}

	var url = Ti.App.mamashai + "/api/mbook/album_template/" + win.template_id;
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			show_timeout_dlg(xhr, url);
	}
	xhr.onload = function() {
			if (this.responseText == "null")
				return;
			var json = JSON.parse(this.responseText)
			require('/lib/mamashai_db').db.insert_json('album_template_pages', win.template_id, this.responseText)
			make_thumb_from_json(json)
	};
	
	var record = require('/lib/mamashai_db').db.select_one_json('album_template_pages', win.template_id);
	if (record.blank){
		xhr.open('GET', url);
		xhr.send();	
	}
	else{
		var json = JSON.parse(record.json)
		make_thumb_from_json(json)
	}
	
	
	var view = PickerView.create_picker_view(picker_view, function(){
		//nothing to do
	})
	
	if (Ti.App.is_android)
		view.height = __l(130)
	else if (Ti.App.is_iphone){
		view.height = __l(230)
	}
	//view.height = Ti.App.is_android ? __l(130) : __l(230)
	win.add(view)
	view.animate(PickerView.picker_slide_in);

	this.view = picker_view;

	return this;
}

exports.album_page_template_picker = album_page_template_picker;
