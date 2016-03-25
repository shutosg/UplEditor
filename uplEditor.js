var UplEditor = function (_uplFile, _variable) {
	var it = this;
	it.uplFile = _uplFile||it.template;
	it.dom = it.xmlToDom(it.uplFile);
	it.xml = it.domToXml(it.dom);
	it.vType = _variable||"variable2";
	it.lists = [], it.sets = [], it.BpicNames = [], it.ApicNames = [];
	
	$(function(){
		$(it.dom).find("list").each(function(){
			it.lists.push($(this)[0]);
		});
	});
	
	var params = it.getParamsFromUplFile();
	
	var sets = it.makeSetsFromParams(params);
	var exLists = it.makeListsFromSets(sets);
	//it.exDom = it.makeDomFromLists(exLists);
	
	var randomList = it.randomize(exLists);
	it.exDom = it.makeDomFromLists(randomList);
	it.setTime(it.exDom);
	it.setTitle(it.exDom, "実験用プレイリスト");
	console.log("プレイリストが作成されました。")
	console.log(it.exDom);
};

UplEditor.prototype.setTime = function(dom) {
	var it = this;
	dom.getElementsByTagName("date")[0].innerHTML = it.getTimeNow();
};

UplEditor.prototype.setTitle = function(dom, title) {
	dom.getElementsByTagName("title")[0].innerHTML = title;
};

UplEditor.prototype.getTimeNow = function() {
	var date = new Date();
	var Y = date.getFullYear();
	var M = date.getMonth();
	M = M<10?"0"+M:M;
	var D = date.getDay();
	D = D<10?"0"+D:D;
	var h = date.getHours();
	h = h<10?"0"+h:h;
	var m = date.getMinutes();
	m = m<10?"0"+m:m;
	var s= date.getSeconds();
	s = s<10?"0"+s:s;
	return Y + "/" + M + "/" + D + " " + h + ":" + m + ":" + s;
};

UplEditor.prototype.makeSetsFromParams = function (params) {
	// paramsオブジェクトからセットのarrayを作成してreturnする
	// sets配列には各listのDOM要素が格納されている
	var paramsA = params.paramsA;
	var paramsB = params.paramsB;
	var it = this;
	var sets = [], ApicNames = [], BpicNames = [];
	for (var i=0, typeLen=paramsA.sequence.length; i<typeLen; i++) {
		ApicNames[i] = paramsA.sequence[i] + "_orig";
		$(function(){
			var org = $(gi).clone(false);
			org.find("name").text(ApicNames[i]);
			org.find("in").text(paramsA.in[i] || org.find("in").text());
			org.find("out").text(paramsA.out[i] || org.find("out").text());
			org.find("folder").text(paramsA.folder[i] || org.find("folder").text());
			org.find("loop").text(paramsA.loop[i] || org.find("loop").text());
			var pushArr = it.vType=="variable2"?[gi, org, gi, org, gi, org, gi, org]:[gi, org, gi, org];  // 原画同士の比較
			sets.push(pushArr);
		});
		
		for (var j=0, brLen=paramsB.bitrate.length; j<brLen; j++) {
			for (var k=0, epLen=paramsB.encParam.length; k<epLen; k++) {
				var l = i*brLen*epLen+j*epLen+k;
				BpicNames[l] = paramsA.sequence[i] + "_" + paramsB.bitrate[j] + "_" + paramsB.encParam[k];
				
				var gi = it.grayImage;
				$(function(){
					var a = $(gi).clone(false);
					a.find("name").text(ApicNames[i]);
					a.find("in").text(paramsA.in[i] || a.find("in").text());
					a.find("out").text(paramsA.out[i] || a.find("out").text());
					a.find("folder").text(paramsA.folder[i] || a.find("folder").text());
					a.find("loop").text(paramsA.loop[i] || a.find("loop").text());
					var b = $(gi).clone(false);
					b.find("name").text(BpicNames[l]);
					b.find("in").text(paramsA.in[i] || b.find("in").text());
					b.find("out").text(paramsA.out[i] || b.find("out").text());
					b.find("folder").text(paramsB.folder[i][j][k] || b.find("folder").text());
					b.find("loop").text(paramsA.loop[i] || b.find("loop").text());
					var pushArr = it.vType=="variable2"?[gi, a, gi, b, gi, a, gi, b]:[gi, a, gi, b];
					sets.push(pushArr);
				});
				
			}
		}
	}
	return sets;
};

UplEditor.prototype.makeListsFromSets = function (sets) {
	// sets配列からlists配列に入れ替え。
	var lists = [], it = this;
	for (var i=0, len1=sets.length; i<len1; i++) {
		for (var j=0, len2=sets[i].length; j<len2; j++) {
			$(function(){
				//lists[i*len2+j] = $(sets[i][j]).clone(false)[0];
				lists.push($(sets[i][j]).clone(false)[0]);
			});
		}
	}
	return lists;
};

UplEditor.prototype.makeDomFromLists = function (lists) {
	// lists配列からDOM要素（Document）を返す
	var dom, it = this;
	$(function(){
		dom = $(it.xmlToDom(it.template)).clone(false)[0];
		$(dom).find("main").text("");
		$(dom).find("main").append("\n\t\t");
		for (var i=0, len=lists.length; i<len; i++) {
			$(dom).find("main").append($(lists[i]).attr("number", i+1)[0]);
			$(dom).find("main").append(i==len-1?"\n\t":"\n\t\t");
		}
	});
	return dom;
};

UplEditor.prototype.randomize = function(lists) {
	// listsとEBU法の種類を投げるとlistsを並び替えてreturnしてくれる
	var it = this;
	var tmpSet = [], sets1 = [], sets2 = [], sets3 = [], newSets = [];
	
	for (var i=0, len=lists.length; i<len; i++) {
		tmpSet.push(lists[i]);
		if ((it.vType=="variable2")?(i%8 == 7):(i%4 == 3)) {
			var tmpSets = (i<len/3?sets1:(i<len/3*2?sets2:sets3));
			tmpSets.push(tmpSet);
			tmpSet = [];
		}
	}
	var index = 0;
	while (sets3.length > 0) {
		var a = index++%3;
		var pushedSets = a==0?sets1:(a==1?sets2:sets3);
		newSets.push(pushedSets.splice(parseInt(Math.random()*pushedSets.length), 1)[0]);
	}
	return it.makeListsFromSets(newSets);
}

UplEditor.prototype.xmlToDom = function (xml) {
	//生のxmlテキストファイルからDOM要素を生成してreturn
	var parser = new DOMParser();
    var dom = parser.parseFromString(xml, 'text/xml');
	return dom;
};

UplEditor.prototype.domToXml = function (dom) {
	//DOMからxmlを書き出してくれる
	var serializer = new XMLSerializer();
	var textXml = serializer.serializeToString(dom);
	if (!textXml.match(/^'<\?xml version="1.0" encoding="UTF-8"\?>'/))
		textXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + textXml;
	return textXml;
};

UplEditor.prototype.downloadXml = function (_xml, _name){
	var url = URL.createObjectURL(new Blob([_xml], {type: 'text.xml'}));
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', _name || 'noname.xml');
	a.dataset.downloadurl = ['text/xml', a.download, a.href].join(':');
    a.dispatchEvent(new CustomEvent('click'));
};

UplEditor.prototype.xmlFirstLine = '<?xml version="1.0" encoding="UTF-8"?>\n';
UplEditor.prototype.template = 
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<root>\n' +
	'	<header>\n' +
	'		<title>template</title>\n' + 
	'		<date>2016/03/22 12:00:00</date>\n' +
	'		<version>1.1</version>\n' +
	'	</header>\n' +
	'	<main>\n' +
	'		<list number="1" play="enable">\n' +
	'			<volume>0</volume>\n' +
	'			<folder>1</folder>\n' +
	'			<take>-1</take>\n' +
	'			<name>gray_3840</name>\n' +
	'			<in>0</in>\n' +
	'			<out>10</out>\n' +
	'			<loop>12</loop>\n' +
	'			<speed>1.0</speed>\n' +
	'			<reverse>off</reverse>\n' +
	'			<memo/>\n' +
	'		</list>\n' +
	'	</main>\n' +
	'</root>';

UplEditor.prototype.defaultParams = {
	// パラメータセット
	"paramsA" : {
		"sequence": ["008_cracker", "011_snow", "505_nebuta"], // シーケンスの名前
		"in": [240, 240, 180],	// 各シーケンスのin
		"out": [840, 840, 780], // 各シーケンスのout
		"loop": [1, 1, 1], 		// 各シーケンスのloop回数
		"folder": [4, 97, 9]  	// 各シーケンスの原画のfolder番号
	},
	"paramsB" : {
		"bitrate": ["15M", "20M", "30M"],
		"encParam": [3, 6, "conv"],
		/*"folder": [
			[[5, 6, 7], [8, 9, 10], [11, 12, 13]], //folders for sequence 1
			[[14, 15, 16], [17, 18, 19], [20, 21, 22]], //folders for sequence 2
			[[23, 24, 25], [26, 27, 28], [29, 30, 31]] // folders for sequence 3
		]*/
		"folder": [// 15M       20M          30M
			[[91, 94, 13], [11, 14, 16], [12, 15, 17]], //folders for sequence 1
			[[95, 98, 92], [19, 20, 24], [21, 22, 93]], //folders for sequence 2
			[[3, 8, 61], [86, 87, 90], [114, 115, 116]] // folders for sequence 3
		]
	}
};


UplEditor.prototype.getParamsFromUplFile = function() {
	// 未完成
	// 読み込んだuplファイルからparamsオブジェクトを生成したいけど正規表現とか駆使しないといけないから難しそう
	var it = this;
	var paramsA = it.defaultParams.paramsA;
	var paramsB = it.defaultParams.paramsB;
	return {"paramsA": paramsA, "paramsB": paramsB};
};

$(function(){
	UplEditor.prototype.grayImage = $(UplEditor.prototype.xmlToDom(UplEditor.prototype.template)).find("list")[0];
});


UplEditor.prototype.setVal = function (_dom, _name, _val) {
	$(function(){
		$(_dom).find(_name).text() = _val;
	});
};