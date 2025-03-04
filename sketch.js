let heartModel, cam;
let spheres = [];
let blobs = [];
let numBlobs = 50;
let numSpheres = 10;
let heartAngle = 0;
let surface;
let heartbeatSound, breathingSound;

function preload() {
  try {
    heartModel = loadModel('assets/human_heart.obj', true);
  } catch (error) {
    console.error("Error loading 3D model:", error);
    heartModel = null;
  }

  heartbeatSound = loadSound('assets/heartbeat.mp3');
  breathingSound = loadSound('assets/breathing.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, 0, 500);
  cam.lookAt(0, 0, 0);

  heartbeatSound.setVolume(20);
  breathingSound.setVolume(5);

  surface = new WavySurface();

  for (let i = 0; i < numSpheres; i++) {
    spheres.push(new Sphere(random(-300, 300), random(-300, 300), random(-300, 300)));
  }

  for (let i = 0; i < numBlobs; i++) {
    blobs.push(new FlockingBlob(random(-width/2, width/2), random(-height/2, height/2), random(-300, 300)));
  }
}

function draw() {
  background(255);

  surface.update();
  surface.display();

  ambientLight(180);
  pointLight(255, 200, 200, 0, 0, 300);

  for (let s of spheres) {
    s.update();
    s.display();
  }

  if (heartModel) {
    displayHeart();
  }

  for (let b of blobs) {
    b.update();
    b.display();
  }
}
//sound
function mousePressed() {
  if (!heartbeatSound.isPlaying()) {
    heartbeatSound.play();
  }
  if (!breathingSound.isPlaying()) {
    breathingSound.play();
  }

  for (let i = 0; i < 10; i++) {
    blobs.push(new FlockingBlob(mouseX - width / 2, mouseY - height / 2, random(-300, 300)));
  }

  spheres.push(new Sphere(mouseX - width / 2, mouseY - height / 2, random(-300, 300)));
}



// floating heart
function displayHeart() {
  push();
  translate(0, 0, sin(frameCount * 0.05) * 20);
  rotateX(PI);
  rotateY(PI / 2);
  scale(1.5); // Smaller heart
  
  ambientMaterial(random(255,255,255), random(200, 255), random(200, 255));
  // Pastel Pink Outline Effect
  stroke(255, 182, 193); // pink
  strokeWeight(0.5);
  fill(255, 220, 230); // outline pink
  model(heartModel);

  pop();
}

//spheres
class Sphere {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(random(-2, 2), random(-2, 2), random(-2, 2));
    this.size = random(20, 50);
    this.color = color(random(255), random(150, 200), random(255), 200);
  }

  update() {
    this.position.add(this.velocity);

    if (abs(this.position.x) > width / 2) this.velocity.x *= -1;
    if (abs(this.position.y) > height / 2) this.velocity.y *= -1;
    if (abs(this.position.z) > 300) this.velocity.z *= -1;
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color);
    noStroke();
    sphere(this.size);
    pop();
  }
}

// blobs
class FlockingBlob {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.velocity = p5.Vector.random3D().mult(2);
    this.acceleration = createVector();
    this.size = random(10, 25);
    this.color = color(random(255), random(180, 255), random(180, 255), 220);
    this.maxSpeed = 2;
    this.maxForce = 0.05;
  }

  update() {
    let mouseVec = createVector(mouseX - width / 2, mouseY - height / 2, 0);
    let dir = p5.Vector.sub(mouseVec, this.position);
    dir.setMag(0.1);
    this.acceleration.add(dir);

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color);
    noStroke();
    sphere(this.size);
    pop();
  }
}

// Full-Screen Surface
class WavySurface {
  constructor() {
    this.updateSurfaceParams();
  }

  updateSurfaceParams() {
    this.cols = floor(windowWidth/40);
    this.rows = floor(windowHeight/40);
    this.spacing = 40;
    this.waveOffset = 0;
  }

  update() {
    this.waveOffset += 0.05;
  }

  display() {
    push();
    translate(-width / 2, -height / 2, -300);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = i * this.spacing;
        let y = j * this.spacing;
        let z = sin(this.waveOffset + i * 0.2 + j * 0.2) * 30;
        push();
        translate(x, y, z);
        fill(random(200, 255), random(150, 200), random(200, 255), 180);
        noStroke();
        sphere(5);
        pop();
      }
    }
    pop();
  }
}

//canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  surface.updateSurfaceParams(); 
}
