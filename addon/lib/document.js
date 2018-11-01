import EmberObject, { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import Field from "ember-caluma-form/lib/field";

/**
 * Object which represents a document
 *
 * @class Document
 */
export default EmberObject.extend({
  init() {
    this._super(...arguments);

    assert("The raw document `raw` must be passed", this.raw);
  },

  id: reads("raw.id"),

  fields: computed(
    "raw.{form.questions.edges.[],answers.edges.[]}",
    function() {
      return this.raw.form.questions.edges.map(({ node: question }) => {
        const answer = this.raw.answers.edges.find(({ node: answer }) => {
          return answer.question.slug === question.slug;
        });

        return Field.create(getOwner(this).ownerInjection(), {
          document: this,
          _question: question,
          _answer: answer && answer.node
        });
      });
    }
  ).readOnly()
});
