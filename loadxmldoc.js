function loadXMLDoc (dname) {
    var xmlDoc;

    try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', dname, false);
        //xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send('');
        xmlDoc = xmlhttp.responseXML;
    } catch (e) {
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        } catch (e) {
            console.error(e.message);
        }
    }
    return xmlDoc;
}
