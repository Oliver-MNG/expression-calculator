function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    let prioritySigns = ["*", "/"]
    let usualSigns = ["+", "-"]
    let allSigns = ["*", "/", "+", "-"]

    expr = expr.replace(/\s/g, "");

    function sum(num1, num2) {
        return +num1 + +num2;
    }

    function substract(num1, num2) {
        return +num1 - +num2;
    }

    function multiply(num1, num2) {
        return num1 * num2;
    }

    function division(num1, num2) {
        return (num1 / num2).toFixed(20);
    }

    let allOperations = {
        "*": multiply,
        "/": division,
        "+": sum,
        "-": substract
    };

    function isZeroDivision(operationSing, num2) {
        return operationSing == "/" && num2 == 0;
    }

    function extractFullNum(str, i, direction) {
        let result = "";
        if (direction) {
            for (; i <= str.length; i++) {
                if (!allSigns.includes(str.charAt(i)) || str.charAt(i) === ".") {
                    result = result + str.charAt(i);
                } else {
                    break;
                }
            }
        } else {
            for (; i >= 0; i--) {
                if (!allSigns.includes(str.charAt(i))
                    || str.charAt(i) === "."
                    || (str.charAt(i) === "-" && i == 0)) {
                    result = str.charAt(i) + result;
                } else {
                    break;
                }
            }
        }
        return result;
    }

    function calcSetOperations(str, operationsSet) {
        let priorityOperationExist = true;

        while (priorityOperationExist) {
            priorityOperationExist = false;
            for (var i = 0; i < str.length; i++) {
                if (operationsSet.includes(str.charAt(i)) && i !== 0) {
                    let num1 = extractFullNum(str, i - 1, false);
                    let num2 = extractFullNum(str, i + 1, true);
                    if (isZeroDivision(str.charAt(i), num2)) {
                        throw ("TypeError: Division by zero.");
                    }
                    let result = allOperations[str.charAt(i)](num1, num2)
                    str = str.replace(num1 + str.charAt(i) + num2, result)
                    priorityOperationExist = true;
                    break;
                }
            }
        }
        return str;
    }

    function simplCalc(str) {
        str = calcSetOperations(str, prioritySigns);
        str = calcSetOperations(str, usualSigns);
        return str;
    }

    function removeBrackets(expr) {
        return expr.replace(/[()]/g, "")
    }

    function replaceAt(expr, index, replacement) {
        return expr.substr(0, index) + replacement
            + expr.substr(index + replacement.length);
    }

    function moveMinus(expr, i) {
        for (; i >= 0; i--) {
            if (expr.charAt(i) == '-') {
                if (i == 0) {
                    return expr.replace('--', '-');
                } else {
                    return expr.replace('--', '+');
                }
            } else if (expr.charAt(i) == '+') {
                return expr.replace('+-', '-')
            } else if (expr.charAt(i) == '(') {
                return expr;
            }
            let tmpChar = expr.charAt(i);
            expr = replaceAt(expr, i, '-');
            expr = replaceAt(expr, i + 1, tmpChar);
        }
        return expr;
    }

    function fullCalc(expr) {
        let exprs = expr.match(/\([\d-+.*/]*\)/g)
        for (e in exprs) {
            let tmpResult = simplCalc(removeBrackets(exprs[e]));
            expr = expr.replace(exprs[e], tmpResult);
            expr = expr.replace("--", "+");
            if (tmpResult.charAt(0) == '-') {
                expr = moveMinus(expr, expr.indexOf(tmpResult) - 1)
            }
            if (expr.charAt(0) == '+') {
                expr = expr.slice(1);
            }
        }
        expr = expr.replace("-(+", "-(");
        if (expr.match(/\([\d-+*./]*\)/g)) {
            expr = fullCalc(expr)
        }
        if (expr.indexOf("(") < 0) {
            expr = simplCalc(expr);
        }
        return expr;
    }

    let result = fullCalc(expr);
    if (result.indexOf("(") >= 0 || result.indexOf(")") >= 0 || result == 'NaN') {
        throw ("ExpressionError: Brackets must be paired")
    }

    return +result;
}

module.exports = {
    expressionCalculator
}
