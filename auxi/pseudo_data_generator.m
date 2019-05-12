fid = fopen('chr0', 'w');

fprintf(fid, 'chr0\n');
fprintf(fid, '5000\n');
fprintf(fid, '0\n');

x = 0.0;
y = 0.0;
z = 0.0;

for i = 1:200

    fprintf(fid, '%d %f %f %f\n', i, x, y, z);
    x = x + 0.5/200.0;
end

for i = 201:400

    x = 0.5 * cos(pi/400.0*(i-200));
    y = 0.5 * sin(pi/400.0*(i-200));
    fprintf(fid, '%d %f %f %f\n', i, x, y, z);
end

for i = 401:500

    z = z + 0.5/150.0;
    fprintf(fid, '%d %f %f %f\n', i, x, y, z);
end
