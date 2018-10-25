import EmberObject, { computed } from "@ember/object";
import jexl from "jexl";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default EmberObject.extend({
  /**
   * Promise which parses the questions `isRequired` and tells whether the
   * question is optional or not.
   *
   * @property {RSVP.Promise} optional
   * @accessor
   */
  optional: computed("isRequired", async function() {
    return !(await jexl.eval(this.isRequired));
  }).readOnly()
});
