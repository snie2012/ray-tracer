function obj_parser(lines) {
    var dict = {};
    var vtx = {},
        group = [],

    vtx = vtx_parser(lines);
    dict['vtx'] = vtx;

    group = group_parser(lines);
    if (group.length > 0) {
        dict['groups'] = group;
        return dict;
    } else {
        var faces = [];
        for (var i = 0; i < lines.length; i++) {
            line = lines[i].trim();
            elms = line.split(/\s+/);
            elms.shift();
            if (regexTest('f', line)) {
                faces.push(elms);
            }
        }
        dict['faces'] = face_parser(faces);
        return dict;
    }
}

function group_parser(lines) {
    var group = block_parser(lines, 'g');
    var faces, mtls;
    var str, line, elms;

    for (var i = 0; i < group.length; i++) {
        faces = [];
        mtls = [];
        str = group[i]['str'];
        for (var j = 0; j < str.length; j++) {
            line = str[j].trim();
            elms = line.split(/\s+/);
            elms.shift();
            if (regexTest('f', line)) {
                faces.push(elms);
            } if (regexTest('usemtl', line)) {
                mtls.push(elms);
            }
        }
        group[i]['usemtl'] = mtls.toString();
        group[i]['faces'] = face_parser(faces);
    }

    return group;
}

function face_parser(faces) {
    var dict = {};

    var f_points = [],
        f_norm = [],
        f_txt = [];

    var p_tmp, n_tmp, t_tmp,
        pos1, pos2,
        str;

    for (var i = 0; i < faces.length; i++) {
        p_tmp = [], n_tmp = [], t_tmp = [];
        for (var j = 0; j < faces[i].length; j++) {
            if (/\/{2}/.test(faces[i][j])) {
                pos1 = 0, pos2 = 0;
                str = '';
                pos1 = faces[i][j].search(/\/{2}/);

                p_tmp.push(parseFloat(faces[i][j].substring(0, pos1)));
                str = faces[i][j].substring(pos1 + 2, faces[i][j].length);
                pos2 = str.search(/\/{2}/);
                if (pos2 <= 0) {
                    n_tmp.push(parseFloat(str));
                }
                if (pos2 > 0) {
                    t_tmp.push(parseFloat(str.substring(0, pos2)));
                    n_tmp.push(parseFloat(str.substring(pos2 + 2, str.length)));
                }
            } else {
                pos1 = 0, pos2 = 0;
                str = '';
                pos1 = faces[i][j].search(/\//);

                if (pos1 <= 0) {
                    p_tmp.push(parseFloat(faces[i][j]));
                } else {
                    p_tmp.push(parseFloat(faces[i][j].substring(0, pos1)));
                    str = faces[i][j].substring(pos1 + 1, faces[i][j].length);
                    pos2 = str.search(/\//);
                    if (pos2 <= 0) {
                        n_tmp.push(parseFloat(str));
                    }
                    if (pos2 > 0) {
                        t_tmp.push(parseFloat(str.substring(0, pos2)));
                        n_tmp.push(parseFloat(str.substring(pos2 + 1, str.length)));
                    }
                }
            }
        }
        f_points.push(p_tmp);
        f_norm.push(n_tmp);
        f_txt.push(t_tmp);
    }

    dict['f_points'] = f_points;
    dict['f_norm'] = f_norm;
    dict['f_txt'] = f_txt;
    return dict;
}


function vtx_parser(lines) {
    var dict = {};
    var vtx_point = [],
        vtx_norm = [],
        vtx_txt = [];

    var line, elms;
    var len = lines.length;

    for (var i = 0; i < len; i++) {
        line = lines[i].trim();
        elms = line.split(/\s+/);
        elms.shift();
        for (var elm in elms) {elms[elm] = parseFloat(elms[elm])};
        if (regexTest('v', line)) {
            vtx_point.push(elms);
        } else if (regexTest('vn', line)) {
            vtx_norm.push(elms);
        } else if (regexTest('vt', line)) {
            vtx_txt.push(elms);
        } 
    }

    dict['vtx_point'] = vtx_point;
    dict['vtx_norm'] = vtx_norm;
    dict['vtx_txt'] = vtx_txt;

    return dict;
}








