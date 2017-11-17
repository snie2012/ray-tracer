// Vector utility functions
function subV(v1, v2) {
    var v = vec3.create();
    vec3.sub(v, v1, v2); // produce v1-v2
    return v;
}

function calNorm(v1, v2, v3) {
    var v = vec3.create();
    var v12 = subV(v1, v2);
    var v13 = subV(v1, v3);
    vec3.cross(v, v12, v13);
    return v;
}

function absVector(v1, v2, v3) {
    return Math.sqrt(vec3.squaredLength(calNorm(v1, v2, v3)));
}

// Detect intersection point of the ray and plane
function detectIntersection(line_point, line_diret, plane_point1, plane_point2, plane_point3) {
    var plane_norm = calNorm(plane_point1, plane_point2, plane_point3);
    //vec3.normalize(plane_norm, plane_norm); //normalize the normal vector

    var parrallel = vec3.dot(line_diret, plane_norm);
    var in_plane = vec3.dot(subV(plane_point1, line_point), plane_norm);

    // parrallel < 0 means only considering front faces (back faces excluded)
    if (parrallel < 0) {
        var t = in_plane / parrallel;
        var intersected_point = vec3.create();
        var temp_point = vec3.create();
        vec3.scale(temp_point, line_diret, t);
        vec3.add(intersected_point, temp_point, line_point);

        //console.log('intersected with the plane');
        return {'intsct_point': intersected_point, 'plane_norm': plane_norm};
    } else {
        //console.log('the line is parrallel to the plane or within the plane');
        return null;
    }
}

// If intersected, detect if the interacted point is within the triangle
function detectLocation(point, plane_point1, plane_point2, plane_point3) {
    // reference： http://gamedev.stackexchange.com/questions/23743/whats-the-most-efficient-way-to-find-barycentric-coordinates
    var v0 = subV(plane_point2, plane_point1),
        v1 = subV(plane_point3, plane_point1),
        v2 = subV(point, plane_point1);

    var d00 = vec3.dot(v0, v0),
        d01 = vec3.dot(v0, v1),
        d11 = vec3.dot(v1, v1),
        d20 = vec3.dot(v2, v0),
        d21 = vec3.dot(v2, v1);

    var denom = d00 * d11 - d01 * d01;

    var alpha = (d11 * d20 - d01 * d21) / denom;
    var beta = (d00 * d21 - d01 * d20) / denom;
    var gamma = 1 - alpha - beta;

    if ((alpha >= 0 && alpha <= 1) && (beta >= 0 && beta <= 1) && (gamma >= 0 && gamma <= 1)) {
        return true;
    } else {
        return null;
    }
}












