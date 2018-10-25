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

  test("it computes optional", async function(assert) {
    assert.expect(2);

    let question = Question.create({ isRequired: "true" });

    assert.equal(await question.optional, false);

    question.set("isRequired", "false");

    assert.equal(await question.optional, true);
  });
});
