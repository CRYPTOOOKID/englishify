/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addQuestion = /* GraphQL */ `
  mutation AddQuestion($input: AddQuestionInput!) {
    addQuestion(input: $input) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion($input: DeleteQuestionInput!) {
    deleteQuestion(input: $input) {
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
