// Final Project

//planets
var planets = [];
//circle
var cirX = 0;
var cirY = 0;
var circle1 = 0;
var circleSize = 0;
//orb
var orbX;
var orbY;
var orbSpeed = 0;
//environment
var degree = 1;
var meter = 0;
var pause;
var pulse;
//sounds
var volume;
var sounds = [];
var hits = [];
var curSound;

function preload() {
	var metro = loadSound('drums/metro.wav');
	var samp1 = loadSound('drums/sampleTest.mp3');
	var kick1 = loadSound('drums/k1.wav');
	var kick2 = loadSound('drums/k2.wav');
	var snare1 = loadSound('drums/hit1.wav');
	var snare4 = loadSound('drums/hit4.wav');
	sounds.push(metro);
	sounds.push(kick1);
	sounds.push(kick2);
	sounds.push(snare1);
	sounds.push(snare4);
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	background(20);
	pause = true;

	volume = createSlider(0, 255, 100);
	volume.position(130, 68);

	//button
	fill(255, 0, 0);
	rect(65, 65, 25, 25);

	//meter is 360 divided by even number, usually power of 2
	meter = 360/32;
	angleMode(DEGREES);
	pulse = 0;

	curSound = 1;
	circle1 = new Planet(400, width/3, height/2);
	planets.push(circle1);
}

function draw() {
	background(50, 80);

	//draw status bar
	fill(0);
	noStroke();
	rect(0, 0, width, 20);

	fill(210);
	rect(width - 75, 45, 50, 40);
	text(meter, width - 70, 42);

	// circle1 = new Planet(circleSize, 6, 8);
	// circle1.display();
	// circle1.makeBlocks();

	for (var p = 0; p < planets.length; p++) {
		planets[p].display();
		for (var i = 0; i < planets[p].blcks.length; i++) {
			planets[p].blcks[i].display();
			// planets[p].blcks[i].playBlock();
		}
	}

	orb = (planets[0].size * 2) / 3;
	orbX = planets[0].x + orb * cos(degree);
	orbY = planets[0].y + orb * sin(degree);

	if (pause) {
		//stop all sound
		for (var k = 0; k < sounds.length - 1; k++) {
			sounds[k].pause();
		}
		//draw orb
		if (pulse == 27) {
			fill(255);
			ellipse(orbX, orbY, planets[0].size/30, planets[0].size/30);
			pulse = 0;
		} else {
			pulse +=0.5;
		}
		//play button
		noStroke();
		fill(255, 0, 0);
		triangle(65, 65, 65, 90, 90, 77.5);
	}

	else {
		orbSpeed = 2;
		degree+= orbSpeed;

		if (degree >= 360) {
			degree = 1;
		}

		//pause button
		noStroke();
		fill(255, 0, 0);
		rect(65, 65, 10, 25);
		rect(80, 65, 10, 25);

		fill(255);
		ellipse(orbX, orbY, planets[0].size/30, planets[0].size/30);
	}
}

function keyPressed() {
	if (key == ' ') {
		pause = !pause;
	} else if (key === '1') {
		curSound = 1;
		print("curSound is k" + curSound);
	} else if (key === '2') {
		curSound = 2;
		print("curSound is k" + curSound);
	} else if (key === '3') {
		curSound = 3;
		print("curSound is k" + curSound);
	} else if (key === '4') {
		curSound = 4;
		print("curSound is k" + curSound);
	}
}

function mouseClicked() {
	// call blocks clicked/active function
	for (var p = 0; p < planets.length; p++) {
		for (var i = 0; i < planets[p].blcks.length; i++) {
			if (abs(mouseX - planets[p].blcks[i].x) <= planets[p].blcks[i].size &&
				abs(mouseY - planets[p].blcks[i].y) <= planets[p].blcks[i].size) {
				planets[p].blcks[i].toggle();
				planets[p].blcks[i].setSound();
				// print("This block degree is: " + planets[p].blcks[i].deg);
				print("block status is: " + planets[p].blcks[i].active);
				print("block type is: " + planets[p].blcks[i].type);
			}
		}
	}

	if (mouseX >= 65 && mouseX <= 90 && mouseY >= 65 && mouseY <= 90) {
		pause = !pause;
		print("button hit");
		for (var s = 0; s < sounds.length; s++) {
			sounds[s].pause;
		}
	}
}

class Block {
	constructor(type, x, y, size, deg, isHit, gs) {
		// 0 = off, 1 = hovered, 2 = active
		this.state = 0;
		// grayscale value
		this.gs = gs;
		this.type = type;
		this.active = false;
		this.x = x;
		this.y = y;
		this.size = size;
		this.deg = deg;
		this.isHit = isHit;
	}

	display() {
		var hitbox = 0;
		var alpha;
		var r = 245;
		var g = 235;
		var b = 0;

		if (orbSpeed < 1) {
			hitbox = orbSpeed/2;
		} else {
			hitbox = orbSpeed;
		}

		if (this.active) {
			if (abs(this.deg - degree) < hitbox) {
				this.state = 2;
				print("a block is hit. the type is: " + this.type); 
				alpha = 250;
				r = 255;
				g = 255;
				b = 220;
				sounds[this.type].play();
			} else {
				alpha = 200;
			}
		} else if (abs(mouseX - this.x) <= this.size &&
			abs(mouseY - this.y) <= this.size) {
			this.state = 1;
			alpha = 50;
			// print("the state is hover. This block degree is: " + circle1.blcks[i].deg);
		} else {
			this.state = 0;
			alpha = 10;
		}

		noStroke();
		fill(r, g, b, alpha);
		ellipseMode(CENTER);
		ellipse(this.x, this.y, this.size, this.size);
	}

	setSound() {
		this.type = curSound;
	}

	toggle() {
		this.active = !this.active;
	}

	// playBlock() {
	// 	if (this.state == 2 && this.active) {
	// 		// playMode(restart);
	// 		sounds[0].play();
	// 	}
	// }
}

class Planet {
	constructor(size, x, y) {
		this.size = size;
		this.x = x;
		this.y = y;
		this.col = color(115, 50, 118);
		this.blcks = [];
		// constructor(type, x, y, size, deg, isHit, gs)
		for (var i = 0; i < 32; i++) {
			var b = new Block(1, this.x + (this.size / 2) * cos(i * meter), 
								 this.y + (this.size / 2) * sin(i * meter), this.size/30, i * meter, false, 55);
			this.blcks.push(b);
		}
	}

	// ADD A WAY TO NAME / TYPE TEXT ONTO MIDDLE OF PLANET

	display() {
		fill(this.col);
		stroke(255);
		// for (var i = 1; i < meter - 1; i++) {
		// 	line(0,0, width, 0);
		// }
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x, this.y, this.size, this.size);
	}
}

class incDec {
	constructor(w, h, x, y, color) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.color = color;
	}

	display() {
		fill(this.color);
		noStroke();

	}
}







