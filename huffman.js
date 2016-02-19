(function () {
    Huffman = {
        create: computeHuffman,
        toBlob: toBlob
    };


    function toBlob (binaryOutput) {
        return new Blob([binaryOutput], {type: 'application/octet-stream'});
    }


    function computeHuffman (str) {
        console.log('computing huffman for:', str);

        var tree = buildHuffmanTree(str);

        return encode(tree);
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


    // @TODO this is definitely squishy
    // - Improve output
    // - I think binary packing is broken 
    function encode (tree) {
        var charCodes = buildCharCodes(tree.head);
        var str = tree.str;

        var strOutput = '';
        var i;

        for (i = 0; i < str.length; i++) {
            var charCode = findCharCode(charCodes, str.charAt(i));
            strOutput += charCode.toString(2);
        }

        var charSize = computeCharSize(charCodes);
        var binaryOutputLength = Math.ceil(strOutput.length / charSize);
        var binaryOutput = new Uint32Array(binaryOutputLength);

        for (i = 0; i < binaryOutputLength; i++) {
            binaryOutput[i] = parseInt(strOutput.substr(i * charSize, i * charSize + charSize), 2);
        }

        // debugging purpose
        summarize(str, strOutput, computeCharSize(charCodes));

        return {
            output: binaryOutput,
            charSize: charSize
        };
    }


    function summarize (input, output, charSize) {
        var binaryOutputLength = Math.ceil(output.length / charSize);
        console.log('input string length', input.length);
        console.log('output string length', output.length);
        console.log('binary char code bit count', charSize);
        console.log('output bytes count', binaryOutputLength);
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
        if (!head) {
            return;
        }

        charCodes = charCodes || {};
        path = path || '';
        var leftPath;
        var rightPath;

        if (head.char) {
            charCodes[path] = head.char;
            return charCodes;
        }

        buildCharCodes(head.left, extendPath(path, 0), charCodes);
        buildCharCodes(head.right, extendPath(path, 1), charCodes);

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

}());
