let selected = false
let selected_element
let highlighted = {}
let highlights = 0
let incheck
let incheckcolor;
const boxes = document.getElementsByClassName("box")
const boxeslength = boxes.length
let checking_piece

function select(element, action) {
        if (selected == false && element.innerHTML) {
            //if (element.innerHTML[17] == 'b' && turn == 'black' || element.innerHTML[17] == 'w' && turn == 'white') {
                element.classList.add('selected');
                selected_element = element;
                selected = true;
                highlight_moves(action);
            //}
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

function highlight_moves(action) {
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
            if (action == 'attack' || action == null) {
                if (id%10 - 1 >= 1) {
                    //check there
                    if (id + leftincrement <= 78 && id + leftincrement >= 1 && document.getElementById(id+leftincrement).innerHTML && document.getElementById(id+leftincrement).innerHTML[17] != selected_element.innerHTML[17]) {
                        if (action == 'attack' && document.getElementById(id+leftincrement) == checking_piece || action == null) {
                            element = document.getElementById(id+leftincrement)
                            element.classList.add('red')
                            element.addEventListener("click", moveclick)
                            element.onclick = null
                            highlighted[highlights] = element
                            highlights += 1
                        }
                    }
                }
                if (id%10 + 1 <=8) {
                    //check there
                    if (id + rightincrement <= 78 && id + rightincrement >= 1 &&document.getElementById(id+rightincrement).innerHTML && document.getElementById(id+rightincrement).innerHTML[17] != selected_element.innerHTML[17]) {
                        if (action == 'attack' && document.getElementById(id+rightincrement) == checking_piece || action == null) {
                            console.log("hi1")
                            element = document.getElementById(id+rightincrement) 
                            element.classList.add('red')
                            element.addEventListener("click", moveclick)
                            element.onclick = null
                            highlighted[highlights] = element
                            highlights += 1
                        }
                    }
                }
            }
            
            // Check if able to move twice
            if (action == 'move' || action == null) {
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
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackcastle.png">' || selected_element.innerHTML == '<img src="Images/whitecastle.png">': // if its a castle
            // horizontal mapping (right and left)
            full_map(id, 1, action) 
            full_map(id, -1, action)
            // horizontal mapping (up and down)
            full_map(id, 10, action)
            full_map(id, -10, action)
            break;
        case selected_element.innerHTML == '<img src="Images/blackhorse.png">' || selected_element.innerHTML == '<img src="Images/whitehorse.png">': // if its a horse
            // check all horse angles
            angles = [21, 19, -21, -19, 12, 8, -12, -8];
            for (let i = 0; i < 8; i++) {
                horsecheck(id, angles[i], action)
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackbishop.png">' || selected_element.innerHTML == '<img src="Images/whitebishop.png">': // if its a bishop
            full_map(id, 11, action)
            full_map(id, 9, action)
            full_map(id, -11, action)
            full_map(id, -9, action)
            break;
        case selected_element.innerHTML == '<img src="Images/blackqueen.png">' || selected_element.innerHTML == '<img src="Images/whitequeen.png">': // if its a queen
            angles = [1, -1, 10, -10, 11, 9, -11, -9]
            for (let i = 0; i < 8; i++) {
                full_map(id, angles[i], action)
            }
            break;
        case selected_element.innerHTML == '<img src="Images/blackking.png">' || selected_element.innerHTML == '<img src="Images/whiteking.png">': // if its a king
            // Checking if king can move to specified angles
            angles = [1,-1,9,10,11,-9,-10,-11]
            for (let i = 0; i < 8; i++) {
                if ((id + angles[i])/10 <= 7.8 && (id + angles[i])/10 >= 0 && (id + angles[i])%10 <= 8 && (id + angles[i])%10 >= 1) {
                    element = document.getElementById(id + angles[i])
                    if (can_king_move(id, angles[i]) && !document.getElementById(id + angles[i]).innerHTML) {
                        element.innerHTML = '<img src = "Images/ball.jpeg">'
                        element.addEventListener("click", moveclick)
                        element.onclick = null
                        highlighted[highlights] = element
                        highlights += 1
                    }
                    else if (can_king_move(id, angles[i]) && document.getElementById(id + angles[i]).innerHTML[17] != selected_element.innerHTML[17]) {
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

function can_king_move(id, increment) {
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
            return false;
        }
        // check for queen/castle/bishop
        if (!can_it_move_check([1,-1,10,-10], id, increment, ['c', 'q'])) {return false; } // castle/queen horizontal check
        if (!can_it_move_check([11,9,-11,-9], id, increment, ['b', 'q'])) {return false; } // bishop/queen 45 check
        // check for horse
        tempincrement = [21, 19, -21, -19, 12, 8, -12, -8];
        for (let i = 0; i < 8; i++) {
            tempid = id + increment
            if ((tempid + tempincrement[i])%10 >= 1 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])/10 <= 7.8) {
                if (!document.getElementById(tempid + tempincrement[i]).innerHTML) {}
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[22] == 'h' && document.getElementById(tempid + tempincrement[i]).innerHTML[17] != selected_element.innerHTML[17]) {
                    return false;
                }
            }
            
        }
        // check for opposing king
        tempincrement = [-9,-10,-11,-1,1,9,10,11];
        for (let i = 0; i < 8; i++) {
            tempid = id + increment
            for (let j = 0; j < 8; j++) {
                if ((tempid + tempincrement[j])%10 >= 1 && (tempid + tempincrement[j])%10 <= 8 && (tempid + tempincrement[j])/10 >= 0 && (tempid + tempincrement[j])/10 <= 7.8) {
                    if (!document.getElementById(tempid + tempincrement[j]).innerHTML) {}
                    else if (document.getElementById(tempid + tempincrement[j]).innerHTML[22] == 'k' && document.getElementById(tempid + tempincrement[j]) != selected_element) {
                        return false;
                    }
                }
            }
        }
    return true; // since none of the tests ran false
}

function can_it_move_check(tempincrement, id, increment, char) {
        for (let i = 0; i < 4; i++) {
            tempid = id + increment // sets a tempid to check boxes
            while ((tempid + tempincrement[i])%10 >= 1 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
                if (!document.getElementById(tempid + tempincrement[i]).innerHTML || document.getElementById(tempid + tempincrement[i]) == selected_element) {
                    tempid += tempincrement[i] //if theres nothing in box, go to next box
                }
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[17] != selected_element.innerHTML[17]) { // checks if whats in there is of same team
                    element = document.getElementById(tempid + tempincrement[i])
                    if (element.innerHTML[22] == char[0] || element.innerHTML[22] == char[1]) { 
                        return false; // if not and its a queen/"char" (depends on what its checking) return false, it cannot go there
                    }
                    else {break;} // if theres something there that is not hostile theres no reason to look further as its practically a shield
                }
                else {break;}
            }   
        }
        return true;
}

function horsecheck(id, increment, action) {
    let element;
    if ((id + increment)/10 <= 7.8 && (id + increment)/10 >= 0 && (id + increment)%10 <= 8 && (id + increment)%10 >= 1) {
        if (!document.getElementById(id+increment).innerHTML) {
            if (action == null || action == 'move') {
                element = document.getElementById(id + increment)
                element.innerHTML = '<img src = "Images/ball.jpeg">'
                element.addEventListener("click", moveclick)
                element.onclick = null
                highlighted[highlights] = element
                highlights += 1
            }
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            if (action == null || action == 'attack' && document.getElementById(id + increment) == checking_piece) {
                element = document.getElementById(id + increment)
                element.classList.add('red')
                element.addEventListener("click", moveclick)
                element.onclick = null
                highlighted[highlights] = element
                highlights += 1
            }
        }
    }
    
}

function full_map(id, increment, action) {
    let element = document.getElementById(id)
    while ((id + increment)%10 >= 1 && (id + increment)%10 <= 8 && (id + increment)/10 >= 0 && (id + increment)/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
        if (!document.getElementById(id + increment).innerHTML) {
            if (action == null || action == 'move') {
                element = document.getElementById(id + increment)
                element.innerHTML = '<img src = "Images/ball.jpeg">'
                element.addEventListener("click", moveclick)
                element.onclick = null
                highlighted[highlights] = element
                highlights += 1
            }
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            if (action == null || action == 'attack' && document.getElementById(id + increment) == checking_piece) {
                element = document.getElementById(id + increment)
                element.classList.add('red')
                element.addEventListener("click", moveclick)
                element.onclick = null
                highlighted[highlights] = element
                highlights += 1
                break;
            }
        }
        else {break;}
        id += increment
    }
}

function moveclick() {
    movepiece(this)
}

function movepiece(element) {
    if (incheck) {
        incheck = null;
        for (let i = 0; i < boxeslength; i++) {
            boxes[i].onclick = function() {
                select(this)
            }
        }
    }
    console.log("moving")
    element.innerHTML = selected_element.innerHTML
    element.onclick = function() {select(this)}
    selected_element.innerHTML = ''
    if (turn == 'black') {turn = 'white'; document.getElementById("turn").innerHTML = "White's Turn"}
    else {turn = 'black'; document.getElementById("turn").innerHTML = "Black's Turn"}
    selected_element.classList.remove('selected');
    selected = false;
    // remove highlights
    remove_highlights();
    // check if any of the 2 kings are in check
    for (let i = 0; i < boxeslength; i++) {
        if (boxes[i].innerHTML) {
            if (boxes[i].innerHTML[22] == 'k') {
                if (isincheck(boxes[i])) {
                    console.log("is in check " + incheck)
                }
            }
        }
    }
    if (incheck) {
        checking_piece = element // saving the piece which is commiting the check
        console.log("incheck: " + incheck)
        let kingcantmove = false;
        // check if king can move
        let angles = [1,-1,9,10,11,-9,-10,-11]
        let falses = 0
        let id = parseInt(selected_element.id)
        for (let i = 0; i < 8; i++) {
            if ((id + angles[i])/10 <= 7.8 && (id + angles[i])/10 >= 0 && (id + angles[i])%10 <= 8 && (id + angles[i])%10 >= 1) {
                element = document.getElementById(id + angles[i])
                if (can_king_move(id, angles[i])) {

                }
                else {falses++}
            }
            else {falses++}
        }
        //remove the onclick/event attribute of everyone 
        for (let i = 0; i < boxeslength; i++) {
            boxes[i].onclick = null
        }
        console.log(falses)
        if (falses == 8) {
            kingcantmove = true
        }
        else {
            selected_element.onclick = function() {
                select(this)
            }
        }
        // if something can attack it
        console.log(can_someone_go_here(parseInt(checking_piece.id), incheck) + " someone can/cant go there")
        console.log(kingcantmove)
        if (can_someone_go_here(parseInt(checking_piece.id), incheck) || !kingcantmove) {} 
        else {
            if (incheck == 'w') {
                alert("Checkmate, Black won!")
            }
            else {
                alert("Checkmate, White won!")
            }
            startgame()
        }     
    }
}

function isincheck(king) {
    const king_team = king.innerHTML[17]
    const kingid = parseInt(king.id)
    let tempincrement
    let tempelement
    let checkingfor
    let amount
    // reverse engineer the king to see if anything targets it
    //check for pawns
    if (king_team == 'w') {
        tempincrement = [-9,-11]
        checkingfor = 'p'
        amount = 2
    }
    else {
        tempincrement = [9,11]
        checkingfor = 'p'
        amount = 2
    }
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < amount; i++) {
            if ((kingid + tempincrement[i])/10 <= 7.8 && (kingid + tempincrement[i])/10 >= 0 && (kingid + tempincrement[i])%10 <= 8 && (kingid + tempincrement[i])%10 >= 1) {
                tempelement = document.getElementById(kingid + tempincrement[i])
                if (tempelement.innerHTML[22] == checkingfor && tempelement.innerHTML[17] != king_team) {
                    incheck = king_team
                    selected_element = king
                    return incheck
                }
            }
        }
        tempincrement = [21, 19, -21, -19, 12, 8, -12, -8]
        checkingfor = 'h'
        amount = 8
    }
    // check for castle/queen horizontal and bishop/queen 45
    tempincrement = [1,-1,10,-10]
    checkingfor = ['c', 'q']
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 4; i++) {
            tempelement = king
            console.log()
            while ((parseInt(tempelement.id) + tempincrement[i])/10 <= 7.8 && (parseInt(tempelement.id) + tempincrement[i])/10 >= 0 && (parseInt(tempelement.id) + tempincrement[i])%10 <= 8 && (parseInt(tempelement.id) + tempincrement[i])%10 >= 1) {
                tempelement = document.getElementById(parseInt(tempelement.id) + tempincrement[i])
                if (tempelement.innerHTML) {
                    if (tempelement.innerHTML[17] != king_team) {
                        if (tempelement.innerHTML[22] == checkingfor[0] || tempelement.innerHTML[22] == checkingfor[1]) {
                            incheck = king_team
                            selected_element = king
                            return incheck
                        }
                        else {break;}
                    }
                    else {break;}
                }

            }
        }
        tempincrement = [11,9,-11,-9]
        checkingfor = ['b', 'q']
    }
}
function startgame() {
    setboard()
    let turn = 'white'
    document.getElementById("turn").innerHTML = "White's Turn"
    for (let i = 0; i < boxeslength; i++) {
        boxes[i].onclick = function() {
            select(this)
        }
    }
}
function can_someone_go_here(tempid, checked_team) {
    //make sure to make EVERYONE who can go there able to move, not just 1 piece and stop
    let element;
    let tempincrement;
    let tempelement;
    let canit = false
        if (document.getElementById(tempid).innerHTML) {
            if (checked_team == 'b') {
                tempincrement = [-9,-11];
            }
            else {
                tempincrement = [11,9];
            }
            for (let i = 0; i < 2; i++) {
                //checks if it can go there before starting
                if ((tempid + tempincrement[i])/10 <= 7.8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])%10 >= 1) {
                    tempelement = document.getElementById(tempid + tempincrement[i])
                    //checking if whats there is a pawn
                    if (tempelement.innerHTML[22] == 'p') {
                        if (tempelement.innerHTML[17] == checked_team) {
                            if (tempelement.innerHTML[17] == 'w') {
                                if (tempincrement[i] == 9 || tempincrement[i] == 11) {
                                    tempelement.onclick = function() {
                                        select(this, 'attack')
                                    }
                                    canit = true
                                }
                            }
                            else {
                                if (tempincrement[i] == -9 || tempincrement[i] == -11) {
                                    tempelement.onclick = function() {
                                        select(this, 'attack')
                                    }
                                    canit = true
                                }
                            }
                        }
                    }
                }
            }   
        }
        else {
            if (checked_team == 'b') {tempincrement = [-10, -20]}
            if (checked_team == 'w') {tempincrement = [10, 20]}
            element = document.getElementById(tempid + tempincrement[0])
            if (element.innerHTML && element.innerHTML[17] == checked_team && element.innerHTML[22] == 'p') {
                element.onclick = function() {
                    select(this, 'attack')
                }
                canit = true
            }
            else if (!element.innerHTML && tempid >= 31 && tempid <= 38) {
                element = document.getElementById(tempid + tempincrement[1]) 

                if (element.innerHTML && element.innerHTML[17] == checked_team && element.innerHTML[22] == 'p') {
                    element.onclick = function() {
                        select(this, 'attack')
                    }
                    canit = true
                }
            }
        }
        // check for queen/castle/bishop
        tempincrement = [1,-1,10,-10] // checks for castle/queen horizontal
        let checkfor = ['c', 'q']
        for (let i = 0; i < 2; i++) { // loops twice for horizontal and 45
            for (let j = 0; j < 4;j++) { // loops 4 times for the 4 directions of each
                element = document.getElementById(tempid)
                while ((parseInt(element.id) + tempincrement[j])%10 >= 1 && (parseInt(element.id) + tempincrement[j])%10 <= 8 && (parseInt(element.id) + tempincrement[j])/10 >= 0 && (parseInt(element.id) + tempincrement[j])/10 <= 7.8) {
                    element = document.getElementById(parseInt(element.id) + tempincrement[j])
                    if (element.innerHTML) {
                        if (element.innerHTML[22] == checkfor[0]  && element.innerHTML[17] == checked_team|| element.innerHTML[22] == checkfor[1] && element.innerHTML[17] == checked_team) {
                            element.onclick = function() {
                                select(this, 'attack')
                            }
                            canit = true
                            
                        }
                        else {break;}
                    }
                }
            }
            tempincrement = [11,9,-11,-9] // checks for bishop/queen 45
            checkfor = ['b', 'q']
        }
        // check for horse
        tempincrement = [21, 19, -21, -19, 12, 8, -12, -8];
        for (let i = 0; i < 8; i++) {
            if ((tempid + tempincrement[i])%10 >= 1 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])/10 <= 7.8) {
                if (!document.getElementById(tempid + tempincrement[i]).innerHTML) {}
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[22] == 'h' && document.getElementById(tempid + tempincrement[i]).innerHTML[17] == checked_team) {
                    document.getElementById(tempid + tempincrement[i]).onclick = function() {
                        select(this, 'attack')
                    }
                    canit = true
                }
            }
        }
    return canit; // since none of the tests ran true
}

function remove_highlights() {
    for (let i = 0; i < highlights; i++) {
        highlighted[i].removeEventListener("click", moveclick)
        if (highlighted[i].innerHTML === '<img src="Images/ball.jpeg">') {
            highlighted[i].innerHTML = '' 
        }
        else if (highlighted[i].classList.contains('red')) {
            highlighted[i].classList.remove('red')
            highlighted[i].onclick = function () {
                select(this)
            }
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
startgame()