class InputType {
    static EMPTY = new InputType("empty");
    static DIGIT = new InputType("digit");
    static OPERATOR = new InputType("operator");
    static PARENTHESIS = new InputType("parenthesis");
    static PARENTHESISL = new InputType("parenthesisL");
    static PARENTHESISR = new InputType("parenthesisR");
    static DECIMAL = new InputType("decimal");
    static NEGATIVE = new InputType("negative");
    static EXPONENT = new InputType("exponent");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `${this.name}`;
    }

}

export default InputType;