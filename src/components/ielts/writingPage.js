import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import './writingPage.css';

// IELTS Writing Task Questions
const writingQuestions = [
  {
    id: 1,
    text: "The chart below shows the number of trips made by children in one country in 1990 and 2010 to travel to and from school using different modes of transport.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant."
  },
  {
    id: 2,
    text: "Write about the following topic:\n\nThe average standard of people's health is likely to be lower in the future than it is now.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience."
  }
];

const WritingPage = ({ onBackToStart }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState(['', '']);
  const [loadingStage, setLoadingStage] = useState(0);
  const loadingInterval = useRef(null);
  
  // Loading animation stages
  const loadingStages = [
    "Compiling your response...",
    "Analyzing the content...",
    "Evaluating grammar and vocabulary...",
    "Checking coherence and cohesion...",
    "Finalizing your score..."
  ];

  // Calculate word count
  const calculateWordCount = (text) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // Update word count when user answer changes
  useEffect(() => {
    setWordCount(calculateWordCount(userAnswer));
  }, [userAnswer]);

  // Save answers when user submits
  useEffect(() => {
    if (isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = userAnswer;
      setAnswers(newAnswers);
    }
  }, [isSubmitted]);

  // Effect to handle loading stage animation
  useEffect(() => {
    if (isLoading) {
      setLoadingStage(0);
      // Set up interval to cycle through loading stages
      loadingInterval.current = setInterval(() => {
        setLoadingStage(prev => {
          // If we're at the last stage, stay there
          if (prev === loadingStages.length - 1) {
            return prev;
          }
          // Otherwise, move to the next stage
          return prev + 1;
        });
      }, 6000); // Change message every 6 seconds
    } else {
      // Clear interval when loading is done
      if (loadingInterval.current) {
        clearInterval(loadingInterval.current);
        loadingInterval.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (loadingInterval.current) {
        clearInterval(loadingInterval.current);
      }
    };
  }, [isLoading, loadingStages.length]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Show review button when on the second question and submitted
    if (currentQuestionIndex === 1) {
      setShowReviewButton(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < writingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setIsSubmitted(false);
    }
  };

  // Function to format the evaluation result with proper styling
  const formatEvaluationResult = (result) => {
    if (!result) return null;

    // Try to parse JSON if the result contains JSON
    let jsonData = null;
    try {
      // Extract JSON if it's in the response
      const jsonMatch = result.match(/```json\s*({[\s\S]*?})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonData = JSON.parse(jsonMatch[1]);
      }
    } catch (e) {
      console.error("Failed to parse JSON from result:", e);
    }

    // Format the markdown-style text
    const formattedText = result
      // Replace markdown headings with styled headings
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>')
      // Replace markdown lists with styled lists
      .replace(/\* (.*?)(?=\n|$)/g, '<li class="mb-2">$1</li>')
      // Replace newlines with breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return (
      <div className="space-y-6">
        {/* If we have parsed JSON data, show a nice summary card */}
        {jsonData && (
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-8">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4">Score Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700">Task Achievement</h4>
                <p className="text-3xl font-bold text-indigo-600">{jsonData.criterion_scores.task_achievement_response}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700">Coherence & Cohesion</h4>
                <p className="text-3xl font-bold text-indigo-600">{jsonData.criterion_scores.coherence_cohesion}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700">Lexical Resource</h4>
                <p className="text-3xl font-bold text-indigo-600">{jsonData.criterion_scores.lexical_resource}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700">Grammar</h4>
                <p className="text-3xl font-bold text-indigo-600">{jsonData.criterion_scores.grammatical_range_accuracy}</p>
              </div>
            </div>
            <div className="mt-6 bg-indigo-600 p-4 rounded-lg text-center">
              <h4 className="text-lg font-semibold text-white">Overall Band Score</h4>
              <p className="text-4xl font-bold text-white">{jsonData.overall_score}</p>
            </div>
          </div>
        )}

        {/* Full detailed feedback */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </div>
    );
  };

  // Import the prompt text directly
  const ieltsPrompt = `**Task:** Evaluate the following written response to an IELTS Writing Task (Task 1 or Task 2, Academic or General Training). Provide a band score (0-9) for each of the four IELTS Writing assessment criteria and an overall band score for the writing task.

**Input:**

* **Task Type:** Task 2 (common to both)
* **Task Prompt:** ${writingQuestions[1].text}
* **Candidate Response:** [Insert the full text of the candidate's written response here]

**Instructions for AI Evaluation:**

Evaluate the Candidate Response based on the following four IELTS Writing criteria. For each criterion, assign a band score from 0 to 9 based on the detailed descriptors provided below. Then, calculate the overall Task band score.

**Scoring Criteria and Descriptors:**

**1. Task Achievement / Task Response (TA/TR) (Weight: 25% of Task 1 Score, 50% of Overall Writing Score due to Task 2 weighting)**

* **Focus:**  Has the candidate fulfilled the task requirements? How accurately, appropriately, and relevantly has the candidate addressed all parts of the prompt?

* **Detailed Descriptors:**
    * **Task 2 (Academic & General Training):**
        * **High Band (7-9):**  Presents a fully developed response to the prompt.  Clearly addresses all parts of the task.  Presents a clear position throughout the response in argumentative tasks.  Ideas are well-developed, relevant, and logically supported with examples (which can be from personal experience).  Essay is well-focused and directly answers the question.
        * **Mid Band (5-6):**  Addresses the prompt, but the response may be somewhat underdeveloped or superficial.  May address all parts of the task but not equally well.  Position may be clear but not consistently maintained in argumentative tasks.  Ideas are relevant but may lack sufficient development or support.  Essay is generally focused but may drift slightly off-topic at times.
        * **Low Band (Below 5):**  Fails to adequately address the prompt.  May present irrelevant or tangential ideas.  May not address all parts of the task.  Position may be unclear or inconsistent in argumentative tasks.  Ideas are underdeveloped or lack relevance.  Essay may be poorly focused or off-topic.  May not meet minimum word count. Off-topic responses are penalized.

**2. Coherence and Cohesion (CC) (Weight: 25% of Task 1 Score, 25% of Overall Writing Score)**

* **Focus:** How well is the answer organized and connected?  Logical flow of ideas, paragraphing, and use of cohesive devices (linking words, pronouns, conjunctions).

* **Detailed Descriptors:**
    * **High Band (7-9):**  Logically organizes information and ideas; there is a clear progression throughout the response.  Uses a range of cohesive devices appropriately and accurately.  Paragraphing is logical and effective.  The response is easy to follow and ideas are clearly linked.
    * **Mid Band (5-6):**  Organizes information and ideas coherently, but there may be some inconsistencies in logical flow.  Uses cohesive devices, but there may be some overuse, underuse, or inaccuracy.  Paragraphing is evident, but may not always be logical or effective.  The response is generally understandable, but some connections between ideas may be unclear.
    * **Low Band (Below 5):**  Lacks clear organization and logical progression.  Cohesive devices are used rarely, inaccurately, or inappropriately, making the response difficult to follow.  Paragraphing is inadequate or absent.  The response is disjointed and difficult to understand.

**3. Lexical Resource (LR) (Weight: 25% of Task 1 Score, 25% of Overall Writing Score)**

* **Focus:** Range and accuracy of vocabulary used. Ability to use a variety of words and phrases, including less common vocabulary and paraphrase effectively.

* **Detailed Descriptors:**
    * **High Band (7-9):**  Uses a wide range of vocabulary fluently and flexibly to convey precise meanings.  Skillfully uses less common vocabulary and idiomatic expressions.  Demonstrates sophisticated control of lexical features with only rare minor errors.  Effective use of paraphrase.
    * **Mid Band (5-6):**  Uses an adequate range of vocabulary for the task.  Attempts to use less common vocabulary, but may be some inaccuracies.  Errors in word choice and collocation may be present but do not impede understanding.  Some attempt at paraphrase.
    * **Low Band (Below 5):**  Uses a limited range of vocabulary, which may be repetitive or inappropriate.  Frequent errors in word choice, spelling, and word formation may impede understanding.  Little or no attempt at paraphrase.  Over-reliance on basic vocabulary.  Memorized phrases or misused "complex" words are penalized.

**4. Grammatical Range and Accuracy (GRA) (Weight: 25% of Task 1 Score, 25% of Overall Writing Score)**

* **Focus:** Variety of sentence structures (simple, compound, complex) and grammatical accuracy.

* **Detailed Descriptors:**
    * **High Band (7-9):**  Uses a wide range of grammatical structures flexibly and accurately.  Majority of sentences are error-free.  Only very occasional errors or slips.  Sophisticated control of grammar.
    * **Mid Band (5-6):**  Uses a mix of simple and complex sentence forms.  Grammatical accuracy is generally good, but errors are present and may be noticeable.  Errors do not frequently impede communication.
    * **Low Band (Below 5):**  Uses only a limited range of grammatical structures, primarily simple sentences.  Frequent grammatical errors, which may impede communication.  Errors in basic grammar are common.

**Scoring Calculation:**

1. **Assign Band Scores:**  Based on the descriptors above, assign a band score (0-9) for each of the four criteria: TA/TR, CC, LR, and GRA.

2. **Calculate Task 2 Score:** Average the four criterion scores for Task 2. (TA/TR + CC + LR + GRA) / 4

3. **Calculate Overall Writing Score:** The Overall Writing Score is the Task 2 Score.

4. **Rounding:** Round the Overall Writing Score to the nearest half band.  For example, 6.75 rounds up to 7.0, 6.25 rounds down to 6.0, 6.3 rounds to 6.5, 6.8 rounds to 7.0.

**Output Format:**

\`\`\`json
{
  "criterion_scores": {
    "task_achievement_response": "[Band Score for TA/TR]",
    "coherence_cohesion": "[Band Score for CC]",
    "lexical_resource": "[Band Score for LR]",
    "grammatical_range_accuracy": "[Band Score for GRA]"
  },
  "overall_score": "[Overall Writing Band Score]"
}
\`\`\``;

  const handleReviewScore = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Format the prompt with the user's answer
      const formattedPrompt = ieltsPrompt.replace('[Insert the full text of the candidate\'s written response here]', answers[1] || userAnswer);

      // Make the API request to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-5bf2c81a2b514029badda49b337fd017'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: 'You are an IELTS examiner evaluating writing responses.' 
            },
            { 
              role: 'user', 
              content: formattedPrompt 
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setEvaluationResult(data.choices[0].message.content);
    } catch (err) {
      console.error('Error evaluating response:', err);
      setError(err.message || 'Failed to evaluate your response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pt-12 pb-12 px-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={onBackToStart}
            >
              ← Back to IELTS
            </Button>
            
            <motion.p
              className="text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Question {currentQuestionIndex + 1} of {writingQuestions.length}
            </motion.p>
          </div>
          
          <motion.h1
            className="text-3xl font-bold text-slate-800 mb-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IELTS Writing Task
          </motion.h1>
        </div>

        {/* Main content - Two bigger boxes side by side with maximum width */}
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-8 w-full mx-auto">
          {/* Question Box - Left side */}
          <motion.div
            className="w-full lg:w-[49.5%]"
            variants={cardVariants}
            initial="initial"
            animate="animate"
          >
            <Card className="h-full border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-12 pb-12 px-6">
                <h2 className="text-3xl font-semibold text-slate-700 mb-6">Question:</h2>
                <div
                  className="bg-slate-50 rounded-lg p-6 overflow-auto"
                  style={{ height: '650px', minHeight: '650px' }}
                >
                  <p className="font-medium text-2xl italic text-slate-800 whitespace-pre-line" style={{ fontSize: 'calc(1.25rem * 1.1)' }}>
                    {writingQuestions[currentQuestionIndex].text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Box - Right side */}
          <motion.div
            className="w-full lg:w-[49.5%]"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-12 pb-12 px-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-semibold text-slate-700">Your Answer:</h2>
                  <div className="bg-white px-4 py-1 rounded-md shadow-sm" style={{ minWidth: '180px' }}>
                    <p className="text-slate-700 font-bold italic text-right">
                      Word count: {wordCount}
                    </p>
                  </div>
                </div>
                <textarea
                  id="essay-textarea"
                  className="w-full p-6 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-xl"
                  placeholder="Write your essay here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  style={{
                    height: '650px',
                    minHeight: '650px',
                    textAlign: 'left',
                    direction: 'ltr',
                    fontSize: 'calc(1.25rem * 1.2)'
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Loading Animation Modal */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-center p-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Animated icon */}
                  <div className="relative w-24 h-24">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-indigo-100"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear"
                      }}
                    >
                      <svg className="w-16 h-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m0 16v1m-8-8h1m15 0h1m-9-9l.707-.707M4.929 19.071L5.636 18.364M19.07 4.929l-.707.707M18.364 18.364l-.707-.707" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Animated text */}
                  <motion.div
                    key={loadingStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-12 flex items-center justify-center"
                  >
                    <h3 className="text-xl font-semibold text-indigo-800">
                      {loadingStages[loadingStage]}
                    </h3>
                  </motion.div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(loadingStage + 1) * (100 / loadingStages.length)}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-2">
                    Please wait while we evaluate your response.
                    <br />
                    <span className="text-indigo-600 font-medium">
                      This might take up to 30 seconds. Please be patient.
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Evaluation Result Modal */}
        <AnimatePresence>
          {evaluationResult && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEvaluationResult(null)}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 bg-indigo-600 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">IELTS Writing Evaluation</h2>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-indigo-700 p-2 rounded-full"
                    onClick={() => setEvaluationResult(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                  {formatEvaluationResult(evaluationResult)}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            className="w-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-red-200 bg-red-50 shadow-lg">
              <CardContent className="pt-4 pb-4 px-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div 
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="default"
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "border-teal-600 text-teal-600 hover:bg-teal-50",
              !isSubmitted && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleNext}
            disabled={!isSubmitted}
          >
            Next Question
          </Button>

          {showReviewButton && (
            <Button
              variant="secondary"
              size="lg"
              className={cn(
                "bg-indigo-600 hover:bg-indigo-700 text-white",
                isLoading && "opacity-70 cursor-wait"
              )}
              onClick={handleReviewScore}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Evaluating...
                </span>
              ) : "Review Score"}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WritingPage;