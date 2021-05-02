let bg;

let a = 0;
let currentFly;
let onFly = false;
let currentJarFly;
let timing;

let currentTime = function() {
    return millis();
  }

let d = 0;
let lidOff = false;
let onJar = false;

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
  sGW = new Window(458, 250, 40, 30);
  door = new Window(530, 310, 40, 80, color(0, 0, 0));

  moon = new Moon(600, 150, 30);

  for (let i = 0; i < 20; i++) {
    timing = currentTime();
    freeFireflies[i] = new freeFirefly(createVector(random(0, width), random(250, 550)));
  }
  
  
  jar = new Jar();


}

function draw() {
  background(bg);
  h.display();
  windowUpperR.runWindow();
  windowLowerM.runWindow();
  windowUpperL.runWindow();
  windowLowerL.runWindow();

  sGW.runStainedGlass();
  door.runDoor();
  
  moon.rise();

  for (let i = 0; i < freeFireflies.length; i++) {
    freeFireflies[i].run();
  };

  for (let i = 0; i < bugsInJar.length; i++) {
    bugsInJar[i].run();
  };
  
  for (let i = 0; i<firefliesOut.length; i++) {
    firefliesOut[i].run();
  }
  
  for (let i=0; i < stars.length; i++) {
    stars[i].display();
    stars[i].shine();
  }

  jar.display();
  jar.lid();

}


function mouseClicked() {
  if (onFly) {
    freeFireflies.splice(currentFly, 1);
    if (bugsInJar.length < 20) {
      bugsInJar.push(new jarFirefly(createVector(random(25, 95), random(423, 533))));
      console.log(bugsInJar.length);
      onFly = false;
    };
  }
  
  windowUpperR.onWindowClick();
  windowLowerM.onWindowClick();
  windowUpperL.onWindowClick();
  windowLowerL.onWindowClick();
  door.onDoorClick();
  sGW.onGlassClick();
  
  if (mouseY < 120) {
    stars.push(new Star(mouseX, mouseY));
  }
}

function keyPressed() {
  if (keyCode === ESCAPE && !lidOff && freeFireflies.length === 0) {
    lidOff = true;
    
    /*for (let i = 0; i < 20; i++) {
      timing = currentTime();
      firefliesOut.push(new outFirefly(createVector(random(20, 100), 390)));
    }*/
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
    triangle(this.x, (this.y / 2) - triangleHeight, this.x - (this.width / 2), this.y - this.height / 2, this.x + (this.width / 2), this.y - this.height / 2);
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

let doorOpen = false;
let aGlass = 100;

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

  onWindowClick() {
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
  
  runWindow() {
    this.windows();
    this.shutters();
    this.checkOnWindow();
  }

  stainedGlassWindow() {
    fill(0, 0, 0);
    rect(this.x, this.y, this.width, this.height);
    stroke('#696969');
    strokeWeight(4);
    fill(255, 109, 124, aGlass);
    rect(this.x, this.y, this.width, this.height);
    noStroke();
    fill(0, 0, 255, aGlass);
    triangle(this.x + 2, this.y + 2, this.x - 2 + this.width, this.y + 2, this.x + this.width / 2, this.y + this.height / 2);
    fill(0, 0, 255, aGlass);
    triangle(this.x + 2, this.y + this.height - 2, this.x - 2 + this.width, this.y + this.height - 2, this.x + this.width / 2, this.y + this.height / 2);
    fill(255, 255, 50, aGlass);
    ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, this.width / 3);
  }
  
  runStainedGlass() {
    this.stainedGlassWindow();
    this.checkOnWindow();
  }
  
  onGlassClick() {
    if (this.onWindow && aGlass === 255) {
      aGlass = 100;
    } else if (this.onWindow && aGlass === 100) {
      aGlass = 255;
    }
  }

  displayDoor() {
    stroke('#696969'); //door
    strokeWeight(4);
    if (!doorOpen) {
      fill('#aa9a86');
      rect(this.x, this.y, this.width, this.height);
      noStroke();
      fill('#704214'); //doorknob
      ellipse(this.x + this.width / 6, this.y + this.height / 2, 10, 10);
    } else if (doorOpen) {
      fill('#fcf75e');
      rect(this.x, this.y, this.width, this.height);
      noStroke();
      fill('#daa520');
      rect(this.x+2, this.y+this.height*0.66, this.width - 4, this.height*0.33-1);
      fill('#f4f0ec');
      quad(this.x+this.width*0.8, 
           this.y+this.height*0.8, 
           this.x+this.width*0.8, 
           this.y+2, 
           this.x+this.width-2, 
           this.y+2,
           this.x+this.width-2,
           this.y+this.height-2);
      fill('#b8860b');
      ellipse(this.x + this.width*0.78, this.y + this.height*0.45, 5, 8);
    }
    
    noStroke();
    fill('#696969'); //steps
    rect(this.x, this.y + this.height, this.width, this.height / 2);
    for (let steps = 0; steps < this.height / 2; steps += 15) {
      fill('#c0c0c0');
      rect(this.x, steps + this.y + this.height, this.width, this.height / 10);
    }
  }
  
  runDoor() {
    this.displayDoor();
    this.checkOnWindow();
  }
  
  onDoorClick() {
    if (this.onWindow && doorOpen) {
      doorOpen = false;
    } else if (this.onWindow && !doorOpen) {
      doorOpen = true;
      
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
    ellipse(this.x, this.y, this.diameter * 1.4, this.diameter * 1.4);
    fill(moonColorA);
    ellipse(this.x, this.y, this.diameter * 1.2, this.diameter * 1.2);
    fill(moonColor);
    ellipse(this.x, this.y, this.diameter, this.diameter)
    this.x -= 0.0035;
    this.y -= 0.005;
  }
}

let Jar = function() {
}

Jar.prototype.display = function() {
  stroke(234, 224, 200, 255);
  strokeWeight(1);
  fill(234, 224, 200, 30);
  rect(20, 418, 80, 120, 20, 20, 10, 10);
  rect(29, 406, 62, 12, 3);
  fill(234, 224, 200, 10);
  stroke(234, 224, 200);
  line(30, 408, 90, 408);
  line(30, 411, 90, 411);
  line(30, 414, 90, 414);
  noStroke();
  fill(234, 224, 200)
  bezier(85, 425, 102, 420, 94, 460, 96, 500);
}

Jar.prototype.lid = function() {
  if (!lidOff) {
    noStroke();
    fill(0, 0, 0);
    rect(25, 405, 70, 15, 5);
    fill(0, 0, 139);
    bezier(26, 405, 30, 422, 91, 422, 95, 405);
  } else if (lidOff) {
    noStroke();
    fill(0, 0, 0);
    rect(70, 530, 70, 15, 5);
    fill(0, 0, 139);
    bezier(71, 530, 70, 547, 141, 547, 139, 530);
  }
}
  
Jar.prototype.checkOnJar = function() {
  if (mouseX > 20 &&
    mouseX < 100 &&
    mouseY > 418 &&
    mouseY < 538) {
    onJar = true;
  }
}




let Star = function(x, y, dMIN, dMAX) {
  this.x = x;
  this.y = y;
  this.dMIN = random(1, 3);
  this.dMAX = this.dMIN * 1.5;
}

Star.prototype.display = function() {
  noStroke();
  fill(255, 255, 255);
  ellipse(this.x, this.y, d, d);
}

Star.prototype.shine = function() {
  this.dMIN += 2;
  d = ((sin(radians(this.dMIN)) + 1.5) / 2) * this.dMAX;
}

let stars = [];




let Firefly = function(position, value) {
  this.acceleration = createVector(-0.5, 0.5);
  this.velocity = createVector(0.3, 0.3);
  this.position = position;
  this.value = 0;
};

Firefly.prototype.display = function() {
	noStroke();
	fill(255, 255, 0, a);
	ellipse(this.position.x, this.position.y, 5, 2);
}

Firefly.prototype.update = function() {
  let move = createVector(random(-15, 15), random(-15, 15));
  this.acceleration.add(move);
  this.velocity.add(this.acceleration);
  this.velocity.limit(0.3);
  this.position.add(this.velocity);
};

Firefly.prototype.shine = function() {
	this.value += 1;
	a = ((sin(radians(this.value)) + 1) / 2) * 255;
}

Firefly.prototype.run = function() {
  this.display();
  this.update();
  this.shine();
}

function freeFirefly(position, value, s) {
	Firefly.call(this, position);
    this.s = random(10000);
}

freeFirefly.prototype = Object.create(Firefly.prototype);


freeFirefly.prototype.checkEdges = function() {
  if (this.position.x > width) {
    this.position.x = 0;
  } else if (this.position.x < 0) {
    this.position.x = width;
  } else if (this.position.y > 550) {
    this.position.y = 250;
  } else if (this.position.y < 250) {
    this.position.y = 550;
  }
}

freeFirefly.prototype.checkOnFly = function() {
  if (mouseX > this.position.x - 20 &&
    mouseX < this.position.x + 20 &&
    mouseY > this.position.y - 20 &&
    mouseY < this.position.y + 20
  ) {
    onFly = true;
    currentFreeFly = freeFireflies.indexOf(this);
  } 
}

freeFirefly.prototype.run = function() {
  if (millis() > this.s + timing) {
    Firefly.prototype.run.call(this);
    this.checkEdges();
    this.checkOnFly();
  }
};

function jarFirefly(position, value, s) {
	Firefly.call(this, position);
    this.s = random(10000);
}

jarFirefly.prototype = Object.create(Firefly.prototype);

jarFirefly.prototype.display = function() {
	noStroke();
	fill(255, 255, 0, a);
	ellipse(this.position.x, this.position.y, 7, 4);
	fill(192, 192, 192, a);
	triangle(this.position.x, this.position.y - 6, random(this.position.x - 8, this.position.x - 6), random(this.position.y - 7, this.position.y - 4), this.position.x - 4, this.position.y - 6);
	triangle(this.position.x, this.position.y - 6, random(this.position.x + 8, this.position.x + 6), random(this.position.y - 7, this.position.y - 4), this.position.x + 4, this.position.y - 6);
}

jarFirefly.prototype.checkEdges = function() {
  if (this.position.x > 95) {
    this.position.x = 94;
  } else if (this.position.x < 25) {
    this.position.x = 29;
  } else if (this.position.y > 533) {
    this.position.y = 532;
  } else if (this.position.y < 433) {
    this.position.y = 434;
  }
}

jarFirefly.prototype.run = function() {
  Firefly.prototype.run.call(this);
  this.display();
  this.checkEdges();
  this.escape();
}

jarFirefly.prototype.escape = function() {
  if (lidOff && bugsInJar.length > 0) {
    let move = createVector(random(-15, 15), random(-5, -1));
    this.acceleration.add(move);
    this.velocity.add(this.acceleration);
    this.velocity.limit(0.3);
    this.position.add(this.velocity);
    
    if (this.position.y < 435) {
      bugsInJar.splice(this, 1);
      console.log(bugsInJar.length);
    } 
    
    for (let i = 0; i < 20; i++) {
      timing = currentTime();
      freeFireflies.push(new freeFirefly(createVector(random(20, 100), 390)));
    }
    
    /*if (this.position.y < 435 && bugsInJar.length > 0) {
      bugsInJar.splice(this, 1);
      console.log(bugsInJar.length);
    
    if (firefliesOut.length < 20) {
        
        timing = currentTime();
        firefliesOut.push(new outFirefly(createVector(random(20, 100), 390)));
      } 
    }*/
  }
}


/*function outFirefly(position, value, s) {
	Firefly.call(this, position);
    this.s = random(5000);
}

outFirefly.prototype = Object.create(Firefly.prototype);

outFirefly.prototype.display = function() {
  if (millis() > this.s + timing) {
	Firefly.prototype.display.call(this);
  };
}

outFirefly.prototype.run = function() {
  Firefly.prototype.run.call(this);
  this.display();
}*/

let freeFireflies = [];
let bugsInJar = [];
let firefliesOut = [];	