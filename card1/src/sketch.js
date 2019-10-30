Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}




// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}



Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}









// =============================












let flock;
let input;
let analizer;
let ariel;
let prev_wind;
let curr_wind;
let wind_thresh;

function setup() {
  createCanvas(500, 500);
  flock = new Flock();
  for (let i = 0; i < 50; i++) {
    let b = new Boid(random(width), random(height));
    flock.addBoid(b);
  }
  ariel = new Boid(random(width), random(height));
  input = new p5.AudioIn();
  input.start();
  userStartAudio();
  prev_wind = false;
  wind_thresh = 0.05;
}

function draw() {
  curr_wind = input.getLevel() * 10;
  if (curr_wind > wind_thresh) {
    ariel.setSides(5);
    flock.changePolySides(5);
  }
  background(20);
  strokeWeight(1);
  stroke(245, 246, 233, 40);
  fill(244, 128, 0, 15 * curr_wind);
  flock.run();
  strokeWeight(2);
  stroke(56, 99, 103, 90);
  fill(56, 99, 103, 20 * curr_wind);
  ariel.runSingle(flock.boids);
  if (frameCount % 300 === 0) {
    let num = int(random(3, 13));
    flock.changePolySides(num);
  }
}

Flock.prototype.changePolySides = function(n) {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].setSides(n);
  }
}

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.direction = random(360);
  this.speed = random(0.5, 1.5);
  this.r = 6.0;
  this.maxspeed = 3;
  this.maxforce = 0.05;
  this.angs = [];
  this.history = [];
  for (i = 0; i < 5; i++) {
    let aux = 360 / 5;
    this.angs.push(aux);
  }
}

Boid.prototype.setSides = function(n) {
  if (this.angs.length < n) {
    while (this.angs.length < n) {
      this.angs.push(0);
    }
  } else if (this.angs.length > n) {
    while (this.angs.length > n) {
      this.angs.pop();
    }
  }
}

Boid.prototype.runSingle = function(boids) {
  this.updateSingle(boids);
  this.borders();
  this.render();
}

Boid.prototype.updateSingle = function(others) {
  for (i = 0; i < others.length; i++) {
    if (this.position.dist(others[i].position) < this.r * 4) {
      if (others[i].angs.length === this.angs.length || frameCount % 600 === 0) {
        this.setSides(int(random(3, 13)));
        break;
      }
    }
  }
  let multiplier = map(curr_wind, 0, 1, 0.5, 4);
  let dx = cos(radians(this.direction)) * this.speed * multiplier;
  let dy = sin(radians(this.direction)) * this.speed * multiplier;
  this.position.set(this.position.x + dx, this.position.x + dy);
  this.handleAnglesAndHistory();
}

Boid.prototype.handleAnglesAndHistory = function() {
  let target_ang = 360 / this.angs.length;
  this.direction += random(-5, 5);
  for (let i = 0; i < this.angs.length; i++) {
    if (this.angs[i] < target_ang) {
      this.angs[i]++;
    } else if (this.angs[i] > target_ang) {
      this.angs[i]--;
    }
  }
  if (this.history.length < 30) {
    this.history.splice(0, 0, createVector(this.position.x, this.position.y));
  } else {
    this.history.pop();
    this.history.splice(0, 0, createVector(this.position.x, this.position.y));
  }
}

Boid.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
  this.handleAnglesAndHistory();
}

Boid.prototype.render = function() {
  let theta = this.velocity.heading() + radians(90);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  push();
  noStroke();
  beginShape();
  let acum = 0;
  for (i = 0; i < this.angs.length; i++) {
    acum += radians(this.angs[i]);
    let x = cos(acum) * this.r * 2;
    let y = sin(acum) * this.r * 2;
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
  acum = 0;
  for (let i = 0; i < this.angs.length; i++) {
    acum += radians(this.angs[i]);
    let x = cos(acum) * this.r * 2;
    let y = sin(acum) * this.r * 2;
    line(x, y, 0, 0);
    ellipse(x, y, 3, 3);
  }
  pop();
  push();
  stroke(246, 246, 233, 15 * curr_wind);
  for (let i = 0; i < this.history.length - 1; i++) {
    line(
      this.history[i].x,
      this.history[i].y,
      this.history[i + 1].x,
      this.history[i + 1].y
    );
  }
  pop();
}

Boid.prototype.borders = function() {
  let out = false;
  if (this.position.x < -this.r) {
    this.position.x = width + this.r;
    out = true;
  }
  if (this.position.y < -this.r) {
    this.position.y = height + this.r;
    out = true;
  }
  if (this.position.x > width + this.r) {
    this.position.r = -this.r;
    out = true;
  }
  if (this.position.y > height + this.r) {
    this.position.y = -this.r;
    out = true;
  }
  if (out)
    this.history.splice(0, this.history.length);
}
