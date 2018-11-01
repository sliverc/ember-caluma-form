import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma-form/lib/document";

module("Unit | Library | document", function(hooks) {
  setupTest(hooks);

  test("it works", async function(assert) {
    assert.expect(2);

    const raw = {
      id: 1,
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: "question-1"
              },
              __typename: "StringAnswer"
            }
          }
        ]
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question-1",
                label: "Question 1",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };

    const document = Document.create(this.owner.ownerInjection(), { raw });

    assert.ok(document);
    assert.equal(document.fields.length, 1);
  });
});
