import React, { useState, useEffect } from 'react';
import { generateClient } from '@aws-amplify/api';
import { getQuestionsByTopic } from './graphql/queries';
import { Button, Heading, View, Text, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import QuestionView from './components/QuestionView';

const client = generateClient();

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions...');
        const response = await client.graphql({
          query: getQuestionsByTopic,
          variables: { 
            topic: "Conjunctions",
            limit: 10
          }
        });
        console.log('Response:', response);
        setQuestions(response.data.getQuestionsByTopic.items);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View padding="1rem">
        <Text>No questions available.</Text>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </View>
    );
  }

  return (
    <View padding="1rem">
      <Heading level={1}>Questions for Conjunctions</Heading>
      <Text>Question {currentQuestionIndex + 1} of {questions.length}</Text>
      <Card variation="outlined" margin="1rem 0">
        <QuestionView 
          question={questions[currentQuestionIndex]}
          onNext={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : undefined}
          onPrevious={currentQuestionIndex > 0 ? handlePreviousQuestion : undefined}
        />
      </Card>
      <Button onClick={() => window.location.reload()}>Start Over</Button>
    </View>
  );
}

export default App;