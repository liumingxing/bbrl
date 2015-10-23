//创建购放心界面
function __l(x){
	if (Ti.App.is_android){
		 return parseInt(Ti.App.platform_width*x/(Ti.App.logicalDensityFactor == 1 ? 360 : 320));
	}
	
	if (!Ti.App.is_android && !Ti.App.is_ipad && Ti.App.platform_width > 320){
		return parseInt(375.0*x/320);
	}
	
	return Ti.App.is_ipad ? 1.5*x : x;
	/*
	if (Ti.App.is_android && Ti.App.platform_width > 320 && Ti.App.platform_width <=400){
		return parseInt(1.1*x);
	}
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	return Ti.App.is_ipad ? 2*x : x;
	*/
}

function pre(window) {
	//安卓系统隐藏标题条
	if (Ti.App.is_android) {
		if (Ti.Platform.Android.API_LEVEL < 11)
			window.setNavBarHidden(true)
			
		//window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE
		window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
		//window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED

		window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT];
	}
}

function create_gou_fangxin(ages, not_send) {
	var ZhinanAdv = require("lib/zhinan_adv")
	
	var wrapper = Ti.UI.createView({
		left : 0,
		width : Ti.App.platform_width,
		top : 0,
		bottom : 0
	})

	if (ages.length > 1) {
		var TabBar = require("lib/tab_bar")
		var age_container = TabBar.create_tab_bar(ages, true)
		age_container.zIndex = 100
		age_container.addEventListener("tab_click", function(e) {
			xhr.age_id = e.value;
			xhr.open('GET', Ti.App.mamashai + '/api/taotaole/baobao_categories/' + e.value)
			xhr.send();
			Titanium.App.fireEvent('show_indicator', {
				tip : "正在加载"
			});
		})
		wrapper.add(age_container)
		age_container.fireEvent("click", {
			index : 0,
			only_select : true
		})
	}

	var container = Ti.UI.createScrollView({
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		left : 0,
		width : Ti.App.platform_width,
		bottom : __l(50),
		top : ages.length > 1 ? __l(44) : 0,
		layout : 'vertical'
	});
	wrapper.container = container;
	wrapper.add(container)
	
	ZhinanAdv.zhinan_adv('gou', wrapper)
	
	function make_category_view(json) {
		var old_container = wrapper.container;
		old_container.hide();
		wrapper.remove(old_container);
		if (wrapper.adview){
			wrapper.remove(wrapper.adview)
			wrapper.adview = null;
			ZhinanAdv.zhinan_adv('gou', wrapper)
		}
		container = Ti.UI.createScrollView({
			contentHeight : 'auto',
			showVerticalScrollIndicator : true,
			left : 0,
			width : Ti.App.platform_width,
			bottom : __l(50),
			top : ages.length > 1 ? __l(44) : 0,
			layout : 'vertical'
		});
	
		wrapper.add(container);
		wrapper.container = container;
	
		add_category_to_view(container, json);
	
		container.animate({
			opacity : 1,
			duration : 400
		}, function(e) {
			Titanium.App.fireEvent('hide_indicator');
		})
	
		Ti.App.fireEvent("flurry_event", {
			event : "zhinan_gou"
		})
	}

	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout;
	xhr.onerror = function() {
		//show_timeout_dlg(xhr, url);
	};
	xhr.onload = function() {
		var json = JSON.parse(this.responseText)
		make_category_view(json)
		require('lib/mamashai_db').db.insert_json("gou_fangxin_category1", this.age_id, this.responseText)
	}

	xhr.safe_send = function(id) {
		if (!id)
			id = xhr.age_id;
		var record = require('/lib/mamashai_db').db.select_with_check("gou_fangxin_category1", id)
		if (!record.blank){
			
			var json = JSON.parse(record.json)
			make_category_view(json)
		}
		else{
			xhr.age_id = id
			var url = Ti.App.mamashai + '/api/taotaole/baobao_categories/' + id
			xhr.open('GET', url)
			xhr.send()	
		}		
	}

	xhr.age_id = ages[0].value	
	//var url = Ti.App.mamashai + '/api/taotaole/baobao_categories/' + ages[0].value
	//xhr.open('GET', url)
	if (!not_send) {
		//xhr.send();
		
		setTimeout(function(e){
			xhr.safe_send(ages[0].value)
		}, 800)
	}
	wrapper.xhr = xhr;

	return wrapper
}

function add_category_to_view(container, json) {
	for (var i = 0; i < json.length; i++) {
		var section_json = json[i];
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
			bottom : __l(4),
			height : Ti.UI.SIZE,
			width: __l(100),
			font : {
				fontSize : __l(13)
			},
			color : "#333",
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
			
			var button = Ti.UI.createButton({
				title : "  " + category_json.name + "  ",
				font : {
					fontSize : __l(13)
				},
				height : __l(26),
				top : __l(4),
				bottom: __l(4),
				left : __l(10),
				textAlign : 'center',
				selectedColor : '#003',
				cname : category_json.name,
				code : category_json.code,
				id : category_json.id
			});
			pre_btn(button)
			
			button.addEventListener("click", function(e) {
				var TaotaoleProducts = require("taotaole_products")
				var win = new TaotaoleProducts({
					title : e.source.cname,
					id : e.source.id,
					code : e.source.code,
					cname : e.source.cname
				});

				pre(win)

				if (!Ti.App.is_android) {
					win.hideTabBar();
				}

				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			})			
						
			category_wrapper.add(button)
		}

		container.add(section_wrapper)
	}
}

exports.create_gou_fangxin = create_gou_fangxin; 