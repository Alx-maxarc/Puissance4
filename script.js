//Deplacement du curseur
document.addEventListener('mousemove', function(e) {
    const triangle = document.getElementById('indicator');
    const containerRect = document.querySelector('.indicator').getBoundingClientRect();
    const xPosition = e.clientX - containerRect.left;

    const minX = 0;
    const maxX = containerRect.width;
    const clampedX = Math.min(Math.max(xPosition, minX), maxX);

    triangle.style.left = clampedX + 'px';
});

//Animation curseur
const buttons = document.querySelectorAll('[id^="button-"]');
const cols = document.querySelectorAll('.col-1');

buttons.forEach((button, index) => {
    button.addEventListener('mouseover', function() {
        const colIndex = index + 1;

        const cols = document.querySelectorAll(`.col-${colIndex}`);

        cols.forEach(col => {
            col.style.boxShadow = '1px 1px 1px 1px rgb(31, 29, 29), inset 0 0 10px 15px rgba(255, 0, 0, 0.1)';
        });    });

    button.addEventListener('mouseout', function() {
        const colIndex = index + 1;

        const cols = document.querySelectorAll(`.col-${colIndex}`);

        cols.forEach(col => {
            col.style.boxShadow = '';
        });
    
    });
});


const gameBoard = document.getElementById('game-board');
let currentPlayer = 'red';



function checkVictory() {
    const directions = [
        [[-1, 0], [1, 0]], // Verticale
        [[0, -1], [0, 1]], // Horizontale
        [[-1, -1], [1, 1]], // Diagonale 
        [[-1, 1], [1, -1]] // Diagonale 
    ];

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const color = gameBoard.rows[row].cells[col].style.backgroundColor;
            if (color !== '') {
                for (const dir of directions) {
                    let count = 1;
                    for (const [dx, dy] of dir) {
                        let i = row + dx;
                        let j = col + dy;
                        while (i >= 0 && i < 6 && j >= 0 && j < 7 && gameBoard.rows[i].cells[j].style.backgroundColor === color) {
                            count++;
                            i += dx;
                            j += dy;
                        }
                    }
                    if (count >= 4) {
                        return true; // Victoire
                    }
                }
            }
        }
    }

    return false; // Pas de victoire
}


// Fonction comportement IA
function IAPlayer() {
    const cells = document.querySelectorAll('#game-board td');
    let yellowFound = false; 
    
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        
        if (cell.style.backgroundColor === 'yellow') {
            yellowFound = true; 
            const row = cell.parentNode.rowIndex; 
            const col = cell.cellIndex; 
             
            if (row > 0 && gameBoard.rows[row - 1].cells[col].style.backgroundColor === '') {
                
                for (let i = cells.length - 1; i >= 0; i--){
                    gameBoard.rows[row - 1].cells[col].style.backgroundColor = 'yellow';        
                    return;} 
            }
            if (col < gameBoard.rows[row].cells.length - 1 && gameBoard.rows[row].cells[col + 1].style.backgroundColor === '') {
                
                for (let i = gameBoard.rows.length - 1; i >= 0; i--) {
                    if (gameBoard.rows[i].cells[col + 1].style.backgroundColor === '') {
                        gameBoard.rows[i].cells[col + 1].style.backgroundColor = 'yellow';
                        return; 
                    }
                }
            }
            else {
                const randomColumn = Math.floor(Math.random() * 7);
                const cells = document.querySelectorAll(`#game-board tr td:nth-child(${randomColumn + 1})`);
        
                for (let i = cells.length - 1; i >= 0; i--) {
                 if (cells[i].style.backgroundColor === '') {
                cells[i].style.backgroundColor = 'yellow';
                return; 
            }
        }
            }
        }
    }

    if (!yellowFound) {
        const randomColumn = Math.floor(Math.random() * 7);
        const cells = document.querySelectorAll(`#game-board tr td:nth-child(${randomColumn + 1})`);
        
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].style.backgroundColor === '') {
                cells[i].style.backgroundColor = 'yellow';
                return; 
            }
        }
    }
}



// Pour placer les jetons
for (let ind = 1; ind <= 7; ind++) {
    const bouton = document.getElementById(`button-${ind}`);
    bouton.addEventListener('click', function() {
        const col = ind - 1; 
        const cells = document.querySelectorAll(`#game-board tr[id^="row"] td:nth-child(${ind})`);
        const allCells = document.querySelectorAll('#game-board td');


        // Parcourir les cellules de bas en haut pour trouver la première case vide
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].style.backgroundColor === '') {
                cells[i].style.backgroundColor = currentPlayer; 
                const row = i; 
                // Vérifier s'il y a une victoire
                if (checkVictory()) {
                    setTimeout(function() {
                    alert(`Vous avez Gagné !`);
                    const counterSpan = document.getElementById('counter-player');
                    let currentValue = parseInt(counterSpan.textContent);
                    currentValue++;
                    counterSpan.textContent = currentValue;
                    allCells.forEach(cell => {
                        cell.style.backgroundColor = '';
                    })},200)
                    ;
                } else {
                    setTimeout(function() {
                        IAPlayer();
                    
                        // Vérification de la victoire IA
                        if (checkVictory()) {
                            setTimeout(function() {

                            alert('Vous avez perdu !');
                            const counterSpan = document.getElementById('counter-IA');
                            let currentValue = parseInt(counterSpan.textContent);
                            currentValue++;
                            counterSpan.textContent = currentValue;
                            // Réinitialisation du jeu après la victoire 
                                allCells.forEach(cell => {
                                    cell.style.backgroundColor = '';
                                });
                            }, 200);
                        }
                    }, 500);
                
                }
                break;
            }
        }
    });
}
