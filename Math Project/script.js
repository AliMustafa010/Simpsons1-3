function evaluateEquation(equation, x) {
    try {
        let scope = {
            x: x,
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            exp: Math.exp,
            pi: Math.PI,
            e: Math.E
        };

        let expr = math.parse(equation);
        return expr.evaluate(scope);
    } catch (e) {
        alert("Invalid equation or error evaluating the function.");
        return NaN;
    }
}

function evaluateLimit(limit) {
    try {
        let scope = { pi: Math.PI, e: Math.E };
        return math.evaluate(limit, scope);
    } catch (e) {
        alert("Invalid limit: " + limit);
        return NaN;
    }
}

function calculateSimpsons() {
    let equation = document.getElementById('equation').value;
    let lowerLimitStr = document.getElementById('lowerLimit').value;
    let upperLimitStr = document.getElementById('upperLimit').value;
    let intervals = parseInt(document.getElementById('intervals').value);
    let exactValueStr = document.getElementById('exactValue').value;

    let lowerLimit = evaluateLimit(lowerLimitStr);
    let upperLimit = evaluateLimit(upperLimitStr);

    if (isNaN(lowerLimit) || isNaN(upperLimit) || isNaN(intervals) || intervals <= 0 || intervals % 2 !== 0) {
        alert('Please enter valid numbers. Number of intervals must be positive and even.');
        return;
    }

    let h = (upperLimit - lowerLimit) / intervals;
    let sum = 0;
    let details = '';

    let formula = `Δx = (b - a) / n = (${upperLimit.toFixed(4)} - ${lowerLimit.toFixed(4)}) / ${intervals} = ${h.toFixed(4)}`;
    details += `<p>Interval width (Δx): ${formula}</p>`;

    let functionValues = [];
    for (let i = 0; i <= intervals; i++) {
        let x = lowerLimit + i * h;
        let fx = evaluateEquation(equation, x);
        if (isNaN(fx)) {
            alert("Error evaluating the function at x = " + x);
            return;
        }

        functionValues.push({ x: x.toFixed(4), fx: fx.toFixed(4) });
        if (i === 0 || i === intervals) {
            sum += fx;
        } else if (i % 2 === 1) {
            sum += 4 * fx;
        } else {
            sum += 2 * fx;
        }
    }

    let result = (h / 3) * sum;

    let functionValuesOutput = functionValues.map(val => `f(${val.x}) = ${val.fx}`).join('<br>');

    let sumTerms = functionValues.map((val, i) => {
        let term = `${val.fx}`;
        if (i === 0 || i === functionValues.length - 1) {
            return term;
        } else if (i % 2 === 1) {
            return `4 × ${term}`;
        } else {
            return `2 × ${term}`;
        }
    }).join(' + ');

    let sumFormula = `Sum = ${sumTerms} = ${sum.toFixed(4)}`;
    let hTimesSumFormula = `f(${equation}) = h/3 × Sum <br>
    f(${equation}) = ${h.toFixed(4)} / 3 × ${sum.toFixed(4)} <br> 
    f(${equation}) = ${result.toFixed(4)}`;

    let exactValue = exactValueStr ? parseFloat(exactValueStr) : NaN;
    let absoluteError = NaN;
    let relativeError = NaN;

    if (!isNaN(exactValue)) {
        absoluteError = Math.abs(exactValue - result);
        relativeError = absoluteError / Math.abs(exactValue);
    }

    let output = `
        <h2>Simpson's Rule Calculation</h2>
        <h4>Equation:</h4>
        <p>b<br>
        ∫f(x) = ${equation}<br>
        a</p>
        <h4>Limits</h4>
        <p>Lower Limit (a): ${lowerLimit.toFixed(1)}<br>
        Upper Limit (b): ${upperLimit.toFixed(1)}</p>
        <h4>Intervals:</h4>
        <p>Intervals (n): ${intervals}</p>
        <h4>Formula for h:</h4>
        <p>h = (b - a) / n <br>
        h = (${upperLimit.toFixed(4)} - ${lowerLimit.toFixed(4)}) / ${intervals} = ${h.toFixed(4)}</p>
        <h4>Function Values:</h4>
        <p>${functionValuesOutput}</p>
        <h4>Summation of Terms:</h4>
        <p>${sumFormula}</p>
        <h4>Final Calculation:</h4>
        <p>${hTimesSumFormula}</p>
    `;

    if (!isNaN(exactValue)) {
        output += `
            <h4>Exact Value:</h4>
            <p>${exactValue.toFixed(9)}</p>
            <h4>Absolute Error:</h4>
            <p>Exact - Calculated = ${exactValue.toFixed(9)} - ${result.toFixed(9)}<br> 
            Absolute Error = ${absoluteError.toFixed(9)}</p>
            <h4>Relative Error:</h4>
            <p>Absolute Error / Exact = ${absoluteError.toFixed(9)} / ${Math.abs(exactValue).toFixed(9)} <br>
            Relative Error = ${relativeError.toFixed(9)}</p>
        `;
    }

    document.getElementById('result').innerHTML = output;
}
