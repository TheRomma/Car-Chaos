#version 300 es
        
layout (location = 0) in vec2 v_pos;
layout (location = 1) in vec2 v_tex;
        
out vec2 f_tex;
flat out int f_instance;

uniform sampler2D u_dataTex;

uniform mat4 u_projView;

void main(){      

    int instance = gl_InstanceID;

    mat4 model = mat4(
        texelFetch(u_dataTex, ivec2(0, instance), 0),
        texelFetch(u_dataTex, ivec2(1, instance), 0),
        texelFetch(u_dataTex, ivec2(2, instance), 0),
        texelFetch(u_dataTex, ivec2(3, instance), 0)
        );

    f_tex = v_tex;
    f_instance = instance;

    gl_Position = u_projView * model * vec4(v_pos, 0.0, 1.0);

}