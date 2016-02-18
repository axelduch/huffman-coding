(function () {


    function init () {
        initDOMInteractions();
        console.log(computeHuffman());
    }


    function initDOMInteractions () {
        registerUserInput();
    }


    function computeHuffman (str) {
        str = str || 'go go gophers';
        console.log('computing huffman for:', str);

        var tree = buildHuffmanTree(str);

        return encode(tree);
    }


    function registerUserInput () {
        var rawStringInput = document.getElementById('rawString');

        rawStringInput.addEventListener('keyup', function () {
            var str = rawStringInput.value;
            console.log(computeHuffman(str));
        });
    }


    function incrementOrSet (object, key) {
        object[key] = (object[key] | 0) + 1;
    }


    function buildHuffmanTree (str) {
        var rawFrequencies = computeRawFrequencies(str);
        var frequencies = transformRawFrequencies(rawFrequencies);
        var nodes = frequencies.slice();

        while (nodes.length > 1) {
            var leftNode = nodes.pop();
            var rightNode = nodes.pop();

            if (leftNode && rightNode) {
                var parentNode = {
                    count: leftNode.count + rightNode.count,
                    left: leftNode,
                    right: rightNode
                };

                nodes.push(parentNode);
                nodes.sort(compareFrequencies);
            }
        }

        return {
            head: nodes.pop(),
            frequencies: frequencies.reverse(),
            str: str
        };
    }


    function buildIndex (str) {
        var rawFrequencies = computeRawFrequencies(str);
        var frequencies = transformRawFrequencies(rawFrequencies);

        return frequencies.map(function (frequency) {
            return frequency.char;
        }).join('');
    }


    function encode (tree) {
        var charCodes = buildCharCodes(tree.head);
        var str = tree.str;

        var output = '';

        for (var i = 0; i < str.length; i++) {
            var charCode = findCharCode(charCodes, str.charAt(i));
            console.log(charCode);
            output += charCode.toString(2);
        }

        // debugging purpose
        summarize(str, output, computeCharSize(charCodes));

        return output;
    }


    function summarize (input, output, charSize) {
        var binaryOutputLength = Math.ceil(output.length / charSize);
        console.log('input string length', input.length);
        console.log('output string length', output.length);
        console.log('binary char size', charSize);
        console.log('output binary string length', binaryOutputLength);
        console.log(100 - ((input.length) / (output.length)) * 100, '% compression rate');
    }


    function findCharCode (charCodes, char) {
        for (var key in charCodes) {
            if (charCodes[key] === char) {
                return key | 0;
            }
        }
    }


    function computeCharSize(charCodes) {
        var max = 0;

        for (var key in charCodes) {
            var num = key | 0;

            if (num > max) {
                max = num;
            }
        }

        return max.toString(2).length;
    }


    function buildCharCodes (head, path, charCodes) {

        charCodes = charCodes || {};
        path = path || '';
        var leftPath;
        var rightPath;

        if (head.char) {
            charCodes[path] = head.char;
            return charCodes;
        }

        if (head.left) {
            leftPath = extendPath(path, 0);

            if (head.left.char) {
                charCodes[leftPath] = head.left.char;
            } else {
                buildCharCodes(head.left, leftPath, charCodes);
            }
        }

        if (head.right) {
            rightPath = extendPath(path, 1);

            if (head.right.char) {
                charCodes[rightPath] = head.right.char;
            } else {
                buildCharCodes(head.right, rightPath, charCodes);
            }

        }

        return charCodes;
    }


    function extendPath(path, direction) {
        return path + direction;
    }

    function correspondingFrequency(char, frequencies) {
        return frequencies.reduce(function (frequency, current) {
            if (frequency === null && current.char === char) {
                frequency = current;
            }

            return frequency;
        }, null);
    }


    function decode (str) {
    }


    function transformRawFrequencies (rawFrequencies) {
        var frequencies = [];

        for (var key in rawFrequencies) {
            var frequency = transformRawFrequenciesEntry(rawFrequencies[key], key);
            frequencies.push(frequency);
        }

        return frequencies.sort(compareFrequencies);
    }


    function transformRawFrequenciesEntry (rawFrequenciesEntry, key) {
        return {
            char: key,
            count: rawFrequenciesEntry
        };
    }


    function computeRawFrequencies (str) {
        var l = str.length;
        var frequencies = {};

        for (var i = 0; i < l; i++) {
            var char = str.charAt(i);
            incrementOrSet(frequencies, char);
        }

        return frequencies;
    }


    function compareFrequencies (a, b) {
        return b.count - a.count;
    }


    // ENTRY POINT
    window.addEventListener('load', init);
}());
