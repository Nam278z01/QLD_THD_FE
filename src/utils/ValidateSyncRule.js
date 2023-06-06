const fieldSyncType = {
    Number: 'number',
    Percentage: 'percentage',
    String: 'string',
    Date: 'date'
};
const formType = {
    Number: '"numberType"',
    String: '"stringType"',
    DateType: '"dateType"'
};
const errorMessage = {
    ConditionError: 'Condition is invalid',
    ConditionErrorCompare: 'Condition compare string invalid',
    CaculationError: 'Caculation is invalid',
    ConditionErrorCompareNumber: 'Condition compare number invalid',
    ConditionErrorCompareDate: "'Condition compare date invalid'"
};

function checkConditionConditionAndFormula(conditionString, caculationFormulaString, SampleData) {
    let regex = /[^-\d+*/\[\]&=!()||]/g;
    let regexCharacter1 = /[[]/g;
    let regexCharacter2 = /]/g;
    let regexCharacter3 = /[(]/g;
    let regexCharacter4 = /[)]/g;
    let CaculationError = '';
    let ConditionError = '';
    let checkCondition = true;
    let Condition = conditionString;
    let caculationRegex = /[^-\d+*/\[\]]/g;
    let checkCaculation = true;
    let CaculationFormula = caculationFormulaString;
    let caculationFormulaElement = CaculationFormula?.split(']');
    let count5 =
        CaculationFormula.match(regexCharacter1) !== null ? CaculationFormula.match(regexCharacter1).length : 0;

    let count6 =
        CaculationFormula.match(regexCharacter2) !== null ? CaculationFormula.match(regexCharacter2).length : 0;

    if (regex.test(CaculationFormula) == true || count5 != count6) {
        CaculationError = errorMessage.Caculation;
        checkCaculation = false;
    }
    caculationFormulaElement.forEach((element) => {
        let initElemet = element.split('[');

        if (initElemet[1] !== undefined) {
            if (
                (SampleData[parseInt(initElemet[1])] == fieldSyncType.Number ||
                    SampleData[parseInt(initElemet[1])] == fieldSyncType.Percentage) &&
                caculationRegex.test(CaculationFormula) != true &&
                checkCaculation
            ) {
            } else {
                checkCaculation = false;
                CaculationError = errorMessage.CaculationError;
            }
        }
    });
    let count1 = Condition.match(regexCharacter1) !== null ? Condition.match(regexCharacter1).length : 0;
    let count2 = Condition.match(regexCharacter2) !== null ? Condition.match(regexCharacter2).length : 0;
    let count3 = Condition.match(regexCharacter3) !== null ? Condition.match(regexCharacter3).length : 0;
    let count4 = Condition.match(regexCharacter4) !== null ? Condition.match(regexCharacter4).length : 0;
    if (!(count1 == count2 && count3 == count4)) {
        checkCondition = false;
    }

    function replaceElement(index) {
        if (SampleData[index] == fieldSyncType.Number || SampleData[index] == fieldSyncType.Percentage) {
            return formType.Number;
        } else if (SampleData[index] == fieldSyncType.String) {
            return formType.String;
        } else if (SampleData[index] == fieldSyncType.Date) {
            return formType.DateType;
        }
    }
    function capitalizeWords(str) {
        return str.replace(/\[(.*?)\]/g, function (match, firstLetter) {
            return `${replaceElement(firstLetter)}`;
        });
    }
    const outputString = capitalizeWords(Condition);
    function isValidCondition(conditionString) {
        try {
            eval(`if (${conditionString}) true;`);

            return true;
        } catch (error) {
            return false;
        }
    }
    if (!isValidCondition(conditionString)) {
        checkCondition = false;
        ConditionError = errorMessage.ConditionError;
    }
    if (!isValidCondition(caculationFormulaString)) {
        checkCaculation = false;
        CaculationError = errorMessage.CaculationError;
    }
    let pattern = /([=!<>]+|\&\&|\|\|)|"(\w+)"|'(\w+)'|(\w+)/g;
    let elements = Condition ? outputString.match(pattern) : [];

    let filteredElements = elements.filter((elem) => {
        return elem !== undefined && elem !== '(' && elem !== ')';
    });
    filteredElements.forEach(function (element, index) {
        try {
            if (!isNaN(parseFloat(filteredElements[index]))) {
                filteredElements[index] = parseFloat(filteredElements[index]);
            }
        } catch (error) {}
    });
    const operators = ['+', '-', '*', '/', '%', '^'];
    function isOperator(element) {
        return operators.includes(element);
    } // checkCondition if an element is a comparison operator
    const comparisonOperators = ['<', '>', '<=', '>=', '==', '!='];
    function isComparisonOperator(element) {
        return comparisonOperators.includes(element);
    }
    for (let index = 0; index < filteredElements.length; index++) {
        if (isComparisonOperator(filteredElements[index])) {
            if (filteredElements[index - 1] == formType.String || filteredElements[index + 1] == formType.String) {
                if (
                    (filteredElements[index - 1] != formType.String &&
                        typeof filteredElements[index - 1] != fieldSyncType.String) ||
                    (filteredElements[index + 1] != formType.String &&
                        typeof filteredElements[index + 1] != fieldSyncType.String)
                ) {
                    ConditionError = errorMessage.ConditionErrorCompare;
                    checkCondition = false;
                }
            }
            if (filteredElements[index - 1] == formType.Number || filteredElements[index + 1] == formType.Number) {
                if (
                    (filteredElements[index - 1] != formType.Number &&
                        typeof filteredElements[index - 1] != fieldSyncType.Number) ||
                    (filteredElements[index + 1] != formType.Number &&
                        typeof filteredElements[index + 1] != fieldSyncType.Number)
                ) {
                    ConditionError = errorMessage.ConditionErrorCompareNumber;
                    checkCondition = false;
                }
            }
            if (filteredElements[index - 1] == formType.DateType || filteredElements[index + 1] == formType.DateType) {
                if (
                    (filteredElements[index - 1] != formType.DateType &&
                        typeof filteredElements[index - 1] != fieldSyncType.Date) ||
                    (filteredElements[index + 1] != formType.DateType &&
                        typeof filteredElements[index + 1] != fieldSyncType.Date)
                ) {
                    if (
                        (filteredElements[index - 1] == formType.DateType &&
                            filteredElements[index - 2] == formType.DateType) ||
                        (filteredElements[index + 1] == formType.DateType &&
                            filteredElements[index + 2] == formType.DateType)
                    ) {
                        if (
                            typeof filteredElements[index - 1] != fieldSyncType.Number &&
                            typeof filteredElements[index + 1] != fieldSyncType.Number
                        ) {
                            ConditionError = errorMessage.ConditionErrorCompareDate;

                            checkCondition = false;
                        }
                    }
                }
            }
        }
    }
    if (Condition == '') {
        checkCondition = true;
        ConditionError = '';
    }
    if (CaculationFormula == '') {
        checkCaculation = true;
        CaculationError = '';
    }
    return {
        checkCaculation: checkCaculation,
        checkCondition: checkCondition,
        ConditionError: ConditionError,
        CaculationError: CaculationError
    };
}

const checkConditionData = (value, sampleData) => {
    let Condition = value ? value : '';
    const result = checkConditionConditionAndFormula(Condition, '', sampleData);
    return result;
};

const checkCaculateData = (value, sampleData) => {
    let caculationFormulaString = value ? value : '';
    const result = checkConditionConditionAndFormula('', caculationFormulaString, sampleData);
    return result;
};

export { checkConditionData, checkCaculateData };
