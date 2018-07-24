

  //call to the backend api
  let scores;
  function getHighScores(){
    // url (required), options (optional)
    fetch("http://localhost:4000/", {
      method: 'get'
      // mode: 'no-cors'
    }).then(resp => resp.json())
    // console.log(resp)
      // console.log(resp)
    .then(resp=>
      buildTable(resp)
  
    )
    // .catch(function(err) {
    //   // Error :(
    //     console.log('error')
    // });

  }

  getHighScores();
  let table = document.getElementById('highScores');
  function buildTable(obj){
    let arr = obj.Scores;
    //iterate through the data and create a highscore row for each element
    for(let i = 0; i<arr.length; i++){
      let tableRow = document.createElement('tr');
      let tableData = document.createElement('td');
      console.log(arr[i].player)
      //fill in the table data
      tableData.textContent = `${arr[i].player}:${arr[i].score} `
      //attach the table to the row
      tableRow.appendChild(tableData)
      //attach the row to the table
      table.appendChild(tableRow)
    }
  }

  //nodes that will be modified
  const holes = document.querySelectorAll('.hole');
  const scoreBoard = document.querySelector('.score');
  const moles = document.querySelectorAll('.mole');
  const body = document.getElementsByTagName('body');
  const clock = document.querySelector('.time');
  //store the individual initials
  let l1, l2, l3;
  let lastHole;
  let score = 0;
  let timeUp = false;

  let time = 10;

  function randTime(min, max){
    return Math.round(Math.random()*(max-min) + min);
  }

  function randHole(holes){
    const idx = Math.floor(Math.random()*holes.length)
    const hole = holes[idx]
    
    if(hole === lastHole){
      return randHole(holes);
    }
    lastHole = hole
    return hole
  }

  function peep() {
    const time = randTime(200, 1000);
    const hole = randHole(holes)
    hole.classList.add('up')
    setTimeout(()=> {
      hole.classList.remove('up');
      if(!timeup) peep();
    }, time);
  }

  function startGame(){
    scoreBoard.textContent = 0;
    clock.textContent = 10;
    time = 10;
    score = 0;
    timeup = false;
    peep();
    //once the time is up, swith timeup to true so that the heads stop peeping
    setTimeout(()=> timeup = true, 10000);
    //initiates the countdown clock
    countDown();
    //once the time has run out, display the gameover screen
    setTimeout(()=> toggleGameOver(), 10500);
  }

  function bonk(e){
    if(!e.isTrusted) return; //cheater
    score++
    this.classList.remove('up');
    scoreBoard.textContent = score;
  }

  function countDown(){
    //countdown
    let count = setInterval(function(){
        time--
        clock.textContent = time
    }, 1000)
    //game over
    setTimeout(()=> clearInterval(count), 10000);
  }

  function toggleGameOver(){
    let popup = document.getElementById('popup');
    //if gameover is not on the classlist, set it. If it is, remove it
    popup.classList.toggle('gameOver')
  }
  //I know this is not the most efficient way to go about this, but I am going to do it this way for now.
  function updateL1(ev){
    l1 = ev
  }
  function updateL2(ev){
    l2 = ev
  }
  function updateL3(ev){
    l3 = ev
  }
  
  function createPostRequest(){
    //combine the initials
    const initials = l1 + l2 + l3;
    //make sure all the fields have been completed
    if (initials.length !== 3){
      alert("Please complete all three blanks."); 
      return};
    //package the info
    let data = {
      user: initials,
      score: score,
    }
    //send the request
    fetch("http://localhost:4000/add", {
      method: 'post',
      body: JSON.stringify(data),
    }).then(toggleGameOver())
  }
  
  moles.forEach(mole => mole.addEventListener('click', bonk));


