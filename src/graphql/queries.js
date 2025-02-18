/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getQuestionsByTopic = /* GraphQL */ `
  query GetQuestionsByTopic($topic: String!, $nextToken: String, $limit: Int) {
    getQuestionsByTopic(topic: $topic, nextToken: $nextToken, limit: $limit) {
      items {
        topic
        questionId
        correct_answer
        options {
          S
        }
        question
        type
        pro_tip
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getQuestion = /* GraphQL */ `
  query GetQuestion($topic: String!, $questionId: Int!) {
    getQuestion(topic: $topic, questionId: $questionId) {
      topic
      questionId
      correct_answer
      options {
        S
        __typename
      }
      question
      type
      pro_tip
      __typename
    }
  }
`;
