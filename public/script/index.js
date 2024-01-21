const camLoc = [-10, 10, -10];

var drag;

var mouseStartX;
var mouseCurrX;
var mouseDeltaX;

var theta = 0.0;

const dragFac = 500;

var world;

const amp = 0.4;

function fitCanv() {
	window.canv.width = window.innerWidth;
	window.canv.height = window.innerHeight;
}

document.addEventListener("mousedown", function(e) {
	drag = true;

	mouseStartX = e.clientX;
});

document.addEventListener("mouseup", function() {
	drag = false;

	theta += mouseDeltaX / dragFac;
});

document.addEventListener("mousemove", function(e) {
	if (drag) {
		mouseCurrX = e.clientX;

		mouseDeltaX = mouseCurrX - mouseStartX;

		mat4.identity(world);
		mat4.rotate(world, world, theta + (mouseDeltaX / dragFac), [0, 1, 0]);
	}
});

document.addEventListener("DOMContentLoaded", async function() {
	/* Context */
	window.canv = document.getElementById("disp");

	fitCanv();

	window.gl = window.canv.getContext("webgl2");

	if (!gl) {
		console.log("WebGL not supported, falling back on experimental-webgl");
		gl = canv.getContext("experimental-webgl");
	}

	if (!gl) {
		alert("Your browser does not support WebGL");
	}

	gl.enable(gl.DEPTH_TEST);

	gl.clearColor(1, 1, 1, 1);

	gl.enable(gl.CULL_FACE);

	gl.cullFace(gl.BACK);

	world = mat4.create();
	mat4.identity(world);
	mat4.rotate(world, world, 0, [0, 1, 0]);

	let buoy = new Obj("buoy", "buoy", "buoy");

	let plane = new Obj("plane", "wave", "solid");

	plane.prog.use();

	let uniT = gl.getUniformLocation(plane.prog.id, "t");

	let uniAmp = gl.getUniformLocation(plane.prog.id, "amp");

	gl.uniform1f(uniAmp, amp);

	let uniWorld = gl.getUniformLocation(plane.prog.id, "world");

	plane.prog.unUse();

	buoy.prog.use();

	let uniWorldBuoy = gl.getUniformLocation(buoy.prog.id, "world");

	buoy.prog.unUse();

	let t = 0;
	function draw() {
		mat4.identity(buoy.model);
		mat4.translate(buoy.model, buoy.model, [0, Math.sin(t / 100) * amp, 0]);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		plane.prog.use();

		gl.uniform1i(uniT, t);
		gl.uniformMatrix4fv(uniWorld, gl.FALSE, world);

		plane.prog.unUse();

		buoy.prog.use();

		gl.uniformMatrix4fv(uniWorldBuoy, gl.FALSE, world);

		buoy.prog.unUse();

		plane.draw();
		buoy.draw();

		requestAnimationFrame(draw);

		t++;
	}
	requestAnimationFrame(draw);
});
