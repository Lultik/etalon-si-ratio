const DoBUTTON = document.querySelector('.btn_do')
const calibratorField = document.querySelector('.select-etalon');
const modeField = document.querySelector('.select-mode');
let calibrator = calibratorField.value;
let minRange, maxRange, stepRange;
let mode = modeField.value;
const resultTable = document.querySelector('.results');


calibratorField.addEventListener('change', () => {
    calibrator = calibratorField.value;
})

modeField.addEventListener('change', () => {
    mode = modeField.value;
    document.querySelector('.si_mode').innerHTML = mode
})



function createPoints() {
    minRange = +document.querySelector('#si_range--min').value;
    maxRange = +document.querySelector('#si_range--max').value;
    stepRange = +document.querySelector('.si_step').value;

    if(/[a-zA-Zа-яА-Я]/.test(minRange)) {
        document.querySelector('#si_range--min').value = '';
        minRange = ''
    }
    if(/[a-zA-Zа-яА-Я]/.test(maxRange)) {
        document.querySelector('#si_range--max').value = '';
        maxRange = ''
    }
    let pointArray = [];
    for (let i = minRange; i <= maxRange; i = i + (maxRange - minRange)*stepRange/100) {
       pointArray.push(i)
    }
    return pointArray;
}

function computeError(formula, D, X) {
    formula = formula.replaceAll(/,/g, '.')
    return eval(formula)
}

function compare(calibrator, point) {
let ratio = 0;
    for ( let [range, formula] of ETALON[calibrator][mode] ) {
        if(point < range) {
            let etalonError = computeError(
                    formula,
                    range,
                    point
                )
            let siError = computeError(
                document.querySelector('.si_error--value').value,
                    maxRange,
                    point
                )
            ratio = siError / etalonError
            let isOk = ratio > 3 ? 'ok' : 'ne Ok'
            return [range, `1:${ratio.toFixed(1)}`, isOk]
        }
    }
}

function addHTML(calibratorRange, point, ratio, res) {
    let row = document.createElement('div');

    row.classList.add('result-row')
    
    let calRange = document.createElement('span');
    calRange.innerText = calibratorRange
    calRange.classList.add('span')
    row.append(calRange);

    let pointCol = document.createElement('span')
    pointCol.innerText = point
    pointCol.classList.add('span')
    row.append(pointCol)

    let ratioCol = document.createElement('span')
    ratioCol.innerText = ratio
    ratioCol.classList.add('span')
    row.append(ratioCol)

    let resCol = document.createElement('span')
    resCol.innerText = res
    resCol.classList.add('span')
    res === 'ok' ? resCol.classList.add('result_positive') : resCol.classList.add('result_negative')
    row.append(resCol)


    resultTable.append(row)
    
}

function createTableHeader () {
    let tableHeader = document.createElement('div');
    tableHeader.classList.add('result-row');

    let calRange = document.createElement('span');
    calRange.innerText = 'Предел измерения'
    calRange.classList.add('span')
    tableHeader.append(calRange);

    let pointCol = document.createElement('span')
    pointCol.innerText = "Точка"
    pointCol.classList.add('span')
    tableHeader.append(pointCol)

    let ratioCol = document.createElement('span')
    ratioCol.innerText = "Соотношение"
    ratioCol.classList.add('span')
    tableHeader.append(ratioCol)

    let resCol = document.createElement('span')
    resCol.innerText = "Вывод"
    resCol.classList.add('span')
    tableHeader.append(resCol)


    resultTable.append(tableHeader)
}

DoBUTTON.addEventListener('click', () => {
   resultTable.innerHTML = ''
    createTableHeader();

    let points = createPoints()
    for(let point = 0; point < points.length; point++) {
        let ratio = compare(calibrator, points[point])
        addHTML(ratio[0], points[point], ratio[1], ratio[2])
    }
})


// computeError(document.querySelector('.si_error--value').value, points[points.length-1], points[i])
