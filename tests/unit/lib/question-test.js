import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Question from "ember-caluma-form/lib/question";

module("Unit | Library | question", function(hooks) {
  setupTest(hooks);

  test("it works", async function(assert) {
    assert.expect(1);

    const question = Question.create({});

    assert.ok(question);
  });
});
