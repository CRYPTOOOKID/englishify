/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onQuestionAdded = /* GraphQL */ `
  subscription OnQuestionAdded($topic: String!) {
    onQuestionAdded(topic: $topic) {
      topic
      questionId
      correct_answer
      options {
        S
        __typename
      }
      pro_tip
      question
      type
      __typename
    }
  }
`;
export const onQuestionUpdated = /* GraphQL */ `
  subscription OnQuestionUpdated($topic: String!, $questionId: Int!) {
    onQuestionUpdated(topic: $topic, questionId: $questionId) {
      topic
      questionId
      correct_answer
      options {
        S
        __typename
      }
      pro_tip
      question
      type
      __typename
    }
  }
`;
export const onQuestionDeleted = /* GraphQL */ `
  subscription OnQuestionDeleted($topic: String!, $questionId: Int!) {
    onQuestionDeleted(topic: $topic, questionId: $questionId) {
      topic
      questionId
      correct_answer
      options {
        S
        __typename
      }
      pro_tip
      question
      type
      __typename
    }
  }
`;
