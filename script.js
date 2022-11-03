const colorList = ['maroon','brown','olive','teal','navy','black','red','orange','yellow','lime','green','cyan','blue','purple','magenta','grey','pink','apricot','beige','mint','lavender','white'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(random(colorList));
  fill(random(colorList));  
  background(255);
}

function draw() {
  ellipse(mouseX, mouseY, 25, 25);
}