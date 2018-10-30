import Service from "@ember/service";
import { computed } from "@ember/object";
import { A } from "@ember/array";
import { getOwner } from "@ember/application";

import Field from "ember-caluma-form/lib/field";

/**
 * @class FieldStoreService
 * @extends Ember.Service
 */
export default Service.extend({
  /**
   * The actual store of all present fields
   *
   * @accessor fields
   * @type {Ember.Array}
   */
  fields: computed(() => A([])).readOnly(),

  /**
   * Find a field in the cache or build it and put it in the cache.
   *
   * @method find
   * @param {Object} question The question of the field
   * @param {Object} document The document
   * @return {Field} The field
   */
  find(question, document) {
    const cached = this.fields.find(
      field => field.id === `Document:${document.id}:Question:${question.slug}`
    );

    if (!cached) {
      this.fields.pushObject(this._build(question, document));

      return this.find(question, document);
    }

    return cached;
  },

  /**
   * Build a new field out of a question and a document
   *
   * @method _build
   * @param {Object} question The question of the field
   * @param {Object} document The document
   * @return {Field} The built field
   * @internal
   */
  _build(question, document) {
    const answer = document.answers.edges.find(
      ({
        node: {
          question: { slug }
        }
      }) => slug === question.slug
    );

    return Field.create(getOwner(this).ownerInjection(), {
      _document: document,
      _question: question,
      _answer: answer && answer.node
    });
  }
});
