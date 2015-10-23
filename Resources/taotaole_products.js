function Taotaole_products(attr){
	Ti.include("public.js")
	var win = Titanium.UI.createWindow(attr);
	win.backButtonTitle = ""
	win.backgroundColor = "#f1f1f2"
	
	if (Ti.App.is_android){
		add_default_action_bar(win, win.title, true)
	}
	
	var wrapper = Ti.UI.createScrollableView({
		showPagingControl : false,
		left : 0,
		right : 0,
		top : 0,
		bottom : 0,
		width : Ti.App.platform_width,
		scrollingEnabled: false,
	});
	
	wrapper.addEventListener("scrollend", function(e){
		if (e.currentPage == 1 && lane2_1.children.length == 0){
			if (lane2_1.children.length == 0)
				taobao_call("taobao.tbk.items.get", [["fields", "num_iid,cid,title,nick,pic_url,price,click_url,commission,commission_rate,commission_num,commission_volume,shop_click_url,seller_credit_score,item_location,volume,promotion_price"], ["cid", win.code], ['is_mobile', "true"], ['sort', 'commissionNum_desc'], ['page_no', page + ''], ['page_size', '39']], 
					callback
				)
			logEvent('taotaole_products2')
		}
	})
	
	win.add(wrapper)
		
	var container = Ti.UI.createScrollView({
		contentHeight : 'auto',
		contentWidth: Ti.App.platform_width,
		showVerticalScrollIndicator : true,
		left : 0,
		width : Ti.App.platform_width,
		bottom : 0,
		top : 0,
		layout: 'horizontal'
	})
	
	
	
	if (Ti.App.is_android){
			var ypos = 0;
			var intervalIsRunning = false;
			var yposPrevious = 0;
			container.addEventListener('scroll', function(e) {
			    ypos = e.y;
			    if (!intervalIsRunning) {
			        //Ti.API.info('started');
			        intervalIsRunning = true;
			        var i = setInterval(function() {
			            if (yposPrevious != ypos) {
			                yposPrevious = ypos; 
			            } else {
			                clearInterval(i);
			                intervalIsRunning = false;
			                
			                container.fireEvent("scrollEnd", {}) 
			            }
			        }, 500);
			    }
			 
			});
		}
	
	wrapper.addView(container)
	
	var lanes = new Array();
	
	var lane1 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		//height: 200,
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	var lane2 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	var lane3 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	container.add(lane1)
	container.add(lane2)
	container.add(lane3)
	
	var loading_wrapper = Ti.UI.createView({
		top: 0,
		left: 0,
		right: 0,
		width: Ti.App.platform_width,
		heigh: __l(40)
	})
	var actInd = Titanium.UI.createActivityIndicator({
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
		top : 10,
		height : __l(20),
		bottom: 10,
		message: "正在获取"
	});
	loading_wrapper.add(actInd)
	
	container.addEventListener("scrollEnd", function(e){
		if (xhr.finished)
			return;
		var height = lane1.rect.height;
		if (lane2.rect.height > height)
			height = lane2.rect.height;
			
		if (lane3.rect.height > height)
			height = lane3.rect.height;
		
		Ti.API.log('scroll' + (height - Ti.App.platform_height - container.contentOffset.y));
		if (height - Ti.App.platform_height - container.contentOffset.y < __l(150)){
			xhr.page += 1
			xhr.open('GET', Ti.App.mamashai + '/api/taotaole/products_of/' + win.id + "?page=" + xhr.page)
			
			container.add(loading_wrapper);
			actInd.show()
			//container.scrollToBottom()
			
			xhr.send();
		}
	})
	
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
				actInd.hide()
				show_timeout_dlg(xhr, Ti.App.mamashai + "/api/taotaole/products_of/" + win.id);
	}
	xhr.onload = function() {
				actInd.hide()
				if (this.responseText == "null"){
					xhr.finished = true;
					if (!container.empty){
							var empty_label = Ti.UI.createLabel({
								left: 0,
								right: 0,
								width: Ti.App.platform_width,
								height: __l(40),
								font: {
									fontSize: __l(18)
								},
								color: "#333",
								text: "没有更多推荐了",
								textAlign: "center"
							})
							container.add(empty_label)
							container.empty = empty_label
					}
					container.remove(loading_wrapper);
					actInd.hide()
					return;
				}
				
				var json = JSON.parse(this.responseText)
				if (!json)
					return;
				
				if (json.length < 27)
					xhr.finished = true;
				
				var cursor = 0;
				if (lane2.rect.height < lane1.rect.height)
					cursor = 1;
				if (lane3.rect.height < lane2.rect.height)
					cursor = 2;
				for(var i=0; i<json.length; i++){
					var product_json = json[i]
					var wrapper = Ti.UI.createView({
						left: 0,
						right: 0,
						top: 0,
						bottom: (Ti.App.platform_width-__l(300))/4,
						height: Ti.UI.SIZE
					})
					
					var picture = Ti.UI.createImageView({
						left: 0,
						width: __l(100),
						hires: true,
						image: product_json.logo200,
						id: product_json.id,
						borderWidth: 1,
						borderColor: "#ddd",
						defaultImage : './images/bj.png'
					})
					if (Ti.App.is_android){
						picture.height = __l(100);
					}
					picture.addEventListener("click", function(e){
						var win = Ti.UI.createWindow({
								title : "推荐商品",
								url: 'gou_detail.js',
								backgroundColor : '#fff',
								id : e.source.id,
								backButtonTitle: ''
						});
						pre(win)
						Ti.App.currentTabGroup.activeTab.open(win, {
							animated : true
						});
						return;
					})
					wrapper.add(picture)
					
					var name_wrapper = Ti.UI.createView({
						width : __l(32),
						height : __l(13),
						bottom: __l(8),
						right: 0,
						zIndex: 10,
						backgroundColor: 'black',
						opacity: 0.4
					})
					var name = Ti.UI.createLabel({
						font:{fontSize:__l(8)},
						text: "￥ " + product_json.price,
						color:'white',
						textAlign:'center',
						width : __l(32),
						height : __l(13),
						bottom: __l(8),
						right: 0,
						zIndex: 20
					});
					wrapper.add(name_wrapper)
					wrapper.add(name)
					
					container.children[cursor].add(wrapper)
					cursor += 1
					if (cursor == 3)
						cursor = 0
				}
				if (json.length < 27){
						if (!container.empty){
							var empty_label = Ti.UI.createLabel({
								left: 0,
								right: 0,
								width: Ti.App.platform_width,
								height: __l(40),
								font: {
									fontSize: __l(18)
								},
								color: "#333",
								text: "没有更多推荐了",
								textAlign: "center"
							})
							container.add(empty_label)
							container.empty = empty_label
						}
				}
				container.remove(loading_wrapper);
				actInd.hide()
	}
	
	xhr.page = 1
	xhr.open('GET', Ti.App.mamashai + '/api/taotaole/products_of/' + win.id + "?page=" + xhr.page)
	xhr.send();
	
	///////////////////////销量排名//////////////////////////////////////
	var container2 = Ti.UI.createScrollView({
		contentHeight : 'auto',
		contentWidth: Ti.App.platform_width,
		showVerticalScrollIndicator : true,
		left : 0,
		width : Ti.App.platform_width,
		bottom : 0,
		top : 0,
		layout: 'horizontal'
	})
	
	if (Ti.App.is_android){
			var ypos = 0;
			var intervalIsRunning2 = false;
			var yposPrevious = 0;
			container2.addEventListener('scroll', function(e) {
			    ypos = e.y;
			    if (!intervalIsRunning2) {
			        //Ti.API.info('started');
			        intervalIsRunning2 = true;
			        var j = setInterval(function() {
			            if (yposPrevious != ypos) {
			                yposPrevious = ypos; 
			            } else {
			                clearInterval(j);
			                intervalIsRunning2 = false;
			                
			                container2.fireEvent("scrollEnd", {}) 
			            }
			        }, 500);
			    }
			 
			});
		}
		
	if (win.code)
		wrapper.addView(container2)
	
	var lane2_1 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		//height: 200,
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	var lane2_2 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	var lane2_3 = Ti.UI.createView({
		left: (Ti.App.platform_width-__l(300))/4,
		width: __l(100),
		height: Ti.UI.SIZE,
		top: __l(7),
		layout: 'vertical'
	})
	
	container2.add(lane2_1)
	container2.add(lane2_2)
	container2.add(lane2_3)
	
	var loading_wrapper2 = Ti.UI.createView({
		top: 0,
		left: 0,
		right: 0,
		width: Ti.App.platform_width,
		heigh: __l(40)
	})
	var actInd2 = Titanium.UI.createActivityIndicator({
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
		top : 10,
		height : __l(20),
		bottom: 10,
		message: "正在获取"
	});
	loading_wrapper2.add(actInd2)
	function callback(json){
		actInd2.hide()
		if (!json.tbk_items_get_response || !json.tbk_items_get_response.tbk_items){
			container2.finished = true;
			
			return;
		}
		page += 1
		var cursor = 0;
		if (lane2_2.rect.height < lane2_1.rect.height)
			cursor = 1;
		if (lane2_3.rect.height < lane2_2.rect.height)
			cursor = 2;
		for(var i=0; i<json.tbk_items_get_response.tbk_items.tbk_item.length; i++){
			var product_json = json.tbk_items_get_response.tbk_items.tbk_item[i]
			var wrapper = Ti.UI.createView({
				left: 0,
				right: 0,
				top: 0,
				bottom: (Ti.App.platform_width-__l(300))/4,
				height: Ti.UI.SIZE
			})
					
			var picture = Ti.UI.createImageView({
				left: 0,
				width: __l(100),
				hires: true,
				image: product_json.pic_url + "_200x200.jpg",
				id: product_json.id,
				num_iid: product_json.num_iid,
				click_url: product_json.click_url,
				cname: product_json.title, 
				borderWidth: 1,
				borderColor: "#ddd",
				defaultImage: './images/bj.png'
			});
			if (Ti.App.is_android){
				picture.height = __l(100);
			}
			picture.addEventListener("click", function(e){
				taobao_call("taobao.tbk.mobile.items.convert", [["fields", "num_iid,click_url,iid,commission,commission_rate,commission_num,commission_volume"], ["num_iids", e.source.num_iid], ["outer_code", Ti.App.Properties.getString("email", "")]], 
					function(json){
						if (json.tbk_mobile_items_convert_response.tbk_items){
							Ti.App.fireEvent("open_url", {url: json.tbk_mobile_items_convert_response.tbk_items.tbk_item[0].click_url, title : "手机淘宝网——" + e.source.cname})
						}
					}
				)
			});
			wrapper.add(picture);
					
			var name_wrapper = Ti.UI.createView({
						width : __l(38),
						height : __l(13),
						bottom: __l(8),
						right: 0,
						zIndex: 10,
						backgroundColor: 'black',
						opacity: 0.4
			});
			var name = Ti.UI.createLabel({
						font:{fontSize:__l(8)},
						text: "￥ " + parseInt(product_json.promotion_price||product_json.price),
						color:'white',
						textAlign:'center',
						width : __l(38),
						height : __l(13),
						bottom: __l(8),
						right: 0,
						zIndex: 20
			});
			wrapper.add(name_wrapper)
			wrapper.add(name)
					
			container2.children[cursor].add(wrapper)
			cursor += 1
			if (cursor == 3)
				cursor = 0
		}
		container2.remove(loading_wrapper2);
	}
	
	var page = 1;
	var showed = false;
	container2.addEventListener("scrollEnd", function(e){
		if (page >= 6)
		{
			container2.finished = true;
			if (!showed){
				var empty_label = Ti.UI.createLabel({
								left: 0,
								right: 0,
								width: Ti.App.platform_width,
								height: __l(40),
								font: {
									fontSize: __l(18)
								},
								color: "#333",
								text: "没有更多推荐了",
								textAlign: "center"
				})
				container2.add(empty_label)
				showed = true
			}
		}	
		
		if (container2.finished)
			return;
			
		var height = lane2_1.rect.height;
		if (lane2_2.rect.height > height)
			height = lane2_2.rect.height;
			
		if (lane2_3.rect.height > height)
			height = lane2_3.rect.height;
		
		if (height - Ti.App.platform_height - container2.contentOffset.y < __l(150)){
			if (win.code){
				taobao_call("taobao.tbk.items.get", [["fields", "promotion_price,num_iid,cid,title,nick,pic_url,price,click_url,commission,commission_rate,commission_num,commission_volume,shop_click_url,seller_credit_score,item_location,volume"], ["cid", win.code], ['is_mobile', "true"], ['sort', 'commissionNum_desc'], ['page_no', page + ''], ['page_size', '39']], 
					callback
				)
			}
			else{
				taobao_call("taobao.tbk.items.get", [["fields", "promotion_price,num_iid,cid,title,nick,pic_url,price,click_url,commission,commission_rate,commission_num,commission_volume,shop_click_url,seller_credit_score,item_location,volume"], ["keyword", win.cname], ['is_mobile', "true"], ['sort', 'commissionNum_desc'], ['page_no', page + ''], ['page_size', '39']], 
					callback
				)
			}
			container2.add(loading_wrapper2);
			actInd2.show()
		}
		
	})
	
	function taobao_call(api, params, callback){
			APP_KEY = "12522500"
			APP_SECRET = "28db7262ee024150ea26512b94fd5b7e"
			
	    	var now = new Date();
	    	params.push(["method", api])
	    	params.push(["timestamp", datetime_str(now)])
	    	params.push(["format", "json"])
	    	params.push(["app_key", APP_KEY])
	    	params.push(["v", "2.0"])
	    	params.push(["sign_method", "md5"])
			params = params.sort(function(a, b){
				return a[0] > b[0] ? 1 : -1
			})
			var final_str = APP_SECRET;
			for(var i=0; i<params.length; i++){
				final_str += params[i][0] + params[i][1]
			}
			final_str += APP_SECRET
			var url = "http://gw.api.taobao.com/router/rest?"
			for(var i=0; i<params.length; i++){
				url += params[i][0] + "=" + params[i][1] + "&"
			}
			url += "sign=" + Titanium.Utils.md5HexDigest(final_str).toUpperCase()
			var xhr = Ti.Network.createHTTPClient()
			xhr.onerror = function(){
					actInd2.hide();
			}
			xhr.onload = function(){
					callback(JSON.parse(this.responseText))
			}
			xhr.open("GET", url)
			xhr.send()
	}
		
	logEvent('taotaole_products')
	return win;
}

module.exports = Taotaole_products
