var functions = {
	"体重_yun" : function(picker){
		picker.label = "我的体重是";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var shi = 50;
		var ge = "";
		
		for(var i=40; i<=110; i++){
			column1.addRow(Ti.UI.createPickerRow({title : i + ''}));
		}
		
		column2.addRow(Ti.UI.createPickerRow({title : ".0 kg", item_value: ""}));
		column2.addRow(Ti.UI.createPickerRow({title : ".5 kg", item_value: ".5"}));
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "今天称了个体重，已经有" + shi + ge + "公斤了！"
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = "我的体重是：" + shi + ge + "公斤";
			picker.write_str = "今天称了个体重，已经有" + shi + ge + "公斤了！"
		})
	},
	"体温_yun" : function(picker){
		picker.label = "我的体温是";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var shi = 35;
		var ge = "0";
		
		for(var i=35; i<=42; i++){
			column1.addRow(Ti.UI.createPickerRow({title : i + ''}));
		}
		
		for(var i=0; i<=9; i++){
			column2.addRow(Ti.UI.createPickerRow({title : "." + i + " ℃", item_value: i}));
		}
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "今天量了个体温：" + shi + "." + ge + "℃！"
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = "我的体温是：" + shi + "." + ge + "℃";
			picker.write_str = "今天量了个体温：" + shi + "." + ge + "℃！"
		})
	},
	"孕吐_yun" : function(picker){
		picker.label = "今天孕吐了1次";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		var column3 = Ti.UI.createPickerColumn();
		
		var bai = "今天";
		var shi = "1次";
		var ge = "干呕";
		
		column1.addRow(Ti.UI.createPickerRow({title : "今天"}));
		column1.addRow(Ti.UI.createPickerRow({title : "早上"}));
		column1.addRow(Ti.UI.createPickerRow({title : "中午"}));
		column1.addRow(Ti.UI.createPickerRow({title : "晚上"}));
		
		for(var i=1; i<=10; i++){
			column2.addRow(Ti.UI.createPickerRow({title : i + '次'}));
		}
		
		column3.addRow(Ti.UI.createPickerRow({title : "干呕"}));
		column3.addRow(Ti.UI.createPickerRow({title : "吐酸水"}));
		column3.addRow(Ti.UI.createPickerRow({title : "吐苦水"}));
		column3.addRow(Ti.UI.createPickerRow({title : "吐的不多"}));
		column3.addRow(Ti.UI.createPickerRow({title : "吃的全吐了"}));
		column3.addRow(Ti.UI.createPickerRow({title : "狂吐"}));
		column3.addRow(Ti.UI.createPickerRow({title : "吐血"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/3
			column2.width = Ti.App.platform_width/3
			column3.width = Ti.App.platform_width/3
		}
		picker.add(column1)
		picker.add(column2)
		picker.add(column3);
		picker.write_str = bai + ge + shi;
		
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				bai = e.row.title
			}
			else if (e.columnIndex == 1){
				shi = e.row.title
			}
			else{
				ge = e.row.title
			}
			
			picker.l.text = bai + "呕吐" + shi + "，" + ge;
			picker.write_str = bai + "呕吐" + shi + "，" + ge;
			
		})
	},
	"胎动_yun" : function(picker){
		picker.label = "胎动";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var shi = "早上";
		var ge = "1次/小时";
		
		column1.addRow(Ti.UI.createPickerRow({title : '早上'}));
		column1.addRow(Ti.UI.createPickerRow({title : '中午'}));
		column1.addRow(Ti.UI.createPickerRow({title : '晚上'}));
		
		for(var i=3; i<=40; i++){
			column2.addRow(Ti.UI.createPickerRow({title : i + "次/小时"}));
		}
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "今天" + shi + "感觉到胎动" + ge + "次/小时"
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.title
			}
			picker.l.text = "今天" + shi + "感觉到胎动" + ge 
			picker.write_str = "今天" + shi + "感觉到胎动" + ge 
		})
	},
	"睡眠_yun" : function(picker) {
		picker.label = "睡眠";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		var column3 = Ti.UI.createPickerColumn();
		
		var bai = "白天睡眠";
		var shi = "10分钟";
		var ge = "很香甜";
		
		column1.addRow(Ti.UI.createPickerRow({title : "白天睡眠"}));
		column1.addRow(Ti.UI.createPickerRow({title : "夜间睡眠"}));
		
		column2.addRow(Ti.UI.createPickerRow({title : '10分钟'}));
		column2.addRow(Ti.UI.createPickerRow({title : '30分钟'}));
		column2.addRow(Ti.UI.createPickerRow({title : '40分钟'}));
		column2.addRow(Ti.UI.createPickerRow({title : '50分钟'}));
		for(var i=1; i<=10; i++){
			column2.addRow(Ti.UI.createPickerRow({title : i + '小时'}));
		}
		
		column3.addRow(Ti.UI.createPickerRow({title : "很香甜"}));
		column3.addRow(Ti.UI.createPickerRow({title : "不太安稳"}));
		column3.addRow(Ti.UI.createPickerRow({title : "总是醒"}));
		column3.addRow(Ti.UI.createPickerRow({title : "尿频"}));
		column3.addRow(Ti.UI.createPickerRow({title : "根本睡不着"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/3
			column2.width = Ti.App.platform_width/3
			column3.width = Ti.App.platform_width/3
		}
		
		picker.add(column1)
		picker.add(column2)
		picker.add(column3);
		picker.write_str = bai + shi + "，"+ ge;
		
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				bai = e.row.title
			}
			else if (e.columnIndex == 1){
				shi = e.row.title
			}
			else{
				ge = e.row.title
			}
			if (ge == "根本睡不着"){
				picker.l.text = bai + ge;
				picker.write_str = bai + ge;
			}
			else{
				picker.l.text = bai + shi + "，" + ge;
				picker.write_str = bai + shi + "，" + ge;
			}
			
		})
	},
	"孕检_yun" : function(picker){
		var data = ["血压", "宫高", "胎心", "尿常规", "静脉血", "心电图", "B超", "唐氏综合征筛查", "糖尿病筛查", "乙型肝炎抗原", "梅毒血清试验"];
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = "选择孕检项目"
		picker.write_str = "今天去医院孕检，项目是：";
		picker.addEventListener("click", function(e){
			var result = "今天去医院孕检，项目是：";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	},
	"营养" : function(picker){
		var data = ["钙", "锌", "铁", "镁", "牛初乳", "鱼肝油", "维生素", "DHA", "葡萄糖", "核桃油", "益生菌"];
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = "选择补充的营养"
		picker.write_str = kid.name + "今天补了";
		picker.addEventListener("click", function(e){
			var result = kid.name + "今天补了";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	},
	"营养_yun" : function(picker){
		var data = ["孕妇奶粉", "叶酸", "DHA", "维生素", "钙", "铁", "锌", "牛初乳", "益生菌"];
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = "选择补充的营养"
		picker.write_str = "今天我补了";
		picker.addEventListener("click", function(e){
			var result = "今天我补了";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	},
	"身高" : function(picker){
		picker.label = kid.name + "的身高是";
		var ge = 40;
		
		var data = [];
		for(var i=40; i<=150; i++){
			data.push(Ti.UI.createPickerRow({title : i + '  cm'}));
		}
		var column1 = Ti.UI.createPickerColumn({rows: data});
		if (Ti.App.is_android)
			column1.width = Ti.App.platform_width
		
		picker.add(column1);
		picker.write_str = "今天给" + kid.name + "量了身高，已经有" +  ge + "厘米了！"
		picker.addEventListener("change", function(e){
			picker.l.text = kid.name + "的身高是：" + parseInt(e.row.title) + "厘米";
			ge = parseInt(e.row.title)
			
			picker.write_str = "今天给" + kid.name + "量了身高，已经有" + ge + "厘米了！"
		})
	},
	"体重" : function(picker){
		picker.label = kid.name + "的体重是";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var shi = 2;
		var ge = "0";
		
		for(var i=2; i<=30; i++){
			column1.addRow(Ti.UI.createPickerRow({title : i + ''}));
		}
		
		for(var i=0; i<=9; i++){
			column2.addRow(Ti.UI.createPickerRow({title : "." + i + " kg", item_value: i}));
		}
		picker.add(column1)
		picker.add(column2);
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
			
		picker.write_str = "今天给" + kid.name + "量了体重，已经有" + shi + "." + ge + "公斤了！"
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value;
			}
			picker.l.text = kid.name + "的体重是：" + shi + "." + ge + "公斤";
			picker.write_str = "今天给" + kid.name + "量了体重，已经有" + shi + "." + ge + "公斤了！"
		})
	},
	"体温" : function(picker){
		picker.label = kid.name + "的体温是";
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var shi = 36;
		var ge = "0";
		
		for(var i=36; i<=42; i++){
			column1.addRow(Ti.UI.createPickerRow({title : i + ''}));
		}
		
		for(var i=0; i<=9; i++){
			column2.addRow(Ti.UI.createPickerRow({title : "." + i + " ℃", item_value: i}));
		}
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "今天给" + kid.name + "量了体温：" + shi + "." + ge + "℃！"
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = kid.name + "的体温是：" + shi + "." + ge + "℃";
			picker.write_str = "今天给" + kid.name + "量了体温：" + shi + "." + ge + "℃！"
		})
	},
	"奶粉" : function(picker){
		var shi = '配方奶粉'
		var ge = '30毫升'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		column1.addRow(Ti.UI.createPickerRow({title : '配方奶粉'}));
		column1.addRow(Ti.UI.createPickerRow({title : '牛奶'}));
		column1.addRow(Ti.UI.createPickerRow({title : '羊奶'}));
		
		column2.addRow(Ti.UI.createPickerRow({title : "20 ml", item_value: "20毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "30 ml", item_value: "30毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "40 ml", item_value: "40毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "50 ml", item_value: "50毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "60 ml", item_value: "60毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "70 ml", item_value: "70毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "80 ml", item_value: "80毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "90 ml", item_value: "90毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "100 ml", item_value: "100毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "110 ml", item_value: "110毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "120 ml", item_value: "120毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "130 ml", item_value: "130毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "140 ml", item_value: "140毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "150 ml", item_value: "150毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "160 ml", item_value: "160毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "170 ml", item_value: "170毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "180 ml", item_value: "180毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "190 ml", item_value: "190毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "200 ml", item_value: "200毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "210 ml", item_value: "210毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "220 ml", item_value: "220毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "250 ml", item_value: "250毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "300 ml", item_value: "300毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "350 ml", item_value: "350毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "400 ml", item_value: "400毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "450 ml", item_value: "450毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "500 ml", item_value: "500毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "550 ml", item_value: "550毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "600 ml", item_value: "600毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "650 ml", item_value: "650毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "700 ml", item_value: "700毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "750 ml", item_value: "750毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "800 ml", item_value: "800毫升"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "刚才" + kid.name + "喝了" + shi + ge ;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = kid.name + "喝了" + shi + ge ;
			picker.write_str = "刚才" + kid.name + "喝了" + shi + ge ;
		})
	},
	"母乳" : function(picker){
		var shi = '合计'
		var ge = '5分钟'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		column1.addRow(Ti.UI.createPickerRow({title : '左侧乳房'}));
		column1.addRow(Ti.UI.createPickerRow({title : '右侧乳房'}));
		column1.addRow(Ti.UI.createPickerRow({title : '合计'}));
		
		column2.addRow(Ti.UI.createPickerRow({title : "5 min", item_value: "5分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "10 min", item_value: "10分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "15 min", item_value: "15分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "20 min", item_value: "20分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "25 min", item_value: "25分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "30 min", item_value: "30分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "35 min", item_value: "35分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "40 min", item_value: "40分钟"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "刚才" + kid.name + "喝母乳了，" + shi + "喝了" + ge;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = shi + "喝了" +  ge ;
			picker.write_str = "刚才" + kid.name + "喝母乳了，" + shi + "喝了" + ge;
		})
	},
	"饮水" : function(picker){
		var shi = '水'
		var ge = '100毫升'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var data = ["水", "苹果汁", "橙汁", "梨汁", "西瓜汁", "胡萝卜汁", "蔬菜汁", "绿豆水", "柠檬水"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		column2.addRow(Ti.UI.createPickerRow({title : "20 ml", item_value: "20毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "30 ml", item_value: "30毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "40 ml", item_value: "40毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "50 ml", item_value: "50毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "60 ml", item_value: "60毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "70 ml", item_value: "70毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "80 ml", item_value: "80毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "90 ml", item_value: "90毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "100 ml", item_value: "100毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "110 ml", item_value: "110毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "120 ml", item_value: "120毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "130 ml", item_value: "130毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "140 ml", item_value: "140毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "150 ml", item_value: "150毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "160 ml", item_value: "160毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "170 ml", item_value: "170毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "180 ml", item_value: "180毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "190 ml", item_value: "190毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "200 ml", item_value: "200毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "210 ml", item_value: "210毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "220 ml", item_value: "220毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "250 ml", item_value: "250毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "300 ml", item_value: "300毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "350 ml", item_value: "350毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "400 ml", item_value: "400毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "450 ml", item_value: "450毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "500 ml", item_value: "500毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "550 ml", item_value: "550毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "600 ml", item_value: "600毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "650 ml", item_value: "650毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "700 ml", item_value: "700毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "750 ml", item_value: "750毫升"}));
		column2.addRow(Ti.UI.createPickerRow({title : "800 ml", item_value: "800毫升"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "刚才" + kid.name + "喝了" + ge + shi;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value
			}
			picker.l.text = kid.name + "喝了" +  ge + shi;
			picker.write_str = "刚才" + kid.name + "喝了" + ge + shi;
		})
	},
	"辅食" : function(picker){
		var bai = '蛋黄'
		var shi = '尝了点'
		var ge = '过敏'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		var column3 = Ti.UI.createPickerColumn();
		
		var data = ["蛋黄", "苹果泥", "香蕉泥", "胡萝卜泥", "南瓜泥", "红薯泥", "米汤", "米粉", "米粥", "菜泥", "肉泥", "肝泥", "鱼泥", "海鲜泥", "面条", "豆腐", "磨牙棒"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		data = ["尝了点", "少量吃", "适中吃", "吃多了"]
		for(var i=0; i<data.length; i++){
			column2.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		data = ["过敏", "不喜欢", "还可以", "爱吃"]
		for(var i=0; i<data.length; i++){
			column3.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/3
			column2.width = Ti.App.platform_width/3
			column3.width = Ti.App.platform_width/3
		}
		picker.add(column1)
		picker.add(column2)
		picker.add(column3);
		picker.write_str = kid.name + "刚才" + shi + bai + "，" + "表现" + ge ;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				bai = e.row.title
			}
			else if (e.columnIndex == 1){
				shi = e.row.title
			}
			else{
				ge = e.row.title
			}
			picker.l.text = shi + bai + "，" + "表现" + ge ;
			picker.write_str = kid.name + "刚才" + shi + bai + "，" + "表现" + ge ;
		})
	},
	"用餐" : function(picker){
		var data = ["粥", "汤", "蔬菜", "肉", "鱼", "虾", "面条", "米饭", "馄饨", "包子", "饺子", "比萨", "汉堡", "面包", "火锅", "自助餐"];
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = kid.name + "刚才吃了"
		picker.write_str = kid.name + "刚才吃了";
		picker.addEventListener("click", function(e){
			var result = "今天" + kid.name + "吃了";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	},
	"嘘嘘" : function(picker){
		var shi = '清澈'
		var ge = '量少'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var data = ["清澈", "颜色淡", "偏黄", "偏深"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		data = ["量少", "量适中", "量大", "多次"]
		for(var i=0; i<data.length; i++){
			column2.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = "刚才" + kid.name + "嘘嘘了，" + shi + ge;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.title
			}
			picker.l.text = kid.name + "嘘嘘，" + shi + ge;
			picker.write_str = "刚才" + kid.name + "嘘嘘了，" + shi + ge;
		})
	},
	"便便" : function(picker){
		var bai = '胎便'
		var shi = ''
		var ge = '金黄'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		var column3 = Ti.UI.createPickerColumn();
		
		var data = ["胎便", "条状", "奶瓣状", "稀坨坨", "稠坨坨", "小球状", "有泡沫", "蛋花状", "豆腐渣状", "带油", "有不消化物"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		for(var i=1; i<6; i++){
			if (i==1)
				column2.addRow(Ti.UI.createPickerRow({title : i + "次", item_value: ""}));
			else
				column2.addRow(Ti.UI.createPickerRow({title : i + "次", item_value: i + "次"}));
		}
		
		data = ["金黄", "土黄", "土绿", "灰白", "褐", "偏黑"]
		for(var i=0; i<data.length; i++){
			column3.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/3
			column2.width = Ti.App.platform_width/3
			column3.width = Ti.App.platform_width/3
		}
		picker.add(column1)
		picker.add(column2)
		picker.add(column3);
		picker.write_str = "今天" + kid.name + "便便了，" + bai + "，" + ge + "色";
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				bai = e.row.title
			}
			else if (e.columnIndex == 1){
				shi = e.row.item_value;
			}
			else if (e.columnIndex == 2){
				ge = e.row.title
			}
			picker.l.text = kid.name + "便便了" + shi + "，" + bai + "，" + ge + "色";
			picker.write_str = "今天" + kid.name + "便便了" + shi + "，" + bai + "，" + ge + "色";
		})
	},
	"白天睡眠" : function(picker){
		var shi = '很踏实'
		var ge = '10分钟'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var data = ["很踏实", "不太安稳", "总是醒", "根本不睡", "拍着抱着才睡", "正常"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		column2.addRow(Ti.UI.createPickerRow({title : "10分钟", item_value: "10分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "20", item_value: "20分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "30", item_value: "30分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "40", item_value: "40分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "50", item_value: "50分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "1小时", item_value: "1小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "2", item_value: "2小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "3", item_value: "3小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "4", item_value: "4小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "5", item_value: "5小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "6", item_value: "6小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "7", item_value: "7小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "8", item_value: "8小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "9", item_value: "9小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "10", item_value: "10小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "11", item_value: "11小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "12", item_value: "12小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "13", item_value: "13小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "14", item_value: "14小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "15", item_value: "15小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "16", item_value: "16小时"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = kid.name + "白天睡了" + ge + "，" + shi;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value;
			}
			picker.l.text = "白天睡了" + ge + "，" + shi;
			picker.write_str = kid.name + "白天睡了" + ge + "，" + shi;
			if (shi == "根本不睡"){
				picker.l.text = kid.name + shi;
				picker.write_str = kid.name + shi;
			}
		})
	},
	"夜间睡眠" : function(picker){
		var shi = '很踏实'
		var ge = '10分钟'
		var column1 = Ti.UI.createPickerColumn();
		var column2 = Ti.UI.createPickerColumn();
		
		var data = ["很踏实", "不太安稳", "总是醒", "根本不睡", "拍着抱着才睡", "正常"];
		for(var i=0; i<data.length; i++){
			column1.addRow(Ti.UI.createPickerRow({title : data[i]}));
		}
		
		column2.addRow(Ti.UI.createPickerRow({title : "10分钟", item_value: "10分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "20", item_value: "20分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "30", item_value: "30分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "40", item_value: "40分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "50", item_value: "50分钟"}));
		column2.addRow(Ti.UI.createPickerRow({title : "1小时", item_value: "1小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "2", item_value: "2小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "3", item_value: "3小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "4", item_value: "4小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "5", item_value: "5小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "6", item_value: "6小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "7", item_value: "7小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "8", item_value: "8小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "9", item_value: "9小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "10", item_value: "10小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "11", item_value: "11小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "12", item_value: "12小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "13", item_value: "13小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "14", item_value: "14小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "15", item_value: "15小时"}));
		column2.addRow(Ti.UI.createPickerRow({title : "16", item_value: "16小时"}));
		
		if (Ti.App.is_android){
			column1.width = Ti.App.platform_width/2
			column2.width = Ti.App.platform_width/2
		}
		picker.add(column1)
		picker.add(column2);
		picker.write_str = kid.name + "晚上睡了" + ge + "，" + shi;
		picker.addEventListener("change", function(e){
			if (e.columnIndex == 0){
				shi = e.row.title
			}
			else{
				ge = e.row.item_value;
			}
			picker.l.text = "晚上睡了" + ge + "，" + shi;
			picker.write_str = kid.name + "晚上睡了" + ge + "，" + shi;
			if (shi == "根本不睡"){
				picker.l.text = kid.name + shi;
				picker.write_str = kid.name + shi;
			}
		})
	},
	"疫苗" : function(picker){
		var data = ["乙型肝炎疫苗第一针", "卡介苗初种",	"乙型肝炎疫苗第二针","脊髓灰质炎糖丸第一次", 
					"脊髓灰质炎糖丸第二次", "百白破疫苗第一次", "脊髓灰质炎糖丸第三次", "百白破疫苗第二次",
					"百白破疫苗第三次", "乙型肝炎疫苗第三针", "A群流脑疫苗第一针", "麻疹疫苗第一针",
					"A群流脑疫苗第二针", "乙脑初免两针", "百白破疫苗加强","脊髓灰质炎糖丸加强",
					"乙脑疫苗加强", "A群流脑疫苗第三针", "脊髓灰质炎疫苗加强",
					"流感疫苗","肺炎疫苗","水痘疫苗","甲肝疫苗",
					"HIB疫苗", "轮状病毒疫苗", "狂犬病疫苗"];
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = kid.name + "今天打了"
		picker.write_str = kid.name + "今天打了";
		picker.addEventListener("click", function(e){
			var result = kid.name + "今天打了";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	},
	"娱乐" : function(picker){
		var data = ["晒太阳", "听音乐", "听故事", "说说话", "洗澡", "抚触", "亲子游戏", "婴儿游泳", "看书", "聚会", "下棋", "运动", "跳舞", "唱歌", "画画", "公园", "参观", "串门", "公益", "逛街", "采摘", "旅游", "看电影", "看演出", "看电视", "玩ipad", "电子游戏"]
		for(var i=0; i<data.length; i++){
			picker.appendRow(make_row(data[i]))
		}
		
		picker.label = kid.name + "今天的活动:"
		picker.write_str = kid.name + "今天的活动：";
		picker.addEventListener("click", function(e){
			var result = kid.name + "今天的活动:";
			var options = []
			for(var i = 0; i < picker.data.length; i++) {
				for(var j=0; j<picker.data[i].rowCount; j++){
					if (picker.data[i].rows[j].hasCheck)
						options.push(picker.data[i].rows[j]._title)
				}
			}
			for(var i=0; i<options.length; i++){
				result += options[i];
				result += i == options.length-1 ? '。' : '，'
			}
			
			picker.write_str = result;
		})
	}
}

var g_picker_view = null;
var kid = null;
var today_str = "";
//var win = Titanium.UI.currentWindow;
var PickerView = require('lib/picker_view')

function visible_items(){
	if (Ti.App.logicalDensityFactor == 1.5 && Ti.App.density == "high"){
		return 8;
	}
	
	if (Ti.App.is_android && Ti.App.platform_width >= 480){
		return 5;
	}
	if (Ti.App.is_android && Ti.App.platform_width <= 320){
		return 6;
	}
	return 7;
}
function jiance_popup(win, name, user_kid, today_str, currentTab) {
	kid = user_kid
	var picker = Ti.UI.createPicker({label: ' ', 
									name: name, 
									selectionIndicator : true,
									width: Ti.App.platform_width, 
									useSpinner: true, 
									visibleItems: visible_items()
	});
	
	var map = {"吃喝": ["奶粉", "母乳", "饮水", "营养", "辅食", "用餐"],
			   "拉撒": ["嘘嘘", "便便"],
			   "睡眠": ["白天睡眠", "夜间睡眠"]}
			   
	var multi_select = ['用餐', '疫苗', '娱乐', '营养', '营养_yun', '孕检_yun'];
	if (map[name]){
		var options = map[name]
		options.push("取消")
		var optionsDialogOpts = {options: options, cancel: options.length -1};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.name = name
		dialog.picker = picker
		dialog.addEventListener("click", function(e){
			if (e.index == e.source.options.length - 1){
				return;
			}
			var name = map[e.source.name][e.index]
			var _picker = e.source.picker;
			if (multi_select.indexOf(name) > -1){
				_picker = Titanium.UI.createTableView({
					top: Ti.App.is_android ? __l(40) : 143,
					l: ' ',
				});
				
				_picker.addEventListener("click", function(e){
					e.source.hasCheck = !e.source.hasCheck;
				})
				functions[name](_picker);
			}
			else if (functions[name]) {
		    	functions[name](_picker);
			}
			_picker.hide();
			var picker_view = PickerView.create_picker_view(_picker, function() {
				var WritePost = require("write_post")
				var win = new WritePost({
					title : '日常监测',
					backgroundColor : '#fff',
					text : (name.indexOf('_yun') > 0 ? "#孕期监测#" : "#日常监测#") + _picker.write_str,
					kind : 'jiance',
					from : 'jiance',
					today_str : today_str
				});
				pre(win)
	
				win.backButtonTitle = ''
				currentTab.open(win, {
					animated : true
				});
				win.remove(_picker)
				_picker.hide();
				_picker = null;
			})
	
			win.add(picker_view)
			_picker.show()
			picker_view.animate(PickerView.picker_slide_in);
		})
		dialog.show();
		return;
	}
	
	if (multi_select.indexOf(name) > -1){
		picker = Titanium.UI.createTableView({
					top: Ti.App.is_android ? __l(40) : 143,
					name: name,
					l: ' ',
		});
		if (Ti.App.is_android)
			picker.top = __l(40)
		
		picker.addEventListener("click", function(e){
			e.source.hasCheck = !e.source.hasCheck;
		})
		functions[name](picker);
	}
	else if (functions[name]) {
    	functions[name](picker);
	}
	
	picker.hide();
	
	if (g_picker_view){
		g_picker_view.animate(PickerView.picker_slide_out);
	}
	
	var picker_view = PickerView.create_picker_view(picker, function() {
		var WritePost = require("write_post")
		var win = new WritePost({
			title : '日常监测',
			backgroundColor : '#fff',
			text : (picker.name.indexOf('_yun') > 0 ? "#孕期监测#" : "#日常监测#") + picker.write_str,
			kind : 'jiance',
			from : 'jiance',
			today_str : today_str
		});
		pre(win)

		win.backButtonTitle = ''
		currentTab.open(win, {
			animated : true
		});
		win.remove(picker)
		picker.hide();
		picker = null;
	})

	win.add(picker_view)
	picker.show()
	picker_view.animate(PickerView.picker_slide_in);
	g_picker_view = picker_view;
	
	return picker_view;
}
	//////////////安卓下必须这么干//////////////////////
	var bg_color = '#fff';

function make_row(title){
		var row = Ti.UI.createTableViewRow({
				height : __l(34),
				color: '#333',
				selectedColor: '#fff',
				_title: title
		});
		var label1 = Ti.UI.createLabel({
				color : '#333',
				left : __l(10),
				top : 0,
				height : __l(34),
				width : __l(160),
				font : {
					fontSize : __l(14)
				},
				touchEnabled: false,
				text : title
		});
		row.add(label1)
		return row;
	}

function __l(x){
	if (Ti.App.is_android){
		 if (Ti.App.platform_height/Ti.App.logicalDensityFactor > 800)
			return x * Ti.App.logicalDensityFactor * 1.4;
		else
			return x * Ti.App.logicalDensityFactor;
			
		 //return parseInt(Ti.App.platform_width*x/(Ti.App.logicalDensityFactor == 1 ? 360 : 320));
	}
	
	if (!Ti.App.is_android && !Ti.App.is_ipad && Ti.App.platform_width > 320){
		return parseInt(375.0*x/320);
	}
	
	return Ti.App.is_ipad ? 1.5*x : x;
	/*
	if (Ti.App.is_android && Ti.App.platform_width > 320 && Ti.App.platform_width <=400){
		return parseInt(1.1*x);
	}
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	return Ti.App.is_ipad ? 2*x : x;
	*/
}
exports.jiance_popup = jiance_popup; 