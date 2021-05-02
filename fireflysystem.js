let bg; 
let a = 0;
let flyLightSpeed = 1;
let flyLightMAX = 255;
let freeBugs;
let jarBugs;
let onFly = false;
let currentFly;

function preload() {
  bg = loadImage('mandanCrescentBgNight.jpg');
}

function setup() {
  createCanvas(750, 550);

  image(bg, 0, 0);

  h = new House(480, 320, 200, 190);
  windowUpperR = new Window(530, 240, 27, 48, '#000036');
  windowLowerM = new Window(465, 310, 27, 48, '#000036');
  windowUpperL = new Window(400, 240, 27, 48, '#000036');
  windowLowerL = new Window(400, 310, 27, 48, '#000036');
  sGW = new Window(458, 250, 40, 30, '#000000');
  door = new Window(530, 310, 40, 80, '#000000');
  
  moon = new Moon(600, 150, 30);
  
  freeBugs = new FireflySystem();
  jarBugs = new JarBugsSystem();
  
  
}

function draw() {
  background(bg);
  h.display();
  windowUpperR.display();
  windowLowerM.display();
  windowUpperL.display();
  windowLowerL.display();
  windowUpperR.checkOnWindow();
  windowLowerM.checkOnWindow();
  windowUpperL.checkOnWindow();
  windowLowerL.checkOnWindow(); 
 
  sGW.stainedGlassWindow();
  door.door();
  moon.rise();
  
  for (let i = 0; i < freeFireflies.length; i++) {
    freeFireflies[i].run();
  };
  
  for (let i=0; i < bugsInJar.length; i++) {
    bugsInJar[i].run();
  };
  
  jar();
  
}


function mouseClicked() {
  windowUpperR.onClick();
  windowLowerM.onClick();
  windowUpperL.onClick();
  windowLowerL.onClick();  
  
  if (onFly) {
    freeFireflies.splice(currentFly, 1);
    bugsInJar.push(new jarFirefly(createVector(random(25, 95), random(423, 533))));
    console.log(freeFireflies.length);
  }
}

  class House {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height
    }

    chimney() {
      fill('#800000');
      rectMode(CORNER);
      let chimneyX = this.x - this.width / 3;
      let chimneyY = this.y - this.height;
      let chimneyWidth = this.width / 9;
      let chimneyHeight = this.height / 3;
      noStroke();
      rect(chimneyX, chimneyY, chimneyWidth, chimneyHeight);
      strokeWeight(1);
      stroke('#a9a9a9');
      for (let c = chimneyY; c < this.height; c += 7) {
        line(chimneyX, c, chimneyX + chimneyWidth, c);
        if (c % 2) {
          line(chimneyX + chimneyWidth / 2, c, chimneyX + chimneyWidth / 2, c + 7);
        }
      }
    }

    roof() {
      noStroke();
      fill('#696969');
      let triangleHeight = this.height / 4;
      triangle(this.x, (this.y / 2) - triangleHeight, this.x - (this.width / 2), this.y - this.height/2, this.x + (this.width / 2), this.y - this.height/2);
    }

    building() {
      noStroke();
      fill('#aa9a86');
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
      for (let s = this.y - this.height / 2; s < this.y + this.height / 2; s += 10) {
        strokeWeight(1);
        stroke('#696969');
        line(this.x - this.width / 2, s + 10, this.x + this.width / 2, s + 10);
      }
    }
    
    porch() {
      rectMode(CORNER);
      fill('#696969');
      triangle(this.x - this.width, this.y - this.height / 10, this.x - this.width / 2, this.y - this.height / 10, this.x - this.width / 2, this.y - this.height / 3);
      stroke('#aa9a86');
      strokeWeight(4);
      line(this.x - this.width, this.y - this.height / 10 + 2, this.x - this.width, this.y + this.height / 2.05);
      line(this.x - this.width * 0.75, this.y - this.height / 10 + 2, this.x - this.width * 0.75, this.y + this.height / 2.05);
      noStroke();
      fill('#aa9a86');
      rect(this.x - this.width, this.y - this.height / 10, this.width / 2, this.height / 16);
      rect(this.x - this.width, this.y + this.height / 2 - this.height / 14, this.width / 2, this.height / 14);
    }

    foundation() {
      for (let f = 0; f < this.width; f += this.width / 6) {
        fill('#8a795d');
        rect(f + (this.x - this.width / 2), (this.y + this.height / 2) - this.width / 6, this.width / 6, this.width / 6);

      }
      for (let f = this.width / 6; f < this.width; f += this.width / 6) {
        strokeWeight(1);
        stroke('#696969');
        line(f + (this.x - this.width / 2), (this.y + this.height / 2) - this.width / 6, f + (this.x - this.width / 2), this.y + this.height / 2);
      }
    }

    display() {
      this.chimney();
      this.building();
      this.roof();
      this.porch();
      this.foundation();
    }

  }

  class Window {
    constructor(x, y, width, height, isLightOn) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.isLightOn = isLightOn;
    }
    
    checkOnWindow() {
        if (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    ) {
      this.onWindow = true;
      } else {
        this.onWindow = false;
      }
    }
    
    onClick() {
      if (this.onWindow && this.isLightOn === '#000036') {
      this.isLightOn = '#ffff00';
    } else if (this.onWindow && this.isLightOn === '#ffff00') {
      this.isLightOn = '#000036';
    }
    }
    
    windows() {
      rectMode(CORNER);
      fill(this.isLightOn);
      stroke('#696969');
      strokeWeight(4);
      rect(this.x, this.y, this.width, this.height);
      strokeWeight(2);
      line(this.x + this.width / 2, this.y, this.x + this.width / 2, this.y + this.height);
      line(this.x, this.y + this.height * 0.33, this.x + this.width, this.y + this.height * 0.33);
      line(this.x, this.y + this.height * 0.66, this.x + this.width, this.y + this.height * 0.66);
    }
    
    shutters() {
      fill('#49796b');
      stroke('#004040');
      strokeWeight(1);
      rect(this.x - this.width / 2, this.y, this.width / 2, this.height); //left shutter
      rect(this.x + this.width, this.y, this.width / 2, this.height); //right shutter
      for (let l = this.y; l < this.height + this.y; l += 4) {
        line(this.x - this.width / 2, l, this.x, l)
      };
      for (let m = this.y; m < this.height + this.y; m += 4) {
        line(this.x + this.width, m, this.x + this.width + this.width / 2, m)
      };
    }

    display() {
      this.windows();
      this.shutters();
    }
    
    stainedGlassWindow() {
      stroke('#696969');
      strokeWeight(4);
      fill('#9f1d35');
      rect(this.x, this.y, this.width, this.height);
      noStroke();
      fill('#000036');
      triangle(this.x+2, this.y+2, this.x-2+this.width, this.y+2, this.x+this.width/2, this.y+this.height/2);
      fill('#483d8b');
      triangle(this.x+2, this.y+this.height-2, this.x-2+this.width, this.y+this.height-2, this.x+this.width/2, this.y+this.height/2);
      fill('#000080');
      ellipse(this.x+this.width/2, this.y+this.height/2, this.width/3, this.width/3);
    }

    door() {
      stroke('#696969'); //door
      strokeWeight(4);
      fill('#aa9a86');
      rect(this.x, this.y, this.width, this.height);
      noStroke();
      fill('#704214'); //doorknob
      ellipse(this.x + this.width / 6, this.y + this.height / 2, 10, 10);
      fill('#696969'); //steps
      rect(this.x, this.y + this.height, this.width, this.height / 2);
      for (let steps = 0; steps < this.height / 2; steps += 15) {
        fill('#c0c0c0');
        rect(this.x, steps + this.y + this.height, this.width, this.height / 10);
      }

    }

  } 
  
  class Moon {
    constructor(moonPosX, moonPosY, diameter) {
      this.x = moonPosX;
      this.y = moonPosY;
      this.diameter = diameter;
    }
    
    rise() {
      let moonColor = color(234, 224, 200);
      let skyColor = color(0, 0, 128);
      let moonColorA = lerpColor(moonColor, skyColor, 0.33);
      let moonColorB = lerpColor(moonColor, skyColor, 0.66);
      fill(moonColorB);
      ellipse(this.x, this.y, this.diameter*1.4, this.diameter*1.4);
      fill(moonColorA);
      ellipse(this.x, this.y, this.diameter*1.2, this.diameter*1.2);
      fill(moonColor);
      ellipse(this.x, this.y, this.diameter, this.diameter)
      this.x -= 0.0035;
      this.y -= 0.005;
    }
  }
  
  jar = () => {
    noFill();
    stroke(234, 224, 200);
    strokeWeight(3);
    rect(20, 418, 80, 120, 20, 20, 10, 10);
    noStroke();
    fill(234, 224, 200);
    bezier(85, 425, 102, 420, 94, 460, 96, 500);
    fill(0, 0, 0);
    rect(25, 405, 70, 15, 5);
    fill(0, 0, 139);
    bezier(26, 405, 30, 422, 91, 422, 95, 405);
  }
  
let Firefly = function(position, s, value) {
  this.acceleration = createVector(-0.5, 0.5);
  this.velocity = createVector(0.3, 0.3);
  this.position = position;
  this.s = random(10000);
  this.value = 0;
};

Firefly.prototype.run = function() {
  if (millis() > this.s) {
    this.shine();
    this.display();
    this.update();
    this.checkEdges();
    this.checkOnFly();
  }
};

Firefly.prototype.update = function(){
    let move = createVector(random(-15, 15), random(-15, 15));
    this.acceleration.add(move);
    this.velocity.add(this.acceleration);
    this.velocity.limit(0.3);
    this.position.add(this.velocity);
};

Firefly.prototype.display = function() {
  noStroke();
  fill(255, 255, 0, a);
  ellipse(this.position.x, this.position.y, 5, 2);
};

Firefly.prototype.shine = function() {
    this.value += flyLightSpeed;
    a = ((sin(radians(this.value))+1)/2)*flyLightMAX;
};

Firefly.prototype.checkEdges = function() {
  if (this.position.x > width) {
        this.position.x = 0;
    } else if (this.position.x < 0) {
        this.position.x = width;
    } else if (this.position.y > 500) {
        this.position.y = 250;
    } else if (this.position.y < 250) {
        this.position.y = 500;
    }
}

Firefly.prototype.checkOnFly = function() {
  if (mouseX > this.position.x - 20 &&
    mouseX < this.position.x + 20 &&
    mouseY > this.position.y - 20 &&
    mouseY < this.position.y + 20
  ) {
    onFly = true;
    currentFly = freeFireflies.indexOf(this);
  } 
}

let jarFirefly = function (position, s, value) { 
    this.acceleration = createVector(-0.5, 0.5);
    this.velocity = createVector(0.3, 0.3);
    this.position = position;
    this.s = random(10000);
    this.value = 0;
  }

jarFirefly.prototype.run = function() {
      this.shine();
      this.update();
      this.display();
      this.checkEdges();
  }

jarFirefly.prototype.update = function(){
    let move = createVector(random(-15, 15), random(-15, 15));
    this.acceleration.add(move);
    this.velocity.add(this.acceleration);
    this.velocity.limit(0.3);
    this.position.add(this.velocity);
};

jarFirefly.prototype.display = function() {
    noStroke();
    fill(255, 255, 0, a);
    ellipse(this.position.x, this.position.y, 7, 4);
    fill(192, 192, 192, a);
    triangle(this.position.x, this.position.y-6, random(this.position.x-8, this.position.x-6), random(this.position.y-7, this.position.y-4), this.position.x-4, this.position.y-6);
    triangle(this.position.x, this.position.y-6, random(this.position.x+8, this.position.x+6), random(this.position.y-7, this.position.y-4), this.position.x+4, this.position.y-6);
  }

jarFirefly.prototype.checkEdges = function() {
  if (this.position.x > 95) {
        this.position.x = 90;
    } else if (this.position.x < 25) {
        this.position.x = 30;
    } else if (this.position.y > 533) {
        this.position.y = 528;
    } else if (this.position.y < 433) {
        this.position.y = 434;
    }
}

jarFirefly.prototype.shine = function() {
    this.value += flyLightSpeed;
    a = ((sin(radians(this.value))+1)/2)*flyLightMAX;
}

let freeFireflies = [];
let bugsInJar = [];
  
let FireflySystem = function() {
  for (let i = 0; i < 20; i++) {
    freeFireflies[i] = new Firefly(createVector(random(0, width), random(250, 500)));
  }
}

let JarBugsSystem = function () {
  for (let i = 0; i < bugsInJar.length; i++) {
    bugsInJar[i];
  }
}



