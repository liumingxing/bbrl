function Chengzhang(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	win.layout = 'vertical';
	
	//1: 孕期 2：0-3岁 3：3-6岁
	function age_step(birthday_str) {
		if (!birthday_str)
			return "";
			
		var today = new Date();
		
		var t = new Date();
		t.setFullYear(birthday_str.split("-")[0]);
		t.setMonth(parseInt(birthday_str.split("-")[1], 10) - 1, parseInt(birthday_str.split("-")[2], 10));
		var diff_days = parseInt((today.getTime() - t.getTime()) / (1000 * 3600 * 24));
		if(diff_days < 0) {
			return 1
		}
		else if (diff_days < 365*3){
			return 2
		}
		else if (diff_days < 365*6) {
			return 3
		}
	}
	
	function button_click(e){
		var Jiance = require(e.source.url)
		var win = new Jiance({
			title : e.source.title == "成长监测" ? '' : e.source.title,
			backgroundColor : '#fff',
			backButtonTitle : ''
		});
		
		pre(win)
		
		if (!Ti.App.is_android) {
			win.hideTabBar();
		}
	
		Ti.App.currentTabGroup.activeTab.open(win, {
			animated : true
		});
	}
	
	var button1 = Titanium.UI.createButton({
		top : __l(30),
		left: __l(30),
		right: __l(30),
		height : __l(50),
		url: "jiance1",
		title : "孕期",
		font: {fontSize: __l(18)}
	});
	
	var button2 = Titanium.UI.createButton({
		top : __l(30),
		left: __l(30),
		right: __l(30),
		height : __l(50),
		title : "0-3岁",
		url: "jiance2",
		font: {fontSize: __l(18)}
	});
	
	var button3 = Titanium.UI.createButton({
		top : __l(30),
		left: __l(30),
		right: __l(30),
		height : __l(50),
		title : "3-6岁",
		url: "jiance3",
		font: {fontSize: __l(18)}
	});
	
	pre_btn(button1)
	pre_btn(button2)
	pre_btn(button3)
	
	button1.addEventListener("click", button_click);
	button2.addEventListener("click", button_click);
	button3.addEventListener("click", button_click);
	
	win.add(button1);
	win.add(button2);
	win.add(button3);
	
	
	return win;
}

module.exports = Chengzhang;
