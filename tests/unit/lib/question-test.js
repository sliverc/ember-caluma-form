import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma-form/lib/document";

module("Unit | Library | question", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const raw = {
      id: 1,
      answers: {
        edges: []
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question-1",
                label: "Test",
                isRequired: "true",
                isHidden: "true",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };

    const document = Document.create(this.owner.ownerInjection(), { raw });
    this.set("question", document.fields[0].question);
  });

  test("it computes optional", async function(assert) {
    assert.expect(2);

    assert.equal(await this.question.optionalTask.perform(), false);

    this.question.set("isRequired", "false");

    assert.equal(await this.question.optionalTask.perform(), true);
  });
});
