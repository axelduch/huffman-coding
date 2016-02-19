(function () {

    // ENTRY POINT
    window.addEventListener('load', init);


    function init () {
        initDOMInteractions();
        var str = fetchUserInput();
        var huffman = Huffman.create(str);

        console.log(huffman);
    }


    function initDOMInteractions () {
        registerUserInput();
        registerDownloadButton();
    }


    // @TODO implement
    function debugTree(tree) {
        return; // until it's implemented

        var binaryOutput = tree.binaryOutput;
        var charSize = tree.charSize;
        var str = '';

        for (var i = 0; i < binaryOutput.length; i++) {
            var charCode = 0;

            for (var j = 0; j < 32; j+= charSize) {
            }
        }
    }


    function display(thing) {
        document.getElementById('console').innerText += thing.toString() + '\n';
    }


    function fetchUserInput () {
        return document.getElementById('rawString').value;
    }


    function registerUserInput () {
        var rawStringInput = document.getElementById('rawString');

        rawStringInput.addEventListener('keyup', function () {
            var str = fetchUserInput();
            console.log(Huffman.create(str));
        });

    }


    function registerDownloadButton () {
        var downloadButton = document.getElementById('downloadButton');

        downloadButton.addEventListener('click', function () {
            var str = fetchUserInput();
            var huffman = Huffman.create(str);
            download(huffman.binaryOutput);
        });
    }


    function download(binaryOutput) {
        var blob = Huffman.toBlob(binaryOutput);
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'my-tree.huff';
        link.click();
        window.URL.revokeObjectURL(url);
    }


    function upload (huffmanBytes, charSize) {

    }

}());
