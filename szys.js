// 初始化分数和最高分数
let currentScore = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let operationData = {}; // 用来存储当前题目

// 获取 DOM 元素
const operationDiv = document.getElementById('operation');
const answerInput = document.getElementById('answer-input');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const resultModal = document.getElementById('result-modal');
const finalScoreDisplay = document.getElementById('final-score');
const highestScoreDisplay = document.getElementById('highest-score');

// 显示当前分数和最高分数
document.getElementById('current-score').textContent = currentScore;
document.getElementById('high-score').textContent = highScore;

// 生成随机四则运算题目
function generateOperation() {
    let num1, num2, operator, correctAnswer, operatorSymbol;

    do {
        num1 = Math.floor(Math.random() * 99) + 1;  // 1-99的随机数
        num2 = Math.floor(Math.random() * 99) + 1;  // 1-99的随机数

        operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

        if (operator === '+') {
            operatorSymbol = '+'; // 加法符号
            correctAnswer = num1 + num2;
        } else if (operator === '-') {
            operatorSymbol = '-'; // 减法符号
            if (num1 < num2) {
                [num1, num2] = [num2, num1];  // 保证 num1 > num2，避免负数
            }
            correctAnswer = num1 - num2;
        } else if (operator === '*') {
            operatorSymbol = '×'; // 乘法符号
            correctAnswer = num1 * num2;
        } else if (operator === '/') {
            operatorSymbol = '÷'; // 除法符号
            do {
                num1 = Math.floor(Math.random() * 99) + 1;  // 被除数范围: 1-99
                num2 = Math.floor(Math.random() * 10) + 1;  // 除数范围: 1-10，避免除数过大
            } while (num1 % num2 !== 0);  // 确保能整除
            correctAnswer = num1 / num2;
        }
    } while (correctAnswer < 0 || Number.isNaN(correctAnswer));

    const operationText = `${num1} ${operatorSymbol} ${num2}`;
    return { operationText, correctAnswer };
}

// 更新页面上的运算题目
function displayOperation() {
    const { operationText, correctAnswer } = generateOperation();
    operationDiv.textContent = operationText;
    operationData = { operationText, correctAnswer };
}

function submitAnswer() {
    const userAnswer = parseFloat(answerInput.value);
    const correctAnswer = operationData.correctAnswer;

    // 判断是否答对
    if (userAnswer === correctAnswer) {
        currentScore += 1; // 正确答案得1分
    }

    // 更新当前分数显示
    document.getElementById('current-score').textContent = currentScore;

    // 判断答错后弹出结算窗口
    if (userAnswer !== correctAnswer) {
        finalScoreDisplay.textContent = `本次得分：${currentScore}`;
        highestScoreDisplay.textContent = `最高分数：${highScore}`;

        // 更新历史最高分
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem('highScore', highScore);  // 将新最高分保存到 localStorage
        }

        // 更新页面显示
        document.getElementById('current-score').textContent = currentScore;
        document.getElementById('high-score').textContent = highScore;

        // 保存历史记录
        saveHistoryRecord();

        // 显示结算窗口
        resultModal.style.display = 'flex';
    }

    // 清空输入框并显示新题目
    answerInput.value = '';
    displayOperation();
}
// 初始化页面，生成题目
displayOperation();


// 关闭结算窗口，返回首页
function closeModal() {
    resultModal.style.display = 'none';  // 隐藏结果模态框
    
    // 保存当前分数到历史记录
    saveHistoryRecord();  // 保存历史记录
    
    // 重新设置高分
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);  // 将新最高分保存到 localStorage
    }
    
    // 更新分数显示
    document.getElementById('current-score').textContent = currentScore;
    document.getElementById('high-score').textContent = highScore;

    // 返回首页
    window.location.href = 'sy.html';  // 返回首页
}

// 保存历史记录
function saveHistoryRecord() {
    const record = {
        score: currentScore,  // 本次得分
        highScore: highScore,  // 当前最高分数
        time: new Date().toLocaleString(),  // 当前时间
    };

    // 获取历史记录并添加新记录
    let historyRecords = JSON.parse(localStorage.getItem('historyRecords')) || [];
    historyRecords.push(record);

    // 将更新后的历史记录保存到 localStorage
    localStorage.setItem('historyRecords', JSON.stringify(historyRecords));
}


// 获取历史记录并更新页面表格
function updateHistoryTable() {
    const historyTableBody = document.getElementById('history-table-body');
    let historyRecords = JSON.parse(localStorage.getItem('historyRecords')) || [];  // 从 localStorage 获取历史记录

    // 清空表格内容
    historyTableBody.innerHTML = '';

    // 如果没有历史记录，显示提示
    if (historyRecords.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4">没有历史记录</td>';  // 这里改成了4列
        historyTableBody.appendChild(row);
        return;
    }

    // 遍历历史记录并填充表格
    historyRecords.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.score}</td>  <!-- 显示得分 -->
            <td>${record.highScore}</td>  <!-- 显示最高分数 -->
            <td>${record.time}</td>  <!-- 显示时间 -->
        `;
        historyTableBody.appendChild(row);
    });
}
