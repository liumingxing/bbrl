Ti.include("public.js")

var win = Titanium.UI.currentWindow;

if (!Ti.App.is_android)
	win.hideNavBar();

win.preview_callback = function(){
	win.scrolly.remove(select_pic)
	win.scrolly.remove(select_face)
}

win.edit_callback = function(){
	win.scrolly.add(select_face)
	win.scrolly.add(select_pic)
}

win.text_callback = function(){
	return "#表情心绪#" + face_label.text
}

win.has_picture = function(){
	if (kid_pic.file)
		return true;
	else
		return false;
}

win.select_picture_callback = function(image, path, width, height) {
	if (!Ti.App.is_android){
		kid_pic.animate({left: -260, height: 20, width: 20, duration: 400}, function(){
			kid_pic.file = image;
			kid_pic.image = image;
			kid_pic.left = Ti.App.platform_width + 20;
			kid_pic.animate({left: __l(0), height: __l(240), width: __l(240), duration: 400})
		})
	}
	else{
		scrolly.remove(kid_pic_scroll)
		kid_pic_scroll = Ti.UI.createView({
			top : __l(62),
			left : __l(39),
			width : __l(240),
			height : __l(240)
		});
		
		scrolly.add(kid_pic_scroll)
		
		var imageWrapper = Ti.UI.createView({
			top : 0,
			left : 0,
			width : __l(240),
			height : __l(240)
		})
		
		kid_pic = Ti.UI.createImageView({
				top : 0,
				left : 0,
				right: 0,
				bottom: 0,
				hires : true,
				image : image,
				file : image,
				autorotate: true
		});
		
		kid_pic.addEventListener("load", function(e){
			require('lib/make_android_pinch').make_android_pinch(imageWrapper, kid_pic_scroll)
		})
		imageWrapper.add(kid_pic)
		kid_pic_scroll.add(imageWrapper)
	}
}

Ti.include("lib/template_page.js")
var toolbar = template_page(win, "biaoqing", "表情心绪", "#536D1B", win.today_str)
toolbar.zIndex = 1;
var scrolly = win.scrolly

var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
var json = JSON.parse(record.json)
var kid = null
if(json.user_kids.length > 0)
	kid = json.user_kids[0];
	
var label_kind = Ti.UI.createLabel({
		text : "表情心绪",
		font : {
			fontSize : __l(18),
			fontWeight : "bold"
		},
		top : __l(320),
		left : __l(30),
		//height : __l(20),
		width : __l(180),
		textAlign : 'left',
		color : "black"
})
scrolly.add(label_kind)
win.label_kind = label_kind;	

if(kid) {
	var str = kid.name + (win.today_str ? detail_age_for_birthday(kid.birthday, win.today_str) : detail_age_for_birthday(kid.birthday))
	var label = Ti.UI.createLabel({
			text : str,
			font : {
				fontSize : __l(12)
			},
			top : __l(360),
			left : __l(30),
			//height : __l(15),
			width : __l(200),
			textAlign : 'left',
			color : "black"
	})
	scrolly.add(label)
}

var now = new Date();
var now_str = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";

var label = Ti.UI.createLabel({
	text : now_str,
	font : {
		fontSize : __l(12)
	},
	top : __l(360),
	right : __l(30),
	//height : __l(15),
	width : __l(200),
	textAlign : 'right',
	color : "black"
})

if (win.today_str && !is_today(win.today_str)){
	var splits = win.today_str.split('-')
	label.text = splits[0] + "年" + splits[1] + "月" + splits[2] + "日"
}
scrolly.add(label)


var kid_pic_scroll = Ti.UI.createScrollView({
	top : __l(62),
	left : __l(39),
	width : __l(240),
	height : __l(240),
	contentWidth: __l(240),
	contentHeight : __l(240),
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : false
});
scrolly.add(kid_pic_scroll)

var kid_pic = Ti.UI.createImageView({
	top : 0,
	left : 0,
	right: 0,
	bottom: 0,
	hires : true,
	width: __l(240),
	height: __l(240),
	image : "./images/template/biaoqing/zhaopian.jpg"
});
kid_pic_scroll.add(kid_pic)

var select_pic = Ti.UI.createImageView({
	top : __l(270),
	right : __l(30),
	width : __l(43),
	height : __l(43),
	hires : true,
	image : "./images/tupian" +Ti.App.pic_sufix+ ".png",
	zIndex : 2
});
select_pic.addEventListener("click", function() {
	select_image(!Ti.App.is_android, win.select_picture_callback)
})

scrolly.add(select_pic)

var select_face = Ti.UI.createImageView({
	top : __l(395),
	right : __l(40),
	width : __l(31),
	height : __l(31),
	hires : true,
	image : "./images/jiantou_down" + Ti.App.pic_sufix + ".png",
	zIndex : 2
});
function select_face_click() {
	toolbar.hide();
	var PickerView = require('lib/picker_view')
	var picker_view = PickerView.create_picker_view(picker, function() {
		face_label.text = picker.str;

		var t3 = Ti.UI.create2DMatrix();
		t3 = t3.rotate(180);
		t3 = t3.scale(0.1)
		var a = Titanium.UI.createAnimation();
		a.transform = t3;
		a.duration = 300;
		face_image.animate(a)
		a.addEventListener("complete", function() {
			face_image.image = "./images/template/biaoqing/" + picker.back_value + ".png"

			var t3 = Ti.UI.create2DMatrix();
			t3 = t3.rotate(-1);
			t3 = t3.scale(1)
			var a = Titanium.UI.createAnimation();
			a.transform = t3;
			a.duration = 300;
			face_image.animate(a)
		})
		toolbar.show();
	},
	function(){
		toolbar.show();
	})
	win.add(picker_view)
	picker_view.animate({
		bottom : 0
	});
}

select_face.addEventListener("click", select_face_click)
scrolly.add(select_face)

var face_image = Ti.UI.createImageView({
	top : __l(388),
	left : __l(40),
	width : __l(42),
	height : __l(44),
	hires : true,
	image : "./images/template/biaoqing/qyg.png"
});
scrolly.add(face_image)
face_image.addEventListener("click", select_face_click)

var face_label = Ti.UI.createLabel({
	text : "亲一个",
	font : {
		fontSize : __l(22),
		fontWeight : "bold"
	},
	top : __l(395),
	left : __l(110),
	height : __l(30),
	width : __l(180),
	textAlign : 'left',
	color : "#2D1E1F"
})
scrolly.add(face_label)
face_label.addEventListener("click", select_face_click)

var picker = Titanium.UI.createPicker({
	useSpinner: true,
	selectionIndicator : true,
	width: Ti.App.platform_width,
	visibleItems: visible_items(),
	zIndex : 2
});

picker.back_value = "qyg";
picker.str = '亲一个'
var data = [];
var biaoqings = [['亲一个', 'qyg'], ['挨打了', 'adl'], ['不开心', 'bkx'], ['得瑟一下', 'dsyx'], ['很开心', 'hkx'], ['很无语', 'hwy'], ['吼吼吼吼', 'hhhh'], ['基本晕菜了', 'jbycl'], ['内牛满面', 'nnmm'], ['桑心了', 'sxl'], ['美女哟', 'mny'], ['总是很受伤', 'zshss']]
for(var i=0; i<biaoqings.length; i++){
	row = Ti.UI.createPickerRow({
		title: biaoqings[i][0],
		custom_item: biaoqings[i][1]
	})
	data.push(row)
}
var column1 = Ti.UI.createPickerColumn( {
	rows: data
});
if (Ti.App.is_android)
	column1.width = Ti.App.platform_width
picker.add(column1);
picker.addEventListener("change", function(e) {
	picker.str = e.row.title;
	picker.back_value = e.row.custom_item;

})

