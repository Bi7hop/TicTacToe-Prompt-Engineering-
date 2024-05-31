let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    const content = document.getElementById('content');
    let tableHTML = '<table>';
    
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const fieldIndex = i * 3 + j;
            let symbol = '';
            if (fields[fieldIndex] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[fieldIndex] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHTML += `<td id="cell-${fieldIndex}" onclick="handleClick(${fieldIndex}, this)">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';
    content.innerHTML = tableHTML;
}

function handleClick(index, element) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        element.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        element.onclick = null; 
        if (checkWin()) {
            setTimeout(() => {
                drawWinningLine(checkWin());
            }, 300); // Adding delay to ensure SVG animation finishes
        } else {
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

function generateCircleSVG() {
    return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="30" stroke="#00B0EF" stroke-width="5" fill="none">
            <animate attributeName="stroke-dasharray" from="0, 188.4" to="188.4, 0" dur="300ms" repeatCount="1"/>
        </circle>
    </svg>`;
}

function generateCrossSVG() {
    return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="5">
            <animate attributeName="stroke-dasharray" from="0, 70" to="70, 0" dur="300ms" repeatCount="1"/>
        </line>
        <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
            <animate attributeName="stroke-dasharray" from="0, 70" to="70, 0" begin="300ms" dur="125ms" repeatCount="1"/>
        </line>
    </svg>`;
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination;
        }
    }

    return null;
}

function drawWinningLine(combination) {
    if (!combination) return; // Add this check to avoid errors

    const lineColor = '#ffffff';
    const lineWidth = 5;
    const content = document.getElementById('content');
    const contentRect = content.getBoundingClientRect();

    const startCell = document.querySelector(`#cell-${combination[0]}`);
    const endCell = document.querySelector(`#cell-${combination[2]}`);
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = '0 0';

    content.appendChild(line);
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    currentPlayer = 'circle';
    document.getElementById('content').innerHTML = '';
    render();
}

document.addEventListener('DOMContentLoaded', init);
