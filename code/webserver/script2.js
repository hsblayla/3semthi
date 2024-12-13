async function loadResult(a_in, b_in, operation_num) {
    const operationMap = {
        1: 'add',
        2: 'sub',
        3: 'times',
        4: 'div'
    };
    const operation = operationMap[operation_num];
    const url = `http://localhost:3000/${operation}?a=${a_in}&b=${a_in}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if ('Ergebnis' in data) {
            textbox.value = `Ergebnis: ${data.Ergebnis}`;
        } else {
            textbox.value = `Gefilterte Daten:\n${JSON.stringify(data, null, 2)}`;
        }
    } catch (error) {
        textbox.value = `Error: ${error.message}`;
    }
} 