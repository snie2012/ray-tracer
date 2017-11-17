// Global information
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var obj_info;
var mtl_info;
var render_points;

// init values for camera position, direction and lighting
var initValues = {
    'line_p': vec3.fromValues(0, 0, -2),
    'line_d': vec3.fromValues(-1, 1, -1),
    'ratio': 2,
    'light_p': vec3.fromValues(0,5,0),
    'light_c': vec3.fromValues(1,1,1) 
}


// Helper function
function clearCanvas() {
    for (i = 0; i < canvas.width; i++) {
        for (j = 0; j < canvas.height; j++) {
            setPixel(imageData, i, j, 0, 0, 0, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

// Change camera position and refresh
function refresh() {
    var line_p = vec3.fromValues(document.getElementById('eye_x').value, document.getElementById('eye_y').value, document.getElementById('eye_z').value);
    //var line_d = ;
    render_points = calNearestpoints(line_p);
    clearCanvas();
    plain_render();
}


// Calculation and rendering functions
function calNearestpointsNogroup(line_p) {
    var vtx = obj_info['vtx']['vtx_point'];
    var faces = obj_info['faces'];
    var f_points;

    var c1, c2, c3, p1, p2, p3;
    var intsct_info;

    var p = line_p;
    var d = $.extend(true, {}, initValues.line_d);

    var nearest_points = [];
    var dist;

    var crash;

    for (var w = 0; w < canvas.width; w++) {
        for (var h = 0; h < canvas.height; h++) {
            dist = [];
            vec3.add(d, initValues.line_d, vec3.fromValues(2 * w / canvas.width, -2 * h / canvas.height, 0));
            vec3.sub(d, d, p);
            f_points = faces['f_points'];
            for (var l = 0; l < f_points.length; l++) {
                c1 = f_points[l][0];
                c2 = f_points[l][1];
                c3 = f_points[l][2];
                p1 = vec3.fromValues(vtx[c1 - 1][0], vtx[c1 - 1][1], vtx[c1 - 1][2]);
                p2 = vec3.fromValues(vtx[c2 - 1][0], vtx[c2 - 1][1], vtx[c2 - 1][2]);
                p3 = vec3.fromValues(vtx[c3 - 1][0], vtx[c3 - 1][1], vtx[c3 - 1][2]);
                //if ((p1[2]>-1 && p1[2]<1) && (p2[2]>-1 && p2[2]<1) && (p3[2]>-1 && p3[2]<1))
                intsct_info = detectIntersection(p, d, p1, p2, p3);
                if (intsct_info) {
                    crash = detectLocation(intsct_info['intsct_point'], p1, p2, p3)
                    if (crash) {
                        console.log('crash');
                        dist.push({
                            'dist': vec3.dist(intsct_info['intsct_point'], p),
                            'intsct_point': intsct_info['intsct_point'],
                            'intsct_norm': intsct_info['plane_norm'],
                            'w': w,
                            'h': h
                        })
                    }
                }
            }

            if (dist.length == 1) {
                nearest_points.push(dist[0]);
            } else if (dist.length > 1) {
                dist.sort(function(a, b) {
                    return parseFloat(a['dist']) - parseFloat(b['dist']);
                })
                nearest_points.push(dist[0]);
            }
        }
    }

    if (nearest_points.length > 0) {
        return nearest_points;
    } else {
        console.log('nearest_points is empty');
        return null;
    }
}

function calNearestpoints(line_p) {
    if (obj_info) {
        if(obj_info.hasOwnProperty('groups')) {
            var vtx = obj_info['vtx']['vtx_point'];
            var groups = obj_info['groups'];
            var f_points;

            var c1, c2, c3, p1, p2, p3;
            var intsct_info;

            var p = line_p;
            var d = $.extend(true, {}, initValues.line_d);

            var nearest_points = [];
            var dist;

            var crash;

            for (var w = 0; w < canvas.width; w++) {
                for (var h = 0; h < canvas.height; h++) {
                    dist = [];
                    vec3.add(d, initValues.line_d, vec3.fromValues(2 * w / canvas.width, -2 * h / canvas.height, 0));
                    vec3.sub(d, d, p);
                    for (var g = 0; g < groups.length; g++) {
                        f_points = groups[g]['faces']['f_points'];
                        for (var l = 0; l < f_points.length; l++) {
                            c1 = f_points[l][0];
                            c2 = f_points[l][1];
                            c3 = f_points[l][2];
                            p1 = vec3.fromValues(vtx[c1 - 1][0], vtx[c1 - 1][1], vtx[c1 - 1][2]);
                            p2 = vec3.fromValues(vtx[c2 - 1][0], vtx[c2 - 1][1], vtx[c2 - 1][2]);
                            p3 = vec3.fromValues(vtx[c3 - 1][0], vtx[c3 - 1][1], vtx[c3 - 1][2]);
                            //if ((p1[2]>-1 && p1[2]<1) && (p2[2]>-1 && p2[2]<1) && (p3[2]>-1 && p3[2]<1))
                            intsct_info = detectIntersection(p, d, p1, p2, p3);
                            if (intsct_info) {
                                crash = detectLocation(intsct_info['intsct_point'], p1, p2, p3)
                                if (crash) {
                                    console.log('crash');
                                    dist.push({
                                        'block': groups[g]['block'],
                                        'dist': vec3.dist(intsct_info['intsct_point'], p),
                                        'intsct_point': intsct_info['intsct_point'],
                                        'intsct_norm': intsct_info['plane_norm'],
                                        'w': w,
                                        'h': h
                                    })
                                }
                            }
                        }

                        if (dist.length == 1) {
                            nearest_points.push(dist[0]);
                        } else if (dist.length > 1) {
                            dist.sort(function(a, b) {
                                return parseFloat(a['dist']) - parseFloat(b['dist']);
                            })
                            nearest_points.push(dist[0]);
                        }
                    }
                }
            }

            if (nearest_points.length > 0) {
                return nearest_points;
            } else {
                console.log('nearest_points is empty');
                return null;
            }
        } else {
            return calNearestpointsNogroup(line_p);
        }
    } else {
        alert('no obj info available');
        console.log('no obj info available');
    }
}

function lighting() {
    var points;
    if (render_points !== undefined) {
        points = render_points;
    } else {
        render_points = calNearestpoints(initValues.line_p);
        points = render_points;
    }

    if (points) {
        var p = initValues.light_p;
        var c = initValues.light_c;
        var line_p = initValues.line_p;
        var ka, kd, ks;
        var r, g, b;
        var ln, rv;
        var alpha = 0.5;
        var lm = vec3.create(), 
            temp_point1 = vec3.create(),
            temp_point2 = vec3.create(), 
            temp_point3 = vec3.create();

        clearCanvas();
        if (mtl_info) {
            for (var i = 0; i < points.length; i++) {
                for (var m = 0; m < mtl_info.length; m++) {
                    if(points[i]['block'] === mtl_info[m]['block']) {
                        vec3.normalize(temp_point1, points[i]['intsct_norm']);
                        vec3.sub(lm, p, points[i]['intsct_point']);
                        vec3.normalize(lm, lm);
                        ln = vec3.dot(lm, temp_point1);

                        vec3.scale(temp_point2, points[i]['intsct_norm'], 2*ln);
                        vec3.sub(temp_point2, temp_point2, lm);
                        vec3.normalize(temp_point2, temp_point2);
                        temp_point3 = subV(line_p, points[i]['intsct_point']);
                        vec3.normalize(temp_point3, temp_point3);
                        rv = vec3.dot(temp_point2, temp_point3);

                        // If ln < 0 or rv < 0, make them 0; otherwise the negative value will cancel the effects of other lighting components
                        ln > 0 ? ln = ln : ln = 0; 
                        rv > 0 ? rv = Math.pow(rv, alpha) : rv = 0;

                        mtl_info[m]['coeff']['ka'].length > 0 ? ka = mtl_info[m]['coeff']['ka'][0] : ka = [1,1,1];
                        mtl_info[m]['coeff']['kd'].length > 0 ? kd = mtl_info[m]['coeff']['kd'][0] : kd = [1,1,1];
                        mtl_info[m]['coeff']['ks'].length > 0 ? ks = mtl_info[m]['coeff']['ks'][0] : ks = [1,1,1];
                        
                        r = 255 * c[0] * (ka[0] + kd[0]*ln + ks[0]*rv);
                        g = 255 * c[1] * (ka[1] + kd[1]*ln + ks[1]*rv);
                        b = 255 * c[2] * (ka[2] + kd[2]*ln + ks[2]*rv);
                        setPixel(imageData, points[i].w, points[i].h, r, g, b, 255);
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        } else {
            console.log('no mtl info available');
            alert('no mtl info available');
        }
    } else {
        console.log('points for lighting is empty');
    }
}

function plain_render() {
    var points;
    if (render_points !== undefined) {
        points = render_points;
    } else {
        render_points = calNearestpoints(initValues.line_p);
        points = render_points;
    }

    if(points) {
        clearCanvas();
        for (var i = 0; i < points.length; i++) {
            setPixel(imageData, points[i].w, points[i].h, 255, 255, 0, 255);
        }
        ctx.putImageData(imageData, 0, 0);
    } else {
        console.log('points for plain rendering is empty');
    }
}


// Entry point
function main() {
    clearCanvas();
    document.getElementById('load_obj').onchange = function() {
        if (this.files[0]) {
            var file = this.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(eve) {
                var lines = this.result.split('\n');
                obj_info = obj_parser(lines);
                console.log(obj_info);
                render_points = undefined;
            }
        }
    }

    document.getElementById('load_mtl').onchange = function() {
        if (this.files[0]) {
            var file = this.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(eve) {
                var lines = this.result.split('\n');
                mtl_info = mtl_parser(lines);
                console.log(mtl_info);
            }
        }
    }
}

window.onload = main
















