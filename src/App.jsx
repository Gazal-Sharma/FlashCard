import { useState, useEffect } from "react";
import FallingSnowflakes from "./components/flakes";
import ResultPage from "./components/confetti";

export default function App() {
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [disableButtons, setDisableButtons] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Get stored preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const currentCard = shuffledFlashcards[currentIndex];

  const handleGenerateFlashcards = () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
    if (numQuestions < 1) {
      alert("Number of questions must be at least 1.");
      return;
    }

    const generated = Array.from({ length: numQuestions }, (_, i) => ({
      question: `Q${i + 1} on ${topic} (${difficulty})`,
      answer: `Answer ${i + 1}`,
    }));

    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    setShuffledFlashcards(shuffled);
    setFormSubmitted(true);
    setCurrentIndex(0);
    setKnownCount(0);
    setUnknownCount(0);
    setFinished(false);
    setUserAnswer("");
    setShowAnswerInput(false);
    setFlipped(false);
  };

  const handleFlip = () => {
    if (!showAnswerInput && !disableButtons) setFlipped(!flipped);
  };

  const handleKnowClick = () => {
    if (disableButtons) return;
    setShowAnswerInput(true);
  };

  const handleDontKnowClick = () => {
    if (disableButtons) return;
    setDisableButtons(true);
    setFlipped(true);
    setUnknownCount((count) => count + 1);

    setTimeout(() => {
      setFlipped(false);
      setDisableButtons(false);
      nextCard();
    }, 2500);
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    setDisableButtons(true);
    setFlipped(true);

    setTimeout(() => {
      if (userAnswer.trim().toLowerCase() === currentCard.answer.toLowerCase()) {
        setKnownCount((count) => count + 1);
        setScoreUpdated(true);
        setTimeout(() => setScoreUpdated(false), 300);
      } else {
        setUnknownCount((count) => count + 1);
      }
      setUserAnswer("");
      setShowAnswerInput(false);
      setFlipped(false);

      setTimeout(() => {
        setDisableButtons(false);
        nextCard();
      }, 500);
    }, 800);
  };

  const nextCard = () => {
    if (currentIndex + 1 < shuffledFlashcards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (finished) return;
      if (e.key === "Enter" && showAnswerInput) handleSubmitAnswer();
      if (e.key === "ArrowRight" && !showAnswerInput) handleKnowClick();
      if (e.key === "ArrowLeft" && !showAnswerInput) handleDontKnowClick();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAnswerInput, finished]);

  useEffect(() => {
    localStorage.setItem("flashcardProgress", JSON.stringify({
      currentIndex,
      knownCount,
      unknownCount,
      shuffledFlashcards,
    }));
  }, [currentIndex, knownCount, unknownCount, shuffledFlashcards]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!formSubmitted) {
    return (
      <>
      <FallingSnowflakes/>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-700 via-blue-800 to-indigo-900 p-8 text-white">
        <h1 className="text-6xl font-extrabold mb-12 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 drop-shadow-lg">
           Generate Flashcards
        </h1>
        <h3 className="text-2xl font-extrabold mb-12 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-300 to-indigo-400 drop-shadow-lg">
          Enter anything your majesty wants to be quizzed on!! and we'll bring it right to you !!</h3>
        <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-3xl p-10 w-full max-w-md shadow-2xl border border-white border-opacity-20">
          <input
            type="text"
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full mb-6 px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-60 shadow-inner transition duration-300"
          />
          <input
            type="number"
            min={1}
            max={50}
            placeholder="Number of Questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full mb-6 px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-60 shadow-inner transition duration-300"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full mb-10 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-60 shadow-inner transition duration-300"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={handleGenerateFlashcards}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 active:scale-95 transition-transform rounded-2xl py-5 font-semibold shadow-xl drop-shadow-lg text-white"
          >
            Generate Flashcards
          </button>
        </div>
      </div>
    </>
    );
  }

  if (finished) {
    const scorePercent = (knownCount / (knownCount + unknownCount)) * 100;
    return (
      <>
      <ResultPage score={scorePercent}/>
      <div className="min-h-screen bg-gradient-to-tr from-gray-500 via-teal-600 to-gray-300 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-700 drop-shadow-md">
          🎉 Session Complete!
        </h1>
        <p className="text-xl mb-3 text-gray-700 font-medium">
          Known Cards: <span className="font-bold">{knownCount}</span>
        </p>
        <p className="text-xl mb-8 text-gray-700 font-medium">
          Unknown Cards: <span className="font-bold">{unknownCount}</span>
        </p>
        <button
          onClick={() => {
            setFormSubmitted(false);
            setCurrentIndex(0);
            setKnownCount(0);
            setUnknownCount(0);
            setFinished(false);
            setUserAnswer("");
            setShowAnswerInput(false);
            setFlipped(false);
            setShuffledFlashcards([]);
            setDisableButtons(false);
          }}
          className="px-8 py-4 bg-teal-600 hover:bg-teal-700 active:scale-95 transition-transform rounded-xl font-semibold text-white shadow-lg drop-shadow-md"
        >
          Restart
        </button>
      </div>
      </>
    );
  }

  return (
    <>
    <FallingSnowflakes />
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-teal-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white transition-colors duration-700">
      <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
        <div className="flex justify-end w-full mb-6">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-5 py-2 rounded-lg bg-cyan-200 dark:bg-cyan-700 text-cyan-900 dark:text-cyan-100 font-semibold shadow-md hover:bg-cyan-300 dark:hover:bg-cyan-600 transition"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 text-teal-900 dark:text-cyan-200 drop-shadow-sm tracking-tight">
          Flashcard Viewer
        </h1>

        {/* Score Indicator */}
        <p
          className={`fixed top-6 right-6 font-extrabold px-7 py-3 rounded-2xl shadow-lg text-xl select-none transition-transform duration-300 ease-in-out ${
            scoreUpdated
              ? "scale-110 bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-200 shadow-green-400"
              : "bg-cyan-100 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-200"
          }`}
        >
          ✅ Score: {knownCount} / {knownCount + unknownCount}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-lg mb-8 px-3">
          <p className="text-center text-teal-700 dark:text-cyan-300 font-semibold mb-1 text-sm sm:text-base">
            Question Card {currentIndex + 1} of {shuffledFlashcards.length}
          </p>
          <div className="w-full bg-cyan-200 dark:bg-cyan-700 rounded-full h-4 shadow-inner">
            <div
              className="bg-teal-600 dark:bg-teal-400 h-4 rounded-full transition-all duration-400"
              style={{
                width: `${((currentIndex + 1) / shuffledFlashcards.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Flashcard with flip effect */}
        <div
          className="w-96 h-56 perspective mb-10 cursor-pointer select-none rounded-2xl"
          onClick={handleFlip}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-xl rounded-2xl ${
              flipped
                ? "rotate-y-180 shadow-pulse"
                : "hover:shadow-2xl hover:ring-4 hover:ring-cyan-400 hover:ring-opacity-50"
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-cyan-50 border border-cyan-300 dark:border-cyan-600 rounded-2xl shadow-md flex items-center justify-center text-2xl font-semibold p-8 text-teal-900 dark:text-teal-900">
              {currentCard?.question}
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-teal-100 dark:bg-teal-600 border border-teal-400 dark:border-teal-700 rounded-2xl shadow-md flex items-center justify-center text-2xl font-semibold p-8 text-teal-900 dark:text-cyan-100">
              {currentCard?.answer}
            </div>
          </div>
        </div>

        {/* Buttons or Answer Input */}
        {!showAnswerInput ? (
          <div className="flex space-x-8">
            <button
              disabled={disableButtons}
              className={`px-8 py-4 rounded-2xl font-semibold transition-transform duration-150 shadow-md ${
                disableButtons
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-green-600 hover:bg-green-700 active:scale-95 text-white shadow-lg"
              }`}
              onClick={handleKnowClick}
            >
              Know
            </button>
            <button
              disabled={disableButtons}
              className={`px-8 py-4 rounded-2xl font-semibold transition-transform duration-150 shadow-md ${
                disableButtons
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-lg"
              }`}
              onClick={handleDontKnowClick}
            >
              Don't Know
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 w-full max-w-md">
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              placeholder="Type your answer here"
              className="w-full px-6 py-4 border-2 border-cyan-500 rounded-2xl text-teal-900 placeholder-teal-600 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-70 shadow-sm transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitAnswer();
              }}
              disabled={disableButtons}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={disableButtons || !userAnswer.trim()}
              className={`w-full px-8 py-4 rounded-2xl font-semibold shadow-md transition-transform duration-150 ${
                disableButtons || !userAnswer.trim()
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white shadow-lg"
              }`}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

