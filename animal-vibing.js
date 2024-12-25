// duckvibe.js

let sound1;
let box1;
let currentSong;

let isPlaying = false;

let boxW = 300;
let boxH = 50;
let buttonW = 50;
let timelineW = 200;

let chooseSong;
let volumeSlider;
let ratePitchSlider;

let duck = '🦆';
let chick = '🐔';
let clickDuck;
let clickChick;
let animal = duck;
let animalName = "Duckie";


// function preload(){
// //   sound1 = loadSound("too sweet cropped.mp3");
//     sound1 = null;
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
//dont check this yet, will cause errors since sound1 is preloaded as null
//   if(sound1.isLoaded() == true){
//     print("Sound is ready to play");
//   }
//   else{
//     print("Error playing file")
//   }
  box1 = new SoundBox(100,200,sound1);
  
  volumeSlider = createSlider(0, 2, 0.5, 0.01);
  volumeSlider.position(250, 280);
  volumeSlider.input(changeVolume);
  
  ratePitchSlider = createSlider(0.5, 2, 1, 0.1);
  ratePitchSlider.position(250, 340);
  ratePitchSlider.input(changeRate);

  chooseSong = createFileInput(songSelect);
  chooseSong.style("font-size", "15px");
  chooseSong.position(10, 50);
  chooseSong.attribute("accept", ".mp3,.wav,.ogg");
  //   chooseSong.mousePressed(() => { print("Choose Song button pressed!");});

  if(sound1 && sound1.isLoaded()){
    print("Sound is ready to play");
  }
  else{
    print("Error playing file")
  }

  changeAnimal();
} 

function draw() {
    background(0, 200, 200); //light blue 

    textSize(15);
    textAlign(LEFT, TOP);
    text("Select Song", 10, 15);

    textSize(15);
    textAlign(RIGHT, TOP);
    text("Select Animal", windowWidth - 17, 15);

    textSize(30);
    textAlign(CENTER, CENTER);
    fill(0, 0, 200);
    text(animalName + " is currently vibing to", windowWidth/2, windowHeight/8);

    box1.x = windowWidth/2 - boxW/2; 
    box1.y = windowHeight/3;
    
    box1.render();
    
    fill(0, 0, 260);
    if(currentSong){
        textSize(20);
        textFont("Arial");
        textAlign(CENTER, CENTER);
        text(split(currentSong, '.mp3')[0], windowWidth/2, windowHeight/6);
    }
    else{
        textSize(20);
        textFont("Arial");
        textAlign(CENTER, CENTER);
        text("No song selected", windowWidth/2, windowHeight/6);
    }

    let volumeSliderY = windowHeight * 0.50;  
    let ratePitchSliderY = windowHeight * 0.60;

    textSize(20);
    textFont("Arial");
    fill(0, 0, 250)

    text("Volume", windowWidth/2, volumeSliderY - 10);
    volumeSlider.position(windowWidth/2 - volumeSlider.width/2, volumeSliderY);

    text("Rate and Pitch", windowWidth/2, ratePitchSliderY - 10);
    ratePitchSlider.position(windowWidth/2 - ratePitchSlider.width / 2, ratePitchSliderY);
}

function keyPressed(){
  if(key == " "){
    if(sound1.isPlaying() == false){
      sound1.play();
      isPlaying = true;
  }
  else{
    sound1.pause();   
    isPlaying = false;
  }

  print("played");
  }
}

function songSelect(song){
    if(song.type == 'audio'){
        loadSound(song.data, (loadedSong => {
            sound1 = loadedSong;
            box1.setSound(sound1);
            currentSong = song.name;
            print("Sound loaded successfully");
        }))
    }
}
function soundFinished(){
  isPlaying = false;
}

function mousePressed(){
  box1.checkAction(mouseX, mouseY);
}

class SoundBox{
  constructor(x, y, audiofile){
    this.x = x;
    this.y = y;
    this.sound = audiofile;
    // this.animal = changeAnimal();
    // this.duck = '🦆';
    // this.chick = '🐔';
  }

  render(){
    fill(180);
    stroke(0);
    strokeWeight(1);
    rect(this.x, this.y, boxW, boxH);

    if(this.sound && this.sound.isPlaying()){
      fill(0, 200, 0);
    }
    else{
      fill(200, 0, 0);
    }
    rect(this.x, this.y, buttonW, boxH);

    if(this.sound){
        let duration = this.sound.duration();
        let currentTime = this.sound.currentTime();

        let niceTime = nf(currentTime, 1, 2);
        noStroke();
        fill(0);
        textFont("Arial");
        textSize(15);
        textAlign(RIGHT, BASELINE);
        text(niceTime, this.x + boxW - 4, this.y + boxH - 25);

        let niceDuration = nf(duration, 1, 2);
        text(niceDuration, this.x + boxW - 4, this.y + boxH - 10); // Adjusted the text position

        let t = currentTime/duration;
        stroke(0);
        strokeWeight(1);
        fill(40, 120, 60);
        rect(this.x + buttonW, this.y, timelineW, boxH);

        let tx = this.x + buttonW + (timelineW * t);
        
        fill(0, 200, 200, 100); // Adjust opacity if needed
        noStroke();
        rect(this.x + buttonW, this.y, tx - this.x - buttonW, boxH);

        fill(0, 0, 255);
        rect(this.x + buttonW, this.y, timelineW, boxH);

        stroke(0, 150, 250);
        strokeWeight(4);
        line(tx, this.y, tx, this.y + boxH);

        let animalX = tx + 10;
        let animalY = this.y - 5;

        textSize(20);
        text(animal, animalX, animalY);
    }
    }
  
  checkAction(mouseX, mouseY) {
    if(mouseX > this.x && mouseX < this.x + boxW && mouseY > this.y && mouseY < this.y + boxH){
      if(this.sound && this.sound.isPlaying()){
        this.sound.pause();
      }
      else{
        this.sound.play();
      }
    }
  }

  setSound(audiofile){
    this.sound = audiofile;
  }
  
}

function changeVolume(){
  let volume = volumeSlider.value();
  sound1.setVolume(volume); 
}

function changeRate(){
  let rate = ratePitchSlider.value(); 
  sound1.rate(rate); 
}

function changeAnimal(){
    clickDuck = createButton(duck);
    clickChick = createButton(chick);

    clickDuck.style("font-size", "18px");
    clickChick.style("font-size", "18px");
    clickDuck.position(windowWidth - 60, 40);
    clickChick.position(windowWidth - 120, 40);
    
    clickDuck.mousePressed(() => {
        animal = duck; // Change the animal to duck
        animalName = "Duckie";
      });
    clickChick.mousePressed(() => {
        animal = chick; // Change the animal to chick
        animalName = "Chico";
      });
}


