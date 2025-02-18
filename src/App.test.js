import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import { getQuestionsByTopic } from './graphql/queries';
import { onQuestionAdded, onQuestionUpdated, onQuestionDeleted } from './graphql/subscriptions';
import { Button, Heading, View, Text, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import QuestionView from './components/QuestionView';
import awsconfig from './aws-exports';

// Configure Amplify with AWS config
Amplify.configure(awsconfig);
const client = generateClient();

const topics = [
    "Subject-Verb Agreement", "Verb Tenses (Basic)", "Verb Tenses (Advanced)",
    "Pronoun Agreement and Case", "Articles (a, an, the)", "Punctuation",
    "Sentence Structure (Clauses and Phrases)", "Sentence Structure (Sentence Types)",
    "Modifiers (Adjectives and Adverbs)", "Prepositions and Prepositional Phrases",
    "Conjunctions", "Word Order (Syntax)", "Active and Passive Voice",
    "Gerunds and Infinitives", "Participles", "Countable and Uncountable Nouns",
    "Determiners", "Modal Verbs", "Reported Speech (Indirect Speech)",
    "Conditional Sentences (If-Clauses)", "Phrasal Verbs"
];

function App() {
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!topic) return;

        let isMounted = true;

        const fetchData = async () => {
            if (!isMounted) return;

            setLoading(true);
            setError(null);
            try {
                let allQuestions = [];
                let nextToken = null;
                do {
                    const response = await client.graphql({
                        query: getQuestionsByTopic,
                        variables: {
                            topic,
                            nextToken,
                            limit: 10
                        }
                    });
                    
                    if (response.errors) {
                        throw new Error(response.errors[0].message);
                    }
                    
                    const result = response.data.getQuestionsByTopic;
                    if (result && result.items) {
                        allQuestions = allQuestions.concat(result.items);
                        nextToken = result.nextToken;
                    } else {
                        throw new Error('Invalid response format');
                    }
                } while (nextToken);

                if (isMounted) {
                    setQuestions(allQuestions);
                }
            } catch (err) {
                console.error('Detailed error:', err);
                setError(err.message || 'Failed to fetch questions');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const subscribeToUpdates = () => {
            const subscriptions = [];

            try {
                // Subscribe to new questions
                subscriptions.push(
                    client.graphql({
                        query: onQuestionAdded,
                        variables: { topic }
                    }).subscribe({
                        next: ({ value: { data } }) => {
                            if (isMounted && data.onQuestionAdded) {
                                setQuestions(prev => [...prev, data.onQuestionAdded]
                                    .sort((a, b) => a.questionId - b.questionId));
                            }
                        },
                        error: (err) => console.error('Subscription error (added):', err)
                    })
                );

                // Subscribe to question updates
                subscriptions.push(
                    client.graphql({
                        query: onQuestionUpdated,
                        variables: { topic }
                    }).subscribe({
                        next: ({ value: { data } }) => {
                            if (isMounted && data.onQuestionUpdated) {
                                setQuestions(prev =>
                                    prev.map(q => q.questionId === data.onQuestionUpdated.questionId
                                        ? data.onQuestionUpdated
                                        : q
                                    )
                                );
                            }
                        },
                        error: (err) => console.error('Subscription error (updated):', err)
                    })
                );

                // Subscribe to question deletions
                subscriptions.push(
                    API.graphql(
                        graphqlOperation(onQuestionDeleted, { topic })
                    ).subscribe({
                        next: ({ value: { data } }) => {
                            if (isMounted && data.onQuestionDeleted) {
                                setQuestions(prev =>
                                    prev.filter(q => q.questionId !== data.onQuestionDeleted.questionId)
                                );
                            }
                        },
                        error: (err) => console.error('Subscription error (deleted):', err)
                    })
                );

                return subscriptions;
            } catch (err) {
                console.error('Error setting up subscriptions:', err);
                return subscriptions;
            }
        };

        fetchData();
        const subscriptions = subscribeToUpdates();

        return () => {
            isMounted = false;
            subscriptions.forEach(sub => sub && sub.unsubscribe());
        };
    }, [topic]);

    const handleTopicSelect = (selectedTopic) => {
        setError(null);
        setTopic(selectedTopic);
        setQuestions([]);
        setCurrentIndex(0);
    };

    return (
        <View padding="1rem">
            {error && (
                <View padding="1rem" backgroundColor="rgba(255, 0, 0, 0.1)" borderRadius="medium">
                    <Heading level={3}>Error</Heading>
                    <Text>{error}</Text>
                    <Button onClick={() => setTopic(null)}>Back to Topics</Button>
                </View>
            )}

            {!topic && (
                <View>
                    <Heading level={2} padding="1rem">Select a Topic</Heading>
                    <View 
                        display="grid" 
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1rem',
                            padding: '1rem'
                        }}
                    >
                        {topics.map((t) => (
                            <Card key={t} variation="elevated" padding="1rem">
                                <Button onClick={() => handleTopicSelect(t)} width="100%">
                                    {t}
                                </Button>
                            </Card>
                        ))}
                    </View>
                </View>
            )}

            {loading && (
                <View padding="2rem" textAlign="center">
                    <Text>Loading questions...</Text>
                </View>
            )}

            {!loading && topic && questions.length === 0 && !error && (
                <View padding="2rem" textAlign="center">
                    <Text>No questions found for this topic.</Text>
                    <Button onClick={() => setTopic(null)}>Back to Topics</Button>
                </View>
            )}

            {!loading && questions.length > 0 && (
                <QuestionView
                    question={questions[currentIndex]}
                    onNext={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
                    onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === questions.length - 1}
                    onBackToTopics={() => setTopic(null)}
                />
            )}
        </View>
    );
}

export default App;
