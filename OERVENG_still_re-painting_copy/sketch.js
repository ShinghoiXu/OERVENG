var length=600; //side length of the canvas
var circleNum=22;
var adjustmentX=2;
var i;//to control loop
var d=length*0.998;
var x=length/2;y=length/2;//initial center of circle
//var dStep=length*0.0425;//step between each circle's diameter
//var cStep=-length*0.022;
//var originalImg;
var extensionRatioX,extenstionRatioY;
var circleColorA,circleColorB;
var backgroundColor;
var isColorA=true;

// function preload() {//delete in final output
//   originalImg = loadImage('https://vagallery.s3.us-west-2.amazonaws.com/wp-content/uploads/2020/09/09160917/VAG-2000.38.41.jpg');
// }

function setup() {
  noLoop();
  colorMode(HSB);
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  createCanvas(length,length);
  backgroundColor=circleColorB;
  background(backgroundColor);
  noStroke();
  /*
  var s=0.335;//delete in final output
  scale(s);//delete in final output
  image(originalImg,length*(1/s), 0);//delete in final output
  scale(1/s);//delete in final output
  */
}

function draw() {
  background(backgroundColor);
  translate(length/2,length/2);
  i=1;
  d=length*0.998;
  circleColorA=color(11,84,93);
  circleColorB=color(272,27,27);
  isColorA=true;
  fill(circleColorA);
  extensionRatioX=circleNum/22;
  extensionRatioY=brightness(circleColorA)/94;

  do {
    if(i==1){d=length*0.998;x=length/2;}
    ii=i/extensionRatioX;
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
}

function keyPressed() {
  if(keyCode==83){//Press "s" to save the image
    var blank1,blank2;
    blank1="0";blank2="0";
    if(month()>=10){blank1="";}
    if(day()>=10){blank2="";}
    saveCanvas(blank1+month()+blank2+day(),'png');
  }
}
