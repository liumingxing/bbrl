Ti.include("public.js");

var win = Titanium.UI.currentWindow;

var delete_button = Ti.UI.createButton({
		title: "删除"
});
delete_button.addEventListener("click", function(e){
		var alert_dialog = Titanium.UI.createAlertDialog({
				title : "提示",
				message:'删除宝宝信息后将不可恢复，确认删除吗！',
				buttonNames: ['再想想', '确定'],
		});
		alert_dialog.addEventListener("click", function(e){
			if (e.index == 1){
				var xhr = Ti.Network.createHTTPClient();
				xhr.timeout = Ti.App.timeout;
				xhr.onerror = function(){
						hide_loading();
				};
				xhr.onload = function(){
						hide_loading();
						win.close();
						show_notice("删除宝宝资料成功");
						if (win.prev){
							win.prev.refresh_table();
						}
				};
				var url = Ti.App.mamashai + "/api/account/delete_kid.json?kid_id=" + win.json.id + "&" + account_str();
				xhr.open('POST', url);
				xhr.send();	
			}
		});
		alert_dialog.show();
});

if (win.json.id && !Ti.App.is_android){	
	win.setRightNavButton(delete_button);
}

var headerView = Ti.UI.createView({
	left: 0,
	right: 0,
	height: Ti.UI.SIZE
});
var section1 = Ti.UI.createTableViewSection({
	headerView : headerView,
});
var table_header = Ti.UI.createView({
	height: Ti.App.is_android ? 0 : 1
});
var tableview = Titanium.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor:'#F4F6F1',
	separatorColor : "#CACACA",
	top: 0,
	bottom: 0,
	headerView : table_header
});

//group_tableview(tableview);

var logo_row = Ti.UI.createTableViewRow({
	height : __l(80),
	selectedBackgroundColor: "#E8E8E8",
	backgroundColor: "white"
});

var user_logo = Ti.UI.createImageView({
	top : __l(6),
	left : __l(100),
	width : __l(70),
	height : __l(70),
	image: "./images/default.gif",
	defaultImage : "./images/default.gif",
	hires : true,
});

user_logo.addEventListener("click", function(){
	select_image(true, function(image, path){
		user_logo.file = image;
		user_logo.image = image;
	});
});

if (win.json.logo_url_thumb140){
	user_logo.image = Ti.App.aliyun + encodeURI(win.json.logo_url_thumb140);
}

var user_logo_tip = Ti.UI.createLabel({
	left : __l(12),
	top : __l(20),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "宝宝头像"
});
logo_row.add(user_logo);
logo_row.add(user_logo_tip);


var name = Ti.UI.createTableViewRow({
	height : 'auto',
	backgroundColor: "white",
	selectedBackgroundColor: "#E8E8E8"
});

var name_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "宝宝昵称"
});
var name_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(2),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	font: {fontSize: __l(18)},
	value : win.json.name
});
name_field.addEventListener("return", function(){
	name_field.blur();
	gender_field.fireEvent("focus");
});
name.add(name_title);
name.add(name_field);

gender = Ti.UI.createTableViewRow({
	height:'auto',
	backgroundColor: "white",
});
var gender_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	selectedBackgroundColor: "#E8E8E8",
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "宝宝性别"
});

var sex = "";
if (win.json.gender == 'w'){
	sex = "女孩"
}
else if (win.json.gender == 'm'){
	sex = "男孩"
}

if (date_str(new Date()) < win.json.birthday){
	sex = "孕期"
}


var gender_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(2),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	font : {fontSize: __l(18)},
	enabled: false,
	editable: false,
	focusable : false,
	value : sex,
	back_value : win.json.gender
});
gender_field.enabled = true;

var gender_picker_android = Ti.UI.createPicker({
	top: __l(10),
	left: __l(100),
	width: Ti.UI.SIZE,
	font: {fontSize: __l(18)},
	value: win.json.gender
});
var data = [];
data[0]=Ti.UI.createPickerRow({title:'女孩', custom_item:'w'});
data[1]=Ti.UI.createPickerRow({title:'男孩', custom_item:'m'});
data[2]=Ti.UI.createPickerRow({title:'孕期', custom_item:'null'});
gender_picker_android.add(data);
if (win.json.gender == 'w'){
	gender_picker_android.setSelectedRow(0, 0, true);
	gender_picker_android.value = 'w';
}
else if (win.json.gender == 'm'){
	gender_picker_android.setSelectedRow(0, 1, true);
	gender_picker_android.value = 'm';
}
else{
	gender_picker_android.setSelectedRow(0, 2, true);
	gender_picker_android.value = 'null';
}
gender_picker_android.addEventListener("change", function(e){
	gender_picker_android.value = e.row.custom_item;
});

function gender_click(){
	name_field.blur();
	gender_field.blur();
	
	var PickerView = require('lib/picker_view')
	var picker_view = PickerView.create_picker_view(picker, function(){
		
	})
	win.add(picker_view)
	picker_view.animate(PickerView.picker_slide_in);
	
	//导致change事件触发，所以注释
	//picker.no_event = true;
	if (gender_field.value == "男孩"){
		picker.setSelectedRow(0, 0, true);
	}
	else if (gender_field.value == "女孩"){
		picker.setSelectedRow(0, 1, false);
	}
	else{
		gender_field.value = "男孩"
		gender_field.back_value = "m"
	}
}
gender_field.addEventListener("click", gender_click)
gender_field.addEventListener("focus", gender_click)

birthday_row = Ti.UI.createTableViewRow({
	height:'auto',
	backgroundColor: "white",
});
var birthday_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	selectedBackgroundColor: "#E8E8E8",
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "宝宝生日"
});

var birthday_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(2),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	font : {fontSize: __l(18)},
//	enabled: false,
	editable: false,
	focusable : false,
	value : win.json.birthday,
	hintText: '孕期请输入预产期'
});
//if (Ti.App.is_android)
//	birthday_field.enabled = true
	
function birthday_click(){
	birthday_field.blur();
	if (Ti.App.is_android){
		Ti.UI.Android.hideSoftKeyboard();
		setTimeout(function(){
			Ti.UI.Android.hideSoftKeyboard();
		}, 400)	
	}
	
	if (Ti.App.is_android){
		date_picker.showDatePickerDialog({
			value: date_picker.value,
			callback: function(e){
				if (!e.cancel && date_str(e.value) != date_str(date_picker.value)){
					birthday_field.value = e.value.getFullYear() + "-" + (e.value.getMonth()+1) + "-" + e.value.getDate();
					date_picker.value = e.value
				}
			}, 
			okButtonTitle: '确定', 
			title: '请选择日期'
		})
	}
	else{
		var PickerView = require('lib/picker_view')
		var picker_view = PickerView.create_picker_view(date_picker, function(){
			birthday_field.value = date_picker.value.getFullYear() + "-" + (date_picker.value.getMonth()+1) + "-" + date_picker.value.getDate();
		})
		win.add(picker_view)
		picker_view.animate(PickerView.picker_slide_in);
	}
}	
birthday_field.addEventListener("click", birthday_click)
birthday_field.addEventListener("focus", birthday_click)

gender.add(gender_title);
if (Ti.App.is_android){
	gender.add(gender_picker_android);
}
else{
	gender.add(gender_field);
}
birthday_row.add(birthday_title);
birthday_row.add(birthday_field);
section1.add(logo_row);
section1.add(name);
section1.add(gender);
section1.add(birthday_row);

var save_row = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor: "#E8E8E8",
	backgroundColor: "white",
	textAlign : 'center'
});
var save_title = Ti.UI.createLabel({
	left : __l(10),
	right : __l(10),
	top : __l(10),
	bottom : __l(8),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	textAlign : 'center',
	color: Ti.App.bar_color,
	text : "保存"
});
save_row.add(save_title)
section1.add(save_row);

if (win.from_write){
	var skip_row = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor: "#E8E8E8",
		backgroundColor: "white",
		textAlign : 'center'
	});
	var skip_title = Ti.UI.createLabel({
		left : __l(10),
		right : __l(10),
		top : __l(10),
		bottom : __l(8),
		height : 'auto',
		font : {
			fontSize : __l(14)
		},
		textAlign : 'right',
		color: Ti.App.bar_color,
		text : "我还在备孕呢"
	});
	skip_row.add(skip_title);
	section1.add(skip_row);
	if (Ti.App.is_android){
		//tableview.height = __l(310);
	}
	skip_row.addEventListener("click", function(e){
		Ti.App.Properties.setString("beiyun", "true");
		win.close();
	});
}

save_row.addEventListener("click", function(e){
	if (!name_field.value || name_field.value.length == 0){
		show_alert("提示", "请输入宝宝的昵称");
		return;
	}
	
	//ios平台判断
	if (!Ti.App.is_android && (!gender_field.value || gender_field.value.length == 0)){
		show_alert("提示", "请选择宝宝性别");
		return;
	}
	
	if (!birthday_field.value || birthday_field.value.length == 0){
		show_alert("提示", "请选择宝宝生日");
		return;
	}
	
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = Ti.App.timeout;
	xhr.onerror = function(){
			hide_loading();
			show_notice("访问网络超时，请检查网络");
	};
	xhr.onload = function(){
			hide_loading();
			var response = this.responseText;
			if (response == "null" || response == "" || response == "error"){
				show_notice("设置宝宝资料失败");
			}
			else{
				if (response!="ok" && response!="error"){
					require('lib/mamashai_db').db.insert_json("user_profile", user_id(), response);
				}
				
				win.close();
				show_notice("设置宝宝资料成功");
			}
			if (win.prev){
				win.prev.refresh_table();
			}
			setTimeout(function(){
				Titanium.App.fireEvent('logged_in');
			}, 100);
	};
	url = Ti.App.mamashai + "/api/account/update_kid_profile.json?name=" + name_field.value + "&birthday=" + birthday_field.value + "&" + account_str();
	if (win.json.id){
		url += "&id=" + win.json.id; 
	}
	
	xhr.open('POST', url);
	if (user_logo.file){
		xhr.send({
			logo : user_logo.file,
			gender: Ti.App.is_android ?  gender_picker_android.value : gender_field.back_value
		});
	}
	else{
		xhr.send({
			gender: Ti.App.is_android ?  gender_picker_android.value : gender_field.back_value
		});	
	}
	show_loading("正在上传");
});

var picker = Titanium.UI.createPicker({
	useSpinner: true,
	selectionIndicator : true,
	width: Ti.App.platform_width,
	visibleItems: visible_items()
});

var data = [];
data[0]=Ti.UI.createPickerRow({title:'男孩',custom_item:'m'});
data[1]=Ti.UI.createPickerRow({title:'女孩',custom_item:'w'});
data[2]=Ti.UI.createPickerRow({title:'孕期',custom_item:'null'});
var column1 = Ti.UI.createPickerColumn({rows: data});
if (Ti.App.is_android){
	column1.width = Ti.App.platform_width;
}
picker.add(column1);
var only_fresh_parent = false;
picker.addEventListener('change',function(e)
{
	gender_field.value = e.row.title;
	gender_field.back_value = e.row.custom_item;
	only_fresh_parent = true;
});

var now = new Date();
 
var minDate = new Date();
minDate.setFullYear(1994);
minDate.setMonth(0);
minDate.setDate(1);

var maxDate = new Date();
maxDate.setFullYear(now.getFullYear() + 1);
maxDate.setMonth(12);
maxDate.setDate(31);

var value = new Date();
if (win.json.birthday){
	var ts = win.json.birthday.split('-');
	value.setFullYear(ts[0]);
	value.setMonth(ts[1]-1);
	value.setDate(ts[2]);	
}

var date_picker = Ti.UI.createPicker({
	type:Ti.UI.PICKER_TYPE_DATE,
	minDate:minDate,
	maxDate:maxDate,
	value: value,
	visibleItems: 3,
	width: Ti.App.platform_width,
	//useSpinner : true,
	locale : 'zh-CN'
});

date_picker.addEventListener("change", function(e){
	date_picker.value = e.value;
});

logEvent('profile_kid');

tableview.data = [section1];

win.add(tableview);

if (win.json.id){
	add_default_action_bar2(win, win.title, "删除", function(){
		delete_button.fireEvent("click");
	});
}
else{
	add_default_action_bar(win, win.title, true);
}

