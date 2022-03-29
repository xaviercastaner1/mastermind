const colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan']
const svgNS = 'http://www.w3.org/2000/svg'
const x = 400
const y = 500
const attempts = 4
const rows = 9

$(function () {
    let secretCode = generarCombinacio()
    console.log(secretCode)
    let results = []

    let dx = x/7
    let dy = y/12
    let cy = dy * 2

    for (let i = 0; i < rows; i++) {
        let cx = dx * 2
        for (let j = 0; j < attempts; j++) {
            let attemptElement = document.createElementNS(svgNS, 'circle')
            let attemptCircle = $(attemptElement).attr({
                id: `attempt_${8-i}_${j}`,
                cx: `${cx}`,
                cy: `${cy}`,
                r: '5',  
                'stroke-width': '3',
                stroke: 'black',
                fill: 'black'  
            })
            let resultElement = document.createElementNS(svgNS, 'circle')
            let resultCircle = $(resultElement).attr({
                id: `result_${8-i}_${j}`,
                cx: `${cx}`,
                cy: `${cy}`,
                r: '5',  
                'stroke-width': '3',
                stroke: 'black',
                fill: 'black'  
            })
            $('#attempts').append(attemptCircle)
            $('#results').append(resultCircle)
            cx += dx
        }
        cy += dy
    }

    let currentRow = 0
    let currentCol = 0
    let currentPlay = $(`#attempt_${currentRow}_${currentCol}`)

    $("circle[id^='option_']").each(function () {
        $(this).mouseenter(function () {
            $(this).attr('r', '30')
        })

        $(this).mouseout(function () {
            $(this).attr('r', '25')
        })

        $(this).click(function () {
            if (currentCol < attempts) {
                let fill = $(this).attr('fill')
                currentPlay.attr('fill', `${fill}`)
                currentPlay.attr('r', '15')
                currentCol++
                currentPlay = $(`#attempt_${currentRow}_${currentCol}`)
            }
        })
    })

    

    $('#menu_button_check').click(function () {
        if (currentCol === attempts && currentRow < rows) {
            let attempt = $(`circle[id^='attempt_${currentRow}_']`)
            let colors = comprovarColors(attempt)
            let result = comprovar(colors, secretCode)
            console.log(result)
            resultat(result, currentRow)
            currentRow++
            currentCol = 0
            currentPlay = $(`#attempt_${currentRow}_${currentCol}`)
        }
    })

    $('#menu_button_clear').click(function () {
        if (currentCol > 0 && currentCol <= attempts) {
            currentCol--
            currentPlay = $(`#attempt_${currentRow}_${currentCol}`)
            
            currentPlay.attr('r', '5')
            currentPlay.attr('fill', 'black')
        }
    })

    $('#menu_button_new').click(function () {
        if (confirm("Reiniciar partida?")) {
            let attempts = $('[id^=attempt_]')
            let results = $('[id^=result_]')
            attempts.each(function () {
                
                $(this).attr('r', '5')
                $(this).attr('fill', 'black')
            })
            results.each(function () {
                
                $(this).attr('r', '5')
                $(this).attr('fill', 'black')
            })
            currentRow = 0
            currentCol = 0
            currentPlay = $(`#attempt_${currentRow}_${currentCol}`)

            $("#circles").css("display", "block")
            secretCode = generarCombinacio()
            console.log(secretCode)    
        }
        
    })
})


function generarCombinacio() {
    return shuffle(colors).slice(0, attempts)
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}


function comprovarColors(attempt) {
    let colors = []
    attempt.each(function () {
        colors.push($(this).attr('fill'))
    })
    return colors
}


function comprovar(attempt, secretCode) {
    let secretCodeObj = posicio(secretCode)
    let attemptObj = posicio(attempt)

    let result = []

    for (const prop in attemptObj) {
        let attemptPos = attemptObj[prop]['positions']
        let quantity = attemptPos.length
        let isPresent = secretCodeObj[prop] !== undefined
        if (isPresent) {
            let secretCodePos = secretCodeObj[prop]['positions']
            if (attemptPos.join() === secretCodePos.join()) {
                for (let i = 0; i < quantity; i++) result.push(0)
            } else for (let i = 0; i < quantity; i++) result.push(1)
            
        } else {
            for (let i = 0; i < quantity; i++) result.push(2)
        }
    }

    result.sort()

    console.log('result: ', result)

    return result
}


function resultat(result, currentRow) {
    let circles = $(`circle[id^='result_${currentRow}_']`)
    circles.each(function (i) {
        if (result[i] === 0) {
            $(this).attr('fill', 'black').attr('r', '15')
        }
        else if (result[i] === 1) {
            $(this).attr('fill', 'grey').attr('r', '15')
        }
        else {
            $(this).attr('fill', 'black').attr('r', '5')
        } 
    })

    let cont = 0

    result.forEach(el => {
        if(el == 0) cont++
    })

    if (cont == attempts) {
        $("img").css("animation", "shake 0.5s 5")
        $("#circles").css("display", "none")

        $("circle").each(function () {
            $(this).append(
                $(`
                    <animate attributeType="XML" attributeName="y" from="0" to="50"
                    dur="5s" repeatCount="indefinite" begin="indefinite"/>
                `)
            )
        })

        document.querySelectorAll("animate").forEach(animate => {
            animate.beginElement()
        })
    }
}



function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function posicio(arr) {
    let obj = {}
    arr.forEach(function (e, i) {
        if (e in obj) obj[e]['positions'].push(i)
        else obj[e] = {
            positions: [i]
        }
    })
    return obj
}

