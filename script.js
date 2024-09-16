let selected = false
let selected_element
let highlighted = {}
let highlights = 0

function select(element) {
    if (selected == false && element.innerHTML) {
        if (element.innerHTML[17] == 'b' && turn == 'black' || element.innerHTML[17] == 'w' && turn == 'white') {
            element.classList.add('selected');
            selected_element = element;
            selected = true;
            highlight_moves();
        }
    }
    else if (element.innerHTML){
        selected_element.classList.remove('selected');
        selected = false;
        // remove highlights
        remove_highlights();
        // if its another element select that element
        if (selected_element.id != element.id) {
            select(element);
        }
    }
}

function highlight_moves() {
    let id = parseInt(selected_element.id);
    let element;
    switch (true) {
        case selected_element.innerHTML == '<img src="Images/blackpawn.png">' || selected_element.innerHTML == '<img src="Images/whitepawn.png">': // if its a pawn
            // check whether it is a black pawn or white pawn and adjust increments
            let leftincrement, rightincrement
            if (selected_element.innerHTML[17] == 'b') {
                // is black
                leftincrement = 9
                rightincrement = 11
                moveincrement = 10
            }
            else {
                // is white
                leftincrement = -11
                rightincrement = -9
                moveincrement = -10
            }
            // Check if it can take a piece
            if (id%10 - 1 >= 1) {
                //check there
                if (document.getElementById(id+leftincrement).innerHTML && document.getElementById(id+leftincrement).innerHTML[17] != selected_element.innerHTML[17]) {
                    element = document.getElementById(id+leftincrement)
                    element.classList.add('red')
                    element.addEventListener("click", moveclick)
                    element.onclick = null
                    highlighted[highlights] = element
                    highlights += 1
                }
            }
            if (id%10 + 1 <=8) {
                //check there
                if (document.getElementById(id+rightincrement).innerHTML && document.getElementById(id+rightincrement).innerHTML[17] != selected_element.innerHTML[17]) {
                    element = document.getElementById(id+rightincrement) 
                    element.classList.add('red')
                    element.addEventListener("click", moveclick)
                    element.onclick = null
                    highlighted[highlights] = element
                    highlights += 1
                }
            }
            
            // Check if able to move twice
            let moves = 1
            if (id <= 18 && id >= 11 && selected_element.innerHTML[17] == 'b' || id <= 68 && id >= 61 && selected_element.innerHTML[17] == 'w') {moves = 2;}
            while (moves > 0) {
                id += moveincrement;
                element = document.getElementById(id)
                if (element.innerHTML) {break;} //if theres something there
                else {
                    element.innerHTML = '<img src = "Images/ball.jpeg">'
                    element.addEventListener("click", moveclick)
                    element.onclick = null
                    highlighted[highlights] = element
                    highlights += 1
                }
                moves -= 1
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackcastle.png">' || selected_element.innerHTML == '<img src="Images/whitecastle.png">': // if its a castle
            // horizontal mapping (right and left)
            full_map(id, 1) 
            full_map(id, -1)
            // horizontal mapping (up and down)
            full_map(id, 10)
            full_map(id, -10)
            break;
        case selected_element.innerHTML == '<img src="Images/blackhorse.png">' || selected_element.innerHTML == '<img src="Images/whitehorse.png">': // if its a horse
            // check all horse angles
            angles = [21, 19, -21, -19, 12, 8, -12, -8];
            for (let i = 0; i < 8; i++) {
                horsecheck(id, angles[i])
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackbishop.png">' || selected_element.innerHTML == '<img src="Images/whitebishop.png">': // if its a bishop
            full_map(id, 11)
            full_map(id, 9)
            full_map(id, -11)
            full_map(id, -9)
            break;
        case selected_element.innerHTML == '<img src="Images/blackqueen.png">' || selected_element.innerHTML == '<img src="Images/whitequeen.png">': // if its a queen
            angles = [1, -1, 10, -10, 11, 9, -11, -9]
            for (let i = 0; i < 8; i++) {
                full_map(id, angles[i])
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackking.png">' || selected_element.innerHTML == '<img src="Images/whiteking.png">': // if its a king
            // Checking if king can move to specified angles
            angles = [1,-1,9,10,11,-9,-10,-11]
            for (let i = 0; i < 8; i++) {
                if ((id + angles[i])/10 <= 7.8 && (id + angles[i])/10 >= 0 && (id + angles[i])%10 <= 8 && (id + angles[i])%10 >= 1) {
                    element = document.getElementById(id + angles[i])
                    if (can_it_move(id, angles[i]) && !document.getElementById(id + angles[i]).innerHTML) {
                        element.innerHTML = '<img src = "Images/ball.jpeg">'
                        element.addEventListener("click", moveclick)
                        element.onclick = null
                        highlighted[highlights] = element
                        highlights += 1
                    }
                    else if (can_it_move(id, angles[i]) && document.getElementById(id + angles[i]).innerHTML[17] != selected_element.innerHTML[17]) {
                        element = document.getElementById(id+angles[i]) 
                        element.classList.add('red')
                        element.addEventListener("click", moveclick)
                        element.onclick = null
                        highlighted[highlights] = element
                        highlights += 1
                    }
                }
            }
            break;
    }
    console.log("highlighted available moves.")
}

function can_it_move(id, increment) {
    let element;
    let tempincrement;
    let tempelement;
    // check if it will be in bounds and whats there is not its color
        if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            let tempid = id + increment;
            // setting temp values which will be switched out
            tempincrement = [-11,-9,9,11];
            for (let i = 0; i < 4; i++) {
                //checks if theres something there before starting
                if ((tempid + tempincrement[i])/10 <= 7.8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])%10 >= 1) {
                    tempelement = document.getElementById(tempid + tempincrement[i])
                    //checking if whats there is a pawn
                    if (tempelement.innerHTML[22] == 'p') {
                        if (tempelement.innerHTML[17] != selected_element.innerHTML[17]) {
                            if (tempelement.innerHTML[17] == 'w') {
                                if (tempincrement[i] == 9 || tempincrement[i] == 11) {
                                    return false;
                                }
                            }
                            else {
                                if (tempincrement[i] == -9 || tempincrement[i] == -11) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }   
        }
        else {
            console.log("é teu parça, não liberado")
            return false;
        }
        // checking for castle/queen horizontal
        tempincrement = [1,-1,10,-10]
        for (let i = 0; i < 4; i++) {
            tempid = id + increment 
            while ((tempid + tempincrement[i])%10 >= 1 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
                if (!document.getElementById(tempid + tempincrement[i]).innerHTML) {
                    tempid += tempincrement[i]
                }
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[17] != selected_element.innerHTML[17]) {
                    element = document.getElementById(tempid + tempincrement[i])
                    if (element.innerHTML[22] == 'c' || element.innerHTML[22] == 'q') {
                        return false;
                    }
                    else {break;}
                }
                else {break;}
            }   
        }
        // checking for bishop/queen angled
        tempincrement = [11,9,-11,-9]
        for (let i = 0; i < 4; i++) {
            tempid = id + increment 
            while ((tempid + tempincrement[i])%10 >= 1 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
                if (!document.getElementById(tempid + tempincrement[i]).innerHTML) {
                    tempid += tempincrement[i]
                }
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[17] != selected_element.innerHTML[17]) {
                    element = document.getElementById(tempid + tempincrement[i])
                    if (element.innerHTML[22] == 'b' || element.innerHTML[22] == 'q') {
                        return false;
                    }
                    else {break;}
                }
                else {break;}
            }   
        }
    return true; // since none of the tests ran false
}

function horsecheck(id, increment) {
    let element;
    if ((id + increment)/10 <= 7.8 && (id + increment)/10 >= 0 && (id + increment)%10 <= 8 && (id + increment)%10 >= 1) {
        if (!document.getElementById(id+increment).innerHTML) {
            element = document.getElementById(id + increment)
            element.innerHTML = '<img src = "Images/ball.jpeg">'
            element.addEventListener("click", moveclick)
            element.onclick = null
            highlighted[highlights] = element
            highlights += 1
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            element = document.getElementById(id + increment)
            element.classList.add('red')
            element.addEventListener("click", moveclick)
            element.onclick = null
            highlighted[highlights] = element
            highlights += 1
        }
    }
    
}

function full_map(id, increment) {
    let element = document.getElementById(id)
    while ((id + increment)%10 >= 1 && (id + increment)%10 <= 8 && (id + increment)/10 >= 0 && (id + increment)/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
        if (!document.getElementById(id + increment).innerHTML) {
            element = document.getElementById(id + increment)
            element.innerHTML = '<img src = "Images/ball.jpeg">'
            element.addEventListener("click", moveclick)
            element.onclick = null
            highlighted[highlights] = element
            highlights += 1
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            element = document.getElementById(id + increment)
            element.classList.add('red')
            element.addEventListener("click", moveclick)
            element.onclick = null
            highlighted[highlights] = element
            highlights += 1
            break;
        }
        else {break;}
        id += increment
    }
}

function moveclick() {
    movepiece(this)
}

function movepiece(element) {
    console.log("moving")
    element.innerHTML = selected_element.innerHTML
    selected_element.innerHTML = ''
    if (turn == 'black') {turn = 'white'; document.getElementById("turn").innerHTML = "White's Turn"}
    else {turn = 'black'; document.getElementById("turn").innerHTML = "Black's Turn"}
    selected_element.classList.remove('selected');
    selected = false;
    // remove highlights
    remove_highlights();
    
}

function remove_highlights() {
    for (let i = 0; i < highlights; i++) {
        highlighted[i].removeEventListener("click", moveclick)
        highlighted[i].onclick = function() {select(this)}
        if (highlighted[i].innerHTML === '<img src="Images/ball.jpeg">') {
            highlighted[i].innerHTML = '' 
        }
        else if (highlighted[i].classList.contains('red')) {
            highlighted[i].classList.remove('red')
        }
    }
}
function setboard() {    
    /* Set Black's Board */
    for (let i = 11; i <= 18; i++) {
        document.getElementById(i).innerHTML = '<img src="Images/blackpawn.png">'
    }  
    document.getElementById("1").innerHTML = '<img src="Images/blackcastle.png">'
    document.getElementById("8").innerHTML = '<img src="Images/blackcastle.png">'

    document.getElementById("2").innerHTML = '<img src="Images/blackhorse.png">'
    document.getElementById("7").innerHTML = '<img src="Images/blackhorse.png">'


    document.getElementById("3").innerHTML = '<img src="Images/blackbishop.png">'
    document.getElementById("6").innerHTML = '<img src="Images/blackbishop.png">'

    document.getElementById("5").innerHTML = '<img src="Images/blackking.png">'
    document.getElementById("4").innerHTML = '<img src="Images/blackqueen.png">'


    /* Set White's Board */
    for (let i = 61; i <= 68; i++) {
        document.getElementById(i).innerHTML = '<img src="Images/whitepawn.png">'
    }  
    document.getElementById("71").innerHTML = '<img src="Images/whitecastle.png">'
    document.getElementById("78").innerHTML = '<img src="Images/whitecastle.png">'

    document.getElementById("72").innerHTML = '<img src="Images/whitehorse.png">'
    document.getElementById("77").innerHTML = '<img src="Images/whitehorse.png">'


    document.getElementById("73").innerHTML = '<img src="Images/whitebishop.png">'
    document.getElementById("76").innerHTML = '<img src="Images/whitebishop.png">'

    document.getElementById("75").innerHTML = '<img src="Images/whiteking.png">'
    document.getElementById("74").innerHTML = '<img src="Images/whitequeen.png">'

    /* Making sure nothing is in the middle */

    for (let i = 21; i <= 28; i++) {
        document.getElementById(i).innerHTML = ''
    }
    for (let i = 31; i <= 38; i++) {
        document.getElementById(i).innerHTML = ''
    }
    for (let i = 41; i <= 48; i++) {
        document.getElementById(i).innerHTML = ''
    }
    for (let i = 51; i <= 58; i++) {
        document.getElementById(i).innerHTML = ''
    }
}
setboard()
let turn = 'white'
document.getElementById("turn").innerHTML = "White's Turn"