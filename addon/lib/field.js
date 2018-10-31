import EmberObject, { computed } from "@ember/object";
import { equal, not } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { camelize } from "@ember/string";
import { task } from "ember-concurrency";
import { all } from "rsvp";
import { validate } from "ember-validators";

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
   * The translation service
   *
   * @property {IntlService} intl
   * @accessor
   */
  intl: service(),

  /**
   * Initialize function which validates the passed arguments and sets an
   * initial state of errors.
   *
   * @method init
   * @internal
   */
  init() {
    this._super(...arguments);

    assert("Owner must be injected!", getOwner(this));
    assert("_question must be passed!", this._question);
    assert("_document must be passed!", this._document);

    this.set("_errors", []);
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
   * Whether the field is valid.
   *
   * @property {Boolean} isValid
   * @accessor
   */
  isValid: equal("errors.length", 0),

  /**
   * Whether the field is invalid.
   *
   * @property {Boolean} isInvalid
   * @accessor
   */
  isInvalid: not("isValid"),

  /**
   * The error messages on this field.
   *
   * @property {String[]} errors
   * @accessor
   */
  errors: computed("_errors.[]", function() {
    return this._errors.map(({ type, context, value }) => {
      return this.intl.t(
        `caluma.form.validation.${type}`,
        Object.assign({}, context, { value })
      );
    });
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
  }),

  /**
   * Validate the field. Every field goes through the required validation and
   * the validation for the given question type. This mutates the `errors` on
   * the field.
   *
   * @method validate
   */
  validate: task(function*() {
    const validationFns = [
      this._validateRequired,
      this.get(`_validate${this.question.__typename}`)
    ];

    const errors = (yield all(
      validationFns.map(async fn => {
        const res = await fn.call(this);

        return Array.isArray(res) ? res : [res];
      })
    ))
      .reduce((arr, e) => [...arr, ...e], []) // flatten the array
      .filter(e => typeof e === "object");

    this.set("_errors", errors);
  }).restartable(),

  /**
   * Method to validate if a question is required or not.
   *
   * @method _validateRequired
   * @returns {RSVP.Promise} Returns an promise which resolves into an object if invalid or true if valid
   * @internal
   */
  async _validateRequired() {
    return (
      (await this.get("question.optional")) ||
      validate("presence", this.get("answer.value"), { presence: true })
    );
  },

  /**
   * Method to validate a text question. This checks if the value longer than
   * predefined by the question.
   *
   * @method _validateTextQuestion
   * @returns {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateTextQuestion() {
    return validate("length", this.get("answer.value"), {
      max: this.get("question.textMaxLength") || Number.POSITIVE_INFINITY
    });
  },

  /**
   * Method to validate a textarea question. This checks if the value longer
   * than predefined by the question.
   *
   * @method _validateTextareaQuestion
   * @returns {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateTextareaQuestion() {
    return validate("length", this.get("answer.value"), {
      max: this.get("question.textareaMaxLength") || Number.POSITIVE_INFINITY
    });
  },

  /**
   * Method to validate an integer question. This checks if the value is bigger
   * or less than the options provided by the question.
   *
   * @method _validateIntegerQuestion
   * @returns {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateIntegerQuestion() {
    return validate("number", this.get("answer.value"), {
      integer: true,
      gte: this.get("question.integerMinValue") || Number.NEGATIVE_INFINITY,
      lte: this.get("question.integerMaxValue") || Number.POSITIVE_INFINITY
    });
  },

  /**
   * Method to validate a float question. This checks if the value is bigger or
   * less than the options provided by the question.
   *
   * @method _validateFloatQuestion
   * @returns {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateFloatQuestion() {
    return validate("number", this.get("answer.value"), {
      gte: this.get("question.floatMinValue") || Number.NEGATIVE_INFINITY,
      lte: this.get("question.floatMaxValue") || Number.POSITIVE_INFINITY
    });
  },

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   *
   * @method _validateRadioQuestion
   * @returns {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateRadioQuestion() {
    return validate("inclusion", this.get("answer.value"), {
      in: this.get("question.radioOptions.edges").map(
        option => option.node.slug
      )
    });
  },

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   *
   * @method _validateCheckboxQuestion
   * @returns {Object[]|Boolean[]|Mixed[]} Returns per value an object if invalid or true if valid
   * @internal
   */
  _validateCheckboxQuestion() {
    return this.get("answer.value").map(value =>
      validate("inclusion", value, {
        in: this.get("question.checkboxOptions.edges").map(
          option => option.node.slug
        )
      })
    );
  }
});
