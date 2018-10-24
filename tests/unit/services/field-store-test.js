import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | field-store", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.question = {
      slug: "question-1",
      label: "Question 1",
      __typename: "TextQuestion"
    };

    this.document = {
      id: 1,
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: this.question.slug
              },
              __typename: "StringAnswer"
            }
          }
        ]
      }
    };
  });

  test("can find a field", function(assert) {
    assert.expect(5);

    const service = this.owner.lookup("service:field-store");

    assert.equal(service.fields.length, 0);
    assert.ok(service.find(this.question, this.document)); // uncached
    assert.equal(service.fields.length, 1);

    service._build = () => assert.ok(false); // make sure _build is not called
    assert.ok(service.find(this.question, this.document)); // cached
    assert.equal(service.fields.length, 1);
  });

  test("can build a field", function(assert) {
    assert.expect(4);

    const service = this.owner.lookup("service:field-store");

    const field = service.find(this.question, this.document);

    assert.ok(field);
    assert.equal(field.id, "Document:1:Question:question-1");
    assert.equal(field.question.label, "Question 1");
    assert.equal(field.answer.stringValue, "Test");
  });

  test("can build a field without an answer", function(assert) {
    assert.expect(4);

    this.document.answers.edges = [];

    const service = this.owner.lookup("service:field-store");

    const field = service._build(this.question, this.document);

    assert.ok(field);
    assert.equal(field.id, "Document:1:Question:question-1");
    assert.equal(field.question.label, "Question 1");
    assert.equal(field.answer.stringValue, null);
  });
});
