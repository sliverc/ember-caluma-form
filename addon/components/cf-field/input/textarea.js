import Component from "@ember/component";

/**
 * Input component for the textarea question type
 *
 * @class CfFieldInputTextareaComponent
 */
export default Component.extend({
  tagName: "textarea",
  classNames: ["uk-textarea"],
  attributeBindings: [
    "field.id:name",
    "field.answer.stringValue:value",
    "field.question.textareaMaxLength:maxlength"
  ]
});
