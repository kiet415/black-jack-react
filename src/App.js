import React from 'react';
import Header from "./Header";
import PlayingCards from "./playingCards";
import './Header.css';
import icon from './icon.jpg';
import axios from 'axios';
import backCard from './blue_back.jpg';
const cardValues = {
  "ACE" : 1,
  "2" : 2,
  "3" : 3,
  "4" : 4,
  "5" : 5,
  "6" : 6,
  "7" : 7,
  "8" : 8,
  "9" : 9,
  "10" : 10,
  "JACK" : 10,
  "QUEEN" : 10,
  "KING" : 10
}

const getCount = (currentHand) => {
  let count = 0;

  const sorted = currentHand.sort((a,b) => {
    return cardValues[b.value] - cardValues[a.value];
  });
  console.log(sorted);

  for(let i = 0; i < sorted.length ; i++) {    
    const hand = sorted[i].value;

    if(hand === "ACE" && count < 11) {
      count += 11;
    } else if (hand === "ACE" && count > 11) {
      count++;
    } else {
      count += cardValues[hand];
    }
  }  
  return count;
}


/**This is how to render as a class based component instead of a function */
class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.betNumber = this.betNumber.bind(this);
   
    this.state = {
      question: "Do you want to play blackjack?",
      currentHand : [],
      dealersHand : [],
      startValue : 5000,
      betValue : 0,
      startGame : false,
      result : "",
      dealersTurn : false,
      gameEnd : false,
      deckId : ""
    }
  }

  componentDidMount() {
    this.inititializeGame();
  }

  inititializeGame = () => {
    let deckId;
    const{startValue,betValue} = this.state; 
    axios.get("https://deckofcardsapi.com/api/deck/new/") //BRAND NEW DECK
    .then(response => {
      this.setState({deckId : response.data.deck_id})
      deckId = response.data.deck_id;
    }).then(() => {
      axios.get("https://deckofcardsapi.com/api/deck/" + deckId + "/shuffle/")
    }).then(() => {
      axios.get("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=4") //DRAW 4 FROM DECK
      .then(response => {
        const currentHand = response.data.cards.slice(0,2);
        const dealersHand = response.data.cards.slice(2,4);
        let result  = "";
        let gameEnd = "";
        let newStartValue;
        if(getCount(currentHand) === 21 && getCount(dealersHand) !== 21) {
          gameEnd = true;
          result = "Blackjack!"          
          newStartValue = startValue + 1.5 * betValue;
        } else if (getCount(dealersHand) === 21) {
          gameEnd = true;
          result = "Dealer got a Blackjack!"
        }
        this.setState({
          startGame : false,
          gameEnd,
          result : result,
          betValue : 0,
          dealersTurn : false,
          currentHand,
          dealersHand,
          startValue : newStartValue || startValue
        })
      })
    }) 
  }
  startNewGame = () => {
    this.inititializeGame();
  }

  setBetValue = (e) => {
   this.setState({betValue : e.target.value })
  }

  /**Checks if dealer should hit or not then check values of both
  dealer and player to see result of game  */
  dealersLogic = () => {      //MAKE THIS DELAY SO IT HITS SLOWER FOR UI
    const {dealersHand,currentHand,startValue,betValue,deckId} = this.state;
    let dealersHandCount = getCount(dealersHand);
    let playersHandCount = getCount(currentHand);
    this.setState({dealersTurn : true});

    axios.get("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=10")
      .then(response => {
        const copy = dealersHand.slice();
      // copy.push(...response.data.cards);
      //this.setState({ dealersHand : copy});
        while(dealersHandCount < 17) {
          copy.push(response.data.cards.shift());
          dealersHandCount = getCount(copy);
        }
        this.setState({ dealersHand : copy});
        if(dealersHandCount > 21) {
          this.setState({
            gameEnd : true,
            result : "Win!"
          });
        } else if(playersHandCount > dealersHandCount) {
          this.setState({
            gameEnd : true,
            result : "Win!",
            startValue: startValue + 2 * (betValue)
          });
        } else if (playersHandCount < dealersHandCount) {
          this.setState({
            gameEnd : true,
            result : "Lose!"
          });
        } else if (playersHandCount === dealersHandCount) {
          this.setState({
            gameEnd : true,
            result : "Tied!",
            startValue: startValue + betValue
          });
        }
      })

    
  }

  
  betNumber() {
    const {startValue, betValue} = this.state;
    if (betValue > startValue) {
      alert("Can't exceed currency value");
      return;
    } 
    if (betValue === 0 ) {
      alert("Can't bet 0");
      return;
    }
    this.setState({startGame : true});
    this.setState({startValue: startValue - betValue});
  }

  getNextCard = () =>  {
    const {deckId,currentHand} = this.state;
      if(getCount(currentHand) < 21) {
        return axios.get("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1")
          .then(response => {
            const copy = currentHand.slice();
            copy.push(...response.data.cards);
            const copyCount = getCount(copy);
            this.setState({ currentHand : copy})
            
            if (copyCount > 21) {
              this.setState({
                result : "Bust!",
                gameEnd : true
              });
            
              return; 
            } 
      })
    }
  }
  
    
    
  


  // /**This function creates the full collection of all the 52 playing cards */
  // getDeck() {
  //   const cardNums = ["Ace","2","3","4",
  //                     "5","6","7","8",
  //                     "9","10","J","Q","K"];
  //   const cardSuits = ["Spade", "Diamond", "Heart", "Club"];
  //     let count = 0;
  //     let fullDeck = [];
  //     for(let i = 0; i !== cardNums.length ; i++ ) {
  //       for(let j = 0; j !== cardSuits.length ; j++) {
  //         const card = {
  //           value : cardNums[i] + " of " + cardSuits[j],
  //           image : imageMap[cardNums[i] + " of " + cardSuits[j]]         
  //         }
  //         fullDeck[count] = card;
  //         count++;
  //       }
  //     }
  //   return fullDeck;
  // } 
  //   /** This is the Fisher-Yates(aka Knuth) Shuffle algorithm */
  // shuffle(array) {
  //   var currentIndex = array.length, temporaryValue, randomIndex;
    
  //   // While there remain elements to shuffle...
  //   while (0 !== currentIndex) {
    
  //     // Pick a remaining element...
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;
    
  //     // And swap it with the current element.
  //     temporaryValue = array[currentIndex];
  //     array[currentIndex] = array[randomIndex];
  //     array[randomIndex] = temporaryValue;
  //   }
    
  //   return array;
  // }
  
  render() {
    const {currentHand, dealersHand, betValue,startGame, gameEnd,result,dealersTurn} = this.state;
    return (
      <div className="App">
      <Header />
      <div className = "Title">
        <img src = {icon} alt = "icon here" height = "200" width = "200"></img>
        <h1>Blackjack</h1>
      </div>
      <h3>Current amount of currency is {this.state.startValue} </h3>

      {!startGame && <input value = {betValue} className = "bet-number-input" onChange = {this.setBetValue} type="number" placeholder = "Bet number here" ></input>}
      {!startGame && <button className = "bet-number-button" type = "submit" onClick = {this.betNumber}>Click here to bet</button>}
      
      {startGame && !gameEnd && <button className = "hit-card" onClick = {this.getNextCard}> Hit </button>}
      {startGame && !gameEnd && <button className = "stand-card" onClick = {this.dealersLogic}> Stand </button>}
      
      {gameEnd && <button className = "new-game" onClick = {this.startNewGame}> Start New Game</button>}
      
      {gameEnd && <div> {result} </div>}
      
      {startGame && 
        <div style = {{display: "flex"}}>
          {currentHand.map(ele => {
            return(
            <PlayingCards  
              cards = {{
                //number : ele.value,
                img : ele.image
              }} />
            ) 
          } )}
          {startGame && <div className = "total"> <div className = "total-text">Total</div>  
          <div>{getCount(currentHand)}</div> </div>}

        </div>
      }
      

      <h3>Dealer's hand</h3>
      {!dealersTurn && startGame && dealersHand.length > 1 &&
        <div style = {{display: "flex"}}>
          <PlayingCards
            cards = {{img : dealersHand[0].image}} 
          />
          <img src = {backCard} alt = "card" height = "150" width = "150"></img>
        </div>
      }
      

      {dealersTurn &&
        <div style = {{display: "flex"}}>
          {dealersHand.map(ele => {
            return(
              <PlayingCards
              cards = {{
                //number : ele.value,
                img : ele.image
              }} />
            ) 
        } )}
        {dealersTurn && <div className = "total"> <div className = "total-text">Total</div>  
          <div>{getCount(dealersHand)}</div> </div>}
      </div>
      }
      
    </div>
    )
      
  }
}

export default App;
