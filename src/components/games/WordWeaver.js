import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

/**
 * Re-optimized Word Weaver game prompt template for the AI language tutor
 * (Handles full sentence input by extracting the words for the blanks)
 */
const WORD_WEAVER_PROMPT = `You are an AI English tutor for Word Weaver.

IMPORTANT: Evaluate the full sentence that the user has spoken. From the spoken sentence, extract the words that are intended to fill the blanks in the sentence skeleton. Then, verify:
1. Each extracted word exists in the word cloud
2. The words appear in a logical order that completes the sentence meaningfully
3. The grammar and syntax of the completed sentence is correct

Respond in ONE of these formats:
1. "Correct! [completed_sentence]" if all extracted words are in the word cloud and form a logical, grammatically correct sentence.
2. "Oops! The word(s) '[non_matching_words]' are not in the word cloud." if any extracted words are not in the word cloud.
3. "Oops! While those words are available, they don't create a logical sentence. Try a different combination." if the words are in the word cloud but don't form a meaningful sentence.
4. "Oops! I heard '[spoken_sentence]' but couldn't match it to the sentence structure. Please try again." if the spoken sentence structure doesn't match the expected pattern.

Current Game State:
* Question: "[skeleton]"
* Available Words: [wordCloud]
* Spoken Sentence: "[spokenSentence]"
* Progress So Far: "[currentAttempt]"

Extract the words intended for the blanks from the spoken sentence, verify them against the word cloud, and check if they form a logical completion of the sentence. Provide ONE feedback line.`;

/**
 * Function to generate the prompt with specific game context
 * @param {string} skeleton - The sentence skeleton with blanks
 * @param {string[]} wordCloud - Array of available words
 * @param {string} spokenSentence - The full sentence spoken by the user
 * @param {string} currentAttempt - Current sentence with filled and remaining blanks
 * @returns {string} - The complete prompt with game context
 */
function generateWordWeaverPrompt(skeleton, wordCloud, spokenSentence, currentAttempt) {
  return WORD_WEAVER_PROMPT
    .replace('[skeleton]', skeleton)
    .replace('[wordCloud]', JSON.stringify(wordCloud))
    .replace('[spokenSentence]', spokenSentence)
    .replace('[currentAttempt]', currentAttempt);
}

const GEMINI_API_KEY = 'AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Game data - sentence skeletons and word clouds
const gameData = [
  {
    skeleton: "The ___ is very ___ today.",
    wordCloud: ["weather", "sunny", "cat", "cloudy", "happy"],
    blanks: 2
  },
  {
    skeleton: "I like to ___ ___ in the morning.",
    wordCloud: ["coffee", "drink", "read", "book", "run"],
    blanks: 2
  },
  {
    skeleton: "She ___ a beautiful ___ for her birthday.",
    wordCloud: ["got", "present", "car", "flower", "received"],
    blanks: 2
  },
  {
    skeleton: "We are going to ___ a movie ___ night.",
    wordCloud: ["watch", "tonight", "see", "theater", "cinema"],
    blanks: 2
  },
  {
    skeleton: "My ___ is always ___ in the morning.",
    wordCloud: ["dog", "hungry", "happy", "cat", "thirsty"],
    blanks: 2
  },
  {
    skeleton: "They ___ to the park ___ Sunday.",
    wordCloud: ["go", "on", "walk", "every", "went"],
    blanks: 2
  },
  {
    skeleton: "He is ___ a new ___ for school.",
    wordCloud: ["buying", "book", "getting", "pen", "backpack"],
    blanks: 2
  },
  {
    skeleton: "The ___ is ___ very slowly.",
    wordCloud: ["car", "moving", "turtle", "walking", "driving"],
    blanks: 2
  },
  {
    skeleton: "She ___ her keys ___ the table.",
    wordCloud: ["put", "on", "placed", "under", "forgot"],
    blanks: 2
  },
  {
    skeleton: "I want to ___ how to ___ Spanish.",
    wordCloud: ["learn", "speak", "study", "write", "read"],
    blanks: 2
  }
];

const WordWeaver = ({ onBackToGames }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [filledBlanks, setFilledBlanks] = useState([]);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const recognitionRef = useRef(null);
  // Store the latest transcript in a ref to avoid race conditions
  const latestTranscriptRef = useRef('');
  // Store the latest processSpokenWord callback in a ref
  const processSpokenWordRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        const trimmedTranscript = transcript.trim().toLowerCase();
        setTranscribedText(trimmedTranscript);
        // Store the latest transcript in the ref
        latestTranscriptRef.current = trimmedTranscript;
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        // Process the spoken word when recognition ends naturally
        // Use the ref value to ensure we have the latest transcript
        if (latestTranscriptRef.current) {
          // Use setTimeout to ensure state is updated before processing
          setTimeout(() => {
            // Call the latest version of processSpokenWord through the ref
            processSpokenWordRef.current();
            
            // Make sure feedback is visible by scrolling to it
            const feedbackElement = document.getElementById('feedback-section');
            if (feedbackElement) {
              feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const getFeedback = useCallback(async (spokenSentence, currentFilledBlanks) => {
    setIsLoading(true);
    try {
      // Create local copies of state to ensure consistency
      const localQuestionIndex = currentQuestionIndex;
      const currentQuestion = gameData[localQuestionIndex];
      
      // Log current game state for debugging
      console.log('Current Game State:', {
        questionIndex: localQuestionIndex,
        skeleton: currentQuestion.skeleton,
        wordCloud: currentQuestion.wordCloud,
        spokenSentence,
        currentFilledBlanks
      });

      // Verify we're still on the same question
      if (localQuestionIndex !== currentQuestionIndex) {
        console.log('Question index changed during feedback generation, aborting');
        return 'Please try again.';
      }
      
      // Create current sentence attempt with filled blanks and remaining blanks
      let currentSentenceAttempt = currentQuestion.skeleton;
      
      // First, normalize the skeleton and spoken sentence for comparison
      const normalizedSkeleton = currentQuestion.skeleton.toLowerCase();
      const normalizedSpoken = spokenSentence.toLowerCase();
      
      // Create a regex pattern to match the sentence structure
      const skeletonParts = normalizedSkeleton.split('___');
      const regexPattern = skeletonParts
        .map((part, index) => {
          const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return index < skeletonParts.length - 1
            ? `${escapedPart}\\b(\\w+)\\b`
            : escapedPart;
        })
        .join('\\s*');
      
      // Try to match the spoken sentence against the pattern
      const regex = new RegExp(`^${regexPattern}$`, 'i');
      const match = normalizedSpoken.match(regex);
      
      // Debug logging
      console.log('Sentence Matching:', {
        skeleton: normalizedSkeleton,
        regexPattern,
        spokenSentence: normalizedSpoken,
        match: match ? match.slice(1) : null
      });
      
      if (match) {
        // Extract the words from the match
        const extractedWords = match.slice(1);
        
        // Debug logging for word validation
        console.log('Word Validation:', {
          extractedWords,
          wordCloud: currentQuestion.wordCloud,
          validation: extractedWords.map(word => ({
            word: word.toLowerCase(),
            isValid: currentQuestion.wordCloud.includes(word.toLowerCase())
          }))
        });
        
        // Check if all extracted words are in the word cloud
        const allWordsValid = extractedWords.every(word =>
          currentQuestion.wordCloud.includes(word.toLowerCase())
        );
        
        if (allWordsValid) {
          // If all words are valid, use them in the current attempt
          let blankCount = 0;
          currentSentenceAttempt = currentQuestion.skeleton.replace(/___/g, () =>
            extractedWords[blankCount++] || '___'
          );
          
          // Debug logging for final sentence
          console.log('Final Sentence:', {
            original: currentQuestion.skeleton,
            filled: currentSentenceAttempt,
            extractedWords
          });
        }
      }

      // Generate the prompt with current question context
      const prompt = generateWordWeaverPrompt(
        currentQuestion.skeleton,
        currentQuestion.wordCloud,
        spokenSentence,
        currentSentenceAttempt
      );

      // Log the prompt being sent to the API
      console.log('Sending prompt to API:', prompt);

      // Try with API key as a query parameter first
      let response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt // Use the already generated prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            topK: 1,
            topP: 0.8,
            stopSequences: ["\n"]
          }
        })
      });

      // If first attempt fails, try with Authorization header
      if (!response.ok && response.status === 401) {
        console.log("Trying with Authorization header instead of query parameter");
        response = await fetch(GEMINI_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt // Use the already generated prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200, // Match the first request
              topK: 1,
              topP: 0.8,
              stopSequences: ["\n"]
            }
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid response format from API');
      }

      const feedbackText = data.candidates[0].content.parts[0].text.trim();
      console.log("Feedback received:", feedbackText);
      
      // Set feedback state
      setFeedback(feedbackText);
      
      // Return the feedback text so the caller can use it
      return feedbackText;
    } catch (error) {
      console.error('Error getting feedback:', error);
      const errorMessage = `Error getting feedback: ${error.message}. Please try again.`;
      setFeedback(errorMessage);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestionIndex]);

  // Helper function to check if feedback indicates success
  const isSuccessFeedback = useCallback((feedbackText) => {
    return feedbackText.startsWith("Correct!");
  }, []);

  const handleNextQuestion = useCallback(() => {
      if (currentQuestionIndex < gameData.length - 1) {
        setCurrentQuestionIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          // Reset all state for the new question
          setTranscribedText('');
          setFeedback('');
          setFilledBlanks([]);
          setCurrentBlankIndex(0);
          latestTranscriptRef.current = ''; // Reset the transcript ref
          
          // Log the transition for debugging
          console.log('Transitioning to next question:', {
            previousIndex: prevIndex,
            newIndex: nextIndex,
            newQuestion: gameData[nextIndex]
          });
          
          return nextIndex;
        });
      } else {
        // Game completion handling
        setShowConfetti(true);
        // Only set gameComplete after a short delay to show confetti
        setTimeout(() => {
          setGameComplete(true);
        }, 1000);
      }
    }, [gameData]);
const processSpokenWord = useCallback(async () => {
  try {
    // Use the latest transcript from the ref to ensure we have the most up-to-date value
    const currentTranscript = latestTranscriptRef.current || transcribedText;
    if (!currentTranscript) return;
    
    // Create a local copy of the current state to ensure consistency
    const localQuestionIndex = currentQuestionIndex;
    const currentQuestion = gameData[localQuestionIndex];
    const spokenSentence = currentTranscript.toLowerCase();
    
    // Create a local copy of filled blanks
    const localFilledBlanks = [...filledBlanks];
    
    // Get feedback from AI for the full sentence and wait for the response
    const feedbackText = await getFeedback(spokenSentence, localFilledBlanks);
    
    // Check if the feedback indicates success using the helper function
    if (isSuccessFeedback(feedbackText)) {
      console.log("Correct answer detected, processing words...");
      
      // Normalize the skeleton and spoken sentence for comparison
      const normalizedSkeleton = currentQuestion.skeleton.toLowerCase();
      const normalizedSpoken = spokenSentence.toLowerCase();
      
      // Create a regex pattern to match the sentence structure
      const skeletonParts = normalizedSkeleton.split('___');
      const regexPattern = skeletonParts
        .map((part, index) => {
          // Escape special regex characters in the fixed parts
          const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // If this is not the last part, add capture group for the blank
          // Use word boundaries to ensure we capture whole words
          return index < skeletonParts.length - 1
            ? `${escapedPart}\\b(\\w+)\\b`
            : escapedPart;
        })
        .join('\\s*');
      
      // Create regex with word boundaries and case insensitive flag
      const regex = new RegExp(`^${regexPattern}$`, 'i');
      const match = normalizedSpoken.match(regex);
      
      // Debug logging for sentence matching
      console.log('Process Word - Sentence Matching:', {
        skeleton: normalizedSkeleton,
        regexPattern,
        spokenSentence: normalizedSpoken,
        match: match ? match.slice(1) : null
      });
      
      // Extract captured words if there's a match
      let newFilledBlanks = [];
      if (match) {
        // match[0] is the full match, subsequent elements are the captured groups
        const extractedWords = match.slice(1);
        
        // Debug logging for word validation
        console.log('Process Word - Word Validation:', {
          extractedWords,
          wordCloud: currentQuestion.wordCloud,
          validation: extractedWords.map(word => ({
            word: word.toLowerCase(),
            isValid: currentQuestion.wordCloud.includes(word.toLowerCase())
          }))
        });
        
        // Verify each word exists in the word cloud
        const allWordsValid = extractedWords.every(word =>
          currentQuestion.wordCloud.includes(word.toLowerCase())
        );
        
        if (allWordsValid) {
          newFilledBlanks = extractedWords;
          console.log('Process Word - Valid Words Found:', newFilledBlanks);
        } else {
          console.log('Process Word - Invalid Words Found');
        }
      } else {
        console.log('Process Word - No Match Found');
      }
      
      // Only update filled blanks if we have valid words
      if (newFilledBlanks.length > 0) {
        console.log('Process Word - Updating Filled Blanks:', newFilledBlanks);
        setFilledBlanks(newFilledBlanks);
      }
      
      // If all blanks are filled and the feedback indicates success
      if (newFilledBlanks.length === currentQuestion.blanks && isSuccessFeedback(feedbackText)) {
        // Add to score
        setScore(prev => prev + 1);
        
        // Update filled blanks state
        setFilledBlanks(newFilledBlanks);
        
        // Wait a moment before moving to next question
        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      }
    }
    } catch (error) {
      console.error('Error processing spoken word:', error);
      setFeedback(`Error processing your answer: ${error.message}. Please try again.`);
    }
    
    // Ensure feedback is visible
    setTimeout(() => {
      const feedbackElement = document.getElementById('feedback-section');
      if (feedbackElement) {
        feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 300);
  }, [handleNextQuestion, getFeedback, isSuccessFeedback]);

  // Update processSpokenWordRef whenever processSpokenWord changes
  useEffect(() => {
    processSpokenWordRef.current = processSpokenWord;
  }, [processSpokenWord]);

  const startListening = () => {
    setTranscribedText('');
    setFeedback('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // Process the spoken word only when the user explicitly stops listening
      // Use the latest transcript from the ref to ensure we have the most up-to-date value
      if (latestTranscriptRef.current || transcribedText) {
        // Use the ref to ensure we have the latest version of processSpokenWord
        processSpokenWordRef.current();
        // Make sure feedback is visible by scrolling to it
        setTimeout(() => {
          const feedbackElement = document.getElementById('feedback-section');
          if (feedbackElement) {
            feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 500);
      }
    }
  };

  // Render the sentence with filled blanks
  const renderSentence = () => {
    const currentQuestion = gameData[currentQuestionIndex];
    const parts = currentQuestion.skeleton.split('___');
    
    return (
      <div className="text-2xl font-medium mb-6 text-center">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className={`inline-block min-w-[80px] mx-1 px-2 py-1 rounded-md ${
                filledBlanks[index] 
                  ? 'bg-green-500 text-white' 
                  : index === currentBlankIndex 
                    ? 'bg-yellow-200 border-2 border-yellow-400 animate-pulse' 
                    : 'bg-gray-200'
              }`}>
                {filledBlanks[index] || '___'}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render word cloud
  const renderWordCloud = () => {
    const currentQuestion = gameData[currentQuestionIndex];
    
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {currentQuestion.wordCloud.map((word, index) => (
          <motion.div
            key={index}
            className="px-4 py-2 rounded-full text-lg font-medium bg-blue-100 text-blue-700 border border-blue-200"
            whileHover={{ scale: 1.05 }}
            animate={{
              scale: [1, 1.05, 1],
              transition: { 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'reverse',
                delay: index * 0.2
              }
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>
    );
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background to-background/95 text-foreground">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        
        <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="text-7xl mb-8"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold mb-4 text-blue-600"
          >
            Congratulations!
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl mb-8 text-center text-slate-600"
          >
            You've completed all the Word Weaver challenges!
            <div className="mt-4">
              Your score: <span className="font-bold">{score}/{gameData.length}</span>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className="px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          >
            Return to Games
          </motion.button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / gameData.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-white text-foreground transition-colors duration-500">
      <div className="container mx-auto p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBackToGames}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {gameData.length}
            </div>
          </div>
        </div>

        <div className="relative w-full h-2 mb-8 rounded-full overflow-hidden bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 h-full bg-blue-500"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl shadow-xl p-8 mb-8 transition-all duration-500 bg-white/80 border border-slate-200 backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
              Word Weaver
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl p-6 transition-all duration-300 bg-blue-50/50 border border-blue-200 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Complete the Sentence:</h3>
                
                {renderSentence()}
                
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2 text-slate-800">Word Cloud:</h4>
                  {renderWordCloud()}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  disabled={isListening || currentBlankIndex >= gameData[currentQuestionIndex].blanks}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isListening || currentBlankIndex >= gameData[currentQuestionIndex].blanks
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? 'Listening...' : 'Speak a Word'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopListening}
                  disabled={!isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !isListening
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop Speaking
                </motion.button>
                
                {/* Always visible Next button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Next Question
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {transcribedText && (
                  <motion.div
                    key="transcribed-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-6 transition-all duration-300 bg-slate-50 border border-slate-200 backdrop-blur-sm"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">You Said:</h4>
                    <p className="text-slate-700">{transcribedText}</p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    key="loading-spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center gap-3 text-slate-600"
                  >
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your response...
                  </motion.div>
                )}

                {feedback && (
                  <motion.div
                    id="feedback-section"
                    key="feedback"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 20px rgba(59, 130, 246, 0.5)", "0px 0px 0px rgba(59, 130, 246, 0)"]
                    }}
                    transition={{
                      boxShadow: { repeat: 0, duration: 1.5 }
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-6 transition-all duration-300 bg-blue-50 border-2 border-blue-300 backdrop-blur-sm shadow-md"
                  >
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold text-blue-800">Feedback:</h4>
                      <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">New</div>
                    </div>
                    <p className="text-slate-700 text-lg">{feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WordWeaver;