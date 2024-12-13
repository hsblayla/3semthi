function modeselect(pmode) {
    hold = document.getElementById('entry').value;
        document.getElementById('entry').value = "";
        mode = pmode;
    }
    function go() {
        switch(mode) {
            case '+':
                result = parseInt(hold) + parseInt(document.getElementById('entry').value);
                break;
            case '-':
                result = parseInt(hold) - parseInt(document.getElementById('entry').value);
                break;
            case 'x':
                result = parseInt(hold) * parseInt(document.getElementById('entry').value);
                break;
            case '/':
                result = parseInt(hold) / parseInt(document.getElementById('entry').value);
                break;
            default:
                result = "";
                break;
        }
        
        mode = ""
        document.getElementById('entry').value = result
    }
    