import EmberObject, { computed } from "@ember/object";
import { next } from "@ember/runloop";
import { lastValue } from "ember-caluma-form/utils/concurrency";
import { getAST, getTransforms } from "ember-caluma-form/utils/jexl";
import { task } from "ember-concurrency";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default EmberObject.extend({
  dependsOn: computed("isHidden", function() {
    let iterator = getTransforms(getAST(this.isHidden));
    let result = iterator.next();
    let transforms = [];

    while (!result.done) {
      transforms.push(result.value);

      result = iterator.next();
    }

    return transforms.map(transform => transform.subject.value);
  }),

  hidden: lastValue("hiddenTask"),
  hiddenTask: task(function*() {
    let hidden = this.document.fields
      .filter(field => this.dependsOn.includes(field.question.slug))
      .some(
        field =>
          field.question.hidden ||
          field.answer.value === null ||
          field.answer.value === undefined
      );

    hidden =
      hidden || (yield this.field.document.questionJexl.eval(this.isHidden));

    if (this.hidden !== hidden) {
      next(this, () =>
        this.document.trigger("hiddenChanged", this.slug, hidden)
      );
    }

    return hidden;
  }),

  /**
   * Boolean which tells whether the question is optional or not.
   *
   * @property {Boolean} optional
   * @accessor
   */
  optional: lastValue("optionalTask"),
  optionalTask: task(function*() {
    return !(yield this.document.questionJexl.eval(this.isRequired));
  })
});
