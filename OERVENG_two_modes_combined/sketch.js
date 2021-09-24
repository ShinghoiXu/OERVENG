var length=600;//side length of the canvas
var circleNum=22;
var rotateAngle=0;
var rotateSpeed=4;
var rotateSpeedTemp=rotateSpeed;
var rotateDestination;
var adjustmentX=2;
var i;//to control loop
var d=length*0.998;
var x=length/2;y=length/2;//initial center of circle
//var dStep=length*0.0425;//step between each circle's diameter
//var cStep=-length*0.022;
//var originalImg;
var extensionRatioX,extenstionRatioY;
var circleColorA,circleColorB;
var hueOffsetTemp,colorAngle;
var backgroundColor;
var colorHueOffsetSwitch=true;
var isColorA=true;
var vector1,vector2;
var isClockwise=true;
var level=0;
var mic,fft;
var helperIsShown=true;
var audioMode=false;

// function preload() {//delete in final output
//   originalImg = loadImage('https://vagallery.s3.us-west-2.amazonaws.com/wp-content/uploads/2020/09/09160917/VAG-2000.38.41.jpg');
// }

function setup() {
  frameRate(60);
  colorMode(HSB);
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  createCanvas(length,length);
  backgroundColor=circleColorB;
  background(backgroundColor);
  vector1=createVector(length/2,0);
  noStroke();
  
  //create an audio in
  mic = new p5.AudioIn();
  mic.start();
  //create an fft to analyze
  fft = new p5.FFT(0.8,2048);
  fft.setInput(mic);
  /*
  var s=0.335;//delete in final output
  scale(s);//delete in final output
  image(originalImg,length*(1/s), 0);//delete in final output
  scale(1/s);//delete in final output
  */
}

function getDomainFreq(fft){//to get pitch of the sound
  var spectrumMax=-1;
  var i,freq;
  freq=0;
  for(i=0;i<=1024;i++){
    if((fft.getEnergy(i,i++))>=spectrumMax){
      freq=i;
      spectrumMax=fft.getEnergy(i,i++);
    }
  }
  return freq;
}

function drawDock(){
  push();
  strokeJoin(ROUND);
  fill(backgroundColor);
  noStroke();
  rect(0,length*1.1,length,length*0.2);
  stroke('black');
  line(0,132/400*length,length,132/400*length);
  noFill();
  rect(445/600*length,160/600*length,140/600*length,38/600*length);
  fill(0);
  textSize(length*0.025);
  text('Mouse&Keyboard',450/600*length,178/600*length);
  text('Mode Only',475/600*length,193/600*length);
  noFill();
  textSize(length*0.08);
  translate(length/25,length/25);
  for(i=1;i<=9;i++){
    if(i<=7||i==9){
      rect(0,(i-1)*length*0.1,length*0.08,length*0.08);
    }
    var textYPostition=length*0.07+(i-1)*length*0.1;
    switch(i){
      case 1:
        text('d',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Change the direction of the rotation',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 2:
        textYPostition-=length*0.005;
        text('-',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Decrease the rotation speed',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 3:
        textYPostition-=length*0.008;
        text('+',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Increase the rotation speed',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 4:
        textYPostition-=length*0.005;
        text('c',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Lock/Unlock the color',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 5:
        textYPostition-=length*0.005;
        text('m',length*0.007,textYPostition);
        push();
        fill(0);
        textSize(length*0.03);
        text('Switch between',length*0.12,textYPostition-length*0.035);
        text('Mouse&Keyboard Mode and Audio Sensitive Mode',length*0.12,textYPostition+length*0.005);
        pop();
        break;
      case 6:
        textYPostition-=length*0.002;
        text('0',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.035);
        text('Reset the rotation speed & direction to default',length*0.12,textYPostition-length*0.015);
        pop();
        break;
      case 7:
        textYPostition-=length*0.001;
        text('h',length*0.017,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Show/Hide this helper page',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 8:
        textYPostition-=length*0.01;
        push();
        textSize(length*0.06);
        rect(0,(i-1)*length*0.1,length*0.29,length*0.08);
        text('spacebar',length*0.017,textYPostition);
        fill(0);
        textSize(length*0.04);
        text('Pause the rotation',length*0.325,textYPostition);
        pop();
        break;
      case 9:
        textYPostition-=length*0.009;
        text('s',length*0.019,textYPostition);
        push();
        fill(0);
        textSize(length*0.04);
        text('Save the image',length*0.12,textYPostition-length*0.01);
        pop();
        break;
      case 10:
        text('')
        break;
    }
  }
  pop();
}

function showHelp(){
  push();
  colorMode(RGB);
  fill(255,255,255,160);
  rect(0,0,length,length);
  pop();
  drawDock();
}

function hueOffset(c,offsetVal){//c means the color(HSB mode)
  var hueResult;
  hueResult=hue(c)+offsetVal;
  if(hueResult>=360){hueResult-=360;}
  if(hueResult<0){hueResult+=360;}
  c=color(hueResult,saturation(c),brightness(c));
  return c;
}

function draw() {
  background(backgroundColor);
  push();
  translate(length/2,length/2);
  if(audioMode==false){
    
    //the color relies on the degree between the mouse and the (1,0) vector (using color wheel)
    
    vector2=createVector(mouseX-length/2,mouseY-length/2);
    colorAngle=degrees(vector1.angleBetween(vector2));
    rotateAngle+=rotateSpeed;
  }
  else{
    
    //the color relies on the level and pitch of sound
    
    if(frameCount%15==0){
      fft.analyze();
      level=map(mic.getLevel(),0,1,0,720);
      colorAngle=level;
      rotateDestination=round(map(getDomainFreq(fft),0,2048,0,360*PI));
    }
    if(rotateAngle>rotateDestination && rotateAngle-rotateDestination>10){
      rotateAngle-=rotateSpeed;
    }
    else if(rotateAngle<rotateDestination && rotateDestination-rotateAngle>10){
      rotateAngle+=rotateSpeed;
    }
  }
  rotate(radians(rotateAngle));
  i=1;
  d=length*0.998;
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  isColorA=true;
  fill(circleColorA);
  
  //the number of circles relies on the distance between the mouse and the center of the circles
  
  if(dist(mouseX,mouseY,length/2,length/2)<=length/2){
    circleNum=round(dist(mouseX,mouseY,length/2,length/2)/(length/44));
  }
  else{
    circleNum=22;
  }
  extensionRatioX=circleNum/22;
  extensionRatioY=brightness(circleColorA)/94;
  
  do {
    if(i==1){d=length*0.998;x=length/2;}
    ii=i/extensionRatioX;
    
    //color hue offset
    
    if(colorHueOffsetSwitch==true){
      if(isColorA){
        fill(hueOffset(circleColorA,colorAngle));
      }
      else{
        fill(hueOffset(circleColorB,colorAngle));
      }
    }
    else{
      if(isColorA){
        fill(hueOffset(circleColorA,hueOffsetTemp));
      }
      else{
        fill(hueOffset(circleColorB,hueOffsetTemp));
      }
    }
    //print(i+": x="+x+" d="+d);
    circle(x-length/2,y-length/2,d);
    //print(hue(circleColorB),saturation(circleColorB),brightness(circleColorB));
    circleColorA=color((-0.2*ii*ii+2.4*ii+7.6)/extensionRatioY,(-0.2*ii*ii+0.0322*ii+83.527)/extensionRatioY,(-4.1*ii+97)/extensionRatioY);
    circleColorB=color((-0.4*ii+267)/extensionRatioY,(0.01651*ii*ii*ii- 0.85*ii*ii+11*ii+8)/extensionRatioY,(-0.2727*ii*ii/4+8.5*ii/2+20)/extensionRatioY);
    
    if(i%2==0){
      fill(circleColorA);
      isColorA=true;
    }
    else{
      fill(circleColorB);
      isColorA=false;
      //print(hue(circleColorB),saturation(circleColorB),brightness(circleColorB));
    }
    //dd=0.009*(ii)*(ii)/600*length-27.5*(ii)/600*length+0.999*length
    dd=-27.9/600*length*(ii-1)+length*0.977;//calculate the new diameter
    xx=1.41/1200*length*(ii)*(ii)-33.8/1200*length*(ii)+31.4/1200*length+length/2;//calculate the new center of the circle
    
    //to avoid circle overlap
    
    if (((d-dd)/2)<=abs(xx-x) && abs(xx-x)<=((d+dd)/2)) {
      if(xx>x){
        if(((d-dd)/2)<=abs(xx-x)){
          xx=x+((d-dd)/2)-adjustmentX;
        }
        else{
          xx=x+((d+dd)/2)+adjustmentX;
        }
      }
      else{
        if(((d-dd)/2)<=abs(xx-x)){    
          xx=x-((d-dd)/2)+adjustmentX;
        }
        else{
          xx=x-((d+dd)/2)-adjustmentX;
        }
      }
    }
    x=xx;d=dd;
    //x+=cStep*(cos(0.04*PI*i));
    //d-=dStep*(1.01*cos(0.002*PI*i));
    i++;
  }
  while(i<=circleNum)
  if(keyIsDown(189)){//Press "-" to slow down the rotation
    if(rotateSpeed>=0.1){
      rotateSpeed-=0.1;
    }
    if(rotateSpeed>0&&rotateSpeed<0.1){
      rotateSpeed=0;
      isClockwise=true;
    }
    if(rotateSpeed<=-0.1){
      rotateSpeed+=0.1;
    }
    if(rotateSpeed<0&&rotateSpeed>-0.1){
      rotateSpeed=0;
      isClockwise=false;
    }
  }
  if(keyIsDown(187)){//Press "+" to speed up the rotation
    if(rotateSpeed>=0 && rotateSpeed<=22 && isClockwise){
      rotateSpeed+=0.1;
    }
    if(rotateSpeed<=0 && rotateSpeed>=-22 && isClockwise==false){
      rotateSpeed-=0.1;
    }
  }
  pop();
  if(helperIsShown){showHelp();}
}

function keyPressed() {
  if(keyCode==32){//Press BlankSpace to pause/play
    if(rotateSpeed!=0){
      rotateSpeedTemp=rotateSpeed;
      rotateSpeed=0;
    }
    else{
      rotateSpeed=rotateSpeedTemp;
    }
  }
  if(keyCode==83){//Press "s" to save the image
    var blank1,blank2;
    blank1="0";blank2="0";
    if(month()>=10){blank1="";}
    if(day()>=10){blank2="";}
    saveCanvas(blank1+month()+blank2+day(),'png');
  }
  if(keyCode==67){//Press "c" to switch color change
    if(colorHueOffsetSwitch==true){
      hueOffsetTemp=colorAngle;
      colorHueOffsetSwitch=false;
    }
    else{
      colorHueOffsetSwitch=true;
    }
  }
  if(keyCode==68){//Press "d" to change the rotation direction
    rotateSpeed=-rotateSpeed;
    isClockwise=!isClockwise;
  }
  if(keyCode==48){//Press "0" to reset the rotation speed & direction to default
    rotateSpeed=4;
    rotateAngle=0;
  }
  if(keyCode==72){//Press "h" to show/hide the helper
    helperIsShown=!helperIsShown;
  }
  if(keyCode==77){//Press "m" to switch mode
    audioMode=!audioMode;
    rotateAngle=0;
    rotateSpeed=4;
  }
}