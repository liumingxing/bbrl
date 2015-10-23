function album_popup_name(win, id, name, template_id){
	Ti.include("/public.js")
	var selected_template_id = template_id;
	
	var picker_view = Titanium.UI.createView({
			height : __l(310),
			bottom : -__l(300),
			backgroundColor : 'white',
			zIndex: 100,
			label: template_id ? "请输入一个新的名字吧" : "输入名称并选择一个主题！",
	});
	picker_view.hide();
	
	var picker_view_wrapper = Ti.UI.createScrollView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		contentWidth: Ti.App.platform_width,
		contentHeight: 'auto',
		width: Ti.App.platform_width
	});
	picker_view.add(picker_view_wrapper);
	
	var fuyan = Titanium.UI.createTextField({
		height : Ti.App.is_android ? __l(40) : __l(30),
		top : __l(2),
		bottom : 2,
		left : __l(10),
		right : __l(10),
		font : {
			fontSize : __l(15)
		},
		value: name,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		hintText: "微电影名字，不超过10个汉字"
	});
	
	//获取模板
	function show_templates(json){
		var scroll = Titanium.UI.createScrollView({
			//contentHeight: __l(300),
			contentHeight: 'auto',
			contentWidth: __l(320),
			//height : Ti.App.is_android ? __l(160) : __l(200),
			width: __l(320),
			top: Ti.App.is_android ? __l(40) : __l(34),
			bottom: __l(6),
			backgroundColor : 'white',
			zIndex: 100,
			layout: 'horizontal'
		});
		picker_view_wrapper.add(scroll)
		
		var select_mask = Ti.UI.createImageView({
			top : 0,
			left : 0,
			width : __l(100),
			height : __l(100),
			hires : true,
			image : "/images/template_select.png"
		});
		var current_selected = null;
		for(var i=0; i<json.length; i++){
			var wrapper = Titanium.UI.createView({
				top : __l(10),
				left : __l(3),
				right: __l(3),
				width : __l(100),
				height : __l(120),
			});
			
			var thumb = Ti.UI.createImageView({
					top : 0,
					left : 0,
					width : __l(100),
					height : __l(100),
					hires : true,
					json: json[i],
					id: json[i].id,
					wrapper: wrapper,
					defaultImage : '/images/default.gif',
					image : "http://www.mamashai.com" + json[i].logo_url_thumb300
			})
			
			if (!template_id){
				thumb.addEventListener("click", function(e){
					selected_template_id = e.source.id
					
					if (Ti.App.is_android){
						if (current_selected){
							current_selected.name.color = '#333';
						}
					
						current_selected = e.source.wrapper;
						current_selected.name.color = 'red';
					}
					else{
						if (select_mask.__parent){
							select_mask.__parent.remove(select_mask)
						}
						e.source.wrapper.add(select_mask)
						select_mask.__parent = e.source.wrapper
					}
				})	
			}
			
			var name = Ti.UI.createLabel({
				font:{fontSize:__l(12)},
				text: json[i].name,
				color:'#333',
				textAlign:'center',
				bottom: __l(0),
				width: __l(100),
				height: __l(16)
			});
			
			wrapper.add(thumb)
			wrapper.add(name)
			wrapper.name = name;
			scroll.add(wrapper)
			
			if (template_id && template_id == json[i].id){
				wrapper.add(select_mask)
			}
		}
	}
	var url = Ti.App.mamashai + "/api/mbook/album_templates";
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout,
	xhr.onerror = function() {
			show_timeout_dlg(xhr, url);
	}
	xhr.onload = function() {
			if (this.responseText == "null")
				return;
			var json = JSON.parse(this.responseText)
			require('/lib/mamashai_db').db.insert_json('album_templates', 0, this.responseText)
			show_templates(json)
	}
	
	var record = require('/lib/mamashai_db').db.select_with_check('album_templates', 0);
	if (!record.blank){
		show_templates(JSON.parse(record.json))
	}
	else{
		xhr.open('GET', url);
		xhr.send();
	}
	
	picker_view_wrapper.add(fuyan)
	
	var PickerView = require('/lib/picker_view')
	var view = PickerView.create_picker_view(picker_view, function(){
		if (!fuyan.value || fuyan.value.length == 0){
			show_alert("提示", "请给电影一个名字吧！")
			return;
		}
		
		if (fuyan.value && fuyan.value.length > 10){
			show_alert("提示", "电影名超过10个字，再精简精简吧!")
			return;
		}
		
		if (selected_template_id == null){
			show_alert("提示", "请选择一个主题吧!")
			return;
		}
		
		fuyan.blur();
		
		if (!id){
			win.fireEvent("mbook.new", {name: fuyan.value, template_id: selected_template_id})
		}
		else{
			win.fireEvent("mbook.change_name", {name: fuyan.value, id: id})
		}
	}, 
	function(){
		
	})
	if (Ti.App.is_android){
		view.height = __l(360)
	}
	else
		view.height = Ti.App.is_iphone ? __l(440) : 740
	win.add(view)
	view.animate(PickerView.picker_slide_in);
	picker_view.show()
	
	return this;
}

exports.album_popup_name = album_popup_name;
