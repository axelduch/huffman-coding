(function () {


    function init () {
        initDOMInteractions();
        computeHuffman();
    }


    function initDOMInteractions () {
        registerUserInput();
    }


    function computeHuffman (str) {
        str = str || 'go go gophers';
        console.log('computing huffman', str);
        console.log(buildIndex(str));

        var tree = buildHuffmanTree(str);

        console.log(tree);

        return encode(tree);
    }


    function registerUserInput () {
        var rawStringInput = document.getElementById('rawString');

        rawStringInput.addEventListener('keydown', function () {
            var str = rawStringInput.value;
            computeHuffman(str);

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
        var str = tree.str;
        var charCodes = {};

        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            var frequency = correspondingFrequency(char, tree.frequencies);

            if (!(char in charCodes)) {
                charCodes[char] = computeCharCode(frequency, tree.head);
            }
        }
    }


    function computeCharCode (frequency, tree) {
        var node = tree;
        var path = 0;

        while (true) {
            console.log(frequency, node.count);
            var left = node.left;
            var right = node.right;

            if (left && left.count === frequency.count) {
                console.log('left');
                node = node.left;
                path = extendPath(path, 1);
                break;
            } else if (right && right.count === frequency.count) {
                console.log('right');
                node = node.right;
                path = extendPath(path, 0);
                break;
            } else {
                var nextNodeCount = Math.max(left.count, right.count);
                node = (node.left.count === nextNodeCount) ? node.left : node.right;
                if (node === node.right) {
                    console.log('right');
                } else {
                    console.log('left');
                }
            }

        }

        console.log(path, path.toString(2));

        return path;
    }


    function extendPath(path, direction) {
        // 1 means right
        if (direction) {
            path = (path << 1) | 1;
        } else {
            path = ((path << 1) || 1) | 0;
        }

        return path;
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
