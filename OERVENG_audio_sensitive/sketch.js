var length=400;//side length of the canvas
var circleNum=22;
var rotateAngle=0;
var rotateSpeed=20;
var rotateSpeedTemp=rotateSpeed;
var rotateDestination=0;
var adjustmentX=2;
var i;//to control loop
var d=length*0.998;
var x=length/2;y=length/2;//initial center of circle
var originalImg;
var extensionRatioX,extenstionRatioY;
var originalImg;
var circleColorA,circleColorB;
var hueOffsetTemp,colorAngle;
var backgroundColor;
var colorHueOffsetSwitch=true;
var isColorA=true;
var isClockwise=true;
var level=0;
var mic,fft;

function setup() {
  frameRate(60);
  colorMode(HSB);
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  createCanvas(length,length);//delete "*2" in final output
  backgroundColor=circleColorB;
  background(backgroundColor);
  noStroke();
  
  //create an audio in
  mic = new p5.AudioIn();
  mic.start();
  //create an fft to analyze
  fft = new p5.FFT(0.8,2048);
  fft.setInput(mic);
}

function getDomainFreq(fft){
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

function hueOffset(c,offsetVal){//c means the color(HSB mode)
  var hueResult;
  hueResult=hue(c)+offsetVal;
  if(hueResult>=360){hueResult-=360;}
  if(hueResult<0){hueResult+=360;}
  c=color(hueResult,saturation(c),brightness(c));
  return c;
}

function draw() {
  //drawDock();
  fft.analyze();
  if(frameCount%15==0){
    rotateDestination=round(map(getDomainFreq(fft),0,2048,0,360*PI));
  }
  translate(length/2,length/2);
  if(rotateAngle>rotateDestination && rotateAngle-rotateDestination>10){
    rotateAngle-=rotateSpeed;
  }
  else if(rotateAngle<rotateDestination && rotateDestination-rotateAngle>10){
    rotateAngle+=rotateSpeed;
  }
  rotate(radians(rotateAngle));
  i=1;
  d=length*0.998;
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  isColorA=true;
  fill(circleColorA);
  level=map(mic.getLevel(),0,1,0,2700);
  //the color relies on the level and pitch of sound
  
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
    
    //color offset
    if(colorHueOffsetSwitch==true){
      if(isColorA){
        fill(hueOffset(circleColorA,level));
      }
      else{
        fill(hueOffset(circleColorB,level));
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
    }
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
    i++;
  }
  while(i<=circleNum)
}

function keyPressed() {
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
}