import EmberObject, { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { camelize } from "@ember/string";
import { task } from "ember-concurrency";

import Answer from "ember-caluma-form/lib/answer";
import Question from "ember-caluma-form/lib/question";
import Document from "ember-caluma-form/lib/document";

import saveDocumentFloatAnswerMutation from "ember-caluma-form/gql/mutations/save-document-float-answer";
import saveDocumentIntegerAnswerMutation from "ember-caluma-form/gql/mutations/save-document-integer-answer";
import saveDocumentStringAnswerMutation from "ember-caluma-form/gql/mutations/save-document-string-answer";
import saveDocumentListAnswerMutation from "ember-caluma-form/gql/mutations/save-document-list-answer";

const TYPE_MAP = {
  TextQuestion: "StringAnswer",
  TextareaQuestion: "StringAnswer",
  IntegerQuestion: "IntegerAnswer",
  FloatQuestion: "FloatAnswer",
  CheckboxQuestion: "ListAnswer",
  RadioQuestion: "StringAnswer"
};

/**
 * An object which represents a combination of a question and an answer.
 *
 * @class Field
 */
export default EmberObject.extend({
  saveDocumentFloatAnswerMutation,
  saveDocumentIntegerAnswerMutation,
  saveDocumentStringAnswerMutation,
  saveDocumentListAnswerMutation,

  /**
   * The Apollo GraphQL service for making requests
   *
   * @property {ApolloService} apollo
   * @accessor
   */
  apollo: service(),

  /**
   * Initialize function which validates the passed arguments
   *
   * @method init
   * @internal
   */
  init() {
    this._super(...arguments);

    assert("Owner must be injected!", getOwner(this));
    assert("_question must be passed!", this._question);
    assert("_document must be passed!", this._document);
  },

  /**
   * The ID of the field. Consists of the document ID and the question slug.
   *
   * E.g: `Document:5:Question:some-question`
   *
   * @property {String} id
   * @accessor
   */
  id: computed("document.id", "question.slug", function() {
    return `Document:${this.document.id}:Question:${this.question.slug}`;
  }).readOnly(),

  /**
   * The computed document object
   *
   * @property {Document} document
   * @accessor
   */
  document: computed("_document", function() {
    return Document.create(getOwner(this).ownerInjection(), this._document);
  }).readOnly(),

  /**
   * The computed question object
   *
   * @property {Question} question
   * @accessor
   */
  question: computed("_question", function() {
    return Question.create(getOwner(this).ownerInjection(), this._question);
  }).readOnly(),

  /**
   * The computed answer object
   *
   * @property {Answer} answer
   * @accessor
   */
  answer: computed("_answer", "_question.__typename", function() {
    const __typename = TYPE_MAP[this.question.__typename];

    return Answer.create(
      getOwner(this).ownerInjection(),
      this._answer || {
        __typename,
        [camelize(__typename.replace(/Answer$/, "Value"))]: null
      }
    );
  }).readOnly(),

  /**
   * Task to save a field. This uses a different mutation for every answer
   * type.
   *
   * @method save
   * @returns {Object} The response from the server
   */
  save: task(function*() {
    const type = this.get("answer.__typename");

    return yield this.apollo.mutate(
      {
        mutation: this.get(`saveDocument${type}Mutation`),
        variables: {
          input: {
            question: this.get("question.slug"),
            document: this.get("document.id"),
            value: this.get("answer.value")
          }
        }
      },
      `saveDocument${type}.answer`
    );
  })
});
