document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('priceForm');
    const calculatePriceButton = document.getElementById('calculatePriceButton');
    const startNewCalculationButton = document.getElementById('startNewCalculationButton');
    const printResultsButton = document.getElementById('printResultsButton');
    const errorMessage = document.getElementById('error-message');
    const resultTable = document.getElementById('result-table');
    const resultTableBody = document.getElementById('result-table-body');
    const notification = document.getElementById('notification');
    const backgroundContainer = document.getElementById('backgroundContainer');
    const patternContainer = document.getElementById('patternContainer');
    const templateContainer = document.getElementById('templateContainer');

    const roundToNearestMultiple = (num, multiple) => Math.round(num / multiple) * multiple;

    function updateVisibility() {
        const baseYes = document.getElementById('baseYes').checked;
        backgroundContainer.style.display = baseYes ? 'none' : 'flex';
        patternContainer.style.display = baseYes ? 'none' : 'flex';
        templateContainer.style.display = baseYes ? 'none' : 'flex';
    }

    document.getElementById('baseYes').addEventListener('change', updateVisibility);
    document.getElementById('baseNo').addEventListener('change', updateVisibility);
    updateVisibility();

    calculatePriceButton.addEventListener('click', function() {
        const clientName = document.getElementById('clientName').value.trim();
        const sellerName = document.getElementById('sellerName').value.trim();
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const thickness = parseFloat(document.getElementById('thickness').value);
        const base = document.querySelector('input[name="base"]:checked').value;
        const background = base === 'no' ? document.querySelector('input[name="background"]:checked').value : 'no';
        const pattern = base === 'no' ? document.querySelector('input[name="pattern"]:checked').value : 'no';
        const template = base === 'no' ? document.querySelector('input[name="template"]:checked').value : 'no';

        if (!clientName || !sellerName || isNaN(length) || isNaN(width) || length <= 2 || width <= 2) {
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        let price = 0;
        if (base === 'yes') {
            price = ((length + 5) * width * 0.5 / 2);
        } else {
            if (background === 'yes') {
                price = (length * width * 0.4 / 2);
            } else {
                price = (length * width * 0.2 / 1.875);
            }
            if (pattern === 'yes') {
                price += (length * width * 0.4 / 2);
            }
            if (template === 'yes') {
                price += (length * width * 0.3 / 2.5);
            }
        }

        if (length < 40 || width < 40) {
            price += 40;
        }

        price = roundToNearestMultiple(price, 5);

        const newRow = document.createElement('tr');
        const today = new Date();
        const verificationDate = new Date(today);
        verificationDate.setDate(today.getDate() + 5);

        newRow.innerHTML = `
            <td>${clientName}</td>
            <td>${sellerName}</td>
            <td>${length}</td>
            <td>${width}</td>
            <td>${base === 'yes' ? 'Sim' : 'Não'}</td>
            ${base === 'no' ? `<td>${background === 'yes' ? 'Sim' : 'Não'}</td><td>${pattern === 'yes' ? 'Sim' : 'Não'}</td><td>${template === 'yes' ? 'Sim' : 'Não'}</td>` : '<td>-</td><td>-</td><td>-</td>'}
            <td>${today.toLocaleDateString('pt-BR')}</td>
            <td>${verificationDate.toLocaleDateString('pt-BR')}</td>
            <td>R$ ${price.toFixed(2)}</td>
        `;
        resultTableBody.appendChild(newRow);
        resultTable.style.display = 'table';
        notification.style.display = 'block';
    });

    startNewCalculationButton.addEventListener('click', function() {
        form.reset();
        updateVisibility();
        resultTableBody.innerHTML = '';
        resultTable.style.display = 'none';
        notification.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    printResultsButton.addEventListener('click', function() {
        printResults();
    });

    function printResults() {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Results</title>
                <link rel="stylesheet" type="text/css" href="styles.css">
                <style>
                    header {
                        background-color: white;
                        color: #51A8B1;
                        padding: 20px;
                        text-align: center;
                    }
                    .logo {
                        width: 150px;
                        height: auto;
                    }
                    .container {
                        width: 100%;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #51A8B1;
                        color: white;
                    }
                    .company-info {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #333;
                        text-align: center;
                    }
                    .company-info a {
                        color: #51A8B1;
                        text-decoration: none;
                    }
                    .company-info a:hover {
                        text-decoration: underline;
                    }
                    .notification {
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #5C0120;
                        color: #FFFFFF;
                        border-radius: 8px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <header>
                    <div class="logo-container">
                        <img src="https://dcdn.mitiendanube.com/stores/001/733/837/themes/amazonas/1-img-934205408-1690839010-8d9b95d5116720928eda0072effd58b91690839011-480-0.png?900093959" alt="Acrisign Logo" class="logo">
                        <h1>Orçamento do Produto</h1>
                    </div>
                </header>
                <div class="container printable">
                    ${document.getElementById('result-table').outerHTML}
                </div>
                <div class="notification">
                    ${document.getElementById('notification').innerHTML}
                </div>
                <div class="company-info">
                    ${document.getElementById('company-info').innerHTML}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
});
