import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";
import layout from "../templates/components/cf-field";
import { task, timeout } from "ember-concurrency";

/**
 * Component to display a label and input for a certain field of a document.
 *
 * ```hbs
 * {{cf-field question=someQuestion document=someDocument}}
 * ```
 *
 * You can disable the field by passing `disabled=true`.
 *
 * @class CfFieldComponent
 * @argument {Object} question The question for the field
 * @argument {Object} document The document context for the field
 */
export default Component.extend({
  layout,
  classNames: ["uk-margin"],
  fieldStore: service(),

  /**
   * @argument {Object} question
   */
  question: null,

  /**
   * @argument {Object} document
   */
  document: null,

  /**
   * @property {Field} field
   * @accessor
   */
  field: computed("question.slug", "document.id", function() {
    return this.fieldStore.find(this.question, this.document);
  }).readOnly(),

  /**
   * Task to save a field. This will set the passed value to the answer and
   * save the field to the API after a timeout off 500 milliseconds.
   *
   * @todo Validate the value
   * @method save
   * @param {String|Number|String[]} value
   */
  save: task(function*(value) {
    const { environment } = getOwner(this).resolveRegistration(
      "config:environment"
    );

    /* istanbul ignore next */
    if (environment !== "test") {
      yield timeout(500);
    }

    const answer = this.get("field.answer");

    answer.set("value", value);

    yield this.field.validate.perform();

    if (this.field.isInvalid) {
      return;
    }

    const response = yield this.field.save.unlinked().perform();

    answer.setProperties(response);

    return response;
  }).restartable()
});
