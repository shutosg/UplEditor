var UplEditor = function (_uplFile) {
	var self = this;
	self.uplFile = _uplFile;
	self.dom = self.xmlToDom(self.uplFile);
	self.xml = self.domToXml(self.dom);
	self.lists = [], self.sets = [], self.BpicNames = [], self.ApicNames = [];
	self.root;
	
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
				//self.sets[i*9+j*3+k] = [];
			}
		}
	}
};

UplEditor.prototype.readFile = function (_uplFile) {
	//
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

UplEditor.prototype.template = '<?xml version="1.0" encoding="UTF-8"?><root><header><title></title><date></date><version>1.1</version></header><main><list number="1" play="enable"><volume>0</volume><folder>1</folder><take>1</take><name>gray_3840</name><in>0</in><out>10</out><loop>12</loop><speed>1.0</speed><reverse>off</reverse><memo/></list></main></root>';

$(function(){
	UplEditor.prototype.grayImage = $(UplEditor.prototype.xmlToDom(UplEditor.prototype.template)).find("list")[0];
});

UplEditor.prototype.setVal = function (_dom, _name, _val) {
	$(function(){
		$(_dom).find(_name)[0].innerHTML = _val;
	});
};