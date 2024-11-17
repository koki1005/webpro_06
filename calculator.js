function calculateResult() {
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);
    
    const operator = document.querySelector('input[name="operation"]:checked').value;

    let result;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                result = 'エラー: ゼロで割ることはできません';
            } else {
                result = num1 / num2;
            }
            break;
        default:
            result = 'エラー: 無効な演算子です。';
    }

    document.getElementById("result").textContent = '結果: ' + result;
}