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

var uplEditor;

function readFile(e) {
    var file = e.target.result;
	uplEditor = new UplEditor(file);
}
