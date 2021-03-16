document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    // const width = 20;
    const width = parseInt(prompt('ESCOLHA O TAMANHO DO SEU GRID: \nPADRÃO:20', "20"))
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
        'green',
        'red',
    ]

    let game_over = false

    const size = 500
    const gridToStyle = document.querySelector('.grid')
    gridToStyle.style.width = `${size}px`
    gridToStyle.style.height = `${size}px`

    let cont1 = 0
    let cont2 = 0
    while (cont1 < width * width) {
        emptyDiv = document.createElement('div')
        grid.appendChild(emptyDiv)
        cont1++
    }

    while (cont2 < width) {
        emptyDiv = document.createElement('div')
        emptyDiv.classList.add('taken')
        grid.appendChild(emptyDiv)
        cont2++
    }

    squares = Array.from(document.querySelectorAll('.grid div'))
    squares.forEach(square => {
        square.style.width = `${size / width}px`
        square.style.height = `${size / width}px`
    })
    // Tetrominos
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const lInvertedTetromino = [
        [1, width + 2, width * 2 + 2, 2],
        [width, width + 1, width + 2, 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width * 2, width, width + 1, width + 2]
    ]

    const zInvertedTetromino = [
        [1, width, width + 1, width * 2],
        [width + 1, width * 2 + 2, width, width * 2 + 1],
        [1, width, width + 1, width * 2],
        [width + 1, width * 2 + 2, width, width * 2 + 1]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, lInvertedTetromino, zInvertedTetromino]


    let currentPosition = Math.floor(width / 2);
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]


    //Desenha os bloquinho
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
            squares[currentPosition + index].style.backgroundImage = `url('./img/${colors[random]}.png')`;
            squares[currentPosition + index].style.backgroundSize = `cover`;
        })
    }

    //Desdesenha os bloquinho
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            // squares[currentPosition + index].style.backgroundColor = ''
            squares[currentPosition + index].style.background = ''
        })
    }

    // Faz os bloquinhos descerem a cada segundo
    let timeInterval = 500
    // timerId = setInterval(moveDown, timeInterval)

    // controles 
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    function moveDown() {
        if (!game_over) {
            undraw()
            currentPosition += width
            draw()
            freeze()
            addScore()
        }
    }


    //Parar no final
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = Math.floor(width / 2)
            draw()
            displayShape()
            gameOver()
        }
    }

    //Movimento sem passar das bordas
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    // rotação da peça
    function rotate() {
        undraw()
        currentRotation++
        //Caso acabe as opções
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // proxima peça no minigrid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    //semrotacao
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
        [1, displayWidth + 2, displayWidth * 2 + 2, 2], //lInvertedTetromino
        [1, displayWidth, displayWidth + 1, displayWidth * 2], //zInvertedTetromino
    ]

    //mostra no na minigrade
    function displayShape() {
        //remove a peça anterior
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.background = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')

            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
            displaySquares[displayIndex + index].style.backgroundImage = `url('./img/${colors[nextRandom]}.png')`;
            displaySquares[displayIndex + index].style.backgroundSize = `cover`;
        })
    }

    //Botão de start
    startBtn.addEventListener('click', () => {
        if (!game_over) {
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            } else {
                draw()
                timerId = setInterval(moveDown, timeInterval)
                nextRandom = Math.floor(Math.random() * theTetrominoes.length)
                displayShape()
            }
        } else {
            game_over = false
        }
    })

    // pontuação
    function addScore() {
        for (let i = 0; i < (squares.length - width - 1); i += width) {
            const row = []
            contBlock = 0
            while (contBlock < width) {
                row.push(i + contBlock)
                contBlock++
            }
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.background = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = `Fim de jogo, sua pontuação foi ${score}`
            clearInterval(timerId)
            game_over = true
        }
    }
})