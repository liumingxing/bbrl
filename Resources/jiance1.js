function Jiance(attr){
	Ti.include("public.js");
	var TabBar = require("lib/tab_bar");
	var ZhinanAdv = require("lib/zhinan_adv");
	var GouFangxin = require("lib/gou_fangxin");
	
	var win = Titanium.UI.createWindow(attr);
	
	if (Ti.App.is_android){
		add_default_action_bar2(win, win.title, "计算预产期", function(){
			win.button.fireEvent("click");
		}, true);
	}
	
	win.addEventListener("open", function(e){
		var wrapper1 = Ti.UI.createView({
			left : 0,
			right : 0,
			top : 0,
			bottom : 0,
			width : Ti.App.platform_width
		});
		win.add(wrapper1);
		if (Ti.App.is_android){
			wrapper1.bottom = __l(54);
		}
		
		var select_index = 0;
		
		var data = [];
		for(var i = 1; i <= 40; i++) {
			data.push({text: '第' + i + '周', value: i});
		}
		data.push({text: '0到3岁', value: 100})
		data.push({text: '3到6岁', value: 200})
		
		var week_container = TabBar.create_tab_bar(data);
		function add_section(title, field, record, container){
					var title_4 = Ti.UI.createLabel({
						backgroundColor : "pink",
						top : __l(4),
						left : __l(8),
						right : __l(8),
						height : __l(24),
						bottom: 0,
						font : {
							fontSize : Ti.App.is_android && Ti.App.platform_width>=600 ? __l(18) : __l(16)
						},
						width : __l(80),
						textAlign : "center",
						text : title,
						tag : i,
						color: "#333"
					});
					
					var title_line_4 = Ti.UI.createView({
						top: 0,
						height: __l(2),
						left: __l(8),
						right: __l(8),
						backgroundColor : "pink"
					});
					
					var desc_4 = Ti.UI.createLabel({
						left : __l(10),
						top : __l(6),
						bottom : __l(16),
						height : Ti.UI.SIZE,
						right : __l(10),
						font : {
							fontSize : __l(16)
						},
						color: "#333",
						text : record.fieldByName(field).replace(/\r\n/g, "\n")
					});
					
					container.add(title_4);
					container.add(title_line_4);
					container.add(desc_4);
		}
		week_container.addEventListener("tab_click", function(e){
			if (e.value == 100){			//0到3岁
					var Jiance = require('jiance2')
					var win2 = new Jiance({
						title : '0到3岁',
						backgroundColor : bg_color,
						backButtonTitle: '返回'
					});
					pre(win2)
					Ti.App.currentTabGroup.activeTab.open(win2, {
						animated : true
					});
					return;
			}
			else if (e.value == 200){		//3到6岁
					var Jiance = require('jiance3')
					var win2 = new Jiance({
						title : '3到6岁',
						backgroundColor : bg_color,
						backButtonTitle: '返回'
					});
					pre(win2)
					Ti.App.currentTabGroup.activeTab.open(win2, {
						animated : true
					});
					return;
			}
			
				var record = Ti.App.db2.execute('SELECT * FROM weeks where id=?', e.value);
				if(record.isValidRow()) {
					if (wrapper1.adview){
						wrapper1.remove(wrapper1.adview);
						wrapper1.adview = null;
					}
					
					var old_pregant_content = wrapper1.pregant_content;
					
					var pregant_content = Ti.UI.createScrollView({
						contentHeight : 'auto',
						showVerticalScrollIndicator : true,
						left : Ti.App.platform_width,
						width : Ti.App.platform_width,
						bottom : Ti.App.is_bbrl ? __l(50) : 0,
						top : week_container.height,
						backgroundColor : 'white',
						layout : 'vertical',
					});
					if (Ti.App.is_android)
						pregant_content.scrollType = "vertical";
						
					if (Ti.App.is_bbrl)
						ZhinanAdv.zhinan_adv('yun', wrapper1)
					
					if (!Ti.App.is_android)
						pregant_content.addEventListener("swipe", swipe)
					
					var pic_container = Ti.UI.createView({
						top : 0,
						width : Ti.App.platform_width,
						height : Ti.UI.SIZE
					});
					
					var pic = Ti.UI.createImageView({
						top : 0,
						left : 0,
						hires : true,
						height : __l(150),
						width : __l(215),
						image : Ti.App.aliyun + "/pregant/" + e.value + ".jpg"
					});
					pic_container.add(pic);
					
					var pic_desc = Ti.UI.createLabel({
						left : __l(220),
						top : __l(10),
						height : Ti.UI.SIZE,
						right : __l(10),
						font : {
							fontSize : Ti.App.is_android && Ti.App.platform_width>=600 ? __l(16) : __l(14)
						},
						color: "#333",
						text : record.fieldByName('field4').replace(/<br>/g, "\n")
					});
					pic_container.add(pic_desc)
					
					pregant_content.add(pic_container)
		
					add_section("胎儿发育", "field1", record, pregant_content);
					add_section("身体变化", "field2", record, pregant_content);
					add_section("孕期营养", "field3", record, pregant_content);
					add_section("养护贴士", "field5", record, pregant_content);
					add_section("孕妈课堂", "field6", record, pregant_content);
		
					if (!Ti.App.is_bbrl)
						ZhinanAdv.zhinan_adv('yun', pregant_content);
					
					wrapper1.add(pregant_content);
					wrapper1.pregant_content = pregant_content;
					
					pregant_content.scrollTo(0, 0);
					
					pregant_content.opacity = 1;
					if (old_pregant_content.children.length == 0){
						wrapper1.remove(old_pregant_content);
						pregant_content.left = 0;
					}
					else{
						var transform = Ti.UI.create2DMatrix().scale(0.92);
						old_pregant_content.animate({transform: transform, duration: 200, top: week_container.height}, function(){
							wrapper1.remove(old_pregant_content);
						});
							
						if (!e.to_left){
							pregant_content.left = 0-Ti.App.platform_width;
						}
						pregant_content.animate({left: 0, top: week_container.height, duration: 300}, function(){
								
						});	
					}
				}
				record.close()
				
				require('lib/mamashai_db').db.insert_json("last_week", "0", e.index)
				logEvent('yuchanqi_week');
		});
		
		var pregant_content = Ti.UI.createScrollView({
			contentHeight : 'auto',
			showVerticalScrollIndicator : true,
			left : 0,
			width : Ti.App.platform_width,
			bottom : 0,
			//height: Ti.UI.SIZE,
			//height: 200,
			top : week_container.height,
			backgroundColor : 'white',
			layout : 'vertical'
		});
		
		wrapper1.add(week_container)
		wrapper1.add(pregant_content)
		
		wrapper1.pregant_content = pregant_content
		
		function swipe(e){
			week_container.fireEvent("swipe", e);
		}
		
		var button = Ti.UI.createButton({
			title : "计算预产期"
		});
		win.button = button;
		function button_click() {
			if (Ti.App.is_android){
				date_picker.showDatePickerDialog({
					callback: function(e){
						if (!e.cancel && date_str(e.value) != date_str(date_picker.value)){
							var value = e.value.getFullYear() + "-" + (e.value.getMonth()+1) + "-" + e.value.getDate();
							var yuchanqi = new Date();
							yuchanqi.setTime(e.value.getTime() + 280*3600*24*1000)
							
							var now = new Date();
							var weeks = parseInt((now.getTime() - e.value.getTime())/(1000*3600*24*7)) + 1
							
							var str = "您的预产期是" + yuchanqi.getFullYear() + "年" + (yuchanqi.getMonth()+1) + "月" + yuchanqi.getDate() + "日";
							if (weeks > 0 && weeks <= 40){
								str += "，当前处于孕" + (weeks) + "周。"
								week_container.fireEvent("click", {index: weeks-1});
							}
							show_alert("提示", str)
							date_picker.value = e.value
						}
					}, 
					okButtonTitle: '确定', 
					title: '请选择末次月经到来时间'
				})
			}
			else{
				var PickerView = require('lib/picker_view')
				var picker_view = PickerView.create_picker_view(date_picker, function(){
					var value = date_picker.value.getFullYear() + "-" + (date_picker.value.getMonth()+1) + "-" + date_picker.value.getDate();
					var yuchanqi = new Date();
					yuchanqi.setTime(date_picker.value.getTime() + 280*3600*24*1000)
					
					var now = new Date();
					var weeks = parseInt((now.getTime() - date_picker.value.getTime())/(1000*3600*24*7)) + 1
					
					var str = "您的预产期是" + yuchanqi.getFullYear() + "年" + (yuchanqi.getMonth()+1) + "月" + yuchanqi.getDate() + "日";
					if (weeks > 0 && weeks <= 40){
						str += "，当前处于孕" + (weeks) + "周。"
						week_container.fireEvent("click", {index: weeks-1});
					}
					show_alert("提示", str)
					button.title = yuchanqi.getFullYear() + "年" + (yuchanqi.getMonth()+1) + "月" + yuchanqi.getDate() + "日";
				})
				wrapper1.add(picker_view)
				picker_view.animate(PickerView.picker_slide_in);
			}
		}
		button.addEventListener("click", button_click);
		
		win.setLeftNavButton(null);
		
		if (!Ti.App.is_android){
			win.setRightNavButton(button);
		}
		
		var now = new Date();
		 
		var minDate = new Date();
		minDate.setFullYear(now.getFullYear()-2);
		
		var date_picker = Ti.UI.createPicker({
			type:Ti.UI.PICKER_TYPE_DATE,
			minDate:minDate,
			maxDate:now,
			value: now,
			visibleItems: 3,
			width: Ti.App.platform_width,
			label: "请选择末次月经到来时间"
		});
		
		date_picker.addEventListener("change", function(e){
			date_picker.value = e.value;
		});
		
		var record = require('/lib/mamashai_db').db.select_one_json("last_week", "0");
		if(!record.blank) {
			var last_week = parseInt(record.json);
			if (Ti.App.is_android){
					setTimeout(function(e){
						week_container.fireEvent("click", {index: last_week});
					}, 400);
			}
			else
				week_container.fireEvent("click", {index: last_week});
		}
		else{
			//setTimeout(function(e){
				week_container.fireEvent("click", {index: 0, no_animate: true});
			//}, 400);
		}
	});
	
	return win;
}

module.exports = Jiance;
