function Jiance(attr){
	Ti.include("public.js")
	var TabBar = require("lib/tab_bar")
	var ZhinanAdv = require("lib/zhinan_adv")
	var GouFangxin = require("lib/gou_fangxin")
	
	var win = Titanium.UI.createWindow(attr);
	
	if (Ti.App.is_android){
		add_default_action_bar(win, win.title, true);
	}
	
	win.addEventListener("open", function(e){
		var wrapper1 = Ti.UI.createView({
			left : 0,
			right : 0,
			top : 0,
			bottom : 0,
			width : Ti.App.platform_width
		});
		win.add(wrapper1)
		
		var data = [];
		for(var i = 0; i < 12; i++) {
			data.push({
				text :  (3+parseInt(i/4)) + "岁" + ((parseInt((i%4)*3))==0 ? "" : (parseInt((i%4)*3)) + "个月"),
				value : i
			})
		}
		var week_container = TabBar.create_tab_bar(data)
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
				var record = Ti.App.db2.execute('SELECT * FROM chengzhangs where id=?', e.value+1);
				if(record.isValidRow()) {
					if (wrapper1.adview){
						wrapper1.remove(wrapper1.adview)
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
					if (Ti.App.is_bbrl)
						ZhinanAdv.zhinan_adv('3_6', wrapper1)
					
					if (!Ti.App.is_android)
						pregant_content.addEventListener("swipe", swipe)
					
					add_section("发育指标", "fayu", record, pregant_content);
					add_section("营养指南", "yingyang", record, pregant_content);
					add_section("注意事项", "zhuyi", record, pregant_content);
					add_section("亲子游戏", "qinzi", record, pregant_content);
					add_section("儿童教养", "jiaoyang", record, pregant_content);
					add_section("智力开发", "zhili", record, pregant_content);
					
					if (!Ti.App.is_bbrl)
						ZhinanAdv.zhinan_adv('3_6', pregant_content)
					
					wrapper1.add(pregant_content)
					wrapper1.pregant_content = pregant_content
					
					pregant_content.scrollTo(0, 0);
					
					var transform = Ti.UI.create2DMatrix().scale(0.92)
					old_pregant_content.animate({transform: transform, duration: 200, top: week_container.height, autoreverse: true}, function(){
						win.remove(old_pregant_content)
					});
						
					if (!e.to_left){
						pregant_content.left = 0-Ti.App.platform_width;
					}
					pregant_content.animate({left: 0, top: week_container.height, duration: 300}, function(){
							
					});
				}
				record.close()
				require('lib/mamashai_db').db.insert_json("last_week_3", "0", e.value)
				logEvent('jiance_month2');
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
		
		function swipe(e){
			week_container.fireEvent("swipe", e);
		}
		
		wrapper1.add(week_container)
		wrapper1.add(pregant_content)
		
		wrapper1.pregant_content = pregant_content
		
		var record = require('/lib/mamashai_db').db.select_one_json("last_week_3", "0")
		if(!record.blank) {
			var last_week = parseInt(record.json)
			if (Ti.App.is_android){
					setTimeout(function(){
						week_container.fireEvent("click", {index: last_week});
					}, 400);
			}
			else
				week_container.fireEvent("click", {index: last_week});
		}
		else{
			setTimeout(function(e){
				week_container.fireEvent("click", {index: 0})
			}, 400);
		}
	});
	return win;
}

module.exports = Jiance;
