function Qinzi(attr){
	var dianping_appkey = "32976344";
	var dianping_secret = "cdb4a7a5ff514ec3b699d5fde142d9b7";
		
	Ti.include("public.js");

	var EARTH_RADIUS = 6378137.0; //单位M 
	var PI = Math.PI; 

	function getRad(d){ 
	return d*PI/180.0; 
	} 

	function getGreatCircleDistance(lat1,lng1,lat2,lng2){ 
		var radLat1 = getRad(lat1); 
		var radLat2 = getRad(lat2); 

		var a = radLat1 - radLat2; 
		var b = getRad(lng1) - getRad(lng2); 

		var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2))); 
		s = s*EARTH_RADIUS; 
		s = Math.round(s*10000)/10000.0; 

		return parseInt(s); 
	} 

	var win = Titanium.UI.createWindow(attr);
	win.backgroundColor = "#F5F5F5";
	win.city = null;
	
	var wrapper = Ti.UI.createScrollView({
		top: 0,
		left: 0, 
		right: 0,
		bottom: 0,
		layout: 'vertical',
		showVerticalScrollIndicator: true
	});
	win.add(wrapper);
	
	var search_wrapper = Ti.UI.createView({
		backgroundColor : "#ededed",
		top: 0,
		left: 0,
		right: 0,
		height: __l(40)
	});
	var city_label = Ti.UI.createLabel({
		font: {fontSize: __l(14)},
		color: "#333",
		left: __l(10),
		height: __l(40)
	});
	var search_bar = Ti.UI.createSearchBar({
		top: Ti.App.is_android ? 0 : __l(5),
		left: __l(0),
		right: 0,
		backgroundColor: 'transparent',
		barColor: "#ededed",
		hintText: '输入您要搜索的内容',
		showCancel : Ti.App.is_android ? false : true,
		borderWidth: 1,
		borderColor: '#eee',
		height: Ti.App.is_android ? __l(40) : __l(30),
	});
	
	if (Ti.App.is_android){
		search_bar.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
		setTimeout(function(){
			search_bar.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}, 2000)
	}

	search_bar.addEventListener("cancel", function(e){
		search_bar.blur();
	});
	search_bar.addEventListener("return", function(e){
		search(e.source.value, win.city || "北京", win.district || "海淀", win.longitude, win.latitude);
	});
	search_wrapper.add(city_label);
	search_wrapper.add(search_bar);
	
	wrapper.add(search_wrapper);
	
	
	function add_category(cate_name, sub_cates){
		wrapper.add(Ti.UI.createLabel({
			font: {fontSize: __l(14), fontWeight: 'bold'},
			color: "#EE6260",
			text: cate_name,
			left: __l(10),
			top: __l(6)
		}));
		var sub_wrapper = Ti.UI.createView({
			backgroundColor: 'white',
			borderColor: "#EDEDED",
			borderWidth: 1,
			left: __l(8),
			width: Ti.UI.SIZE,
			top: __l(6),
			bottom: __l(6),
			layout: 'horizontal',
			height: Ti.UI.SIZE
		});
		for(var i=0; i<sub_cates.length; i++){
			var label = Ti.UI.createLabel({
				text: sub_cates[i],
				//title: sub_cates[i],
				font: {fontSize: __l(12)},
				height: __l(30),
				width: Ti.App.is_ipad ? __l(122) : __l(102),
				left: -1,
				top: -1,
				zIndex: i,
				textAlign: 'center',
				borderWidth: 1,
				borderColor: "#ededed",
				backgroundColor: 'transparent',
				color: '#333',
			});
			
			label.addEventListener("touchstart", function(e){
				e.source.backgroundColor = "#ededed";
			});
			label.addEventListener("touchend", function(e){
				e.source.backgroundColor = "transparent";
			});
			label.addEventListener("touchcancel", function(e){
				e.source.backgroundColor = "transparent";
			});
			label.addEventListener("click", function(e){
				//alert(e.source.text);
				search(e.source.text, win.city || "北京", win.district || "海淀", win.longitude, win.latitude);
			});
			
			sub_wrapper.add(label);
		}
		wrapper.add(sub_wrapper);
	}
	
	add_category("美食餐厅", ["自助餐", "咖啡厅", "西餐", 
							 "面包甜点", "比萨", "汉堡", 
							 "火锅", "烧烤", "快餐",
							 "海鲜", "比萨", "主题餐厅"]);
	add_category("休闲娱乐", ["景点郊游", "公园", "亲子乐园",
							"博物馆", "电影院", "演出场馆", 
							"美术馆", "游泳馆", "羽毛球馆", 
							"武术场馆", "乒乓球馆", "足球场"]);
	add_category("生活服务", ["亲子摄影", "月嫂", "家政", 
							 "超市/便利店", "药店", "鲜花店", 
							 "干洗店", "美发", "ATM"]);
	add_category("教育服务", ["孕产护理", "月子服务", "产后恢复", 
							 "早教中心", "幼儿园", "小学", 
							 "婴儿游泳", "绘本", "特殊教育",
							 "幼儿外语", "幼儿才艺", "亲子服务"]);

	function isIPhone3_2_Plus()
	{
		// add iphone specific tests
		if (Titanium.Platform.name == 'iPhone OS')
		{
			var version = Titanium.Platform.version.split(".");
			var major = parseInt(version[0],10);
			var minor = parseInt(version[1],10);
			
			// can only test this support on a 3.2+ device
			if (major > 3 || (major == 3 && minor > 1))
			{
				return true;
			}
		}
		return false;
	}
	Ti.Geolocation.preferredProvider = "gps";
	if (isIPhone3_2_Plus())
	{
		Ti.Geolocation.purpose = "亲子地点定位";
	}

	if (Titanium.Geolocation.locationServicesEnabled === false){
		show_notice("对不起，您没有打开手机定位功能");
	}
	else{
		if (!Ti.App.is_android){
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			Ti.API.info('Authorization: '+authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				Ti.API.log("Titanium.Geolocation.AUTHORIZATION_DENIED")
			}
			else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				Ti.API.log("Titanium.Geolocation.AUTHORIZATION_RESTRICTED")
			}
		}
		
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		function locationCallback(e){
			if (e.coords){
				win.longitude = e.coords.longitude;
				win.latitude = e.coords.latitude;
			}
		}
		Titanium.Geolocation.addEventListener('location', locationCallback);
		setTimeout(function(e){
			Titanium.Geolocation.removeEventListener('location', locationCallback);
		}, 100*1000)
		win.addEventListener('open', function() {
			Titanium.Geolocation.getCurrentPosition(function(e)
			{
				if (!e.success || e.error)
				{
					Ti.API.log('error ' + JSON.stringify(e.error));
					return;
				}
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				//var text = '2 long:' + longitude + ' lat: ' + latitude;
				//alert(text);
				var url = "https://api.weibo.com/2/location/geo/geo_to_address.json?coordinate=" + longitude + "%2C" + latitude + "&access_token=2.00xneWLCdRvYuDc6e01c7c40yh76DB";
				
				http_call(url, function(e){
					var json = JSON.parse(e.responseText);
					Ti.API.log(json)
					win.city 	 = json.geos[0].city_name;
					if (win.city.length > 0)
						search_bar.left = __l(60);

					city_label.text = json.geos[0].city_name;
					win.province = json.geos[0].province_name;
					win.district = json.geos[0].district_name;
					win.address  = json.geos[0].address;
					win.longitude= json.geos[0].longitude;
					win.latitude = json.geos[0].latitude;

					if (win.city[win.city.length - 1] == "市")
						win.city = win.city.substr(0, win.city.length - 1);
					
					if (win.district[win.district.length - 1] == "区")
						win.district = win.district.substr(0, win.district.length - 1);

					Ti.API.log(win.city);
					Ti.API.log(win.district);
				});
			});
		});	
	}						 
	
	function make_sign(param){
		// 对参数名进行字典排序  
		var array = new Array();  
		for(var key in param)  
		{  
			if (key != "sign")
		    	array.push(key);  
		}  
		array.sort();  
		   
		// 拼接有序的参数名-值串  
		var paramArray = new Array();  
		paramArray.push(dianping_appkey);  
		for(var index in array)  
		{  
		  var key = array[index];  
		  paramArray.push(key + param[key]);  
		}  
		paramArray.push(dianping_secret);  
		   
		var shaSource = paramArray.join(""); 
		var sign = Titanium.Utils.sha1(shaSource).toUpperCase();
		return sign;
	}
	
	function search(key, city, district, longitude, latitude){
		var search_win = Titanium.UI.createWindow({
			title: key,
			backButtonTitle: '',
			backgroundColor: 'white'
		});
		
		var tableview = Ti.UI.createTableView({
			top: 0,
			separatorColor: "#ccc", 
			backgroundColor: "white",
			bottom: __l(24)
		});
		tableview.addEventListener("click", function(e){
			if (e.rowData.tag == "get_more" || e.rowData.name == "get_more"){
				return;
			}
			
			var json = e.rowData.json;
			var detail_win = Ti.UI.createWindow({
				title : "商户详情",
				backgroundColor: 'white',
				backButtonTitle: "",
				json: json
			});

			//生成详情页
			var logo = Ti.UI.createImageView({
				image: json.s_photo_url,
				width: __l(111),
				height: __l(80),
				left: __l(10),
				top: __l(10),
				hires: true
			})
			detail_win.add(logo);

			var name = Ti.UI.createLabel({
				font: {fontSize: __l(16), fontWeight: 'bold'},
				left: __l(131),
				right: __l(10),
				top: __l(8),
				text: json.name + (json.branch_name ? "（" + json.branch_name+ "）" : "")
			})
			detail_win.add(name);

			var rate = Ti.UI.createImageView({
				image: json.rating_img_url,
				width: __l(90),
				height: __l(15),
				left: __l(131),
				top: __l(52),
				hires: true
			})
			detail_win.add(rate)

			var price = Ti.UI.createLabel({
				text: "人均：￥" + json.avg_price,
				top: __l(72),
				left: __l(131),
				font: {fontSize: __l(13)},
				touchEnabled: false,
				color: "#ccc"
			});
			detail_win.add(price)

			var wrapper = Ti.UI.createView({
				top: __l(110),
				left: 0,
				right: 0,
			})
			detail_win.add(wrapper);

			var detail_table = Ti.UI.createTableView({
				top: 0,
				left: 0,
				right: 0
			})
			if (!Ti.App.is_android){
				detail_table.style = Titanium.UI.iPhone.TableViewStyle.PLAIN
			}
			var row1 = Ti.UI.createTableViewRow({
				height: __l(50),
				selectedBackgroundColor: "#E8E8E8",
				hasChild: true
			})
			row1.add(Ti.UI.createImageView({
				image: "/images/dianpingpoi.png",
				width: __l(13),
				height: __l(24),
				left: __l(16),
				hires: true,
				touchEnabled: false
			}));
			row1.add(Ti.UI.createLabel({
				text: json.address,
				font: {fontSize: __l(16)},
				left: __l(40),
				touchEnabled: false
			}))
			row1.addEventListener("click", function(e){
				var location_win = Titanium.UI.createWindow({
						title: json.name,
						backButtonTitle: '',
						backgroundColor: 'white'
				});
				var web = Ti.UI.createWebView({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						url: "http://api.map.baidu.com/marker?location=" + json.latitude + "," + json.longitude + "&title=" + json.name + "&content=" + json.address + "&output=html"
				});
				location_win.add(web);
				pre(location_win)
				add_default_action_bar(location_win, location_win.title, true)
				Ti.App.currentTabGroup.activeTab.open(location_win, {
					animated : true
				});

			})
			detail_table.appendRow(row1)

			var row2 = Ti.UI.createTableViewRow({
				height: __l(50),
				selectedBackgroundColor: "#E8E8E8",
				hasChild: true
			})
			row2.add(Ti.UI.createImageView({
				image: "/images/tel.png",
				width: __l(22),
				height: __l(20),
				left: __l(10),
				hires: true,
				touchEnabled: false
			}));
			row2.add(Ti.UI.createLabel({
				text: json.telephone,
				font: {fontSize: __l(16)},
				left: __l(40),
				touchEnabled: false
			}))
			row2.addEventListener("click", function(e){
				Titanium.Platform.openURL('tel:'+json.telephone);    
			})
			if (json.telephone && json.telephone.length > 0)
				detail_table.appendRow(row2)
			
			wrapper.add(detail_table)

			var param = {};  
			param["business_id"]= json.business_id;  
			param["platform"]	= "2";
			param["sign"]		= make_sign(param);
			
			var url = "http://api.dianping.com/v1/review/get_recent_reviews?appkey=" + dianping_appkey;
			var array = new Array();  
			for(var key in param)  
			{  
			    url += "&" + key + "=" + param[key];
			}
			http_call(url, function(e1){
				var c_json = JSON.parse(e1.responseText);
				if (c_json.status != "OK" || c_json.count < 1)
					return;

				for(var i=0; i<c_json.reviews.length; i++){
					var comment_row = Ti.UI.createTableViewRow({
						className: 'comment',
						selectedBackgroundColor: "#E8E8E8",
						height: Ti.UI.SIZE
					})
					comment_row.add(Ti.UI.createLabel({
						text: c_json.reviews[i].user_nickname,
						font: {fontSize: __l(15)},
						left: __l(10),
						top: __l(10),
						touchEnabled: false
					}))
					comment_row.add(Ti.UI.createImageView({
						right: __l(130),
						top: __l(15),
						image: c_json.reviews[i].rating_s_img_url,
						height: __l(10),
						width: __l(60),
						touchEnabled: false
					}))
					comment_row.add(Ti.UI.createLabel({
						text: c_json.reviews[i].created_time,
						font: {fontSize: __l(14)},
						right: __l(10),
						color: "#ccc",
						top: __l(10),
						touchEnabled: false
					}))
					comment_row.add(Ti.UI.createLabel({
						text: c_json.reviews[i].text_excerpt,
						font: {fontSize: __l(14)},
						left: __l(10),
						top: __l(30),
						height: Ti.UI.SIZE,
						bottom: __l(10),
						touchEnabled: false
					}))
					
					detail_table.appendRow(comment_row)
				}
				var more_row = Ti.UI.createTableViewRow({
					height: Ti.UI.SIZE
				})
				more_row.add(Ti.UI.createLabel({
					text: "更多点评",
					font: {fontSize: __l(18)},
					left: __l(100),
					right: __l(100),
					height: Ti.UI.SIZE,
					top: __l(16),
					selectedBackgroundColor: "#E8E8E8",
					bottom: __l(16),
					textAlign: 'center',
					touchEnabled: false
				}))
				more_row.addEventListener("click", function(e){
					var more_win = Titanium.UI.createWindow({
						title: "更多点评",
						backButtonTitle: '',
						backgroundColor: 'white'
					});
					var web = Ti.UI.createWebView({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						url: c_json.additional_info.more_reviews_url
					});
					more_win.add(web);
					pre(more_win)
					add_default_action_bar(more_win, more_win.title, true)
					Ti.App.currentTabGroup.activeTab.open(more_win, {
						animated : true
					});
				})
				if (c_json.additional_info && c_json.additional_info.more_reviews_url)
					detail_table.appendRow(more_row)
			})

			var right = Ti.UI.createButton({
				title: '点评'
			})
			right.addEventListener("click", function(e){
				if (!check_login()){
					to_login();
					return;
				}

					var comment_win = Titanium.UI.createWindow({
						title: "点评",
						backButtonTitle: '',
						backgroundColor: 'white',
						json: detail_win.json,
						comment_win: 5,
						shiyi: "",
						qx: ""
					});

					var wrapper = Ti.UI.createScrollView({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						contentHeight: 'auto'
					})
					comment_win.add(wrapper)

					wrapper.add(Ti.UI.createLabel({
						text: "星级",
						font: {fontSize: __l(18), fontWeight: 'bold'},
						top: __l(20),
						left: __l(14),
						color: "#333"
					}))

					var star_wrapper = Ti.UI.createView({
						layout: 'horizontal',
						left: __l(70),
						top: __l(18),
						height: __l(24),
						right: __l(10)
					});
					wrapper.add(star_wrapper);
					for(var i=1; i<=5; i++){
						var star = Ti.UI.createImageView({
							left : 0,
							right: __l(10),
							width: __l(24),
							height: __l(24),
							image: "/images/star1.png",
							hires: true,
							index: i
						})
						star.addEventListener("click", function(e){
							var index = e.source.index;
							for(var j=0; j<5; j++){
								if (j<index){
									star_wrapper.children[j].image = "/images/star1.png"
								}
								else
									star_wrapper.children[j].image = "/images/star2.png"
							}
							comment_win.rate_star = index
						})
						star_wrapper.add(star)
					}

					wrapper.add(Ti.UI.createLabel({
						text: "适宜宝宝",
						font: {fontSize: __l(18), fontWeight: 'bold'},
						top: __l(60),
						left: __l(14),
						color: "#333"
					}))
					var shiyi_wrapper = Ti.UI.createView({
						layout: 'horizontal',
						left: __l(98),
						top: __l(60),
						height: __l(24),
						right: __l(10)
					});
					wrapper.add(shiyi_wrapper);
					var vs1 = ["0~3岁", "3~6岁", "6岁以上"];
					for(var j=0; j<vs1.length; j++){
						var label = Ti.UI.createLabel({
							text: vs1[j],
							right: __l(8),
							font: {fontSize: __l(11)},
							width: __l(60),
							textAlign: 'center',
							height: __l(22),
							backgroundColor: "white",
							borderColor: "#EFEFEF",
							borderWidth: 1,
							checked: false
						})
						label.addEventListener("click", function(e){
							e.source.checked = !e.source.checked
							if (e.source.checked){
								e.source.backgroundColor = "#FF9900"
								e.source.borderWidth = 0
							}
							else{
								e.source.backgroundColor = "white"
								e.source.borderWidth = 1
							}

							comment_win.shiyi = ""
							for(var k=0; k<vs1.length; k++){
								if (shiyi_wrapper.children[k].checked){
									comment_win.shiyi += "," + shiyi_wrapper.children[k].text
								}
							}
						})
						shiyi_wrapper.add(label)
					}

					wrapper.add(Ti.UI.createLabel({
						text: "宝宝情绪",
						font: {fontSize: __l(18), fontWeight: 'bold'},
						top: __l(100),
						left: __l(14),
						color: "#333"
					}))
					var qx_wrapper = Ti.UI.createView({
						layout: 'horizontal',
						left: __l(98),
						top: __l(100),
						height: Ti.UI.SIZE,
						right: __l(10)
					});
					wrapper.add(qx_wrapper);
					var vs = ["开心", "安静", "活跃", "留恋", "哭闹", "烦躁"];
					for(var j=0; j<vs.length; j++){
						var label = Ti.UI.createLabel({
							text: vs[j],
							right: __l(8),
							font: {fontSize: __l(11)},
							width: __l(60),
							textAlign: 'center',
							height: __l(22),
							backgroundColor: "white",
							bottom: __l(8),
							borderColor: "#EFEFEF",
							borderWidth: 1,
							checked: false
						})
						label.addEventListener("click", function(e){
							e.source.checked = !e.source.checked
							if (e.source.checked){
								e.source.backgroundColor = "#FF9900"
								e.source.borderWidth = 0
							}
							else{
								e.source.backgroundColor = "white"
								e.source.borderWidth = 1
							}

							comment_win.qx = ""
							for(var k=0; k<vs.length; k++){
								if (qx_wrapper.children[k].checked){
									comment_win.qx += "," + qx_wrapper.children[k].text
								}
							}
						})
						qx_wrapper.add(label)
					}

					var textarea = Titanium.UI.createTextArea({
						hintText : "评论不得少于10个字哦",
						value : "#亲子城市#我去了" + detail_win.json.name + "，",
						height : __l(100),
						left : __l(16),
						right : __l(16),
						top : __l(164),
						textAlign : 'left',
						borderWidth : 1,
						borderColor : '#ccc',
						borderRadius : __l(0),
						backgroundColor : 'transparent',
						returnKeyType: Titanium.UI.RETURNKEY_DONE,
						font : {
							fontSize : __l(15)
						}
					});
					textarea.addEventListener("change", function(e) {
						if(textarea.value.length > 140)
							textarea.value = textarea.value.substr(0, 140)
						title.text = 140 - textarea.value.length;
						
						if(textarea.value.length == 0){
							done.enabled = false;
						}
						else{
							done.enabled = true;
						}
					})
					var title = Ti.UI.createLabel({
						right : __l(24),
						top: __l(244),
						textAlign : "right",
						height : 'auto',
						color: '#999',
						font : {
							fontSize : __l(12)
						},
						text : "140"
					});
					wrapper.add(textarea)
					wrapper.add(title)

					var done = Ti.UI.createButton({
						title : "发布"
					})
					done.addEventListener("click", function(e){
						var xhr = Ti.Network.createHTTPClient()
						xhr.timeout = Ti.App.timeout
						xhr.onerror = function(e) {}
						xhr.onload = function(){
							hide_loading();
							if (this.responseText == "OK"){
								comment_win.close();
							}
							else{
								show_alert("提示", this.responseText)
							}
						}
						var url = Ti.App.mamashai + "/api/statuses/share_poi?" + account_str()
						xhr.open("POST", url)
						xhr.send({
							rate: comment_win.rate_star,
							content: textarea.value,
							json: JSON.stringify(comment_win.json),
							shiyi: comment_win.shiyi,
							qx: comment_win.qx
						})
						show_loading("正在提交")
					})
					if (!Ti.App.is_android)
						comment_win.setRightNavButton(done)
					
					pre(comment_win)
					add_default_action_bar2(comment_win, comment_win.title, "发布", function(e){
						done.fireEvent("click")
					})
					Ti.App.currentTabGroup.activeTab.open(comment_win, {
						animated : true
					});
			})
			if (!Ti.App.is_android)
				detail_win.setRightNavButton(right);

			pre(detail_win)
			add_default_action_bar2(detail_win, detail_win.title, "评论", function(e){
				right.fireEvent("click")
			});

			logEvent("qinzi_detail");
			
			Ti.App.currentTabGroup.activeTab.open(detail_win, {
				animated : true
			});
		});
		search_win.add(tableview);
		
		var bottom_wrapper = Ti.UI.createView({
			height: __l(24),
			bottom: 0,
			left: 0,
			right: 0,
			backgroundColor: 'transparent'
		});
		var bottom_mask = Ti.UI.createView({
			backgroundColor: 'black',
			opacity: 0.5,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		});
		var logo_wrapper = Ti.UI.createView({
			top : 0,
			bottom : 0,
			width: __l(130),
			left: (Ti.App.platform_width-__l(130))/2,
			layout: 'horizontal'
		});
		logo_wrapper.add(Ti.UI.createImageView({
			image: "/images/dianping.png",
			height: __l(18),
			width: __l(18),
			hires: true,
			top: __l(4)
		}));
		logo_wrapper.add(Ti.UI.createLabel({
			text: "数据来自大众点评",
			font: {fontSize: __l(12)},
			color: "white",
			left: __l(6),
			top:0,
			height: __l(24),
			bottom:0
		}));
		bottom_wrapper.add(bottom_mask);
		bottom_wrapper.add(logo_wrapper);
		search_win.add(bottom_wrapper);
		
		var showed_count = 0;
		
		var get_more_row = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				selectedBackgroundColor : '#eee',
				tag : 'get_more',
				textAlign: "center",
				name: 'get_more'
		});
		get_more_row.addEventListener('click', function(e) {
			e.source.navActInd.show();
			param["page"] 		= (parseInt(param["page"])) + 1 + "";
			param["sign"]		= make_sign(param);
			var url = "http://api.dianping.com/v1/business/find_businesses?appkey=" + dianping_appkey;
			var array = new Array();  
			for(var key in param)  
			{  
			    url += "&" + key + "=" + param[key];
			}
			
			http_call(url, callback);
		});
			
		var get_more_row_center = Ti.UI.createView({
				top : 0,
				bottom : 0,
				width : __l(160),
				height : __l(64),
				touchEnabled: false
		});
			
		var get_more_title = Ti.UI.createLabel({
						top : __l(18),
						bottom : __l(12),
						left : __l(26),
						right : __l(10),
						textAlign : 'left',
						height : Ti.UI.SIZE,
						font : {
							fontSize : __l(22)
						},
						color: "#999",
						touchEnabled: false,
						text : '获得更多...'
		});
		var navActInd = Titanium.UI.createActivityIndicator({
					left: __l(0),
					top: __l(24),
					width: __l(20),
					height: __l(20),
					style: Ti.App.is_android ? Titanium.UI.ActivityIndicatorStyle.BIG_DARK : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
		});
			
		get_more_row_center.add(navActInd);
		
		get_more_row.navActInd = navActInd;
		get_more_row_center.add(get_more_title);
		get_more_row.add(get_more_row_center);
		
		var param = {};  
		param["city"]		= city;  
		param["page"]		= "1";
//		param["latitude"]	= latitude + "";  
//		param["longitude"]	= longitude + "";  
		//param["category"]  = key;  
	//	param["region"] 	= district;  
		param["limit"]		= "20";  
//		param["radius"]		= "5000";  
		param["keyword"]	= key;  
		param["sort"]		= "1";  
		param["platform"]   = "2";
		param["sign"]		= make_sign(param);
		
		var url = "http://api.dianping.com/v1/business/find_businesses?appkey=" + dianping_appkey;
		var array = new Array();  
		for(var key in param)  
		{  
		    url += "&" + key + "=" + param[key];
		}
		function callback(e){
			var json_result = JSON.parse(e.responseText);
			if (json_result.status != "OK"){
				show_alert("提示", "对不起，获取数据出错！");
				return;
			}

			if (json_result.count == 0){
				show_alert("提示", "对不起，没有符合条件的地点！");
				return;	
			}

			var total_count = json_result.total_count;
			for(var i=0; i<json_result.businesses.length; i++){
				showed_count += 1;
				var json = json_result.businesses[i];
				var row = Ti.UI.createTableViewRow({
					height : __l(80),
					json: json,
					selectedBackgroundColor: "#E8E8E8",
					className: 'business'
				});
				
				var logo = Ti.UI.createImageView({
					top: __l(10),
					bottom: __l(10),
					left: __l(10),
					height: __l(60),
					width: __l(80),
					hires: true,
					touchEnabled: false,
					image: json.s_photo_url
				});
				
				var label = Ti.UI.createLabel({
					text: json.name + (json.branch_name && json.branch_name.length > 0 ? "（" + json.branch_name +"）" : ""),
					left: __l(100),
					right: __l(4),
					top: __l(10),
					font: {fontSize: __l(13)},
					touchEnabled: false,
					height: __l(18)
				});
				
				var rate = Ti.UI.createImageView({
					top: __l(36),
					left: __l(100),
					width: __l(60),
					height: __l(10),
					hires: true,
					touchEnabled: false,
					image: json.rating_img_url
				});
				
				var price = Ti.UI.createLabel({
					text: "人均：￥" + json.avg_price,
					top: __l(40),
					right: __l(4),
					font: {fontSize: __l(10)},
					touchEnabled: false,
					color: "#ccc"
				});
				
				var category = Ti.UI.createLabel({
					text: "",
					left: __l(100),
					bottom: __l(8),
					font: {fontSize: __l(10)},
					touchEnabled: false,
					color: "#ccc"
				});
				if (json.regions.length > 1)
					category.text += json.regions[1];
				if (json.categories.length > 0)
					category.text += "  " + json.categories[0];
					
				var juli = getGreatCircleDistance(win.latitude, win.longitude, json.latitude, json.longitude)
				var distance = Ti.UI.createLabel({
					text: juli > 1000 ? parseInt(juli/1000) + "km" : juli + 'm',
					bottom: __l(8),
					right: __l(4),
					font: {fontSize: __l(10)},
					touchEnabled: false,
					color: "#ccc"
				});
					
				row.add(logo);
				row.add(label);
				row.add(rate);
				row.add(price);
				row.add(category);
				row.add(distance);
				tableview.appendRow(row);
			}
			
			setTimeout(function(){
				var index = tableview.getIndexByName('get_more');
				if (index > 0){
					get_more_row.navActInd.hide();
					tableview.deleteRow(index);
				}
						
				if (total_count > showed_count){
					tableview.appendRow(get_more_row);
				}
			}, 200);

			hide_loading();
		};
		
		add_default_action_bar(search_win, search_win.title, true);
		logEvent("qinzi_search");
		
		pre(search_win)
		Ti.App.currentTabGroup.activeTab.open(search_win, {
			animated : true
		});

		show_loading();
		http_call(url, callback);
	}						 
	
	add_default_action_bar(win, win.title, true);
	logEvent('qinzi');
	
	pre(win)
	if (!Ti.App.is_android) {
		win.hideTabBar();
	}
	Ti.App.currentTabGroup.activeTab.open(win, {
			animated : true
	});
	
	return win;
}

Qinzi({backButtonTitle: '', title: '亲子城市'})
