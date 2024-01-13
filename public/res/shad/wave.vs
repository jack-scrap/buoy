#version 300 es

precision mediump float;

in vec3 pos;
out vec3 _pos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

uniform int t;

void main() {
  gl_Position = proj * view * model * vec4(pos + vec3(0.0, sin(pos.x + float(t) / 100.0), 0.0), 1.0);

	_pos = pos;
}
