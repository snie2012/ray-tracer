function regexTest(re, str) {
    var regex = new RegExp('^' + re + '\\s');
    return regex.test(str);
}

function block_parser(lines, re) {
    var block = [];

    var line, elms;
    var len = lines.length;

    for (var i = 0; i < len;) {
        var g = 0;
        var temp_j = 1;
        var one_block;

        line = lines[i].trim();
        elms = line.split(/\s+/);
        elms.shift();

        if (regexTest(re, line)) {
            one_block = {};
            one_block['block'] = elms.toString();
            var j = 1;
            var g_str = [];
            regexTest(re, lines[i+j].trim())
            while(!regexTest(re, lines[i+j].trim())) {
                g_str.push(lines[i+j].trim());
                if (i+j < len-1) {
                    j++;
                } else {
                    break;
                }
            }
            temp_j = j;
            one_block['str'] = g_str;

            if (Object.keys(one_block).length > 0) {
                block.push(one_block);
            }
        }

        temp_j > 1 ? i+= temp_j : i++;
    }

    return block;
}
