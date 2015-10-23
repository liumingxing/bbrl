function template_page(win, kind_en, kind_cn, color, today_str) {
	win.kind_cn = kind_cn

	win.fullscreen = true
	
	var scrolly = null;
	if (Ti.App.is_android){
		scrolly = Titanium.UI.createView({
			contentWidth: __l(320),
			//contentHeight: __l(479),
			contentHeight: __l(480),
			bottom: (Ti.App.platform_height - __l(480) - __l(42))/2 + __l(42),
			//top: 0,
			width: __l(320),
			height: __l(480),
			//height: Ti.UI.SIZE,
			scrollingEnabled: false,
			touchEnabled: false
		});
		if ((Ti.App.platform_height - __l(480) - __l(42))/2 < 0){
			//scrolly.top = __l(10)
			scrolly.bottom = 0
		}
	}
	else{
		scrolly = Titanium.UI.createScrollView({
			contentHeight:'auto',
			top: 0,
			width: __l(320),
			height: __l(480)
		});	
	}
	
	win.add(scrolly)
	win.scrolly = scrolly;

	var toolbar = Titanium.UI.createView({
		height : __l(42),
		width : Ti.App.platform_width,
		left : 0,
		right : 0,
		//top: Ti.App.platform_height - __l(42),
		bottom : 0,
		borderWidth : 0,
		backgroundImage : "./images/toolbar.png",
		zIndex : 2
	})
	win.add(toolbar)

	var fanhui = Titanium.UI.createButton({
		height : __l(28),
		width : __l(59),
		top : __l(8),
		left : __l(30),
		title: "返回",
		font: {
			fontSize: __l(14)
		}
	})
	pre_btn(fanhui)
	fanhui.addEventListener("click", function() {
		if (!Ti.App.is_android){
			win.showNavBar();
		}
		
		win.close();
	})
	toolbar.add(fanhui)
	
	var preview = Titanium.UI.createButton({
		height : __l(28),
		width : __l(59),
		top : __l(8),
		right : __l(30),
		title : "预览",
		font: {
			fontSize: __l(14)
		}
	})
	pre_btn(preview)
	preview.addEventListener("click", function() {
		if (win.has_picture()){			//已经选了照片
			scrolly.height = __l(480)
			fanhui.hide();
			preview.hide();
			fanhui2.show();
			share.show();
			save.show();
			
			if (win.preview_callback){
				win.preview_callback();
			}
		}
		else{							//还没选照片
			var a = Titanium.UI.createAlertDialog({
				message:'没照片可无法继续啊！',
				buttonNames: ['选择图片', '取消'],
				cancel: 1
			});
			a.addEventListener("click", function(e){
				if (e.index == 0){
					select_photo(true, win.select_picture_callback);
				}
			})
			a.show();

		}
	})
	toolbar.add(preview)
	
	//预览时的返回
	var fanhui2 = Titanium.UI.createButton({
		height : __l(28),
		width : __l(59),
		top : __l(8),
		left : __l(30),
		title : "返回",
		visible: false,
		font: {
			fontSize: __l(14)
		}
	})
	pre_btn(fanhui2)
	fanhui2.addEventListener("click", function() {
		fanhui.show();
		preview.show();
		fanhui2.hide();
		share.hide();
		save.hide();
		if (win.edit_callback){
			win.edit_callback();
		}
	})
	toolbar.add(fanhui2)
	
	//预览时的保存到相册
	var save = Titanium.UI.createButton({
		height : __l(28),
		width : __l(59),
		top : __l(8),
		left : (Ti.App.platform_width - __l(59))/2,
		visible: false,
		title : "保存",
		font: {
			fontSize: __l(14)
		}
	})
	pre_btn(save)
	save.addEventListener("click", function() {
			win.remove(toolbar)
			if (!Ti.App.is_android){
				Titanium.Media.saveToPhotoGallery(win.scrolly.toImage(null, true), {
					success : function(e) {
						show_alert("提示", "作品成功保存到相册")
					},
					error : function(e) {
						show_alert("提示", "保存到相册时发生错误")
					}
				});
			}
			else{
				var time = new Date();
				var f = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, "image_1" + time.getTime() + ".png"); 
				f.write(win.scrolly.toImage().media); 
				Ti.Media.Android.scanMediaFiles([f.nativePath], null, function(e){});
						
				show_alert("提示", "作品成功保存到相册")
			}
			win.add(toolbar)
	})
	toolbar.add(save)
	
	//预览时的分享
	var share = Titanium.UI.createButton({
		height : __l(28),
		width : __l(59),
		top : __l(8),
		right : __l(30),
		title : "分享",
		visible: false,
		font: {
			fontSize: __l(14)
		}
	})
	pre_btn(share)
	share.addEventListener("click", function() {
			win.remove(toolbar)
			if (!Ti.App.is_android){
				win.scrolly.toImage(function(e) {
						var filename = Titanium.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
						var bgImage = Titanium.Filesystem.getFile(filename);
						bgImage.write(e.blob);
						
						var text = win.text_callback();
						var kind_cn = win.kind_cn;
						win.close();
						
						Ti.App.fireEvent('write_template_post', {
							title : "发一个" + kind_cn,
							text : text,
							kind : win.kind,
							filename : filename
						});
				}, true)
			}
			else{
				var filename = Titanium.Filesystem.applicationDataDirectory + "/" + (new Date().getTime()) + ".jpg"
				var bgImage = Titanium.Filesystem.getFile(filename);
				bgImage.write(win.scrolly.toImage().media)
				
				var text = win.text_callback();
				var kind_cn = win.kind_cn;
				win.close();
						
				Ti.App.fireEvent('write_template_post', {
					title : "发一个" + kind_cn,
					text : text,
					kind : win.kind,
					filename : filename
				});
			}
	})
	toolbar.add(share)

	var bg = Ti.UI.createImageView({
		top : 0,
		left : 0,
		right : 0,
		width: __l(320),
		height: __l(480),
		hires : true,
		image : Ti.App.mamashai + "/images/bbrl/template/" + kind_en + ".jpg"
	});

	scrolly.add(bg)

	return toolbar;
}

//exports.template_page = template_page;
 