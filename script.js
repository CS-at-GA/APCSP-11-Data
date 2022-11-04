const colorList = ['maroon','brown','olive','teal','navy','black','red','orange','yellow','lime','green','cyan','blue','purple','magenta','grey','pink','apricot','beige','mint','lavender','white'];

let table;
let xColumn;
let selectingX = false;
let textBoxWidth;

function preload() {
  table = loadTable("dataR2.csv","csv","header")
  //https://archive-beta.ics.uci.edu/dataset/451/breast+cancer+coimbra
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(random(colorList));
  fill(random(colorList));  
  yColumn = table.columns[0];
  textBoxWidth = textWidth(`y-axis: ${table.columns.reduce( (longest,current) => textWidth(current) > textWidth(longest) ? current : longest, "")}`)
  xColumn;
  background(255);
  noLoop();
  noStroke();
}

function draw() {
  background('white');
  drawInputPrompt();
  drawData(xColumn,yColumn,{x:{min:textBoxWidth+20, max:textBoxWidth+20+400}, y:{min:310,max:10}});
}

function drawData(
  xAxis = Array.from(Array(table.getRowCount()), (x,i) => (i) ), 
  yAxis = yColumn, 
  boundaries = { x: {min: textBoxWidth, max: width-20}, y:{min:height-20,max:20}} ) {
  noFill();
  stroke('black');
  rectMode(CORNERS)
  rect(boundaries.x.min, boundaries.y.min, boundaries.x.max, boundaries.y.max)
  noStroke();
  const classification = table.getColumn("Classification");

  let data = Array.isArray(xAxis) ? xAxis : table.getColumn(xAxis).map( float )
  const x = {
    data, 
    stats: descriptiveStatisticsFor( data )
  }
  data = table.getColumn(yAxis).map( float )
  const y = {
    data,
    stats: descriptiveStatisticsFor( data )
  }

  for( let i = 0; i < classification.length; i++ ) {
    classification[i] === "1" ? fill(colorList[7]) : fill(colorList[12])
    const [xMin,xMax] = Array.isArray(xAxis) ? [0,xAxis.length-1] : [x.stats.min, x.stats.max]
    circle(
      map( x.data[i], xMin, xMax, boundaries.x.min, boundaries.x.max ),
      map( y.data[i], y.stats.min, y.stats.max, boundaries.y.min, boundaries.y.max), 3);
  }
}

function descriptiveStatisticsFor(data) {
  const stats = {
    min: Infinity,
    max: -Infinity,
    mean: 0
  }
  let sum = 0;
  for( let x of data ) {
    x = float(x);
    sum += x;
    stats.min = min(x,stats.min);
    stats.max = max(x, stats.max);
  }
  stats.mean = sum/data.length;
  return stats;
}

function drawInputPrompt() {
  fill('black')
  for( let i = 0; i < table.columns.length-1; i++ ) {
    text( `${i+1}: ${table.columns[i]}`, 10, 10 + 14 * i )
  }
  let y = 10 + 14 * table.columns.length;
  text( `x axis: ${xColumn ?? "sequence"}`,10,y);
  text( `y axis: ${yColumn}`, 10, y + 14 );
  fill(colorList[7]);
  let x = 10;
  text( `present`, x, y + 28 );
  fill(colorList[12]);
  text( `absent`, x + 5 + textWidth('present'), y + 28 );
}

function keyPressed() {
  if( key === 'x' ) {
    selectingX = true;
  } else {
    const digit = parseInt(key)
    if( digit && digit > 0 && digit < 10 ) {
      if( selectingX ) {
        xColumn = table.columns[digit-1];
        selectingX = false;
      } else {
        yColumn = table.columns[digit-1];
      }
      redraw();
    }    
  }

}

