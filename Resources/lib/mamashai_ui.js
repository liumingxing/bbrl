Ti.include("/public.js");
var StyledLabel = require('ti.styledlabel');

var Mamashai = Mamashai || {};
Mamashai.ui = {};

//表情中英文对照
var face_name2 = {
	"爱你" : "aini",
	"奥特曼" : "aoteman",
	"亲亲" : "qinqin",
	"偷笑" : "touxiao",
	"可怜" : "kelian",
	"可爱" : "keai",
	"吃惊" : "chijing",
	"吐" : "tu",
	"呵呵" : "hehe",
	"哈哈" : "haha",
	"哨子" : "shaozi",
	"哼" : "heng",
	"嘘" : "xu",
	"嘻嘻" : "xixi",
	"囧" : "jiong",
	"困" : "kun",
	"围脖" : "weibo",
	"围观" : "weiguan",
	"太开心" : "taikaixin",
	"失望" : "shiwang",
	"委屈" : "weiqu",
	"害羞" : "haixiu",
	"小丑" : "xiaochou",
	"巧克力" : "qiaokeli",
	"帅" : "shuai",
	"帽子" : "maozi",
	"怒" : "nu",
	"怒骂" : "muma",
	"思考" : "sikao",
	"懒得理你" : "landelini",
	"手套" : "shoutao",
	"手纸" : "shouzhi",
	"打哈欠" : "dahaqi",
	"抓狂" : "zhuakuang",
	"抱抱" : "baobao",
	"挖鼻孔" : "wabikong",
	"晕" : "yun",
	"汗" : "han",
	"泪" : "lei",
	"爱心传递" : "aixinchuandi",
	"生病" : "shengbning",
	"疑问" : "yiwen",
	"睡觉" : "shuijiao",
	"织" : "zhi",
	"花心" : "huaxin",
	"蜡烛" : "lazhu",
	"衰" : "shuai2",
	"鄙视" : "bishi",
	"酷" : "ku",
	"钱" : "qian",
	"闭嘴" : "bizui",
	"雪" : "xue",
	"顶" : "ding",
	"风扇" : "fengshan",
	"馋嘴" : "chanzui",
	"鼓掌" : "guzhang",
	"$1" : "hello"
};

Mamashai.ui.filter_html = function(content_str, tp) {
	var regex = new RegExp('\\[([\u4e00-\u9fa5a-zA-Z0-9]+)\\]', 'g');
	var size = __l(18);
	content_str = content_str.replace(regex, function(word) {
		var file = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "images/face/" + face_name2[word.replace("[", "").replace("]", "")] + ".png");
		if (file.exists()){
			if (Ti.App.is_android)
				return "<img align=top src='" + file.nativePath + "'/>";
			else
				return "<img style='width:" + size + "px; height:" + size + "px;' src='" + file.nativePath + "'/>";
		}
		else{
			return word;
		}
	});
	
	if (tp == "detail") {
		var regex = new RegExp('#[\u4e00-\u9fa5a-zA-Z0-9]+#', 'g');
		if (Ti.App.is_android) {
			content_str = content_str.replace(regex, "<a style='color: #EA609E; text-decoration: none;' href='#topic:$&' onclick='Ti.App.fireEvent(\"open_topic\", {value: \"$&\"});return false;'>$&</a>");
			content_str = content_str.replace(/http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)*/, "<a style='color: #EA609E; text-decoration: none;' onclick='Ti.App.fireEvent(\"open_url\", {url: \"$&\"});return false;' href='javascript:void(0)'>$&</a>");
		} else {
			content_str = content_str.replace(regex, "<a style='color: #EA609E; text-decoration: none;' href='topic:$&' >$&<a>");
			content_str = content_str.replace(/http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)*/, "<a style='color: #EA609E; text-decoration: none;' href='url:$&'>$&</a>");
		}
	}

	if (Ti.App.is_android){
		var reg1 = new RegExp('\ud83c[\udf00-\udfff]', 'g');
		var reg2 = new RegExp('\ud83d[\udc00-\ude4f]', 'g');
		var reg3 = new RegExp('\ud83d[\ude80-\udeff]', 'g');
		var content_str = content_str.replace(reg1, function(match){
			return "<img src = 'file:///android_res/drawable/emoji_" + (match.charCodeAt(1)+0x11400).toString(16) + ".png'/>" 
		}).replace(reg2, function(match){
			return "<img src = 'file:///android_res/drawable/emoji_" + (match.charCodeAt(1)+0x11800).toString(16) + ".png'/>" 
		}).replace(reg3, function(match){
			return "<img src = 'file:///android_res/drawable/emoji_" + (match.charCodeAt(1)+0x11800).toString(16) + ".png'/>" 
		})
		
		content_str = "<html> \
						<head> \
						<meta name='viewport' content='width=320px, initial-scale=1, user-scalable=no, maximum-scale=1, target-densitydpi=" + (Ti.App.logicalDensityFactor <=1 ? "low" : "medium") + "-dpi' /> \
						<style>	\
							* {margin: 0; padding: 0; font-size: 18px; line-height: 22px; word-break:break-all;}	\
							img {height: 18px; width: 18px; vertical-align:middle;}	\
							a {color: #EA609E; text-decoration: none;}	\
						</style>   \
						</head>	\
						<body> " 
						+ content_str +
						"</body>	\
						</html>";
			
	}	
	else{
		content_str = "<span style='word-break:break-all; font-size: " + (Ti.App.is_ipad ? "1.6" : "1") + "em;'>" + content_str + "</span>";
	}
	
	return content_str.replace("\n", "");
};

//设置上次更新 id
function set_time_prop(post_type, max_or_min, date_str) {
	Ti.App.Properties.setString(post_type + max_or_min + "_id", date_str)
	//Ti.App.Properties.setString(post_type + max_or_min + "_created_at", date_str)
}

//获取上次更新id
function get_time_prop(post_type, max_or_min) {
	return Ti.App.Properties.getString(post_type + max_or_min + "_id", "100")
	//return Ti.App.Properties.getString(post_type + max_or_min + "_created_at", "2010-01-01 0:0:0")
}

//从服务器一次获取微博条数
Mamashai.ui.receive_count = 30;
var receive_count = 30

//为tableview自动生成
Mamashai.ui.lastUpdatedLabel = null;
function make_pull_refresh(tableView) {
	var border = Ti.UI.createView({
		backgroundColor : "#576c89",
		height : 2,
		bottom : 0
	});

	var tableHeader = Ti.UI.createView({
		backgroundColor : "#e2e7ed",
		width : Ti.App.platform_width,
		height : 60,
		textAlign : 'center'
	});

	// fake it til ya make it..  create a 2 pixel
	// bottom border
	tableHeader.add(border);

	var arrow = Ti.UI.createView({
		backgroundImage : "/images/whiteArrow.png",
		width : 23,
		height : 60,
		bottom : 10,
		left : 20
	});

	var statusLabel = Ti.UI.createLabel({
		text : "下拉可以刷新...",
		left : 55,
		width : 200,
		bottom : 30,
		height : Ti.UI.SIZE,
		color : "#576c89",
		textAlign : "center",
		font : {
			fontSize : 13,
			fontWeight : "bold"
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});
	lastUpdatedLabel = Ti.UI.createLabel({
		text : "最后更新时间: 2012-01-01 10:00:00",
		left : 55,
		width : 200,
		bottom : 15,
		height : Ti.UI.SIZE,
		color : "#576c89",
		textAlign : "center",
		font : {
			fontSize : 12
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});
	tableView.lastUpdatedLabel = lastUpdatedLabel;

	var actInd = Titanium.UI.createActivityIndicator({
		left : 20,
		bottom : 13,
		width : 30,
		height : 30
	});

	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(actInd);

	tableView.headerPullView = tableHeader;

	var pulling = false;
	var reloading = false;

	function beginReloading() {
		Titanium.App.fireEvent("pullRefreshBegin");
		if (tableView.pullRefreshBegin)
			tableView.pullRefreshBegin()
	}


	tableView.addEventListener('pullRefreshFinish', endReloading)
	tableView.addEventListener("close", function(e) {
		tableView.removeEventListener('pullRefreshFinish', endReloading)
	})
	function endReloading() {
		if (Ti.App.is_android)
			return;
		
		tableView.setContentInsets({
				top : 0
			}, {
				animated : true
		});
		reloading = false;
		statusLabel.text = "松开即可刷新...";
		actInd.hide();
		arrow.show();
	}


	tableView.addEventListener('scroll', function(e) {
		if (Ti.App.is_android) {
			return;
		}
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = "释放即可更新...";
		} else if (pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = "下拉可以刷新...";
		}
	});

	tableView.addEventListener("dragEnd", function(e) {
		if (pulling && !reloading) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "正在加载...";
			tableView.setContentInsets({
				top : 60
			}, {
				animated : true
			});
			arrow.transform = Ti.UI.create2DMatrix();
			beginReloading();
		}
	})
}

//生成私信行
Mamashai.ui.make_private_row = function(json) {
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		json : json,
		className: "private",
		name: "private_" + json.id,
		selectedBackgroundColor : "#E8E8E8"
	});

	var user_logo = Ti.UI.createImageView({
		top : __l(8),
		left : __l(8),
		width : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		height : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		defaultImage : "/images/default.gif",
		hires : true,
		touchEnabled : false
	});

	if (json.message_user_logo_thumb48.length > 0) {
		user_logo.image = "http://www.mamashai.com" + encodeURI(json.message_user_logo_thumb140)
	}

	var post = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : __l(46),
		top : 0,
		bottom : __l(8),
		right : 0,
		touchEnabled : false
	});

	var top_section = Ti.UI.createView({
		height : __l(24),
		left : 0,
		top : 0,
		right : 0,
		touchEnabled : false
	});

	var user = Ti.UI.createLabel({
		top : __l(6),
		left : 0,
		height : __l(18),
		font : {
			fontSize : __l(14)
		},
		color : "#333",
		text : json.message_user_name,
		touchEnabled : false
	});

	var refer = Ti.UI.createLabel({
		top : __l(8),
		left : __l(150),
		right : __l(8),
		textAlign : 'right',
		height : Ti.UI.SIZE,
		font : {
			fontSize : __l(12)
		},
		color : "gray",
		text : referTime(json.created_at),
		touchEnabled : false
	});

	top_section.add(user);
	top_section.add(refer);
	post.add(top_section);

	var content = Ti.UI.createLabel({
		top : __l(4),
		left : 0,
		right : __l(8),
		bottom : __l(2),
		height : Ti.UI.SIZE,
		font : {
			fontSize : __l(15)
		},
		color : "#333",
		text : json.content,
		touchEnabled : false
	});

	post.add(content);
	if (json.message_posts_count > 1 && !json.is_sys) {
		var refer = Ti.UI.createLabel({
			top : 3,
			right : 6,
			textAlign : 'right',
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(10)
			},
			color : "gray",
			text : "有对话" + json.message_posts_count + "条",
			width : __l(100)
		});
		post.add(refer);
		row.className = "private2";
	}

	row.add(user_logo);
	row.add(post);
	return row;
};
//生成评论行
Mamashai.ui.make_comment_row = function(json) {
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		json : json,
		userid : json.user.id,
		username : json.user.name,
		postid : json.post.id,
		selectedBackgroundColor : "#E8E8E8",
		className : 'comment_row'
	});
	var user_logo = Ti.UI.createImageView({
		top : 5,
		left : 5,
		width : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		height : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		borderRadius : __l(4),
		defaultImage : "/images/default.gif",
		hires : true,
		touchEnabled : false
	});

	if (json.user.logo_url_thumb48.length > 0) {
		user_logo.image = Ti.App.aliyun + encodeURI(json.user.logo_url_thumb140);
	}

	var post = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : __l(42),
		top : 0,
		bottom : 2,
		right : 0,
		touchEnabled : false
	});

	var top_section = Ti.UI.createView({
		height : __l(20),
		left : 0,
		top : 0,
		right : 0,
		touchEnabled : false
	});

	var user = Ti.UI.createLabel({
		top : Ti.App.is_android ? 2 : 4,
		left : 0,
		height : __l(18),
		font : {
			fontSize : __l(14)
		},
		color : "#333",
		text : json.user.name,
		touchEnabled : false
	});

	var refer = Ti.UI.createLabel({
		top : __l(6),
		left : __l(150),
		right : __l(6),
		textAlign : 'right',
		height : Ti.UI.SIZE,
		font : {
			fontSize : Ti.App.is_android ? __l(11) : __l(13)
		},
		color : "gray",
		text : referTime(json.created_at),
		touchEnabled : false
	});

	top_section.add(user);
	top_section.add(refer);
	post.add(top_section);

	var content = createEmojiLabel({
		top : __l(4),
		left : 0,
		right : __l(4),
		bottom : __l(2),
		height : Ti.UI.SIZE,
		font : {
			fontSize : __l(15)
		},
		color : "#333",
		text : json.content,
		touchEnabled : false
	});
	post.add(content);

	//////微博原文
	var forward_jian = Ti.UI.createImageView({
		width : 11,
		height : 9,
		left : 30,
		top : 0,
		image : "/images/jian.png",
		touchEnabled : false
	});
	post.add(forward_jian);

	var forward = Ti.UI.createView({
		height : Ti.UI.SIZE,
		left : 0,
		top : 0,
		bottom : 4,
		right : 4,
		border : 1,
		borderRadius : 4,
		backgroundColor : "#eee",
		borderColor : "#eee",
		layout : 'vertical',
		zIndex : 1,
		touchEnabled : false
	});

	var forward_content = Ti.UI.createLabel({
		top : 4,
		left : 4,
		right : 4,
		bottom : 4,
		height : Ti.UI.SIZE,
		font : {
			fontSize : __l(14)
		},
		color : "#333",
		text : "回复" + json.post_username + "： " + json.post_content,
		touchEnabled : false
	});
	forward.add(forward_content);
	post.add(forward);

	row.add(user_logo);
	row.add(post);

	return row;
};

//生成礼物行
Mamashai.ui.make_gift_row = function(json) {
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		id : json.id,
		selectedBackgroundColor : "white",
		url : 'post.js',
		from : json.from,
		from_id : json.from_id,
		json : json
	});

	var user_logo = Ti.UI.createImageView({
		top : __l(5),
		left : __l(5),
		width : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		height : Titanium.Platform.osname == 'ipad' ? 50 : __l(30),
		borderRadius : __l(4),
		defaultImage : "/images/default.gif",
		hires : true
	});

	if (json.user && json.user.logo_url_thumb48.length > 0) {
		user_logo.image = "http://www.mamashai.com" + encodeURI(json.user.logo_url_thumb48)
	}

	user_logo.addEventListener("click", function(e) {
		show_window("user", {
			id: json.user.id, 
			title: json.name
		})
	});

	row.add(user_logo);

	var post = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : Titanium.Platform.osname == 'ipad' ? 70 : __l(42),
		top : Titanium.Platform.osname == 'ipad' ? 50 : __l(38),
		bottom : 2,
		right : 2
	});

	var top_section = Ti.UI.createView({
		height : Ti.UI.SIZE,
		left : Titanium.Platform.osname == 'ipad' ? 70 : __l(42),
		top : 0,
		right : 0
	});

	var user = Ti.UI.createLabel({
		top : __l(5),
		left : 0,
		height : Titanium.Platform.osname == 'ipad' ? 19 : __l(20),
		font : {
			fontSize : Titanium.Platform.osname == 'ipad' ? 19 : __l(16)
		},
		color : "#333",
		text : json.user && json.user.name && json.user.name.length > 0 ? json.user.name : "没名字"
	});

	var kid_json = json.user.user_kids[0]
	if (json.kid_id && json.user.user_kids != "null") {
		for (var i = 0; i < json.user.user_kids.length; i++) {
			if (json.kid_id == json.user.user_kids[i].id) {
				kid_json = json.user.user_kids[i]
				break;
			}
		}
	}

	var refer = Ti.UI.createLabel({
		top : Titanium.Platform.osname == 'ipad' ? 30 : __l(23),
		left : 0,
		right : 6,
		textAlign : 'left',
		height : Titanium.Platform.osname == 'ipad' ? 18 : __l(16),
		font : {
			fontSize : Titanium.Platform.osname == 'ipad' ? 16 : __l(14)
		},
		color : "gray",
		text : referMinute(json.created_at) + " " + kid_desc(kid_json, json.created_at)
	});

	top_section.add(user);
	top_section.add(refer)
	row.add(top_section)

	var content = Ti.UI.createLabel({
		top : 2,
		left : 0,
		right : 4,
		bottom : 2,
		height : Ti.UI.SIZE,
		font : {
			fontSize : Titanium.Platform.osname == 'ipad' ? 19 : __l(16)
		},
		color : "#333",
		text : "送给你" + json.gift.name + "并说：" + json.content
	});
	post.add(content);

	//有图片
	var logo = Ti.UI.createImageView({
		left : __l(50),
		top : __l(8),
		bottom : __l(8),
		width : __l(50),
		height : __l(50),
		image : "http://www.mamashai.com" + encodeURI(json.gift.logo_url),
		hires : true
	});

	post.add(logo);

	var gift_button = Ti.UI.createButton({
		top : __l(-45),
		right : __l(20),
		width : __l(100),
		height : __l(28),
		title : "回赠",
		id : json.user.id,
		font : {
			fontSize : __l(15)
		}
	});
	pre_btn(gift_button);
	gift_button.addEventListener("click", function(e) {
		var gift_win = Titanium.UI.createWindow({
			url : "gifts.js",
			title : "送礼物",
			id : e.source.id
		});
		gift_win.backButtonTitle = '';
		pre(gift_win);
		Ti.App.currentTabGroup.activeTab.open(gift_win, {
			animated : true
		});
		show_loading();
	});
	post.add(gift_button);

	row.add(post);
	row.post = post;
	row.json = json;

	return row;
};

//生成微博行
Mamashai.ui.make_weibo_row = function(json) {
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		json : json,
		id : json.id,
		url : 'post.js',
		from : json.from,
		from_id : json.from_id
	});
	
	if (Ti.App.is_android) {
		row.backgroundSelectedColor = "#E8E8E8";
	} else {
		row.selectedBackgroundColor = "#E8E8E8";
	}

	var className = "weibo";
	
	var user_logo = Ti.UI.createImageView({
		top : __l(8),
		left : __l(8),
		width : __l(30),
		height : __l(30),
		defaultImage : "/images/default.gif",
		hires : true,
		touchEnabled : false
	});

	if (json.user && json.user.logo_url_thumb48 && json.user.logo_url_thumb48.length > 0) {
		user_logo.image = Ti.App.aliyun + encodeURI(json.user.logo_url_thumb48);
	}
	
	var top_section = Ti.UI.createView({
		height : Ti.UI.SIZE,
		left : __l(46),
		top : 0,
		right : 0,
		touchEnabled : false
	});

	var user = createEmojiLabel({
		top : Ti.App.is_android ? __l(3) : __l(6),
		left : 0,
		height : __l(17),
		width : __l(200),
		font : {
			fontSize : __l(15)
		},
		text : json.user && json.user.name && json.user.name.length > 0 ? json.user.name : "没名字",
		color : "#333",
		touchEnabled : false
	});
	if (Ti.App.is_android) {
		user.height += 7;
	}

	var kid_json = json.user.user_kids[0];
	if (json.kid_id && json.user.user_kids != "null") {
		for (var i = 0; i < json.user.user_kids.length; i++) {
			if (json.kid_id == json.user.user_kids[i].id) {
				kid_json = json.user.user_kids[i];
				break;
			}
		}
	}

	var refer = createEmojiLabel({
		top : __l(26),
		left : 0,
		right : 6,
		textAlign : 'left',
		height : __l(18),
		font : {
			fontSize : __l(14)
		},
		color : "gray",
		text : referMinute(json.created_at) + " " + kid_desc(kid_json, json.created_at),
		touchEnabled : false
	});

	top_section.add(user);
	if (json.is_private == 1 || json.is_private) {
		top_section.add(Ti.UI.createImageView({
			right : __l(30),
			top : __l(8),
			width : __l(10),
			height : __l(13),
			image : "/images/suo.png",
			hires : true,
			touchEnabled : false
		}));
		className + "_private";
	}
	top_section.add(refer);

	var post = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : __l(46),
		top : __l(44),
		bottom : __l(4),
		right : __l(4),
		tp: 'post',
		touchEnabled : Ti.App.is_android ? false : true
	});

	var content = createEmojiLabel({
			top : __l(2),
			left : 0,
			right : __l(4),
			bottom : __l(2),
			height : Ti.UI.SIZE,
			touchEnabled : false,
			color : "#333",
			font : {
				fontSize : __l(16)
			},
			text : json.content.length > 200 ? json.content.substr(0, 200) + "..." : json.content
	});
	
	post.add(content);

	//有图片
	if (json.post_logos) {//有多张图片
		var logo_wrapper = Ti.UI.createView({
			left : 0,
			width : __l(260),
			top : __l(2),
			bottom : __l(8),
			height : Ti.UI.SIZE,
			layout : 'horizontal',
			tp: 'logo_wrapper',
			touchEnabled : Ti.App.is_android ? false : true
		});
		if (json.post_logos.length == 4){
			logo_wrapper.width = __l(200);
		}
		row.image_logos = new Array();
		var logo_paths = new Array();
		for (var i = 0; i < json.post_logos.length; i++) {
			logo_paths.push(Ti.App.aliyun + encodeURI(Titanium.Network.networkTypeName.toLowerCase()  == 'wifi' ? json.post_logos[i].logo_url : json.post_logos[i].logo_url_thumb400));
		}
		for (var i = 0; i < json.post_logos.length; i++) {
			var logo = Ti.UI.createImageView({
				left : __l(0),
				right: __l(6),
				top : __l(6),
				width : __l(80),
				height : __l(80),
				image : Ti.App.aliyun + encodeURI(json.post_logos[i].logo_url_thumb200),
				image_bak : Ti.App.aliyun + encodeURI(json.post_logos[i].logo_url_thumb200),
				json : json.post_logos[i],
				index: i,
				defaultImage : "/images/default.gif",
				hires : Ti.App.is_ipad ? false : true
			});
			logo.addEventListener("click", function(e) {
				galary_browse(logo_paths, e.source.index);
			});
			logo_wrapper.add(logo);
			row.image_logos.push(logo);
		}
		className += "_logos_" + json.post_logos.length;
		post.add(logo_wrapper);
	} else if (json.logo_url) {//有单张图片
		var logo_wrapper = Ti.UI.createView({
			left : 0,
			right : 0,
			top : __l(8),
			bottom : __l(8),
			height : __l(80),
			width : __l(140),
			tp: 'logo_wrapper',
			touchEnabled : Ti.App.is_android ? false : true
		});
		
		var logo = Ti.UI.createImageView({
			left : __l(2),
			top : 0,
			bottom : 0,
			height : __l(80),
			defaultImage : "/images/default.gif",
			hires : Ti.App.is_ipad ? false : true
		});
		row.image_logo = logo;
		//安卓下用大图容易崩溃
		logo.image = Ti.App.aliyun + encodeURI(Ti.App.logicalDensityFactor >= 4 ? json.logo_url_thumb400 : json.logo_url_thumb120);
		logo.image_bak = Ti.App.aliyun + encodeURI(Ti.App.logicalDensityFactor >= 4 ? json.logo_url_thumb400 : json.logo_url_thumb120);
		if (Ti.App.is_android && Ti.App.logicalDensityFactor == 3 && json.id < 203308717){
			logo.image = Ti.App.aliyun + encodeURI(json.logo_url_thumb400);
			logo.image_bak = Ti.App.aliyun + encodeURI(json.logo_url_thumb400);
		}
		if (json.video_path && Ti.App.is_android) {
			logo.touchEnabled = false;
		}

		className += "_logo";
		
		logo.addEventListener("click", function() {
			if (json.video_path && !Ti.App.is_android) {
				Ti.App.fireEvent("playVideo", {
					url : json.video_path,
				});
			} else {
				galary_browse([Ti.App.aliyun + encodeURI(Titanium.Network.networkTypeName.toLowerCase()  == 'wifi' ? json.logo_url : json.logo_url_thumb400)], 0);
			}
		});
		
		logo_wrapper.add(logo);

		if (json.video_path) {
			logo.wrapper = logo_wrapper;
			logo.addEventListener("load", function(e) {
				if (e.source.wrapper.shadow)
					return;

				var width = e.source.toImage().width;

				var shadow = Ti.UI.createImageView({
					top : __l(20),
					//bottom: __l(20),
					//left : __l(10),
					left : (width - __l(40)) / 2 < 0 ? __l(20) : (width - __l(40)) / 2,
					//right : __l(10),
					width : __l(40),
					height : __l(40),
					image : "/images/video_mask.png",
					zIndex : 11,
					touchEnabled : false
				});
				e.source.wrapper.add(shadow);
				e.source.wrapper.shadow = shadow;
			});
			
			className += "_video";
		}
		if (json.from == "dianping" && json.place_comment) {
			className += "_dianping";
			var product_wrapper = Ti.UI.createView({
				left : Ti.App.is_ipad ? __l(136) : __l(130),
				top : __l(0),
				height : __l(90),
				right : __l(2),
				width : __l(280),
				layout : 'vertical',
				touchEnabled : false
			});

			var wrapper1 = Ti.UI.createView({
				left : 0,
				right : 0,
				top : __l(0),
				height : Ti.UI.SIZE
			});
			product_wrapper.add(wrapper1);
			wrapper1.add(Ti.UI.createImageView({
				left : __l(10),
				image : "/images/poi.png",
				width : __l(16),
				height : __l(16),
				top : __l(0)
			}));

			wrapper1.add(Ti.UI.createLabel({
				left : __l(28),
				top : __l(0),
				text : json.place_comment.place.name,
				color : "#666",
				font : {
					fontSize : __l(11)
				}
			}));

			var wrapper2 = Ti.UI.createView({
				left : 0,
				right : 0,
				top : Ti.App.is_android ? __l(2) : __l(3),
				height : Ti.UI.SIZE
			});
			product_wrapper.add(wrapper2);
			wrapper2.add(Ti.UI.createLabel({
				left : __l(10),
				top : __l(0),
				text : "星级：",
				color : "#666",
				font : {
					fontSize : __l(10)
				}
			}));

			wrapper2.add(Ti.UI.createImageView({
				left : __l(44),
				image : json.place_comment.place.rating_s_img_url,
				width : __l(70),
				height : __l(10),
				top : __l(1)
			}));

			if (json.place_comment.qinzi && json.place_comment.qinzi.length > 0) {
				var wrapper3 = Ti.UI.createView({
					left : 0,
					right : 0,
					top : Ti.App.is_android ? __l(2) : __l(3),
					height : Ti.UI.SIZE,
					layout : 'horizontal'
				});
				product_wrapper.add(wrapper3);

				wrapper3.add(Ti.UI.createLabel({
					left : __l(10),
					top : __l(0),
					height : __l(12),
					text : "亲子设施：",
					color : "#666",
					font : {
						fontSize : __l(10)
					}
				}));

				var names = "儿童餐椅,儿童餐饮,儿童游乐场,宝宝玩具,儿童床,儿童游泳池,哺乳室,儿童马桶,无亲子设施".split(",");
				var names1 = json.place_comment.qinzi.replace(/^,/, '').split(",");
				for (var i = 0; i < names1.length; i++) {
					for (var j = 0; j < names.length; j++) {
						if (names1[i] == names[j]) {
							wrapper3.add(Ti.UI.createImageView({
								left : __l(4),
								top : __l(0),
								height : __l(12),
								width : __l(12),
								hires : true,
								image : "/images/dianping/c" + (j + 1) + ".png"
							}));
						}
					}
				}
			}

			if (json.place_comment.shiyi && json.place_comment.shiyi.length > 0) {
				var wrapper4 = Ti.UI.createView({
					left : 0,
					right : 0,
					top : Ti.App.is_android ? __l(2) : __l(3),
					height : Ti.UI.SIZE,
					layout : 'horizontal'
				});
				product_wrapper.add(wrapper4);

				wrapper4.add(Ti.UI.createLabel({
					left : __l(10),
					top : __l(0),
					text : "适宜宝宝：",
					color : "#666",
					height : __l(12),
					font : {
						fontSize : __l(10)
					}
				}));
				var names = ["0~3岁", "3~6岁", "6岁以上", "孕期", "不适宜宝宝"];
				var names1 = json.place_comment.shiyi.replace(/^,/, '').split(",");
				for (var i = 0; i < names1.length; i++) {
					for (var j = 0; j < names.length; j++) {
						if (names1[i] == names[j]) {
							wrapper4.add(Ti.UI.createImageView({
								left : __l(4),
								top : __l(0),
								height : __l(12),
								width : __l(12),
								hires : true,
								image : "/images/dianping/c" + (j + 10) + ".png"
							}));
						}
					}
				}
			}

			if (json.place_comment.qx && json.place_comment.qx.length > 0) {
				var wrapper5 = Ti.UI.createView({
					left : 0,
					right : 0,
					top : Ti.App.is_android ? __l(2) : __l(3),
					height : Ti.UI.SIZE,
					layout : 'horizontal'
				});
				product_wrapper.add(wrapper5);

				wrapper5.add(Ti.UI.createLabel({
					left : __l(10),
					top : __l(0),
					text : "宝宝情绪：",
					color : "#666",
					height : __l(12),
					font : {
						fontSize : __l(10)
					}
				}));

				var names = ["开心", "安静", "活跃", "留恋", "哭闹", "烦躁"];
				var names1 = json.place_comment.qx.replace(/^,/, '').split(",");
				for (var i = 0; i < names1.length; i++) {
					for (var j = 0; j < names.length; j++) {
						if (names1[i] == names[j]) {
							wrapper5.add(Ti.UI.createImageView({
								left : __l(4),
								top : __l(0),
								height : __l(12),
								width : __l(12),
								hires : true,
								image : "/images/dianping/c" + (j + 15) + ".png"
							}));
						}
					}
				}
			}

			logo_wrapper.width = __l(280);
			logo_wrapper.add(product_wrapper);
		}

		if (json.from == 'taotaole' && json.tao_product) {
			className += "_taotaole";
			var product_wrapper = Ti.UI.createView({
				left : __l(90),
				top : __l(0),
				height : __l(80),
				right : __l(2),
				touchEnabled : false
			});
			var product_title = Ti.UI.createLabel({
				top : __l(5),
				right : __l(2),
				left : __l(0),
				height : Ti.UI.SIZE,
				font : {
					fontSize : Titanium.Platform.osname == 'ipad' ? 17 : __l(11)
				},
				color : "#999",
				touchEnabled : false,
				text : json.tao_product.name
			});

			var product_price = Ti.UI.createLabel({
				//bottom: __l(5),
				top : __l(40),
				right : __l(10),
				left : __l(0),
				height : Ti.UI.SIZE,
				font : {
					fontSize : Titanium.Platform.osname == 'ipad' ? 19 : __l(16)
				},
				textAlign : 'left',
				color : Ti.App.bar_color,
				touchEnabled : false,
				text : "￥" + json.tao_product.price
			});
			product_wrapper.add(product_title);
			product_wrapper.add(product_price);
			logo_wrapper.width = __l(280);
			logo_wrapper.add(product_wrapper);
		}
		
		
		post.add(logo_wrapper);
	}

	if (json.forward_post) {
		var forward_wrapper = Ti.UI.createView({
			left : 0,
			top : 0,
			right : 0,
			height : Ti.UI.SIZE,
			layout : "vertical",
			tp: 'forward_wrapper',
			touchEnabled : Ti.App.is_android ? false : true
		});
		post.add(forward_wrapper);

		var forward_jian = Ti.UI.createImageView({
			width : __l(11),
			height : __l(9),
			left : __l(30),
			top : 0,
			image : "/images/jian.png",
			touchEnabled : false
		});
		forward_wrapper.add(forward_jian);

		var forward = Ti.UI.createView({
			height : Ti.UI.SIZE,
			left : 0,
			top : 0,
			bottom : __l(8),
			right : __l(6),
			border : 1,
			borderRadius : __l(4),
			backgroundColor : "#eee",
			borderColor : "#eee",
			layout : 'vertical',
			zIndex : 1,
			tp: 'forward',
			touchEnabled : Ti.App.is_android ? false : true
		});

		var forward_content = createEmojiLabel({
			top : __l(8),
			left : __l(8),
			right : __l(8),
			bottom : __l(8),
			height : Ti.UI.SIZE,
			font : {
				fontSize : Titanium.Platform.osname == 'ipad' ? 18 : __l(15)
			},
			text : (json.forward_user ? "@" + json.forward_user.name + "： " : "") + json.forward_post.content,
			color : "#333",
			touchEnabled : false
		});
		forward.add(forward_content);
		className += "_forward";
		if (json.forward_post.logo_url) {
			var logo_wrapper = Ti.UI.createView({
				left : __l(8),
				right : 0,
				top : __l(0),
				bottom : 0,
				height : Ti.UI.SIZE,
				tp: 'logo_wrapper',
				touchEnabled : Ti.App.is_android ? false : true
			});
			forward.add(logo_wrapper);

			if (json.forward_post.post_logos && json.forward_post.post_logos.length > 1) {
				logo_wrapper.width = __l(300);
				logo_wrapper.layout = 'horizontal';
				row.image_logos = new Array();
				var logo_paths = new Array();
				for (var i = 0; i < json.forward_post.post_logos.length; i++) {
					logo_paths.push(Ti.App.aliyun + encodeURI(Titanium.Network.networkTypeName.toLowerCase()  == 'wifi' ? json.forward_post.post_logos[i].logo_url : json.forward_post.post_logos[i].logo_url_thumb400));
				}
				for (var i = 0; i < json.forward_post.post_logos.length; i++) {
					var logo = Ti.UI.createImageView({
						left : 0,
						right: Ti.App.platform_width > __l(330) ? __l(6) : __l(4),
						bottom : Ti.App.platform_width > __l(330) ? __l(6) : __l(4),
						width : __l(80),
						height : __l(80),
						image : Ti.App.aliyun + encodeURI(json.forward_post.post_logos[i].logo_url_thumb200),
						image_bak : Ti.App.aliyun + encodeURI(json.forward_post.post_logos[i].logo_url_thumb200),
						json : json.forward_post.post_logos[i],
						index: i,
						defaultImage : "/images/default.gif",
						hires : Ti.App.is_ipad ? false : true
					});
					logo.addEventListener("click", function(e) {
						galary_browse(logo_paths, e.source.index);
					});
					logo_wrapper.add(logo);
					row.image_logos.push(logo);
				}
				className += "_flogos_" + json.forward_post.post_logos.length;
			} else {
				var forward_logo = Ti.UI.createImageView({
					left : 0,
					top : __l(0),
					bottom : __l(8),
					//width : __l(60),
					defaultImage : "/images/default.gif",
					height : __l(60),
					hires : true
				});

				forward_logo.image = Ti.App.aliyun + encodeURI(json.forward_post.logo_url_thumb120);
				forward_logo.image_bak = forward_logo.image;
				row.image_logo = forward_logo;
				forward_logo.addEventListener("click", function() {
					Ti.App.fireEvent("showPicture", {
						src : Ti.App.aliyun + encodeURI(json.forward_post.logo_url_thumb400),
						thumb_src : Ti.App.aliyun + encodeURI(json.forward_post.logo_url_thumb120)
					});
				});
				logo_wrapper.add(forward_logo);

				if (json.forward_post.from == 'taotaole' && json.forward_post.tao_product) {
					var product_wrapper = Ti.UI.createView({
						left : __l(90),
						top : __l(0),
						height : __l(80),
						right : __l(10),
						touchEnabled : false
					});
					var product_title = Ti.UI.createLabel({
						top : __l(5),
						right : __l(10),
						left : __l(0),
						height : Ti.UI.SIZE,
						font : {
							fontSize : Titanium.Platform.osname == 'ipad' ? 17 : __l(11)
						},
						color : "#999",
						touchEnabled : false,
						text : json.forward_post.tao_product.name
					});

					var product_price = Ti.UI.createLabel({
						//bottom: __l(5),
						top : __l(40),
						right : __l(10),
						left : __l(0),
						height : Ti.UI.SIZE,
						font : {
							fontSize : Titanium.Platform.osname == 'ipad' ? 19 : __l(16)
						},
						textAlign : 'left',
						color : Ti.App.bar_color,
						touchEnabled : false,
						text : "￥" + json.forward_post.tao_product.price
					});
					product_wrapper.add(product_title);
					product_wrapper.add(product_price);
					logo_wrapper.add(product_wrapper);
					className += "forward_taotaole_1";
				}
				
				className += "_flogo";
			}
		}
		forward_wrapper.add(forward);
	}

	var comment_str = "";
	var comment_name = json.score > 0 ? "回答" : "评论";
	if (json.forward_posts_count > 0) {
		comment_str = "转晒:" + json.forward_posts_count;
	}
	if (json.comments_count > 0) {
		if (comment_str.length > 0) {
			comment_str += " | " + comment_name + ":" + json.comments_count;
		} else {
			comment_str = comment_name + ":" + json.comments_count;
		}
	}
	
	if (comment_str.length > 0) {
		//className += '_comment';
		
		var refer = Ti.UI.createLabel({
			top : __l(4),
			right : __l(4),
			bottom : __l(4),
			textAlign : 'right',
			height : Titanium.Platform.osname == 'ipad' ? 15 : __l(14),
			width: __l(160),
			font : {
				fontSize : Titanium.Platform.osname == 'ipad' ? 14 : __l(11)
			},
			color : "gray",
			text : comment_str,
			touchEnabled : false
		});
		row.refer = refer;
		post.add(refer);
	}
	else if (Ti.App.is_android){
		post.add(Ti.UI.createLabel({
			top : __l(4),
			right : __l(4),
			bottom : __l(4),
			textAlign : 'right',
			height : 0,
			font : {
				fontSize : __l(11)
			},
			color : "gray",
			text : "",
			touchEnabled : false
		}));
	}
	
	row.add(user_logo);
	row.add(top_section);
	row.add(post);
	row.json = json;

	row.className = className;
		
	return row;
};

Mamashai.ui.make_weibo_tableview = function(weibo_type, url, user_id, row_type) {
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.PLAIN,
		headerDividersEnabled: true,
		separatorColor : "#ccc",
		backgroundColor : "white",
		top : 0,
		bottom : 0,
		left : 0,
		width : Ti.App.platform_width,
		url : url,
		row_type : row_type,
		userid : user_id,
		weibo_type : weibo_type, //all, my, sameage, friend, atme 等等
		_get_type : "first", //获取新数据方式，first: 首次加载,max:获取更新的数据，min:获取更旧的数据
		pulling : false,
		pushing : false
	});

	tableview.pullRefreshBegin = function() {
		if (this.no_new) {
			tableview.fireEvent("pullRefreshFinish");
			return;
		}

		if (this.pulling || this.pushing)
			return;

		this._get_type = "max";
		this.url = this.url + "&cond=" + this.row_type + ".id >" + get_time_prop(this.weibo_type, this._get_type) + "&t=" + this.weibo_type;
		this.send();

		this.pulling = true;
	};

	var get_more_row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectedBackgroundColor : '#eee',
		tag : 'get_more',
		textAlign : "center",
		name : 'get_more'
	});

	var get_more_row_center = Ti.UI.createView({
		top : 0,
		bottom : 0,
		width : __l(160),
		height : __l(50),
		touchEnabled : false
	});

	var get_more_title = Ti.UI.createLabel({
		top : __l(12),
		bottom : __l(10),
		left : __l(26),
		right : __l(10),
		textAlign : 'center',
		height : Ti.UI.SIZE,
		font : {
			fontSize : __l(20)
		},
		color : "#999",
		touchEnabled : false,
		text : '获得更多...'
	});
	var navActInd_more = Titanium.UI.createActivityIndicator({
		left : __l(10),
		top : Ti.App.is_android ? __l(16) : __l(14),
		width : __l(20),
		height : __l(20),
		style : Ti.App.is_android ? Titanium.UI.ActivityIndicatorStyle.BIG_DARK : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
	});

	get_more_row_center.add(navActInd_more);
	get_more_row_center.add(get_more_title);
	get_more_row.add(get_more_row_center);
	
	get_more_row.addEventListener('click', function(e) {
		if (tableview.pushing || tableview.pulling)
			return;

		if (!check_login()) {
			var row_count = get_row_count(tableview);
			if (row_count >= 60) {
				to_login();
				return;
			}
		}

		tableview._get_type = "min";

		if (tableview.by_page) {
			tableview.page = tableview.page + 1;
			tableview.url = tableview.url + "&page=" + tableview.page;
		} else
			tableview.url = tableview.url + "&cond=" + tableview.row_type + ".id <" + get_time_prop(tableview.weibo_type, tableview._get_type);

		navActInd_more.show();
		tableview.pushing = true;

		tableview.send();
	});

	////安卓下的获得更新记录按钮
	var get_new_row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectedBackgroundColor : '#eee',
		tag : 'get_new',
		textAlign : "center",
		name : 'get_new'
	});

	var get_new_row_center = Ti.UI.createView({
		top : 0,
		bottom : 0,
		width : __l(140),
		touchEnabled : false,
		height : __l(50)
	});
	var navActInd_new = Titanium.UI.createActivityIndicator({
		left : __l(10),
		top : Ti.App.is_android ? __l(16) : __l(14),
		width : __l(20),
		height : __l(20),
		style : Ti.App.is_android ? Titanium.UI.ActivityIndicatorStyle.BIG_DARK : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	var get_new_title = Ti.UI.createLabel({
		top : __l(12),
		bottom : __l(10),
		left : __l(26),
		right : __l(10),
		textAlign : 'center',
		height : Ti.UI.SIZE,
		touchEnabled : false,
		font : {
			fontSize : __l(20)
		},
		color : "#999",
		text : '点击刷新'
	});

	get_new_row_center.add(get_new_title);
	get_new_row.add(get_new_row_center);
	get_new_row_center.add(navActInd_new);
	
	get_new_row.addEventListener('click', function(e) {
		tableview._get_type = "max";

		tableview.url = tableview.url + "&cond=" + tableview.row_type + ".id >" + get_time_prop(tableview.weibo_type, tableview._get_type);

		tableview.send();
		navActInd_new.show();
		tableview.newing = true;
	});

	///////////////////

	var xhr = Ti.Network.createHTTPClient();
	tableview.xhr = xhr;
	xhr.timeout = Ti.App.timeout;
	xhr.onerror = function() {
		show_notice("发生错误，您的网络不给力");
		navActInd_new.hide();
		navActInd_more.hide();
		
		tableview.pushing = false;
		tableview.pulling = false;
		
		if (tableview.newing){
			tableview.newing = false;
			tableview.fireEvent("android_pull_refresh_finish");
		}
		tableview.fireEvent("pullRefreshFinish");
		hide_loading();
	};
	xhr.onload = function() {
		navActInd_new.hide();
		navActInd_more.hide();
		if (this.responseText == "null") {
			if (tableview.pushing) {
				//this.tableview.deleteRow(this.tableview.data[0].rowCount-1);
				show_notice("暂时没有更新的");
				hide_loading();		
			} else if (tableview.newing) {
				show_notice("暂时没有更新的");
			} else if (tableview._get_type == "first") {
				if (tableview.weibo_type != "album_books" && !tableview.no_empty_tip)
					show_notice("没有记录");
			}
		} else {
			var json = JSON.parse(this.responseText);
			if (!json || json.length == 0) {
			}

			if (json.length > 0) {
				var row_count = get_row_count(tableview);
				tableview.insert_rows_to_tableview(json);

				if (tableview._get_type == "max" && json.length >= receive_count - 1 || tableview._get_type == "first") {
					if (tableview.userid)
						require('/lib/mamashai_db').db.insert_json(tableview.weibo_type + "_post", tableview.userid, this.responseText);
				} else if (tableview._get_type == "max" && json.length > 0) {//更新json
					var g_tableview = tableview;
					function add_to_cache() {//这么做可以加快展现速度
						if (!tableview.userid)
							return;
							
						if (tableview.no_cache)
							return;

						var record = require('/lib/mamashai_db').db.select_one_json(g_tableview.weibo_type + "_post", g_tableview.userid);
						if (!record.blank) {
							var db_json = JSON.parse(record.json);
							db_json = json.concat(db_json);
							db_json.splice(receive_count, receive_count);
							require('/lib/mamashai_db').db.insert_json(g_tableview.weibo_type + "_post", g_tableview.userid, JSON.stringify(db_json));
						}
					}
					
					add_to_cache();
				}

				if (tableview._get_type == "max" || tableview._get_type == "first") {
					set_time_prop(tableview.weibo_type, "max", json[0].id);
					if (json.length == receive_count) {
						set_time_prop(tableview.weibo_type, "min", json[json.length - 1].id);
					}
					if (json && json[0] && json[0].created_at && tableview.lastUpdatedLabel)
						tableview.lastUpdatedLabel.text = "最后更新时间: " + json[0].created_at.substr(0, 19).replace("T", " ");
				}

				if (tableview._get_type == "min" || tableview._get_type == "first") {
					set_time_prop(tableview.weibo_type, "min", json[json.length - 1].id);
				}
			}
		}

		hide_loading();
		if (tableview.pushing && this.responseText != "null")
			tableview.scrollToIndex(row_count - 1, {
				animated : true,
				position : Ti.UI.iPhone.TableViewScrollPosition.BOTTOM
			});
		if (tableview.pulling && tableview.pull_callback) {
			tableview.pull_callback();	
		} else if (tableview._get_type == "first" && tableview.pull_callback) {
			tableview.pull_callback();
		}
		tableview.pushing = false;
		tableview.pulling = false;
		
		if (tableview.newing){
			tableview.newing = false;
			tableview.fireEvent("android_pull_refresh_finish");
		}
		tableview.fireEvent("pullRefreshFinish");
	};

	tableview._header_title = "";
	//显示个人微博的时候对微博进行按月分组，响应主站的时间线
	tableview.insert_rows_to_tableview = function(json) {
		var insert_point = 0;
		var pre_length = get_row_count(this);
		if (this._get_type == "max" && json.length == receive_count) {
			this.data = [];
			//抹掉记录
			insert_point = -1;
			pre_length = 0;
		}

		if (Ti.App.is_android && this._get_type == "max") {
			var index = this.getIndexByName('get_new');
			if (index >= 0) {
				//	this.deleteRow(index);
				insert_point = 1;
			}
		}

		var json_size = json.length;
		var data = [];
		for (var i = 0; i < json_size; i++) {
			var row = null;
			if (this.make_row_callback) {
				row = this.make_row_callback(json[i]);
			} else {
				if (this.row_type == "posts") {
					row = Mamashai.ui.make_weibo_row(json[i]);
				} else if (this.row_type == "comments") {
					row = Mamashai.ui.make_comment_row(json[i]);
				} else if (this.row_type == "message_topics") {
					row = Mamashai.ui.make_private_row(json[i]);
				} else if (this.row_type == "gift_gets") {
					row = Mamashai.ui.make_gift_row(json[i]);
				}
			}

			if (this.weibo_type == "my" && !Ti.App.is_android) {
				if (this._header_title.indexOf(referMonth(json[i].created_at)) < 0) {
					row.header = referMonth(json[i].created_at);
					this._header_title += referMonth(json[i].created_at) + ";";
				}
			}

			data.push(row);
		}

		//get new row
		if (Ti.App.is_android && (this._get_type == "max" || this._get_type == "first") && !this.no_new && !this.add_pull_refresh) {
			//this.insertRowBefore(0, get_new_row)
			data.splice(0, 0, get_new_row);
		}
		
		if (this._get_type == "max" && insert_point >= 0 && this.data.length > 0) {
			for (var i = 0; i < this.sections.length; i++) {
				for (var j = 0; j < this.sections[i].rows.length; j++) {
					if (this.sections[i].rows[j].name != "get_new")
						data.push(this.sections[i].rows[j]);
				}
			}
			
			if (json_size == receive_count && !tableview.no_more) {
				data.push(get_more_row);
			}
			this.setData(data);
		} else {
			if (pre_length == 0) {
				if (json_size == receive_count && !tableview.no_more) {
					data.push(get_more_row);
				}
				this.setData(data);
			} else {
				if (pre_length > 0 && tableview._get_type != "max") {
					var index = tableview.getIndexByName('get_more');
					if (index > 0) {
						navActInd_more.hide();
						tableview.deleteRow(index);
					}
				}
				
				if (json_size == receive_count && !tableview.no_more) {
					data.push(get_more_row);
				}
				//tableview.appendRow(data);
				tableview.setData(tableview.data.concat(data));
			}
		}

		this.fireEvent("insert.complete");

		if (!Ti.App.is_android)
			hide_loading();
	};

	tableview.addEventListener("scrollend", function(e) {
		if (!Ti.App.is_android)
			return;
		var data = tableview.data[0].rows;
		for(var i=0; i<data.length; i++){
			var row = data[i];
			if (row.image_logo){
				if (i<tableview.firstVisibleItem-1 || i>tableview.firstVisibleItem + tableview.visibleItemCount){
					row.image_logo.image = null;
				}
				else{
					row.image_logo.image = row.image_logo.image_bak;
				}
			}
			
			if (row.image_logos && row.image_logos.length > 0){
				if (i<tableview.firstVisibleItem-1 || i>tableview.firstVisibleItem + tableview.visibleItemCount){
					for(var j=0; j<row.image_logos.length; j++){
						row.image_logos[j].image = null;
					}
				}
				else{
					for(var j=0; j<row.image_logos.length; j++){
						row.image_logos[j].image = row.image_logos[j].image_bak;
					}
				}
			}
		}
	});

	tableview.addEventListener("scroll", function(e) {
		if (!Ti.App.is_android)
			return;

		tableview.firstVisibleItem = e.firstVisibleItem;
		tableview.visibleItemCount = e.visibleItemCount;
	});

	//从外部传入获得更新的消息
	tableview.addEventListener("refresh_new", function(e){
		get_new_row.fireEvent("click");
	});
	
	if (tableview.row_type == "posts" && !tableview.make_row_callback) {
		tableview.addEventListener('click', function(e) {
			if (tableview.make_row_callback)
				return;

			if (tableview.no_click) {
				return;
			}

			if (e.rowData.tag == "get_more" || e.rowData.name == "get_more" || e.rowData.tag == "get_new") {
				return;
			}

			if (e.source.image && e.source.image.length > 0) {
				return;
			}

			if (e.rowData.from == "article") {
				var ArticleWindow = require('/article');
				var win = new ArticleWindow({
					id : e.rowData.from_id,
					t : 'article',
					barImage : '/images/hua.png',
					backgroundColor : 'white',
					title : "育儿宝典"
				});

				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
				return;
			} else if (e.rowData.from == 'album_book') {
				var xhr = Ti.Network.createHTTPClient()
				xhr.timeout = Ti.App.timeout
				xhr.onerror = function(e) {
					hide_loading()
					show_notice("获取照片书失败")
				};
				xhr.onload = function() {
					hide_loading()
					var json = JSON.parse(this.responseText)
					var AlbumMv = require('album_mv')
					var win = new AlbumMv({
						title : json.name,
						backgroundColor : '#78A1A7',
						json : json,
						id : json.id,
						backButtonTitle : ''
					});
					pre(win)
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				};

				var url = Ti.App.mamashai + "/api/mbook/album_book.json?id=" + e.rowData.from_id;
				xhr.open("GET", url)
				xhr.send()
				show_loading()
				return;
			}

			var win = Titanium.UI.createWindow({
				json : e.row.json,
				id : e.row.id,
				title : "记录详情",
				barImage : '/images/hua.png',
				backgroundColor : 'white'
			});

			Mamashai.ui.make_post_win(win);

			pre(win)

			if (!Ti.App.is_android)
				win.hideTabBar();

			if (e.rowData.from == 'column') {
				win.title = "专栏文章"
			}

			win.backButtonTitle = '';

			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		});
	} else if (tableview.row_type == "comments") {
		tableview.addEventListener('click', function(e) {
			if (e.rowData.tag == "get_more" || e.rowData.tag == "get_new") {
				return;
			}

			var optionsDialogOpts = {
				options : ['个人资料', '查看记录原文', '回复评论', '取消'],
				cancel : 3
			};
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click', function(e2) {
				if (e2.index == 0) {//作者资料
					show_window("user", {
						id: e.rowData.userid, 
						title: e.rowData.username
					})
				} else if (e2.index == 1) {
					var win = Titanium.UI.createWindow({
						title : "记录详情",
						json : e.rowData.json.post,
						barImage : '/images/hua.png',
						backgroundColor : 'white',
						id : e.rowData.json.post.id,
						reply : "回复@" + e.rowData.json.user.name + "："
					});
					pre(win)
					
					Mamashai.ui.make_post_win(win);
					
					if (!Ti.App.is_android) {
						win.hideTabBar();
						win.backButtonTitle = '';
					}

					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				} else if (e2.index == 2) {
					show_window('comment', {
						json : e.rowData.json.post,
						o_content : e.rowData.json.post_content,
						id : e.rowData.json.post_id,
						text : "回复@" + e.rowData.json.user.name + "：",
						title : "评论"
					});
				}
			});
			dialog.show();

		});
	} else if (tableview.row_type == "message_topics") {
		tableview.addEventListener('click', function(e) {
			if (e.rowData.tag == "get_more" || e.rowData.tag == "get_new") {
				return;
			}

			show_window('message_posts', {
				id : e.rowData.json.id,
				title : e.rowData.json.message_user_name + "的私信"
			});
		});
	}

	xhr.send_request = function() {
		json_row = require('/lib/mamashai_db').db.select_with_check(tableview.weibo_type + "_post", tableview.userid);
		if (!tableview.no_cache && tableview.weibo_type != "my" && tableview._get_type == "first" && !json_row.blank && tableview.weibo_type != "mbooks" && tableview.weibo_type != "album_books") {
			var json = JSON.parse(json_row.json);

			tableview.insert_rows_to_tableview(json);

			if (json[0].created_at && tableview.lastUpdatedLabel) {
				set_time_prop(tableview.weibo_type, "max", json[0].id)
				tableview.lastUpdatedLabel.text = "最后更新时间: " + json[0].created_at.substr(0, 19).replace("T", " ")
			}
			if (json[json.length - 1].created_at)
				set_time_prop(tableview.weibo_type, "min", json[json.length - 1].id)

			if (json.length >= 160) {
				set_time_prop(tableview.weibo_type, "min", json[159].id)
			}

			hide_loading();

			//获得最新
			tableview.pullRefreshBegin();
		} else {
			xhr.open('GET', tableview.url + "&count=" + receive_count + "&" + account_str());
			xhr.send();
		}
	};

	tableview.send = function() {
		xhr.send_request();
		
		if (!tableview.no_new && !tableview.no_cache) {
			make_pull_refresh(tableview);
		}
	};

	return tableview;
};

//更新微博的评论与转晒数量
Mamashai.ui.update_weibo_from_tableview = function(tableview, id, comment_count, forward_count) {
	for (var i = 0; i < tableview.data.length; i++) {
		var section = tableview.data[i];
		for (var j = 0; j < section.rows.length; j++) {
			row = section.rows[j]
			if (row.json && row.json.id == parseInt(id)) {
				row.json.forward_posts_count = forward_count
				row.json.comments_count = comment_count
				var comment_str = "";
				var comment_name = row.json.score > 0 ? "回答" : "评论";
				if (forward_count > 0) {
					comment_str = "转晒:" + forward_count;
				}
				if (comment_count > 0) {
					if (comment_str.length > 0) {
						comment_str += " | " + comment_name + ":" + comment_count;
					} else {
						comment_str = comment_name + ":" + comment_count;
					}
				}
				if (comment_str.length > 0) {
					if (row.refer) {
						row.refer.text = comment_str;
					} else {
						var refer = Ti.UI.createLabel({
							top : 3,
							left : 200,
							right : 6,
							textAlign : 'right',
							height : Ti.UI.SIZE,
							font : {
								fontSize : 11
							},
							color : "gray",
							text : comment_str
						});
						row.refer = refer
						row.post.add(refer);
					}
				}
				break;
			}
		}
	}
};

Mamashai.ui.delete_weibo_from_tableview = function(tableview, id) {
	var rowIndex = 0;
	for (var i = 0; i < tableview.data.length; i++) {
		var section = tableview.data[i]
		for (var j = 0; j < section.rows.length; j++) {
			row = section.rows[j]
			if (row.id == parseInt(id)) {
				tableview.deleteRow(rowIndex);
				break;
			}
			rowIndex++;
		}
	}
}

function make_post_comment_row(comment) {
	var row_container = Ti.UI.createView({
		left: 0,
		right: 0,
		top: 0,
		json: comment,
		height: Ti.UI.SIZE
	});
	
	row_container.addEventListener("touchstart", function(e){
		row_container.backgroundColor = "#eee";
	});
	row_container.addEventListener("touchend", function(e){
		row_container.backgroundColor = "white";
	});
	row_container.addEventListener("touchcancel", function(e){
		row_container.backgroundColor = "white";
	});
	
	row_container.addEventListener("click", function(e){
		var optionsDialogOpts = {
			options : ['回复', '查看用户', '取消'],
			cancel : 2
		};
		
		if (Ti.App.Properties.getString("is_mms_admin", "false") == "true"){	//是管理员
			optionsDialogOpts.options = ['回复', '查看用户', '取消', '删除评论'];
		}

		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener("click", function(e1){
			if (e1.index == 0){		//回复
				if (!check_login()) {
					to_login();
					return;
				}
				show_window("comment", {
					json : e.source.json,
					backgroundColor: "white",
					id : e.source.json.post_id,
					text : "回复@" + e.source.json.user.name + ":",
					title : "评论"
				});
			}
			else if (e1.index == 1){		//用户详情
				show_window("user", {
					id: e.source.json.user.id, 
					title: e.source.json.user.name
				});
			}
			else if (e1.index == 3){
					var alert_dialog = Titanium.UI.createAlertDialog({
						title : '提示',
						message : '确定要删除评论吗？',
						buttonNames : ['取消', '确定'],
						cancel : 0
					});
					alert_dialog.addEventListener("click", function(e1){
						if (e1.index == 1){
							http_call(Ti.App.mamashai + "/api/admin/delete_comment/" + e.source.json.id + "?" + account_str(), function(e){
								show_notice(e.responseText);
							});
						}
					});
					alert_dialog.show();
			}
		});
		dialog.show();
	});
	
	var user_logo = Ti.UI.createImageView({
		top : __l(12),
		left : __l(4),
		width : __l(30),
		height : __l(30),
		defaultImage : "/images/default.gif",
		id : comment.user.id,
		image : Ti.App.aliyun + encodeURI(comment.user.logo_url_thumb48)
	});
	user_logo.addEventListener("touchstart", function(e){
		e.cancelBubble = true;
	});
	user_logo.addEventListener("touchend", function(e){
		e.cancelBubble = true;
	});
	user_logo.addEventListener("touchcancel", function(e){
		e.cancelBubble = true;
	});
	user_logo.addEventListener("click", function(e) {
		show_window("user", {
			id: e.source.id, 
			title: comment.user.name
		});
		e.cancelBubble = true;
	});
	
	var user_name = createEmojiLabel({
		top : __l(10),
		left : __l(40),
		height : __l(18),
		font : {
			fontSize : __l(14)
		},
		color : "#333",
		touchEnabled: false,
		text : comment.user ? comment.user.name : ""
	});

	var refer = Ti.UI.createLabel({
		top : __l(10),
		right : __l(4),
		height : __l(18),
		width : __l(90),
		font : {
			fontSize : __l(12)
		},
		color : "gray",
		textAlign : "right",
		touchEnabled: false,
		text : referTime(comment.created_at)
	});

	var regex = new RegExp('\\[([\u4e00-\u9fa5a-zA-Z0-9]+)\\]', 'g');
	var content = null;
	content = createEmojiLabel({
			top : __l(32),
			bottom : __l(12),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(15),
			},
			left : __l(40),
			right : 0,
			textAlign : "left",
			color : "#333",
			touchEnabled: false,
			text : comment.content
	});

	row_container.add(user_logo);
	row_container.add(user_name);
	row_container.add(refer);
	row_container.add(content);
	row_container.add(Ti.UI.createView({
		backgroundColor : "#eee",
		left : __l(2),
		touchEnabled: false,
		right : __l(2),
		height : __l(1),
		top: __l(0)
	}));
		
	return row_container;
}

Mamashai.ui.make_post_win = function(win) {
	var right_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.ACTION
	});
	
	win.has_actionbar = true;
	add_default_action_bar2(win, win.title, Ti.App.is_android ? Ti.Android.R.drawable.ic_menu_more : "", function() {
		right_button.fireEvent("click");
	});

	right_button.addEventListener("click", function(e) {
		var tiwechat = require('com.mamashai.tiwechat');
		
		var optionsDialogOpts = {
			options : [win.fav ? '取消收藏' : '收藏', '发送给微信好友', '发到微信朋友圈', '取消'],
			cancel : 3
		};
		if (tiwechat.isWeixinInstalled() == "no"){
			optionsDialogOpts = {
				options : [win.fav ? '取消收藏' : '收藏', '取消'],
				cancel: 1
			};	
		}
		if (win.json.user.id == parseInt(user_id())) {
			optionsDialogOpts = {
				options : [win.fav ? '取消收藏' : '收藏', '发送给微信好友', '发到微信朋友圈', '删除本记录', '取消'],
				cancel : 4
			};
			if (tiwechat.isWeixinInstalled() == "no"){
				optionsDialogOpts = {
					options : [win.fav ? '取消收藏' : '收藏', '删除本记录', '取消'],
					cancel: 2
				};	
			}
		}

		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener('click', function(e) {
			if (optionsDialogOpts.options[e.index] == "取消")
				return;
				
			if (e.index == 0) {
				if (!check_login()) {
					to_login();
					return;
				}

				var url = Ti.App.mamashai + "/api/statuses/favourite/" + win.json.id + "?tp=post&" + account_str();

				http_call(url, function(e) {
					if (e.responseText == "ok") {
						show_notice("收藏成功")
					} else if (e.responseText == "cancel") {
						show_notice("取消收藏成功")

						require('/lib/mamashai_db').db.delete_one_json("favourites1_post", user_id())
					}
				});
			} else if (e.index == 1) {//发给微信好友
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareSession("分享一篇育儿记录", win.json.content, "http://www.mamashai.com/mobile/post/" + win.json.id, "http://www.mamashai.com" + win.json.user.logo_url_thumb48);
				logEvent('weixin_session');
			} else if (e.index == 2) {//分享微信朋友圈
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.shareTimeline(win.json.content, "分享一篇育儿记录", "http://www.mamashai.com/mobile/post/" + win.json.id, "http://www.mamashai.com" + win.json.user.logo_url_thumb48);

				if (!Ti.App.is_android)
					show_notice("成功分享到微信朋友圈")
				logEvent('weixin_timeline');

				var url = Ti.App.mamashai + "/api/statuses/make_weixin_score?" + account_str();
				var xhr = Ti.Network.createHTTPClient()
				xhr.timeout = Ti.App.timeout
				xhr.open("POST", url)
				xhr.send()
			} else if (e.index == 3) {
				if (win.json.user.id == parseInt(user_id())) {
					var alert_dialog = Titanium.UI.createAlertDialog({
						title : '提示',
						message : '删除就再也找不回来了！',
						buttonNames : ['取消', '确定'],
						cancel : 0
					});
					alert_dialog.addEventListener("click", function(e) {
						if (e.index == 1) {
							//从服务器上删除
							http_call(Ti.App.mamashai + '/api/statuses/destroy?id=' + win.json.id + "&" + account_str(), function(e) {
								show_notice("删除记录成功");
							})

							require('/lib/mamashai_db').db.delete_one_json("calendar_posts" + user_id(), win.json.created_at.substr(0, 10))
							require('/lib/mamashai_db').db.delete_one_json("my_" + user_id() + "_post", user_id())

							win.close({
								animated : true
							});
						}
					});
					alert_dialog.show();
				}
			}
		});
		dialog.show()
	});
	if (!Ti.App.is_android)
		win.setRightNavButton(right_button);

	//win.addEventListener("open", function(e){
		var json = win.json;
		var scroll_view = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			top : Ti.App.android_offset,
			backgroundColor : 'white',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true
		});
	
		var post = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'vertical',
			left : __l(8),
			top : __l(0),
			right : __l(8)
		});
	
		var top_section = Ti.UI.createView({
			left: 0,
			right: 0,
			top: 0,
			height: Ti.UI.SIZE,
		});
		var user_logo = Ti.UI.createImageView({
			top : __l(8),
			left : __l(8),
			width : __l(32),
			height : __l(32),
			hires : true,
			defaultImage : "/images/default.gif",
			image : Ti.App.aliyun + encodeURI(json.user.logo_url_thumb140)
		});
	
		user_logo.addEventListener("click", function() {
			show_window("user", {
				id: json.user.id, 
				title: json.user.name
			});
		});
	
		top_section.add(user_logo);
		
		var user = createEmojiLabel({
			top : __l(6),
			left : __l(48),
			height : __l(19),
			font : {
				fontSize : __l(15)
			},
			color : "#333",
			text : json.user ? json.user.name : ""
		});
	
		top_section.add(user);
	
		var refer = createEmojiLabel({
			top : __l(26),
			left : __l(48),
			right : __l(6),
			textAlign : 'left',
			height : __l(17),
			font : {
				fontSize : __l(13)
			},
			color : "gray",
			text : referMinute(json.created_at) + " " + kid_desc(json.user.user_kids[0], json.created_at)
		});
	
		top_section.add(refer);
	
		var line = Ti.UI.createView({
			backgroundColor : "#eee",
			top : __l(48),
			left : 8,
			right : 8,
			height : 1,
		});
	
		top_section.add(line);
		post.add(top_section);
			
		var regex_face = new RegExp('\\[([\u4e00-\u9fa5a-zA-Z0-9]+)\\]', 'g');
		var regex_topic = new RegExp('#[\u4e00-\u9fa5a-zA-Z0-9]+#', 'g');
		//含表情或话题
		var content = null;
		if (Ti.App.is_android){
				var content = Ti.UI.createWebView({
					height : Ti.UI.SIZE,
					top : __l(6),
					right : 0,
					left : 0,
					bottom : 2,
					backgroundColor : "transparent",
					font : {
						fontSize : __l(18)
					},
					//url: "/post.html"
					html:  Mamashai.ui.filter_html(json.content, "detail")
				});
		}
		else if (!Ti.App.is_android || json.content.match(regex_face) || json.content.match(regex_topic)){
				var content = StyledLabel.createLabel({
				//var content = Ti.UI.createLabel({
					height : Ti.UI.SIZE || 'auto',
					top : __l(6),
					right : 0,
					left : 0,
					bottom : 2,
					backgroundColor : "transparent",
					font : {
						fontSize : __l(18)
					},
					html : "<html><body>" + Mamashai.ui.filter_html(json.content, "detail") + "</body></html>"
				});
				content.addEventListener("click", function(e) {
					if (e.url) {
						if (e.url.indexOf('topic:') >= 0) {
							text = decodeURI(e.url.replace("topic:", ""));
							text = text.replace(/%23/g, "");
							Titanium.App.fireEvent("open_topic", {
								value : text
							});
						} else if (e.url.indexOf('url:') >= 0) {
							text = decodeURI(e.url.replace("url:", ""));
							Titanium.App.fireEvent("open_url", {
								url : text
							});
						}
						return false;
					}
				});
			}
			else{
				var content = Ti.UI.createLabel({
					height : Ti.UI.SIZE || 'auto',
					top : __l(6),
					right : 0,
					left : 0,
					bottom : 2,
					color: "#333",
					backgroundColor : "transparent",
					font : {
						fontSize : __l(18)
					},
					html : json.content
				});
		}
				
		post.add(content);
		
		//有图片
		if (json.post_logos && json.post_logos.length > 1) {//多图
			var logo_wrapper = Ti.UI.createView({
				left : 0,
				width : __l(290),
				top : __l(2),
				bottom : 6,
				height : Ti.UI.SIZE,
				layout : 'horizontal',
				touchEnabled : Ti.App.is_android ? false : true
			});
			if (json.post_logos.length == 4){
				logo_wrapper.width = __l(220);
			}
			var logo_paths = new Array();
			for (var i = 0; i < json.post_logos.length; i++) {
				logo_paths.push(Ti.App.aliyun + encodeURI(Titanium.Network.networkTypeName.toLowerCase()  == 'wifi' ? json.post_logos[i].logo_url : json.post_logos[i].logo_url_thumb400));
			}
			for (var i = 0; i < json.post_logos.length; i++) {
				var logo = Ti.UI.createImageView({
					left : __l(6),
					top : __l(6),
					width : __l(90),
					height : __l(90),
					image : Ti.App.aliyun + encodeURI(json.post_logos[i].logo_url_thumb200),
					json : json.post_logos[i],
					index: i,
					hires : Ti.App.is_ipad ? false : true
				});
				logo.addEventListener("click", function(e) {
					galary_browse(logo_paths, e.source.index);
				});
				logo_wrapper.add(logo);
			}
			post.add(logo_wrapper);
		} else if (json.logo_url && json.from == "taotaole" && json.tao_product) {//购放心
			//var product_json = json.tao_product
			var picture_wrapper = Ti.UI.createView({
				top : __l(4),
				bottom : __l(0),
				width : __l(240),
				height : Ti.UI.SIZE,
				borderWidth : 1,
				layout : 'vertical',
				borderColor : "#ccc"
			});
			var picture = Ti.UI.createImageView({
				top : __l(5),
				left : __l(5),
				right : __l(5),
				bottom : __l(5),
				width : __l(230),
				height : Ti.UI.SIZE,
				hires : true,
				zIndex : 1,
				json : json.tao_product,
				image : Ti.App.mamashai + json.logo_url_thumb400
			});
			picture.addEventListener("click", function(e) {
				Ti.App.fireEvent("open_url", {
					url : e.source.json.short_url,
					title : "手机淘宝网 - " + e.source.json.name
				});
			});
	
			picture_wrapper.add(picture);
	
			var label_wrapper = Ti.UI.createView({
				top : __l(0),
				left : __l(4),
				right : __l(4),
				height : Ti.UI.SIZE
			});
			label_wrapper.addEventListener("click", function(e) {
				picture.fireEvent("click");
			});
			var price = Ti.UI.createLabel({
				left : __l(0),
				top : __l(0),
				bottom : __l(0),
				height : __l(46),
				font : {
					fontSize : __l(14),
					fontWeight : 'bold'
				},
				width : __l(58),
				color : Ti.App.bar_color,
				text : "￥" + json.tao_product.price,
				textAlign : 'center'
			});
			label_wrapper.add(price);
			var title = Ti.UI.createLabel({
				left : __l(58),
				right : __l(14),
				top : __l(0),
				bottom : __l(5),
				height : __l(46),
				font : {
					fontSize : __l(11)
				},
				color : "#333",
				text : json.tao_product.name,
				textAlign : 'left'
			});
			label_wrapper.add(title)
	
			var right = Ti.UI.createImageView({
				top : __l(15),
				right : __l(0),
				bottom : __l(5),
				width : __l(10),
				height : __l(26),
				hires : true,
				image : "./images/red_right.png"
			})
			label_wrapper.add(right)
	
			picture_wrapper.add(label_wrapper)
			post.add(picture_wrapper)
		} else if (json.logo_url) {//一般的
			var logo_wrapper = Ti.UI.createView({
				left : 2,
				bottom : 4,
				height : __l(140),
				width : Ti.App.is_android ? Ti.UI.SIZE : __l(140),
				top : __l(4)
			});
	
			var logo = Ti.UI.createImageView({
				left : 0,
				bottom : 0,
				height : __l(140),
				top : 0,
				zIndex : 1,
				defaultImage : "/images/default.gif",
				image : Ti.App.aliyun + encodeURI(json.logo_url_thumb400),
				hires : Ti.App.is_ipad ? false : true
			});
	
			if (Ti.App.is_android) {
				logo.opacity = 0;
				logo.addEventListener("load", function(e) {
					e.source.animate({
						opacity : 1,
						duration : 500
					});
				});
			}
	
			logo_wrapper.add(logo);
	
			if (json.from == "dianping" && json.place_comment) {
				logo.height = __l(100);
				var product_wrapper = Ti.UI.createView({
					left : __l(150),
					top : __l(0),
					height : __l(120),
					right : __l(2),
					width : __l(280),
					layout : 'vertical',
					zIndex : 100
				});
	
				var wrapper1 = Ti.UI.createView({
					left : 0,
					right : 0,
					top : __l(0),
					height : Ti.UI.SIZE
				});
				product_wrapper.add(wrapper1);
				wrapper1.add(Ti.UI.createImageView({
					left : __l(10),
					image : "/images/poi.png",
					width : __l(16),
					height : __l(16),
					top : __l(2)
				}));
	
				var button = Ti.UI.createLabel({
					left : __l(28),
					top : __l(0),
					text : json.place_comment.place.name,
					json : json,
					color : Ti.App.bar_color,
					font : {
						fontSize : __l(14)
					}
				});
				button.addEventListener("touchstart", function(e) {
					e.source.backgroundColor = "#ccc"
				});
				button.addEventListener("touchend", function(e) {
					e.source.backgroundColor = "transparent"
				});
				button.addEventListener("click", function(e) {
					var json = JSON.parse(e.source.json.place_comment.place.json);
					function call_qinzi_detail(code, json) {
						var DetailWin = eval(code);
						var detail_win = new DetailWin({
							backButtonTitle : "",
							backgroundColor : "white",
							json : json
						});
						Ti.App.currentTabGroup.activeTab.open(detail_win, {
							animated : true
						});
					}
	
					var record = require('/lib/mamashai_db').db.select_with_check("qinzi_detail", 0);
					if (record.blank) {
						var url = Ti.App.mamashai + "/api/statuses/qinzi_detail?osname=" + Ti.App.osname + "&osversion=" + Ti.App.osversion + "&appversion=" + Titanium.App.version;
						http_call(url, function(e1) {
							call_qinzi_detail(e1.responseText, json);
							require('/lib/mamashai_db').db.insert_json('qinzi_detail', 0, e1.responseText);
						});
					} else {
						call_qinzi_detail(record.json, json);
					}
				});
				wrapper1.add(button);
	
				var wrapper2 = Ti.UI.createView({
					left : 0,
					right : 0,
					top : __l(6),
					height : Ti.UI.SIZE
				});
				product_wrapper.add(wrapper2);
				wrapper2.add(Ti.UI.createLabel({
					left : __l(10),
					top : __l(0),
					text : "星级：",
					color : "#666",
					font : {
						fontSize : __l(11)
					}
				}));
	
				wrapper2.add(Ti.UI.createImageView({
					left : __l(44),
					image : json.place_comment.place.rating_s_img_url,
					width : __l(70),
					height : __l(12),
					top : __l(2)
				}));
	
				if (json.place_comment.qinzi && json.place_comment.qinzi.length > 0) {
					var wrapper3 = Ti.UI.createView({
						left : 0,
						right : 0,
						layout : 'horizontal',
						top : __l(6),
						height : Ti.UI.SIZE
					});
					product_wrapper.add(wrapper3);
					wrapper3.add(Ti.UI.createLabel({
						left : __l(10),
						top : __l(0),
						text : "亲子设施：",
						color : "#666",
						font : {
							fontSize : __l(11)
						}
					}));
	
					var names = "儿童餐椅,儿童餐饮,儿童游乐场,宝宝玩具,儿童床,儿童游泳池,哺乳室,儿童马桶,无亲子设施".split(",");
					var names1 = json.place_comment.qinzi.replace(/^,/, '').split(",");
					for (var i = 0; i < names1.length; i++) {
						for (var j = 0; j < names.length; j++) {
							if (names1[i] == names[j]) {
								wrapper3.add(Ti.UI.createImageView({
									left : __l(4),
									top : __l(0),
									height : __l(12),
									width : __l(12),
									hires : true,
									image : "/images/dianping/c" + (j + 1) + ".png"
								}));
							}
						}
					}
				}
	
				if (json.place_comment.shiyi && json.place_comment.shiyi.length > 0) {
					var wrapper4 = Ti.UI.createView({
						left : 0,
						right : 0,
						top : __l(6),
						layout : 'horizontal',
						height : Ti.UI.SIZE
					});
					product_wrapper.add(wrapper4);
					wrapper4.add(Ti.UI.createLabel({
						left : __l(10),
						top : __l(0),
						text : "适宜宝宝：",
						color : "#666",
						font : {
							fontSize : __l(11)
						}
					}));
					var names = ["0~3岁", "3~6岁", "6岁以上", "孕期", "不适宜宝宝"];
					var names1 = json.place_comment.shiyi.replace(/^,/, '').split(",");
					for (var i = 0; i < names1.length; i++) {
						for (var j = 0; j < names.length; j++) {
							if (names1[i] == names[j]) {
								wrapper4.add(Ti.UI.createImageView({
									left : __l(4),
									top : __l(0),
									height : __l(12),
									width : __l(12),
									hires : true,
									image : "/images/dianping/c" + (j + 10) + ".png"
								}));
							}
						}
					}
				}
	
				if (json.place_comment.qx && json.place_comment.qx.length > 0) {
					var wrapper5 = Ti.UI.createView({
						left : 0,
						right : 0,
						top : __l(6),
						layout : 'horizontal',
						height : Ti.UI.SIZE
					});
					product_wrapper.add(wrapper5);
					wrapper5.add(Ti.UI.createLabel({
						left : __l(10),
						top : __l(0),
						text : "宝宝情绪：",
						color : "#666",
						font : {
							fontSize : __l(11)
						}
					}));
					var names = ["开心", "安静", "活跃", "留恋", "哭闹", "烦躁"];
					var names1 = json.place_comment.qx.replace(/^,/, '').split(",");
					for (var i = 0; i < names1.length; i++) {
						for (var j = 0; j < names.length; j++) {
							if (names1[i] == names[j]) {
								wrapper5.add(Ti.UI.createImageView({
									left : __l(4),
									top : __l(0),
									height : __l(12),
									width : __l(12),
									hires : true,
									image : "/images/dianping/c" + (j + 15) + ".png"
								}));
							}
						}
					}
				}
	
				logo_wrapper.width = __l(300);
				logo_wrapper.add(product_wrapper);
			}
	
			if (json.video_path) {
				logo.addEventListener("load", function(e) {
					var width = logo.rect.width;
					if (width > 1500 || width < 10)
						width = __l(140);
					var shadow = Ti.UI.createImageView({
						top : __l(50),
						//bottom: __l(20),
						//left : __l(10),
						left : (width - __l(40)) / 2 < 0 ? __l(20) : (width - __l(40)) / 2,
						//right : __l(10),
						width : __l(40),
						height : __l(40),
						image : "/images/video_mask.png",
						zIndex : 11,
						touchEnabled : false
					});
					logo_wrapper.add(shadow);
				});
			}
	
			post.add(logo_wrapper);
			logo.addEventListener("click", function() {
				if (json.video_path) {
					Titanium.App.fireEvent("playVideo", {
						url : json.video_path,
						win : win
					});
				} else {
					Ti.App.fireEvent("showPicture", {
						src : "http://www.mamashai.com" + encodeURI(Titanium.Network.networkTypeName.toLowerCase() == "wifi" ? json.logo_url : json.logo_url_thumb400),
						thumb_src : "http://www.mamashai.com" + encodeURI(json.logo_url_thumb120)
					});
				}
			});
		}
	
		if (json.forward_post) {
			var forward_wrapper = Ti.UI.createView({
				height : Ti.UI.SIZE
			});
			var forward_jian = Ti.UI.createImageView({
				width : __l(11),
				height : __l(9),
				left : __l(30),
				top : __l(4),
				image : "/images/jian.png"
			});
			forward_wrapper.add(forward_jian);
	
			var forward = Ti.UI.createView({
				height : Ti.UI.SIZE,
				left : 0,
				top : __l(13),
				bottom : __l(4),
				right : __l(4),
				border : __l(1),
				borderRadius : __l(4),
				backgroundColor : "#eee",
				borderColor : "#eee",
				layout : 'vertical',
				zIndex : 1
			});
	
			var forward_content = createEmojiLabel({
				top : __l(8),
				left : __l(8),
				right : __l(8),
				bottom : __l(0),
				height : Ti.UI.SIZE,
				font : {
					fontSize : Titanium.Platform.osname == 'ipad' ? 24 : __l(15)
				},
				color : "#333",
				text : "@" + json.forward_user.name + "： " + json.forward_post.content
			});
			forward.add(forward_content);
	
			if (json.forward_post.post_logos && json.forward_post.post_logos.length > 1) {//多图
				var logo_wrapper = Ti.UI.createView({
					left : __l(4),
					right : 0,
					top : __l(8),
					bottom : 0,
					height : Ti.UI.SIZE,
					touchEnabled : Ti.App.is_android ? false : true
				});
				forward.add(logo_wrapper);
				logo_wrapper.layout = 'horizontal';
				logo_wrapper.width = __l(320);
				var logo_paths = new Array();
				for (var i = 0; i < json.forward_post.post_logos.length; i++) {
					logo_paths.push(Ti.App.aliyun + encodeURI(Titanium.Network.networkTypeName.toLowerCase()  == 'wifi' ? json.forward_post.post_logos[i].logo_url : json.forward_post.post_logos[i].logo_url_thumb400));
				}
				for (var i = 0; i < json.forward_post.post_logos.length; i++) {
					var logo = Ti.UI.createImageView({
						left : __l(6),
						top : __l(6),
						width : __l(90),
						height : __l(90),
						image : Ti.App.aliyun + encodeURI(json.forward_post.post_logos[i].logo_url_thumb200),
						json : json.forward_post.post_logos[i],
						index: i,
						hires : Ti.App.is_ipad ? false : true
					});
					logo.addEventListener("click", function(e) {
						galary_browse(logo_paths, e.source.index);
					});
					logo_wrapper.add(logo);
				}
			} else if (json.forward_post.logo_url) {
				var forward_logo = Ti.UI.createImageView({
					left : __l(4),
					bottom : __l(6),
					//width: Ti.UI.SIZE,
					//height : __l(120),
					width : __l(120),
					height : Ti.UI.SIZE,
					defaultImage : "/images/default.gif",
					image : "http://www.mamashai.com" + encodeURI(json.forward_post.logo_url_thumb400),
					hires : true
				});
	
				forward.add(forward_logo);
				forward_logo.addEventListener("click", function() {
					Ti.App.fireEvent("showPicture", {
						src : "http://www.mamashai.com" + encodeURI(json.forward_post.logo_url_thumb400),
						thumb_src : "http://www.mamashai.com" + encodeURI(json.forward_post.logo_url_thumb400)
					})
				})
				if (json.forward_post.from == 'taotaole' && json.forward_post.tao_product) {
					var product_wrapper = Ti.UI.createView({
						left : __l(130),
						top : __l(0),
						height : __l(80),
						right : __l(10),
						json : json.forward_post.tao_product
					})
					product_wrapper.addEventListener("click", function(e) {
						Ti.App.fireEvent("open_url", {
							title : e.source.json.name,
							url : e.source.json.short_url
						})
					})
					var product_title = Ti.UI.createLabel({
						top : __l(5),
						right : __l(0),
						left : __l(0),
						height : Ti.UI.SIZE,
						font : {
							fontSize : Titanium.Platform.osname == 'ipad' ? 17 : __l(11)
						},
						color : "#999",
						touchEnabled : false,
						text : json.forward_post.tao_product.name
					})
	
					var product_price = Ti.UI.createLabel({
						//bottom: __l(5),
						top : __l(40),
						right : __l(10),
						left : __l(0),
						height : Ti.UI.SIZE,
						font : {
							fontSize : Titanium.Platform.osname == 'ipad' ? 19 : __l(16)
						},
						textAlign : 'left',
						color : Ti.App.bar_color,
						touchEnabled : false,
						text : "￥" + json.forward_post.tao_product.price
					})
					product_wrapper.add(product_title)
					product_wrapper.add(product_price)
					logo_wrapper.add(product_wrapper)
				}
			}
	
			var orig_view = Ti.UI.createView({
				height : __l(26),
				bottom : __l(10)
			})
	
			var orig_forward = Ti.UI.createButton({
				title : '原文转晒' + (json.forward_post.forward_posts_count > 0 ? ' (' + json.forward_post.forward_posts_count + ')' : ''),
				top : __l(8),
				right : Titanium.Platform.osname == 'ipad' ? 120 : __l(90),
				width : Titanium.Platform.osname == 'ipad' ? 110 : __l(80),
				height : __l(20),
				backgroundColor : "transparent",
				color : Ti.App.bar_color,
				font : {
					fontSize : Ti.Platform.osname == 'ipad' ? 17 : __l(14)
				},
				style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			orig_forward.addEventListener('click', function() {
				if (!check_login()) {
					to_login();
					return;
				}
	
				var forward_xhr = Ti.Network.createHTTPClient()
				forward_xhr.timeout = Ti.App.timeout
				forward_xhr.onerror = function() {
				}
				forward_xhr.onload = function() {
					hide_loading();
					var json = JSON.parse(this.responseText);
	
					show_window("forward", {
						json : json,
						id : json.id,
						title : "转晒"
					});
				}
	
				forward_xhr.open('GET', Ti.App.mamashai + '/api/statuses/show?id=' + json.forward_post.id)
				forward_xhr.send();
				show_loading();
			});
			var orig_comment = Ti.UI.createButton({
				title : '原文评论' + (json.forward_post.comments_count > 0 ? ' (' + json.forward_post.comments_count + ')' : ''),
				top : __l(8),
				right : __l(10),
				width : Titanium.Platform.osname == 'ipad' ? 120 : __l(80),
				height : __l(20),
				backgroundColor : "transparent",
				color : Ti.App.bar_color,
				font : {
					fontSize : Ti.Platform.osname == 'ipad' ? 17 : __l(14)
				},
				style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			orig_comment.addEventListener('click', function() {
				if (!check_login()) {
					to_login();
					return;
				}
				var forward_xhr = Ti.Network.createHTTPClient()
				forward_xhr.timeout = Ti.App.timeout
				forward_xhr.onerror = function() {
				}
				forward_xhr.onload = function() {
					hide_loading();
					var json = JSON.parse(this.responseText);
	
					var win = Titanium.UI.createWindow({
						json : json,
						id : json.id,
						title : "记录详情",
						backgroundColor : 'white'
					});
	
					pre(win)
					
					Mamashai.ui.make_post_win(win);
					
					win.backButtonTitle = '';
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				}
				forward_xhr.open('GET', Ti.App.mamashai + '/api/statuses/show?id=' + json.forward_post.id)
				forward_xhr.send();
				show_loading();
			})
	
			orig_view.add(orig_forward)
			orig_view.add(orig_comment)
	
			forward.add(orig_view)
			forward_wrapper.add(forward)
			post.add(forward_wrapper);
		}
	
		var comment_view = Ti.UI.createView({
			top : __l(4),
			left : (Ti.App.platform_width - __l(320)) / 2,
			right : (Ti.App.platform_width - __l(320)) / 2,
			width : __l(320),
			height : __l(48)
		});
	
		function create_icon_button(image, left, top, callback){
			var comment_wrapper = Ti.UI.createView({
				top: top,
				width: Ti.App.is_ipad ? 44 : __l(44),
				left : left,
			});
			var img = Ti.UI.createImageView({
				top: Ti.App.is_android ? __l(7) : __l(9),
				left: Ti.App.is_ipad ? 0 : (Ti.App.is_android ? __l(7) : __l(9)),
				width: Ti.App.is_ipad ? 44 : (Ti.App.is_android ? __l(30) : __l(26)),
				height: Ti.App.is_ipad ? 44 : (Ti.App.is_android ? __l(30) : __l(26)),
				image: image,
				touchEnabled: false
			});
			comment_wrapper.img = img;
			comment_wrapper.add(img);
			comment_wrapper.addEventListener("touchstart", function(e){
				e.source.opacity = 0.5;
			});
			comment_wrapper.addEventListener("touchend", function(e){
				e.source.opacity = 1;
				e.source.img.opacity = 1;
			});
			comment_wrapper.addEventListener("touchcancel", function(e){
				e.source.opacity = 1;
				e.source.img.opacity = 1;
			});
			comment_wrapper.addEventListener("click", function(e){
				callback(e);
			});
			return comment_wrapper;
		}
		
		comment_view.add(create_icon_button("/images/hart@4x-100.png", __l(10), __l(2), function(e){
			if (!check_login()) {
				to_login();
				return;
			}
	
			var shadow = Ti.UI.createImageView({
				top : __l(2),
				left : __l(30),
				width : __l(22),
				height : __l(22),
				image : "/images/hart" + Ti.App.pic_sufix + ".png",
				zIndex : 10
			});
			comment_view.add(shadow);
	
			var t = Titanium.UI.create2DMatrix();
			var animate = Titanium.UI.createAnimation({
				transform : t,
				height : 40,
				width : 40,
				opacity : 0,
				duration : 500
			});
			animate.addEventListener('complete', function() {
	
			});
			shadow.animate(animate);
	
			url = Ti.App.mamashai + "/api/statuses/clap.json?id=" + win.id + "&" + account_str();
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout
			xhr.onload = function() {
				var json = JSON.parse(this.responseText)
				clap_count.text = json.claps_count
			};
			xhr.open('POST', url);
			xhr.send();
			clap_count.text = parseInt(clap_count.text);
			e.source.touchEnabled = false;
			e.source.opacity = 0.5;
		}));
		
		var clap_count = Ti.UI.createLabel({
			top : __l(12),
			left : __l(56),
			height : __l(20),
			font : {
				fontSize : __l(13)
			},
			color : "#777",
			text : json.claps_count
		});
		
		comment_view.add(create_icon_button("/images/zhuanfa@4x-100.png", __l(122), __l(2), function(e){
			if (!check_login()) {
				to_login();
				return;
			}
			
			show_window("forward", {
				json : json,
				id : json.id,
				title : "转晒"
			});
		}));
	
		var forward_count = Ti.UI.createLabel({
			top : __l(12),
			left : __l(168),
			height : __l(20),
			font : {
				fontSize : __l(13)
			},
			color : "#777",
			text : json.forward_posts_count
		});
	
		comment_view.add(create_icon_button("/images/pinglun@4x-100.png", __l(226),  __l(2), function(e){
			if (!check_login()) {
				to_login();
				return;
			}
	
			show_window("comment", {
				json : json,
				id : json.id,
				title : "评论"
			});
		}));
		
		function add_forward(e) {
			if (e.id == json.id) {
				forward_count.text = parseInt(forward_count.text) + 1;
			}
		}
	
		Ti.App.addEventListener("add_forward", add_forward);
	
		function add_comment(e) {
			if (e.id == win.json.id) {
				var comment_wrapper = make_post_comment_row(e.json);
				comments.add(comment_wrapper);
			}
		}
	
		Ti.App.addEventListener("add_comment", add_comment)
		win.addEventListener("close", function(e) {
			Ti.App.removeEventListener("add_forward", add_forward)
			Ti.App.removeEventListener("add_comment", add_comment)
		});
		var comment_count = Ti.UI.createLabel({
			top : __l(12),
			left : __l(272),
			height : __l(20),
			font : {
				fontSize : __l(13)
			},
			color : "#777",
			text : json.comments_count
		});
	
		//comment_view.add(heart_pic);
		comment_view.add(clap_count);
		//comment_view.add(forward_pic);
		comment_view.add(forward_count);
		//comment_view.add(comment_pic);
		comment_view.add(comment_count);
		post.add(comment_view);
		
		if (Ti.App.Properties.getString("is_mms_admin", "false") == "true"){	//是管理员
				var admin_wrapper = Ti.UI.createView({
					height: Ti.UI.SIZE,
					layout: 'horizontal',
					backgroundColor: "red"
				});
				var recommand_hot = Ti.UI.createButton({
					title: '热点',
					font: {fontSize: __l(14)},
					left: __l(20),
					height: __l(28),
					width: __l(70),
					top: __l(10),
					bottom: __l(10)
				});
				recommand_hot.addEventListener("click", function(e){
					var optionsDialogOpts = {
						options : ['20', '40', '60', '120', '200', '置顶', '沉底', '取消'],
						cancel : 7
					};
			
					var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
					dialog.addEventListener("click", function(e){
						var score = 0;
						if (e.index < 5){
							score = optionsDialogOpts.options[e.index];
						}
						else if(e.index == 5){
							score = 1000;
						}
						else if (e.index == 6){
							score = -1000;
						}
						
						if (score == 0)
							return;
							
						http_call(Ti.App.mamashai + "/api/admin/recommand/" + json.id + "?score=" + score + "&" + account_str(), function(e){
							win.close();
							show_notice(e.responseText);
						});
					});
					dialog.show();
				});
				pre_btn(recommand_hot);
				
				var delete_post = Ti.UI.createButton({
					title: '删除',
					font: {fontSize: __l(14)},
					left: __l(20),
					height: __l(28),
					width: __l(70),
					top: __l(10),
					bottom: __l(10)
				});
				delete_post.addEventListener("click", function(e){
					var alert_dialog = Titanium.UI.createAlertDialog({
						title : '提示',
						message : '确定要删除本记录吗？',
						buttonNames : ['取消', '确定'],
						cancel : 0
					});
					alert_dialog.addEventListener("click", function(e){
						if (e.index == 1){
							http_call(Ti.App.mamashai + "/api/admin/delete_post/" + json.id + "?" + account_str(), function(e){
								win.close();
								show_notice(e.responseText);
							});
						}
					});
					alert_dialog.show();
				});
				pre_btn(delete_post);
				
				var private_post = Ti.UI.createButton({
					title: '私有',
					font: {fontSize: __l(14)},
					left: __l(20),
					height: __l(28),
					width: __l(70),
					top: __l(10),
					bottom: __l(10)
				});
				private_post.addEventListener("click", function(e){
					var alert_dialog = Titanium.UI.createAlertDialog({
						title : '提示',
						message : '确定要将记录私有吗？',
						buttonNames : ['取消', '确定'],
						cancel : 0
					});
					alert_dialog.addEventListener("click", function(e){
						if (e.index == 1){
							http_call(Ti.App.mamashai + "/api/admin/private_post/" + json.id + "?" + account_str(), function(e){
								win.close();
								show_notice(e.responseText);
							});
						}
					});
					alert_dialog.show();
				});
				pre_btn(private_post);
				
				admin_wrapper.add(recommand_hot);
				admin_wrapper.add(delete_post);
				admin_wrapper.add(private_post);
				post.add(admin_wrapper);
		}
	
	
		if (Ti.App.is_android){
			var ypos = 0;
			var intervalIsRunning = false;
			var yposPrevious = 0;
			scroll_view.addEventListener('scroll', function(e) {
			    ypos = e.y;
			    if (!intervalIsRunning) {
			        intervalIsRunning = true;
			        var i = setInterval(function() {
			            if (yposPrevious != ypos) {
			                yposPrevious = ypos; 
			            } else {
			                clearInterval(i);
			                intervalIsRunning = false;
			                
			                scroll_view.fireEvent("scrollEnd", {});
			            }
			        }, 500);
			    }
			 
			});
		}

		scroll_view.addEventListener("scrollEnd", function(e){
			var height = post.rect.height;
			
			if (height - Ti.App.platform_height - scroll_view.contentOffset.y < __l(200)){
				if (comments.no_more){
					return;
				}
				
				loading_actInd.show();
				
				comment_xhr.open('GET', comment_url + "?page=" + comment_page)
				comment_xhr.send();
			}
		});
			
		var comments = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'vertical',
			left : 0,
			top : 0,
			right : 0,
			bottom : __l(40)
		});
		
		post.add(comments);
		
		var loading_actInd = Titanium.UI.createActivityIndicator({
			style : !Ti.App.is_android ? Titanium.UI.iPhone.ActivityIndicatorStyle.DARK : Titanium.UI.ActivityIndicatorStyle.BIG,
			left: (Ti.App.platform_width - __l(20))/2,
			bottom: __l(8),
			width: __l(20),
			height : __l(20),
			zIndex: 100
		});
		
		win.add(loading_actInd);
	
		var comment_xhr = Ti.Network.createHTTPClient();
		comment_xhr.timeout = Ti.App.timeout;
		comment_xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			var json_size = json.comments.length;
			
			if (!this.responseText || this.responseText.length == 0 || this.responseText == "null" || json.comments.size == 0) {
				comments.no_more = true;
				return;
			}
	
			if (comment_page == 1)
				comment_count.text = json.total_entries + "";
			var w = Ti.UI.createView({
				height : Ti.UI.SIZE,
				layout : 'vertical',
				left : 0,
				top : 0,
				right : 0,
			});
	
			for (var i = 0; i < json_size; i++) {
				comment = json.comments[i];
				var row_wrapper = make_post_comment_row(comment);
				w.add(row_wrapper);
			}
			loading_actInd.hide();
			comments.add(w);
			if (json.has_more) {
				comment_page += 1;
			}
			else{
				comments.no_more = true;
			}
		};
		var comment_url = Ti.App.mamashai + '/api/statuses/comments_and_like2/' + win.json.id;
		var comment_page = 1;
		comment_xhr.open('GET', comment_url + "?page=" + comment_page);
		win.addEventListener("open", function(e){
			comment_xhr.send();
		});
		
	
		function set_height(e) {
			if (win.id != e.id)
				return;
	
			if (Ti.App.is_android) {
				content.height = __l(e.height) + 3;
			} else {
				content.height = e.height + 3;
			}
		}
	
	
		Ti.App.addEventListener("set_height", set_height)
		
		win.addEventListener("close", function() {
			Ti.App.removeEventListener("set_height", set_height)
		});
		
		scroll_view.add(post);
		win.add(scroll_view);
	
		logEvent('post', {
			id : win.id
		});
	//});
};

module.exports = Mamashai
