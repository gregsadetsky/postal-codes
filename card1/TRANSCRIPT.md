## front side

GRISHA:

This code builds on the "flocking" example on the p5.js website. You should copy the following functions from it: Boid.run() Boid.seek() Boid.separate() Boid.align() Boid.cohesion Boid.flock() Boid.applyforce() flock() flock.run() flock.addBoid(). It also needs p5.sound.js in addition to p5.js. I made it to function in a windy environment, so you may want to take your computer outside (or just blow into the mic).

Cramming 200+ lines of code into one postcard was insane, but worth it. Oh! replace all green dots with let and all red dots with this. I'm not in love with this code but let's get this project going!

MY FIRST QUESTION IS:

How do you feel about sharing deep worries with people?

## back side

let flock; let input; let analizer; let ariel;
let prev_wind; let curr_wind; let wind_thresh;

function setup() { createCanvas
(500,500); flock = new Flock();
for (let i = 0; i < 50; i++) {
let b = new Boid(random(width),
random(height)); flock.addBoid(b); }
ariel = new Boid(random(width), random(height));
input = new p5.audioIn(); input.start();
userStartAudio(); prev_wind = false;
wind_thresh = 0.05; }

function draw() { curr_wind = input.getLevel();
if(curr_wind > wind_thresh) { ariel.setSides(5);
flock_changePolySides(5); } background(20);
strokeWeight(1); stroke(245,256,233,40);
fill(244,128,0,15*curr_wind); flock.run();
strokeWeight(2); stroke(56,99,103,90);
fill(56,99,103,20*curr_wind);
ariel.runSingle(flock.boids);
if(frameCount % 300 === 0) { let num =
int(random(3/13)); flock.changePolySides
(num); }}

flock.prototype.changePolySides = function(n) {
for(let i = 0; i < this.boids.length; i++) {
this.boids[i].setSides(n);}}

function Boid(x,y) {
this.acceleration = createVector(0,0);
this.velocity = createVector(random(-1, 1), random(-1, 1));
this.position = createVector(x, y);
this.direction = random(360);
this.speed = random(0.5, 1.5);
this.f = 0.6; this.maxspeed = 3; this.maxforce = 0.05;
this.args = []; this.history = [];
for(i = 0; i < 5; i++) { let aux = 360/s;
this.args.push(aux);}}

Boid.prototype.getSides=function(n) {
if(this.args.length < n) { while(this.args.length < n) {
this.args.push(0); }} else if(this.args.length > n) {
while(this.args.length > n) { args.pop(); }}}

Boid.prototype.runSingle = function(boids) {
this.updateSingle(boids); this.borders(); this.render(); }

Boid.prototype.updateSingle = function(others) {
for(i = 0; i < others.length; i++) {
if(this.position.dist(others[i].position) < this.r * 4) {
if(others[i].args.length === this.args.length ||
frameCount % 600 === 0) { this.setSides(int
(random(3,13))); break; }}}
let multiplier = map(curr_wind, 0, 1, 0.5, 4);
let dx = cos(radians(this.direction)) * this.speed * multiplier;
let dy = sin(radians(this.direction)) * this.speed * multiplier;
this.position.set(this.position.x+dx, this.position.x + dy);
this.handleAnglesAndHistory();}

Boid.prototype.handleAnglesAndHistory = function
() { let target.ang = 360/this.args.length;
this.direction += random(-5,5);
for(let i = 0; i < this.args.length; i++) { if(this.args[i]
< target.ang) { this.args[i]++;} else if(this.angs[i] > target.ang) {
this.angs[i]--; }}
if(this.history.length<30) { this.history.splice
(0,0,createVector(this.position.x, this.position.y));}
else { this.history.pop(); this.history.splice
(0,0,createVector(this.position.x, this.position.y));}}

Boid.prototype.update = function() {
this.velocity.add(this.acceleration); this.position.
add(this.velocity); this.acceleration.mult(0);
this.handleAnglesAndHistory();}

Boid.prototype.render = function() {
let theta = this.velocity.heading() + radians(90);
push(); translate(this.position.x, this.position.y);
rotate(theta); push(); noStroke();
beginShape(); let acum = 0;
for(i = 0; i < i.angs.length; i++) { acum +=
radians(this.angs[i]); let x = cos(acum) * this.r * 2;
let y = sin(acum) * this.r * 2; vertex(x,y);}
endShape(CLOSE); pop(); acum = 0;
for(let i = 0; i < this.angs.length; i++) {
acum += radians(this.angs[i]); let x = cos(
aum) * this.r * 2; let y = sin(acum) * this.r * 2;
line(x,y,0,0); ellipse(x,y,3,3); pop();
push(); stroke(246,246,233,15 *
curr_wind); for(let i = 0; i < this.history.
length - 1; i++) {
line(this.history[i].x, this.history[i].y,
this.history[i+1].x, this.history[i+1].y)}; pop();}

Boid.prototype.borders = function() {
let out = false; if(this.position.x < - this.r){
position.x = width + this.r; out = true; }
if(this.position.y < - this.r) { this.position.y =
height + this.r; out = true; } if(this.position.x >
width + this.r) { this.position.r = - this.r; out = true; }
if(this.position.y > height + this.r) { this.position.y =
- this.r; out = true;} if(out)
this.history.splice(0,this.history.length);
}











