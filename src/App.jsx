import { languages } from './languages.js'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { clsx } from 'clsx'
import { getFarewellText, getRandomWord } from './utils.js'  

export default function AssemblyEndgame() {


  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guesses, setGuesses] = useState([])
  

  // derived values

  const wrongGuessCount = guesses.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split('').every(letter => guesses.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length -1
  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter = guesses[guesses.length -1]
  const isGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuesses([])
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    

    return (
      <span style={styles}
        className={className}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  function addGuess(letter){
    setGuesses(prevGuesses => 
      prevGuesses.includes(letter) ? prevGuesses : [...prevGuesses, letter]
     )
  }

  const letters = currentWord.split('').map((letter, index) => {
    const revealLetter = isGameLost || guesses.includes(letter)
    const letterClassName = clsx (
      isGameLost && !guesses.includes(letter) && "missed-letter"
    )
    return ( 
    
    <span key={index} className={letterClassName}>{revealLetter ? letter.toUpperCase(): ''}</span>
  )
})

  

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split('').map(letter => {
    
    const isGuessed = guesses.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })
    
    return (
    <button key={letter}
            disabled={isGameOver}
            className={className} 
            onClick={() => addGuess(letter)}>
            {letter.toUpperCase()}
    </button>
    )
  }
  )

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isGuessIncorrect
  })

  function renderGameStatus() {
      if (!isGameOver && isGuessIncorrect) {
        return (
          <p className="farewell-message">
            {getFarewellText(languages[wrongGuessCount -1].name)}

          </p>
        )
      }
      if (isGameWon){
        return (
          <>
            <h2>You win!</h2>
            <p>Well done 🎉</p>
          </>
        )
      }
      if (isGameLost){
        return (
          <>
            <h2>Game Over. You Lose 😞</h2>
            <p>Better start learning Assembly 😭</p>
          </>
        )
      }
      return null
  }

  return (
    <main>
      {
        isGameWon && 
          <Confetti
           recycle={false}
           numberOfPieces={1000} 
          
          />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep poor programmers from going back to writing assembly code!</p>
      </header>


      <section className={gameStatusClass}>
        {renderGameStatus()}
        
      </section>


      <section className="lang-chips">
        {languageElements}
      </section>
      <section className="word">
        {letters}
      </section>
      <section className="keyboard">
        {alphabet}
      </section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
     
    </main>
  )
}