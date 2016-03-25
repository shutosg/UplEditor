var input_file = document.getElementById("input_file");


input_file.onchange = function() {

    if (!(input_file.value)) return;
    if (!(window.FileReader)) return;
    var file_list = input_file.files;
    if (!file_list) return;
    var file = file_list[0];
    if (!file) return;
    var file_reader = new FileReader();
    file_reader.addEventListener('load', readFile, false);
    file_reader.readAsText(file);
};

var ue;

function readFile(e) {
    var file = e.target.result;
	ue = new UplEditor(file);
}

document.getElementById("v1_start").addEventListener("click", function(){
	ue = new UplEditor(false, "variable1");
}, false);
document.getElementById("v2_start").addEventListener("click", function(){
	ue = new UplEditor(false, "variable2");
}, false);

document.getElementById("dl_upl").addEventListener("click", function(){
	if (typeof ue !== "undefined") {
		ue.downloadXml(ue.domToXml(ue.exDom), "output.upl");
		return;
	}
	alert("UplEditorインスタンスが未生成です。");
}, false);