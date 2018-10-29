import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import layout from "../templates/components/cf-field";

/**
 * @class CfFieldComponent
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
  }).readOnly()
});
