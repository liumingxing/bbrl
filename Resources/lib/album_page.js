Ti.include('/public.js')
var mymedia = null;
if (!Ti.App.is_android)
	mymedia = require('my.media');

//将2012-01-01这样的日期转换成2012.1.1的格式
function human_date_dot(today_str) {
	var ts = today_str.split('-')
	var year = ts[0]
	var month = parseInt(ts[1], 10)
	var date = parseInt(ts[2], 10)

	return year + "." + month + '.' + date
}

//将2012:12:12 12:12:12转成 2012-12-12 12:12:12
function __translate(str) {
	var texts = str.split(' ')
	return texts[0].replace(/:/g, '-') + " " + texts[1]
}

//由json生成可展示的照片书的一页
//json : 参数
//width : 300
//height : 300
//index : 序号
//relate_thumb : 关联的小图
//view : 如为空，则生成新的，否则更新已有的
function album_page(win, json, kid_json, width, height, index, relate_thumb, view) {
	//var win = Titanium.UI.currentWindow;
	
	var scale_ratio = width * 1.0 / __l(300)
	if (view) {
		clear_window(view)
		view.relate_thumb = relate_thumb
	} else {
		view = Ti.UI.createView({
				top : __l(0),
				height : height,
				width : width,
				relate_thumb : relate_thumb,
				backgroundColor : '#D9D9D9',
				index : index
		})
	}
	view.stamp = new Date().getTime();
	if (json.from == "caiyi" || json.from == "shijian" || json.from == "bbyulu" || json.from == "biaoqing" || (json.from && json.from.indexOf('lama') >= 0)) {
		var pic = Ti.UI.createImageView({
			top : 0,
			bottom : 0,
			left : 0,
			right : 0,
			hires : true,
			image : json.template.logo_url
		})
		view.add(pic)

		var picture = Ti.UI.createImageView({
			top : 0,
			bottom : 0,
			left : 0,
			right : 0,
			hires : true
		})
		if (json.picture) {
			picture.image = "http://www.mamashai.com" + json.picture
		}
		view.add(picture)

		if (relate_thumb)
			relate_thumb.fireEvent("set_status", {
				status : "normal"
			})
	} else {
		//填充背景图片
		var pic = Ti.UI.createImageView({
			top : 0,
			bottom : 0,
			left : 0,
			right : 0,
			height: height,
			width: width,
			hires : true,
			image : "http://www.mamashai.com" + json.template.logo_url
		})

		view.add(pic)

		var template_json = JSON.parse(json.template.json)
		//左上角的日期，孩子年龄
		var created_at = json.created_at
		var date_age = Ti.UI.createLabel({
			text : json.created_at ? human_date_dot(json.created_at) + " " + kid_desc(kid_json, json.created_at) : Ti.App.book_json.name,
			color : 'white',
			font : {
				fontSize : Ti.App.is_android ? __l(7.5) * scale_ratio : __l(7) * scale_ratio
			},
			left : 0,
			top : __l(18) * scale_ratio,
			height : Ti.App.is_android ? __l(7.5) * scale_ratio + 4 : __l(7) * scale_ratio,
			width : __l(110) * scale_ratio,
			textAlign : 'center',
			backgroundColor: 'transparent',
			zIndex : 10
		})
		if (template_json.date_color) {
			date_age.color = template_json.date_color
		}
		view.add(date_age)

		if (template_json.fullscreen) {
			var data_wrapper = Ti.UI.createImageView({
				top : __l(15) * scale_ratio,
				left : 0-__l(15) * scale_ratio/2,
				width : __l(110) * scale_ratio + __l(15) * scale_ratio/2,
				height : __l(15) * scale_ratio,
				hires : true,
				borderRadius: __l(15) * scale_ratio/2,
				image : "/images/fullscreen_date.png",
				zIndex : 8
			})
			view.add(data_wrapper)
		}
		if (template_json.picture) {
			//图片的滚动容器
			var logo_container = null;
			if (Ti.App.is_android){
				logo_container = Ti.UI.createView({
					height : height,
					width : width,
					backgroundColor : 'transparent',
					borderWidth : 0,
					index : index
				})
			}
			else{
				logo_container = Ti.UI.createScrollView({
					contentHeight : Ti.App.is_android ? height : 'auto',
					contentWidth : Ti.App.is_android ? width : 'auto',
					//showHorizontalScrollIndicator : "true",
					backgroundColor : 'transparent',
					minZoomScale : 0.5,
					maxZoomScale : 2.8,
					borderWidth : 0,
					index : index
					//zoomScale: scale_ratio
				})
			}
			
			if (win.mode == "preview") {
				logo_container.backgroundColor = "transparent"
			}
			if (template_json.picture.left) {
				logo_container.left = __l(template_json.picture.left / 2) * scale_ratio
			}
			if (template_json.picture.top) {
				logo_container.top = __l(template_json.picture.top / 2) * scale_ratio
			}
			if (template_json.picture.width) {
				logo_container.width = __l(template_json.picture.width / 2) * scale_ratio
			}
			if (template_json.picture.height) {
				logo_container.height = __l(template_json.picture.height / 2) * scale_ratio
			}
			view.add(logo_container)
			logo_container.addEventListener("scale", function(e) {
				x = e.source.contentOffset.x
				y = e.source.contentOffset.y

				if ( typeof (Ti.App.book_json) != "undefined" && new Date().getTime() - view.stamp > 500) {
					var data = Ti.App.book_json; 
					if (data.pages[index].scroll){
						data.pages[index].scroll.x = x / (scale_ratio * __l(1))
						data.pages[index].scroll.y = y / (scale_ratio * __l(1))
						data.pages[index].scroll.scale = e.scale
					}
					
					Ti.App.book_json = data
					Ti.App.modified = true;
				}
			})
			var x = 0, y = 0;
			logo_container.addEventListener("scrollEnd", function(e) {
				x = e.source.contentOffset.x
				y = e.source.contentOffset.y

				if ( typeof (Ti.App.book_json) != "undefined" && new Date().getTime() - view.stamp > 500) {
					var data = Ti.App.book_json;
					data.pages[index].scroll.x = x / (scale_ratio * __l(1))
					data.pages[index].scroll.y = y / (scale_ratio * __l(1))
					Ti.App.book_json = data
					Ti.App.modified = true;
				}
			})
			
			logo_container.addEventListener("dragEnd", function(e) {
				x = e.source.contentOffset.x
				y = e.source.contentOffset.y

				if ( typeof (Ti.App.book_json) != "undefined" && new Date().getTime() - view.stamp > 500) {
					var data = Ti.App.book_json;
					data.pages[index].scroll.x = x / (scale_ratio * __l(1))
					data.pages[index].scroll.y = y / (scale_ratio * __l(1))
					Ti.App.book_json = data
					Ti.App.modified = true;
				}
			})
			//加入图片
			var picture_wrapper = Ti.UI.createView({
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				width: logo_container.width,
				height: logo_container.height
			})
			var picture = Ti.UI.createImageView({
				top : 0,
				left : 0,
				//height: Ti.UI.SIZE,
				//width: Ti.UI.SIZE,
				bottom : 0,
				right : 0,
				index : index,
				hires : true,
				_parent : view,
				//autorotate: true
			})
			picture_wrapper.add(picture)
			
			if (Ti.App.is_android && template_json.picture && template_json.picture.height){
				picture.accu = 0
				
				function adjust_position(index){
					picture_wrapper.width = logo_container.width
					picture_wrapper.height = logo_container.height			
					var image = picture.toBlob()
					var width = image.width;
					var height = image.height;
					var scale = 1
					if (Ti.App.book_json.pages[index].scroll.scale){
						scale = (Ti.App.book_json.pages[index].scroll.scale);						
					}
						
					picture_wrapper.height = picture_wrapper.height * scale
					picture_wrapper.width  = picture_wrapper.width * scale
					if (Ti.App.book_json.pages[index].scroll.x)
						picture_wrapper.left   = 0-Ti.App.book_json.pages[index].scroll.x * scale_ratio * __l(1)
					if (Ti.App.book_json.pages[index].scroll.y)
						picture_wrapper.top    = 0-Ti.App.book_json.pages[index].scroll.y * scale_ratio * __l(1)
					Ti.API.log("index:" + index + " scale:" + scale + " left:" +picture_wrapper.left+ " top:"+ picture_wrapper.top+" x:" + Ti.App.book_json.pages[index].scroll.x + " y:" + Ti.App.book_json.pages[index].scroll.y+"  width:" + width + "  height:" + height + " pic_width:" + picture_wrapper.width +  " pic_height:" + picture_wrapper.height)
					image = null;
				}
				
				picture.addEventListener("load", function(e){
						adjust_position(index)
						if (Ti.App.album_mode.indexOf("preview") < 0){		//非预览
							var mask = require('lib/make_android_pinch').make_android_pinch(picture_wrapper, logo_container, function(scale, left, top){
								var data = Ti.App.book_json
								data.pages[index].scroll.scale = scale
								data.pages[index].scroll.x = -left/(scale_ratio * __l(1))
								data.pages[index].scroll.y = -top/(scale_ratio * __l(1))
								Ti.App.book_json = data
							})
							mask._parent = view
							mask.addEventListener("singletap", pic_click)	
							picture_wrapper.mask = mask
						}
				})
			}
			
			logo_container.picture = picture_wrapper
			logo_container.add(picture_wrapper)

			view.addEventListener("select_sucai", function(e) {
				var data = Ti.App.book_json; 
				data.pages[e.source.index].picture = e.json.logo_url_thumb400;
				data.pages[e.source.index].text = e.json.content;
				data.pages[e.source.index].created_at = e.json.created_at;
				Ti.App.book_json = data
				album_page(win, Ti.App.book_json.pages[e.source.index], kid_json, width, height, e.source.index, e.source.relate_thumb, e.source)
			})
			if (relate_thumb) {
				if (json.picture) {
					relate_thumb.fireEvent("set_status", {
						status : "normal"
					})
				} else {
					relate_thumb.fireEvent("set_status", {
						status : "no_picture"
					})
				}
			}

			var url = real_path(json.picture)
			if (url) {
				if (url && url.length < 1000 && url.indexOf("upload") >= 0) {
					url = "http://www.mamashai.com" + url
				}
				
				if (url.length && url.length > 0)
					picture.image = url

				if (!Ti.App.is_android){
					if (json.scroll.scale) {
						logo_container.setZoomScale(json.scroll.scale)
					}
					//恢复缩放，滚动位置
					if (json.scroll.x) {
						logo_container.scrollTo(scale_ratio * json.scroll.x * __l(1), scale_ratio * json.scroll.y * __l(1))
					}
				}
				
				picture.backgroundColor = 'transparent'
			} else {	
				if (Ti.App.album_mode.indexOf("preview") >= 0) {
					if (logo_container.height > logo_container.width) {
						picture.image = "/images/album_preview_blank_1.jpg"
					} else {
						picture.image = "/images/album_preview_blank_2.jpg"
					}
				} else if (Ti.App.album_mode != "preview") {
					if (logo_container.height > logo_container.width) {
						picture.image = "/images/album_blank_1.png"
					} else {
						picture.image = "/images/album_blank_2.png"
					}
				}		

			}

			//点击图片可以选择新图片
			function pic_click(e1) {
				var optionsDialogOpts = {
					options : ['从相册中选', '从以前的记录中选', '取消'],
					cancel : 2
				};

				var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
				dialog._win = win;
				dialog.addEventListener('click', function(e) {
					var win = e.source._win;
					function select_picture_success(e) {
								var blob = e.media;
								if (blob.width == 0 && blob.height == 0){
									show_alert("对不起", "读取图片内容出现错误，请重新选择。");
									return;
								}
								Ti.API.log("select_picture_success, width:" + blob.width + " height:" + blob.height)
								if (!Ti.App.is_android){				//ios下进行图片缩放，长宽最短为800
									var blob_width = blob.width
									var blob_height = blob.height
									if (e.width){
										blob_width = e.width;
										blob_height = e.height;
									}
									
									var len = 800;
									if (blob_width > blob_height && blob_width > len) {
										blob_width = blob_width * len / blob_height
										blob_height = len;
									}
									else if (blob_width <= blob_height && blob_height > len){
										blob_height = blob_height * len / blob_width
										blob_width = len
									}
									//blob = blob.imageAsResized(blob_width, blob_height)
									blob = Ti.App.ImageFactory.imageAsResized(blob, { width:blob_width, height:blob_height });
									Ti.API.log("picture width: " + blob.width + " picture height: " + blob.height)
								}
								
								var data = Ti.App.book_json; 
								 
								var timer = new Date().getTime()
								var cache_file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, timer + ".png");
								cache_file.write(blob)
								
								
								/*
								if (Ti.App.is_android){		//生成另外一张小图，用来展示，以免占用过多内存
									cache_file = null;
									var cache_file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, timer + "_small_.png");
									blob = Ti.App.ImageFactory.imageAsResized(blob, {width: blob.width/2, height: blob.height/2, format: Ti.App.ImageFactory.JPEG})
									cache_file.write(blob)
								}
								*/
								
								var parent = e1.source._parent;
								if (e.metadata && e.metadata.exif && e.metadata.exif.DateTimeOriginal && !data.pages[e1.source._parent.index].created_at) {
									data.pages[e1.source._parent.index].created_at = __translate(e.metadata.exif.DateTimeOriginal);
								}
								
								data.pages[e1.source._parent.index].picture = cache_file.nativePath

								var json_tiny = JSON.parse(data.pages[e1.source._parent.index].template.json)
								if (json_tiny.picture.height > json_tiny.picture.width) {//瘦高型
									if (blob_width > blob_height) {//图片是矮胖型
										//放大
										var zoom = (json_tiny.picture.height * blob_width) / (json_tiny.picture.width * blob_height)
										var y = (json_tiny.picture.height - (json_tiny.picture.width * blob_height) / blob_width) * zoom / 4
										var x = (json_tiny.picture.width * zoom - json_tiny.picture.width) / 4

										data.pages[e1.source._parent.index].scroll.scale = zoom
										data.pages[e1.source._parent.index].scroll.x = x
										data.pages[e1.source._parent.index].scroll.y = y
									}
								} 
								
								if (json_tiny.picture.height < json_tiny.picture.width) {	//矮胖型
									if (blob_height > blob_width) {//图片是瘦高型
										//放大
										var zoom = (json_tiny.picture.width * blob_height) / (json_tiny.picture.height * blob_width)
										var x = (json_tiny.picture.width - (json_tiny.picture.height * blob_width) / blob_height) * zoom / 4
										var y = (json_tiny.picture.height * zoom - json_tiny.picture.height) / 4

										data.pages[e1.source._parent.index].scroll.scale = zoom
										data.pages[e1.source._parent.index].scroll.x = x
										data.pages[e1.source._parent.index].scroll.y = y
									}
								}

								album_page(win, data.pages[e1.source._parent.index], kid_json, width, height, e1.source._parent.index, parent.relate_thumb, parent)
								
								parent.relate_thumb.fireEvent("set_status", {
									status : "normal"
								})
								parent.relate_thumb.fireEvent("selected")
								Ti.App.modified = true;

								Ti.App.book_json = data
								
								blob = null;
								cache_file = null;
								data = null;						
					}
							
					if (e.index == 0) {
						if (Ti.App.is_android){
							select_photo(false, function(blob, path, width, height){
								Ti.API.log("blob---width:" + width + " blob---height:" + height)
								select_picture_success({media : blob, width: width, height: height})
							});
						}
						else{
							mymedia.openPhotoGallery({
								success : select_picture_success,
								cancel : function() {
									Ti.API.debug("openPhotoGallery CANCEL");
								},
								error : function(error) {
									Ti.API.error("openPhotoGallery ERROR: " + JSON.stringify(error));
								},
								animated : true,
								allowEditing : false,
								mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
							});	
						}
					} 
					else if (e.index == 1) {
						var AlbumSucai = require('album_sucai');
						var win = new AlbumSucai({
							title : '选择素材',
							backgroundColor : '#fff',
							mode : "single"
						});
						
						Ti.App.parent = e1.source._parent;
						pre(win);
						Ti.App.currentTabGroup.activeTab.open(win, {
							animated : true
						});
					}
				});
				dialog.show()

			}

			if (Ti.App.album_mode.indexOf("preview") >= 0){
				picture.touchEnabled = false;
				logo_container.touchEnabled = false;
			}
			if (!Ti.App.is_android)
				picture.addEventListener("touchend", pic_click)
		}

		var textarea = Ti.UI.createTextArea({
			borderWidth : 0,
			borderColor : 'transparent',
			borderRadius : __l(6),
			font : {
				fontSize : __l(10) * scale_ratio
			},
			backgroundColor : 'transparent',
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			color : template_json.text.color,
			zIndex : 2,
			index : index
		})
		textarea.addEventListener("focus", function(e){
			if (textarea.value == "文字"){
				textarea.value = ""
			}
		})
		textarea.addEventListener("blur", function(e){
			if (textarea.value == ""){
				textarea.value = "文字"
			}
		})
		
		if (json.text == "文字"){
			if (Ti.App.is_android){
				textarea.hintText = json.text
			}
			else{
				textarea.value = json.text
			}
			if (Ti.App.album_mode.indexOf("preview") >= 0){
				textarea.value = ''
			}
		}
		else{
			textarea.value = json.text
		}
		
		if (Ti.App.album_mode.indexOf("preview") >= 0){
			textarea.hintText = ''
		}
		
		if (Ti.App.is_android){
			if (Ti.App.album_mode.indexOf("preview") >= 0){
				textarea.enabled = false;
				textarea.editabled = false;
				textarea.borderWidth = 0;
				textarea.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
			}		
		}

		var count_label = Ti.UI.createLabel({
			text : 140 - json.text.length,
			color : '#444',
			font : {
				fontSize : __l(11)
			},
			height : __l(14),
			width : Ti.UI.SIZE,
			bottom : 2,
			right : 4,
			textAlign : 'right'
		})
		textarea.add(count_label);
		textarea.count_label = count_label
		count_label.hide();

		if (template_json.fullscreen) {
			var textarea_wrapper = Ti.UI.createView({
				borderRadius : __l(6),
				backgroundColor : 'white',
				opacity : 0.5,
				zIndex : 1
			})
			if (template_json.text.left) {
				textarea_wrapper.left = __l(template_json.text.left / 2) * scale_ratio - __l(10)
			}
			if (template_json.text.top) {
				textarea_wrapper.top = __l(template_json.text.top / 2) * scale_ratio - __l(10)
			}
			if (template_json.text.width) {
				textarea_wrapper.width = __l(template_json.text.width / 2) * scale_ratio + __l(20)
			}
			if (template_json.text.height) {
				textarea_wrapper.height = __l(template_json.text.height / 2) * scale_ratio + __l(20)
			}
			view.add(textarea_wrapper)
		}
		textarea.addEventListener("change", function(e) {
			var data = Ti.App.book_json
			data.pages[e.source.index].text = e.source.value;
			e.source.count_label.text = 140 - e.source.value.length
			Ti.App.modified = true;

			if (parseInt(e.source.count_label.text) < 0) {
				count_label.text = 0
				e.source.value = e.source.value.substr(0, 140)
			}
			
			Ti.App.book_json = data;
		})
		textarea.addEventListener("focus", function(e) {
			e.source.count_label.show()
			e.source.borderWidth = 1
		})
		textarea.addEventListener("blur", function(e) {
			e.source.borderWidth = 0
			e.source.count_label.hide()
		})
		//加入文本框和label
		if (template_json.text.left) {
			textarea.left = __l(template_json.text.left / 2) * scale_ratio - 10
		}
		if (template_json.text.right) {
			textarea.right = __l(template_json.text.right / 2) * scale_ratio - 10
		}
		if (template_json.text.top) {
			textarea.top = __l(template_json.text.top / 2) * scale_ratio - 10
		}
		if (template_json.text.bottom) {
			textarea.bottom = __l(template_json.text.bottom / 2) * scale_ratio
		}
		if (template_json.text.width) {
			textarea.width = __l(template_json.text.width / 2) * scale_ratio + 20
		}
		if (template_json.text.height) {
			textarea.height = __l(template_json.text.height / 2) * scale_ratio + 20
		}

		/*
		if (Ti.App.is_android){
			var textarea_hide = Ti.UI.createTextArea({
				zIndex : 3,
				left : -100,
				top : -100,
				width: 10,
				height: 10,
				softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
			})
			view.add(textarea_hide)	
			textarea_hide.focus()
		}
		*/
		
		view.add(textarea)
	}

	return view;
}

exports.album_page = album_page;
