import Component from "@ember/component";

/**
 * Input component for the text question type
 *
 * @class CfFieldInputTextComponent
 */
export default Component.extend({
  tagName: "input",
  classNames: ["uk-input"],
  attributeBindings: [
    "type",
    "disabled",
    "field.id:name",
    "field.answer.stringValue:value",
    "field.question.textMaxLength:maxlength"
  ],
  type: "text"
});
