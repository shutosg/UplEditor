var UplEditor = function (_uplFile) {
	var self = this;
	self.uplFile = _uplFile;
	self.dom = self.xmlToDom(self.uplFile);
	self.xml = self.domToXml(self.dom);
	self.lists = [], self.sets = [], self.BpicNames = [], self.ApicNames = [];
	self.root, self.exDom;
	
	$(function(){
		$(self.dom).find("list").each(function(){
			self.lists.push($(this)[0]);
		});
		self.root = $(self.dom).find("root")[0];
	});
	
	self.params = {
		"type": [1, 2, 3],
		"bitrate": ["15M", "20M", "40M"],
		"encParam": [3, 5, 6]
	};
	
	for (var i=0; i<self.params.type.length; i++) {
		self.ApicNames[i] = "A_" + self.params.type[i];
		for (var j=0; j<self.params.bitrate.length; j++) {
			for (var k=0; k<self.params.encParam.length; k++) {
				self.BpicNames[i*9+j*3+k] = "B_" + self.params.type[i] + "_" + self.params.bitrate[j] + "_" + self.params.encParam[k];
				//var a = self.grayImage.clone
				$(function(){
					var a = $(self.grayImage).clone(true);
					a.find("name")[0].innerHTML = self.ApicNames[i];
					var b = $(self.grayImage).clone(true);
					b.find("name")[0].innerHTML = self.BpicNames[i*9+j*3+k];
					self.sets[i*9+j*3+k] = [self.grayImage, a, self.grayImage, b, self.grayImage, a, self.grayImage, b];
				});
				
			}
		}
	}
	for (var i=0; i<self.sets.length; i++) {
		for (var j=0; j<self.sets[i].length; j++) {
			$(function(){
				self.lists[i*self.sets[i].length+j] = $(self.sets[i][j]).clone(false).attr("number", i*self.sets[i].length+j+1)[0];
			});
		}
	}
	$(function(){
		self.exDom = $(self.xmlToDom(self.template)).clone(false)[0];
		$(self.exDom).find("list").remove();
		for (var i=0; i<self.lists.length; i++) {
			$(self.exDom).find("main").append(self.lists[i]);
			
		}
	});
};

UplEditor.prototype.makeSetsFromParams = function (params) {
	
};

UplEditor.prototype.xmlToDom = function (xml) {
	var parser = new DOMParser();
    var dom = parser.parseFromString(xml, 'text/xml');
	return dom;
};

UplEditor.prototype.domToXml = function (dom) {
	var serializer = new XMLSerializer();
	var textXml = serializer.serializeToString(dom);
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
	'			<take>1</take>\n' +
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
		$(_dom).find(_name)[0].innerHTML = _val;
	});
};