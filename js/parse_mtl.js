function mtl_parser(lines) {
    var mtl = block_parser(lines, 'newmtl');

    if (mtl.length > 0) {
        for (var i = 0; i < mtl.length; i++) {
            var str = mtl[i]['str'];
            mtl[i]['coeff'] = coeff_parser(str);
        }
        return mtl;
    } else {
        mtl.push(coeff_parser(lines));
        return mtl;
    }
}

function coeff_parser(lines) {
    var dict = {};
    var ka = [],
        kd = [],
        ks = [],
        N = [],
        Ns = [];

    var line, elms;
    var len = lines.length;

    for (var i = 0; i < len; i++) {
        line = lines[i].trim();
        elms = line.split(/\s+/);
        elms.shift();
        for (var elm in elms) {elms[elm] = parseFloat(elms[elm])};
        if (regexTest('Ka', line)) {
            ka.push(elms);
        } else if (regexTest('Kd', line)) {
            kd.push(elms);
        } else if (regexTest('Ks', line)) {
            ks.push(elms);
        } else if (regexTest('N', line)) {
            N.push(elms);
        } else if (regexTest('Ns', line)) {
            Ns.push(elms);
        }
    } 

    dict['ka'] = ka;
    dict['kd'] = kd;
    dict['ks'] = ks;
    dict['N'] = N;
    dict['Ns'] = Ns;

    return dict;
}











