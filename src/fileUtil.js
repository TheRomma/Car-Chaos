class FileUtil{
    static toString(a_filename) {
        let result = null;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", a_filename, false);
        //xhr.overrideMimeType("text/plain");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 0) {
                    result = this.responseText;
                }
            }
        }
        xhr.send();
        return result;
    }
}