#version 300 es

precision mediump float;

in vec2 f_tex;
flat in int f_instance;

precision mediump sampler2DArray;
uniform sampler2DArray u_texture;

uniform sampler2D u_dataTex;

uniform float u_time;

out vec4 outColor;

void main(){
    vec4 fetch = texelFetch(u_dataTex, ivec2(4, f_instance), 0);
    vec4 texColor = vec4(0);

    switch(int(fetch.g)){
        case 0://No effect
            texColor = texture(u_texture, vec3(f_tex, fetch.r));
            if(texColor.a < 0.1){discard;}
            break;

        case 1://Negative
            texColor = texture(u_texture, vec3(f_tex, fetch.r));
            texColor.r = 1.0 - texColor.r;
            texColor.g = 1.0 - texColor.g;
            texColor.b = 1.0 - texColor.b;
            break;

        case 2://Wave
            texColor = texture(u_texture, vec3(vec2(f_tex.x + sin(u_time + f_tex.y * 10.0) * fetch.b, f_tex.y + sin(u_time + f_tex.x * 10.0) * fetch.a), fetch.r));
            if(texColor.a < 0.1){discard;}
            break;

        case 3://Haze
            vec4 first = texture(u_texture, vec3(vec2(f_tex.x + sin(u_time + f_tex.y * 10.0) * fetch.b, f_tex.y + sin(u_time + f_tex.x * 10.0) * fetch.a), fetch.r))/2.0;
            vec4 second = texture(u_texture, vec3(vec2(f_tex.x - sin(u_time + f_tex.y * 10.0) * fetch.b, f_tex.y - sin(u_time + f_tex.x * 10.0) * fetch.a), fetch.r))/2.0;
            texColor = first + second;
            if(texColor.a < 0.1){discard;}
            break;

        case 4://Breath
            texColor = texture(u_texture, vec3(vec2(f_tex.x, f_tex.y + sin(u_time * fetch.a) * fetch.b * (1.0 - f_tex.y)), fetch.r));
            if(texColor.a < 0.1){discard;}
            break;

        case 5://Quake
            texColor = texture(u_texture, vec3(vec2(f_tex.x + sin(u_time * 100.0 + f_tex.y * 1.0) * fetch.b, f_tex.y + sin(u_time * 100.0 + f_tex.x * 1.0) * fetch.a), fetch.r));
            if(texColor.a < 0.1){discard;}
            break;
    }

    vec4 result = texColor;

    outColor = result;
}