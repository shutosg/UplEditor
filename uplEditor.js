var UplEditor = function (_uplFile) {
	var it = this;
	it.uplFile = _uplFile;
	it.dom = it.xmlToDom(it.uplFile);
	it.xml = it.domToXml(it.dom);
	it.lists = [], it.sets = [], it.BpicNames = [], it.ApicNames = [];
	it.root, it.exDom;
	
	$(function(){
		$(it.dom).find("list").each(function(){
			it.lists.push($(this)[0]);
		});
		it.root = $(it.dom).find("root")[0];
	});
	
	var paramsA = {
		"sequence": ["008_cracker", "011_children", "012_farm"],
		"in": [60, 100, 110],
		"out": [840, 900, 910],
		"loop": [1, 1, 1],
		"folder": [2, 3, 4]
	};
	
	var paramsB = {
		"bitrate": ["15M", "20M", "40M"],
		"encParam": [3, 5, 6],
		"folder": [
			[[5, 6, 7], [8, 9, 10], [11, 12, 13]], //folders for sequence 1
			[[14, 15, 16], [17, 18, 19], [20, 21, 22]], //folders for sequence 2
			[[23, 24, 25], [26, 27, 28], [29, 30, 31]] // folders for sequence 3
		]
	};
	
	var sets = it.makeSetsFromParams(paramsA, paramsB);
	var exLists = it.makeListsFromSets(sets);
	it.exDom = it.makeDomFromLists(exLists);
	it.setTime();
};

UplEditor.prototype.setTime = function() {
	var it = this;
	$(function(){
		$(it.exDom).find("date").text(it.getTimeNow());
	});
}

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
}

UplEditor.prototype.makeSetsFromParams = function (paramsA, paramsB) {
	var it = this;
	var sets = [], ApicNames = [], BpicNames = [];
	for (var i=0, typeLen=paramsA.sequence.length; i<typeLen; i++) {
		ApicNames[i] = "A_" + paramsA.sequence[i];
		for (var j=0, brLen=paramsB.bitrate.length; j<brLen; j++) {
			for (var k=0, epLen=paramsB.encParam.length; k<epLen; k++) {
				var l = i*brLen*epLen+j*epLen+k;
				BpicNames[l] = "B_" + paramsA.sequence[i] + "_" + paramsB.bitrate[j] + "_" + paramsB.encParam[k];
				
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
					sets[l] = [gi, a, gi, b, gi, a, gi, b];
				});
				
			}
		}
	}
	return sets;
};

UplEditor.prototype.makeListsFromSets = function (sets) {
	var lists = [], it = this;
	for (var i=0, len1=sets.length; i<len1; i++) {
		for (var j=0, len2=sets[i].length; j<len2; j++) {
			$(function(){
				lists[i*len2+j] = $(sets[i][j]).clone(false).attr("number", i*len2+j+1)[0];
			});
		}
	}
	return lists;
};

UplEditor.prototype.makeDomFromLists = function (lists) {
	var dom, it = this;
	$(function(){
		dom = $(it.xmlToDom(it.template)).clone(false)[0];
		$(dom).find("list").remove();
		for (var i=0, len=lists.length; i<len; i++) {
			$(dom).find("main").append(lists[i]);
		}
	});
	return dom;
};

UplEditor.prototype.xmlToDom = function (xml) {
	var parser = new DOMParser();
    var dom = parser.parseFromString(xml, 'text/xml');
	return dom;
};

UplEditor.prototype.domToXml = function (dom) {
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

$(function(){
	UplEditor.prototype.grayImage = $(UplEditor.prototype.xmlToDom(UplEditor.prototype.template)).find("list")[0];
});


UplEditor.prototype.setVal = function (_dom, _name, _val) {
	$(function(){
		$(_dom).find(_name).text() = _val;
	});
};