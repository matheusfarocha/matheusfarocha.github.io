let selected = false
let selected_element
let highlighted = {}
let highlights = 0
let incheck
let incheckcolor;
const boxes = document.getElementsByClassName("box")
const boxeslength = boxes.length
let checking_piece
let turn
let attackandmove = 0
let moveandattack
let diditalreadycomehere = false
let dictionarym = {};
let dictionarya = {};
let piecesforsave = []
let piecesaction = {}
let piecescountforsave = 0
let leftblackcastle = true
let rightblackcastle = true
let leftwhitecastle = true
let rightwhitecastle = true
let blackkingdidntmove = true
let whitekingdidntmove = true


function select(element, action, moveto_location) {
        if (action && selected != true) {
            selected_element = element;
            if (action == 'attack') {
                highlight_moves(action, moveto_location);
            }
            else if (action == 'move') {
                let length = moveto_location.length
                for (let i = 0; i < length; i++) {
                    highlight_moves(action, moveto_location[0][i]);
                }
            }
            else if (action == 'both') {
                let length = moveto_location.length
                for (let i = 0; i < length; i++) {
                    highlight_moves('move', moveto_location[1][i]);
                }
                highlight_moves('attack', moveto_location[0]);
            }
            selected = true; 
        }
        else if (selected == false && element.innerHTML) {
            if (element.innerHTML[17] == 'b' && turn == 'black' || element.innerHTML[17] == 'w' && turn == 'white') {
                element.classList.add('selected');
                selected_element = element;
                selected = true;
                highlight_moves(action,moveto_location);
                moveandattack = action
            }
        }
        else if (element.innerHTML){
            selected_element.classList.remove('selected');
            selected = false;
            // remove highlights
            remove_highlights();
            // if its another element select that element
            if (selected_element.id != element.id) {
                select(element, action, moveto_location);
            }
        }
}

function highlight_moves(action,location) {
    let id = parseInt(selected_element.id);
    let element;
    switch (true) {
        case selected_element.innerHTML[22] == 'p': // if its a pawn
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
                            if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                                element.classList.add('red')
                                element.addEventListener("click", moveclick)
                                element.onclick = null
                                highlighted[highlights] = element
                                highlights += 1
                            }
                        }
                    }
                }
                if (id%10 + 1 <=8) {
                    //check there
                    if (id + rightincrement <= 78 && id + rightincrement >= 1 &&document.getElementById(id+rightincrement).innerHTML && document.getElementById(id+rightincrement).innerHTML[17] != selected_element.innerHTML[17]) {
                        if (action == 'attack' && document.getElementById(id+rightincrement) == checking_piece || action == null) {
                            element = document.getElementById(id+rightincrement) 
                            if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                                element.classList.add('red')
                                element.addEventListener("click", moveclick)
                                element.onclick = null
                                highlighted[highlights] = element
                                highlights += 1
                            }
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
                        if (element == location || location == null) {
                            if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                                element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                                element.addEventListener("click", moveclick)
                                element.onclick = null
                                highlighted[highlights] = element
                                highlights += 1
                            }
                        }
                    }
                    moves -= 1
                }
            }
            break;
        case selected_element.innerHTML[22] == 'c': // if its a castle
            // horizontal mapping (right and left)
            full_map(id, 1, action, location) 
            full_map(id, -1, action, location)
            // horizontal mapping (up and down)
            full_map(id, 10, action, location)
            full_map(id, -10, action, location)
            break;
        case selected_element.innerHTML[22] == 'h': // if its a horse
            // check all horse angles
            angles = [21, 19, -21, -19, 12, 8, -12, -8];
            for (let i = 0; i < 8; i++) {
                horsecheck(id, angles[i], action, location)
            }
            break;
        case selected_element.innerHTML[22] == 'b': // if its a bishop
            full_map(id, 11, action, location)
            full_map(id, 9, action, location)
            full_map(id, -11, action, location)
            full_map(id, -9, action, location)
            break;
        case selected_element.innerHTML[22] == 'q': // if its a queen
            angles = [1, -1, 10, -10, 11, 9, -11, -9]
            for (let i = 0; i < 8; i++) {
                full_map(id, angles[i], action, location)
            }
            break;
        case selected_element.innerHTML[22] == 'k': // if its a king
            // Checking if king can move to specified angles
            angles = [1,-1,9,10,11,-9,-10,-11]
            for (let i = 0; i < 8; i++) {
                if ((id + angles[i])/10 <= 7.8 && (id + angles[i])/10 >= 0 && (id + angles[i])%10 <= 8 && (id + angles[i])%10 >= 1) {
                    element = document.getElementById(id + angles[i])
                    if (can_king_move(id, angles[i]) && !document.getElementById(id + angles[i]).innerHTML) {
                        element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
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
            if (!incheck) {
                if (selected_element.innerHTML[17] == 'w' && whitekingdidntmove) {
                    if (rightwhitecastle) {
                        if (document.getElementById(76).innerHTML == '<img src="Images/ball.jpeg" draggable="false">' && !document.getElementById(77).innerHTML) {
                            // check if king can move to 76 and 77
                            if (can_king_move(75, 2)) {
                                // make castling available with a eventlistener for leftwhite
                                element = document.getElementById(77)
                                element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                                element.onclick = function () {
                                    castle(this)
                                }
                                highlighted[highlights] = element
                                highlights += 1
                            }

                        }
                    }
                    if (leftwhitecastle) {
                        if (!document.getElementById(72).innerHTML && !document.getElementById(73).innerHTML && document.getElementById(74).innerHTML == '<img src="Images/ball.jpeg" draggable="false">') {
                            // check if king can move to 73 and 74
                            if (can_king_move(75, -2)) {
                                // making castling available with eventlistener for leftwhite
                                element = document.getElementById(73)
                                element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                                element.onclick = function () {
                                    castle(this)
                                }
                                highlighted[highlights] = element
                                highlights += 1
                            }
                        }
                    }
                }
                else if (selected_element.innerHTML[17] == 'b' && blackkingdidntmove) {
                    if (rightblackcastle) {
                        if (document.getElementById(6).innerHTML == '<img src="Images/ball.jpeg" draggable="false">' && !document.getElementById(7).innerHTML) {
                            // check if king can move to 76 and 77
                            if (can_king_move(5, 2)) {
                                // make castling available with a eventlistener for leftwhite
                                element = document.getElementById(7)
                                element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                                element.onclick = function () {
                                    castle(this)
                                }
                                highlighted[highlights] = element
                                highlights += 1
                            }

                        }
                    }
                    if (leftblackcastle) {
                        if (!document.getElementById(2).innerHTML && !document.getElementById(3).innerHTML && document.getElementById(4).innerHTML == '<img src="Images/ball.jpeg" draggable="false">') {
                            // check if king can move to 73 and 74
                            if (can_king_move(5, -2)) {
                                // making castling available with eventlistener for leftwhite
                                element = document.getElementById(3)
                                element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                                element.onclick = function () {
                                    castle(this)
                                }
                                highlighted[highlights] = element
                                highlights += 1
                            }
                        }
                    }
                }
            }
            break;
    }
    //console.log("highlighted available moves.")
}

function castle(event) {
    let temp
    selected_element.classList.remove('selected');
    selected = false
    remove_highlights()
    event.onclick = function () {select(this)}
    switch (true) {
        case event.id == '77':
            temp = document.getElementById(78).innerHTML
            document.getElementById(77).innerHTML = document.getElementById(75).innerHTML
            document.getElementById(75).innerHTML = ''
            document.getElementById(76).innerHTML = temp
            document.getElementById(78).innerHTML = ''
            document.getElementById(76).onclick = function () {select(this)}
            whitekingdidntmove = false
            checking_piece = document.getElementById(74)
            break;
        case event.id == '73':
            temp = document.getElementById(71).innerHTML
            document.getElementById(73).innerHTML = document.getElementById(75).innerHTML
            document.getElementById(75).innerHTML = ''
            document.getElementById(74).innerHTML = temp
            document.getElementById(71).innerHTML = ''
            document.getElementById(74).onclick = function () {select(this)}
            checking_piece = document.getElementById(74)
            whitekingdidntmove = false
            break;
        case event.id == '7':
            temp = document.getElementById(8).innerHTML
            document.getElementById(7).innerHTML = document.getElementById(5).innerHTML
            document.getElementById(5).innerHTML = ''
            document.getElementById(6).innerHTML = temp
            document.getElementById(8).innerHTML = ''
            document.getElementById(6).onclick = function () {select(this)}
            checking_piece = document.getElementById(6)
            blackkingdidntmove = false
            break;
        case event.id == '3':
            temp = document.getElementById(1).innerHTML
            document.getElementById(3).innerHTML = document.getElementById(5).innerHTML
            document.getElementById(5).innerHTML = ''
            document.getElementById(4).innerHTML = temp
            document.getElementById(1).innerHTML = ''
            document.getElementById(4).onclick = function () {select(this)}
            checking_piece = document.getElementById(4)
            blackkingdidntmove = false
            break;
    }
    if (turn == 'black') {turn = 'white'; document.getElementById("turn").innerHTML = "White's Turn"}
    if (turn == 'white') {turn = 'black'; document.getElementById("turn").innerHTML = "Black's Turn"}
    checkforcheck()
}
function will_king_be_in_danger(moving_location, team, moving_piece) {
    // find their king using boxes
    let king; let tempid; let tempincrement; let tempelement
    for (let i = 0; i < boxeslength; i++) {
        if (boxes[i].innerHTML[22] == 'k' && boxes[i].innerHTML[17] == team) {
            king = boxes[i]
            break;
        }
    }
    tempincrement = [10,-10,1,-1]
    checkingfor = ['q','c']
    // write a for loop that checks if king will be in view of queen/castle/bishop and ignores the moving_piece when looking at it
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            tempid = parseInt(king.id)
            while ((tempid + tempincrement[j])/10 <= 7.8 && (tempid + tempincrement[j])/10 >= 0 && (tempid + tempincrement[j])%10 <= 8 && (tempid + tempincrement[j])%10 >= 1) {
                tempelement = document.getElementById(tempid + tempincrement[j]);
                if (tempelement.innerHTML && tempelement != moving_piece && tempelement != moving_location && tempelement.innerHTML != '<img src="Images/ball.jpeg" draggable="false">') {
                    if (tempelement.innerHTML[17] != team) {
                        if (tempelement.innerHTML[22] == checkingfor[0] || tempelement.innerHTML[22] == checkingfor[1]) {
                            return true;
                        }
                        else {break;}
                    }
                    else {break;}
                }
                else if (tempelement == moving_location) {
                    break;
                }
                tempid += tempincrement[j]
                
            }
        }
        tempincrement = [9,-9,11,-11]
        checkingfor = ['q', 'b']
    }
    return false;
}

function can_king_move(id, increment) {
    let king = document.getElementById(id)
    let element;
    let tempincrement;
    let tempelement;
    // check if it will be in bounds and whats there is not its color
        if (document.getElementById(id + increment).innerHTML[17] != king.innerHTML[17]) {
            let tempid = id + increment;
            // setting temp values which will be switched out
            tempincrement = [-11,-9,9,11];
            for (let i = 0; i < 4; i++) {
                //checks if theres something there before starting
                if ((tempid + tempincrement[i])/10 <= 7.8 && (tempid + tempincrement[i])/10 >= 0 && (tempid + tempincrement[i])%10 <= 8 && (tempid + tempincrement[i])%10 >= 1) {
                    tempelement = document.getElementById(tempid + tempincrement[i])
                    //checking if whats there is a pawn
                    if (tempelement.innerHTML[22] == 'p') {
                        if (tempelement.innerHTML[17] != king.innerHTML[17]) {
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
                else if (document.getElementById(tempid + tempincrement[i]).innerHTML[22] == 'h' && document.getElementById(tempid + tempincrement[i]).innerHTML[17] != king.innerHTML[17]) {
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
                    else if (document.getElementById(tempid + tempincrement[j]).innerHTML[22] == 'k' && document.getElementById(tempid + tempincrement[j]) != king) {
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

function horsecheck(id, increment, action, location) {
    let element;
    if ((id + increment)/10 <= 7.8 && (id + increment)/10 >= 0 && (id + increment)%10 <= 8 && (id + increment)%10 >= 1) {
        if (!document.getElementById(id+increment).innerHTML) {
            if (action == null || action == 'move') {
                element = document.getElementById(id + increment)
                if (element == location || location == null) {
                    if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                        element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                        element.addEventListener("click", moveclick)
                        element.onclick = null
                        highlighted[highlights] = element
                        highlights += 1
                    }
                }
            }
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            if (action == null || action == 'attack' && document.getElementById(id + increment) == checking_piece) {
                element = document.getElementById(id + increment)
                if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                    element.classList.add('red')
                    element.addEventListener("click", moveclick)
                    element.onclick = null
                    highlighted[highlights] = element
                    highlights += 1
                }
            }
        }
    }
    
}

function full_map(id, increment, action, location) {
    let element = document.getElementById(id)
    while ((id + increment)%10 >= 1 && (id + increment)%10 <= 8 && (id + increment)/10 >= 0 && (id + increment)/10 <= 7.8) { //7.8 because the last value of table/10 is 7.8
                
        if (!document.getElementById(id + increment).innerHTML) {
            if (action == null || action == 'move') {
                element = document.getElementById(id + increment)
                if (element == location || location == null) {
                    if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                        element.innerHTML = '<img src="Images/ball.jpeg" draggable="false">'
                        element.addEventListener("click", moveclick)
                        element.onclick = null
                        highlighted[highlights] = element
                        highlights += 1
                    }
                }
            }
        }
        else if (document.getElementById(id + increment).innerHTML[17] != selected_element.innerHTML[17]) {
            if (action == null || action == 'attack' && document.getElementById(id + increment) == checking_piece) {
                element = document.getElementById(id + increment)
                if (!will_king_be_in_danger(element, selected_element.innerHTML[17], selected_element)) {
                    element.classList.add('red')
                    element.addEventListener("click", moveclick)
                    element.onclick = null
                    highlighted[highlights] = element
                    highlights += 1
                    break;
                }
            }
        }
        else {break;}
        id += increment
    }
}


function move() {
    select(this, 'move', dictionarym[this.id]);
}

function attack() {
    select(this, 'attack', dictionarya[this.id]);
}

function both() {
    let dictionary = [dictionarya[this.id], dictionarym[this.id]]
    select(this, 'both', dictionary);
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
            if (boxes[i].classList.contains('blue')) {
                boxes[i].classList.remove('blue')
            }
            boxes[i].removeEventListener('click', move)
            boxes[i].removeEventListener('click', attack)
            boxes[i].removeEventListener('click', both)
        }
    }
    //console.log("moving")
    element.innerHTML = selected_element.innerHTML
    element.onclick = function() {select(this)}
    selected_element.innerHTML = ''
    if (turn == 'black') {
        turn = 'white' 
        document.getElementById("turn").innerHTML = "White's Turn"
        if (element.innerHTML[22] == 'c' || element.innerHTML[22] == 'k') {
            switch (blackkingdidntmove && rightblackcastle || blackkingdidntmove && leftblackcastle) {
                case element.innerHTML[22] == 'c':
                    if (selected_element.id == '8') {
                        rightblackcastle = false
                    }
                    else if (selected_element.id =='1') {
                        leftblackcastle = false
                    }
                    break;
                case element.innerHTML[22] == 'k':
                    blackkingdidntmove = false
            }
        }
    }
    else {
        turn = 'black'; 
        document.getElementById("turn").innerHTML = "Black's Turn"
        if (element.innerHTML[22] == 'c' || element.innerHTML[22] == 'k') {
            switch (whitekingdidntmove && rightwhitecastle || whitekingdidntmove && leftwhitecastle) {
                case element.innerHTML[22] == 'c':
                    if (selected_element.id == '78') {
                        rightwhitecastle = false
                    }
                    else if (selected_element.id == '71') {
                        leftwhitecastle = false
                    }
                    break;
                case element.innerHTML[22] == 'k':
                    whitekingdidntmove = false
            }
        }
    }
    selected_element.classList.remove('selected');
    selected = false;
    if (element.innerHTML[22] == 'p') {
        if (element.id >= 71 && element.id <= 78 || element.id >= 1 && element.id <= 8) {
            if (element.innerHTML[17] == 'w') {
                document.getElementById("queen").innerHTML = '<img src="Images/whitequeen.png" draggable="false">'
                document.getElementById("castle").innerHTML = '<img src="Images/whitecastle.png" draggable="false">'
                document.getElementById("horse").innerHTML = '<img src="Images/whitehorse.png" draggable="false">'
                document.getElementById("bishop").innerHTML = '<img src="Images/whitebishop.png" draggable="false">'
                document.getElementById("queen").onclick = function () {
                    change(element, '<img src="Images/whitequeen.png" draggable="false">')
                }
                document.getElementById("castle").onclick = function () {
                    change(element, '<img src="Images/whitecastle.png" draggable="false">')
                }
                document.getElementById("horse").onclick = function () {
                    change(element, '<img src="Images/whitehorse.png" draggable="false">')
                }
                document.getElementById("bishop").onclick = function () {
                    change(element, '<img src="Images/whitebishop.png" draggable="false">')
                }
            }
            else {
                document.getElementById("queen").innerHTML = '<img src="Images/blackqueen.png" draggable="false">'
                document.getElementById("castle").innerHTML = '<img src="Images/blackcastle.png" draggable="false">'
                document.getElementById("horse").innerHTML = '<img src="Images/blackhorse.png" draggable="false">'
                document.getElementById("bishop").innerHTML = '<img src="Images/blackbishop.png" draggable="false">'
                document.getElementById("queen").onclick = function () {
                    change(element, '<img src="Images/blackqueen.png" draggable="false">')
                }
                document.getElementById("castle").onclick = function () {
                    change(element, '<img src="Images/blackcastle.png" draggable="false">')
                }
                document.getElementById("horse").onclick = function () {
                    change(element, '<img src="Images/blackhorse.png" draggable="false">')
                }
                document.getElementById("bishop").onclick = function () {
                    change(element, '<img src="Images/blackbishop.png" draggable="false">')
                }
            }
            for (let i = 0; i < boxeslength; i++) {
                boxes[i].onclick = null

            }
            document.getElementById("turn").innerHTML = "White's Choice"
        }
    }


    // remove highlights
    remove_highlights();
    // check if any of the 2 kings are in check or for stalemate
    checking_piece = element // saving the piece which is commiting the check
    checkforcheck()
    
}

function change(element, type) {
    if (turn == 'white') {
        document.getElementById("turn").innerHTML = "White's Turn"
    }
    else {
        document.getElementById("turn").innerHTML = "Black's Turn"
    }
    element.innerHTML = type
    document.getElementById("queen").onclick = null
    document.getElementById("castle").onclick = null
    document.getElementById("horse").onclick = null
    document.getElementById("bishop").onclick = null
    document.getElementById("queen").innerHTML = ''
    document.getElementById("castle").innerHTML = ''
    document.getElementById("horse").innerHTML = ''
    document.getElementById("bishop").innerHTML = ''
    checking_piece = element
    checkforcheck()
    for (let i = 0; i < boxeslength; i++) {
        boxes[i].onclick = function () {
            select(this)
        }
    }
}
function checkforcheck() {
    let whiteteam = []
    let whiteteamcount = 0
    let blackteam = []
    let blackteamcount = 0
    let kingsloc = []
    let kingscount = 0
    for (let i = 0; i < boxeslength; i++) {
        if (boxes[i].innerHTML) {
            if (boxes[i].innerHTML[22] == 'k') {
                kingsloc[kingscount] = boxes[i]
                kingscount++
            }
            else if (boxes[i].innerHTML[17] == 'w') {
                whiteteam[whiteteamcount] = boxes[i]
                whiteteamcount++ 
            }
            else if (boxes[i].innerHTML[17] == 'b') {
                blackteam[blackteamcount] = boxes[i]
                blackteamcount++
            }
        }
    }
    for (let i = 0; i < 2; i++) {
        if (isincheck(kingsloc[i])) {
            console.log("is in check " + incheck)
        }
        else {
            if (kingsloc[i].innerHTML[17] == 'w') {stalemate_check(kingsloc[i], whiteteam, whiteteamcount)}
            else {stalemate_check(kingsloc[i], blackteam, blackteamcount)}
        }
    }
    if (incheck) {
        
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
        if (falses == 8) {
            kingcantmove = true
        }
        else {
            selected_element.onclick = function() {
                select(this)
            }
            selected_element.classList.add('blue')
        }
        // if something can attack it
        let cansomeonegohere = can_someone_go_here(parseInt(checking_piece.id), incheck)
        let cananyonesavethis = cananyonesave()
        for (let i = 0; i < piecescountforsave; i++) {
            element = piecesforsave[i]
            if (piecesaction[element.id] == 'attack') {
                element.addEventListener('click', attack)
            }
            else if (piecesaction[element.id] == 'move') {
                element.addEventListener('click', move)
            }
            else if (piecesaction[element.id] == 'both') {
                element.addEventListener('click', both)
            }
        }
        piecesforsave = []
        piecescountforsave = 0
        piecesaction = {}
        if (cansomeonegohere || !kingcantmove || cananyonesavethis) {} 
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
function stalemate_check(king, team, teamcount) {
    let id = parseInt(king.id); let falses = 0; let tempincrement = [1,-1,9,10,11,-9,-10,-11]; let kingcantmove;
    for (let i = 0; i < 8; i++) {
        if ((id + tempincrement[i])/10 <= 7.8 && (id + tempincrement[i])/10 >= 0 && (id + tempincrement[i])%10 <= 8 && (id + tempincrement[i])%10 >= 1) {
            element = document.getElementById(id + tempincrement[i])
            if (can_king_move(id, tempincrement[i])) {
            }
            else {falses++}
        }
        else {falses++}
    }
    if (falses == 8) {
        kingcantmove = true
    }
    if (kingcantmove) {
        /* go through every piece in his team 
        and check if it can move, if not pronounce stalemate */
        for (let i = 0; i < teamcount; i++) {
            switch (true) {
                case team[i].innerHTML[22] == 'p' && king.innerHTML[17] == 'b':
                    tempincrement = [11,9]
                    for (let j = 0; j < 2; j++) {
                        if ((id + tempincrement[j])/10 <= 7.8 && (id + tempincrement[j])/10 >= 0 && (id + tempincrement[j])%10 <= 8 && (id + tempincrement[j])%10 >= 1) {
                            if (document.getElementById(id + tempincrement[i]).innerHTML && document.getElementById(id + tempincrement[i]).innerHTML[17] != king.innerHTML[17]) {
                                return false
                            }
                        }
                    }
                    tempincrement = [10]
                    break;
                case team[i].innerHTML[22] == 'p' && king.innerHTML[17] == 'w':
                    tempincrement = [-11,-9]
                    for (let j = 0; j < 2; j++) {
                        if ((id + tempincrement[j])/10 <= 7.8 && (id + tempincrement[j])/10 >= 0 && (id + tempincrement[j])%10 <= 8 && (id + tempincrement[j])%10 >= 1) {
                            if (document.getElementById(id + tempincrement[j]).innerHTML && document.getElementById(id + tempincrement[j]).innerHTML[17] != king.innerHTML[17]) {
                                return false
                            }
                        }
                    }
                    tempincrement = [-10]
                    break;
                case team[i].innerHTML[22] == 'h':
                    tempincrement = [21, 19, -21, -19, 12, 8, -12, -8]
                    break;
                case team[i].innerHTML[22] == 'b':
                    tempincrement = [-9,9,11,-11]
                    break;
                case team[i].innerHTML[22] == 'c':
                    tempincrement = [1,-1,10,-10]
                    break;
                case team[i].innerHTML[22] == 'q':
                    tempincrement = [1,-1,10,-10,-9,9,11,-11]
                    break;
            }
            let count = tempincrement.length
            let element
            for (let j = 0; j < count; j++) {
                if ((id + tempincrement[j])/10 <= 7.8 && (id + tempincrement[j])/10 >= 0 && (id + tempincrement[j])%10 <= 8 && (id + tempincrement[j])%10 >= 1) {
                    element = document.getElementById(id + tempincrement[j])
                    if (!element.innerHTML || element.innerHTML[17] != king.innerHTML[17]) {
                        return false
                    }
                }
            }
        }
        // pronounce stalemate
        alert('stalemate')
    }
}

function cananyonesave() {
    let kingsteam = incheck
    let tempincrement = []
    let direction
    let locations
    let locationscount = 0
    /* find the tempincrement that leads to king, map all the locations 
    in location and use can_someone_go_here on all */
    switch (true) {
        case checking_piece.innerHTML[22] == 'c':
            tempincrement = [10,-10,-1,1]
            break;
        case checking_piece.innerHTML[22] == 'b':
            tempincrement = [9,11,-9,-11]
            break;
        case checking_piece.innerHTML[22] == 'q':
            tempincrement = [10,-10,-1,1,9,11,-9,-11]
            break;
    }
    let count = tempincrement.length
    let canit = false
    outerloop:
    for (let i = 0; i < count; i++) {
        let tempelement = checking_piece
        while (document.getElementById(parseInt(tempelement.id) + tempincrement[i])) {
            tempelement = document.getElementById(parseInt(tempelement.id) + tempincrement[i])
            if (tempelement.innerHTML) {
                if (tempelement.innerHTML[22] == 'k' && tempelement.innerHTML[17] != checking_piece.innerHTML[17]) {
                    direction = tempincrement[i]
                    break outerloop;
                }
                else {break;}
            }
        }
    }
    tempelement = checking_piece
    while (document.getElementById(parseInt(tempelement.id) + direction)) {
        tempelement = document.getElementById(parseInt(tempelement.id) + direction)
        if (tempelement.innerHTML[22] == 'k' && tempelement.innerHTML[17] != checking_piece.innerHTML[17]) {
            break;
        }
        else {
            if (can_someone_go_here(parseInt(tempelement.id), incheck)) {
                canit = true
            }
        }
    }
    return canit

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
    turn = 'white'
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
                                piecesforsave[piecescountforsave] = tempelement
                                piecescountforsave++
                                piecesaction[tempelement.id] = 'attack'
                                dictionarya[tempelement.id] = document.getElementById(tempid)
                                canit = true
                                tempelement.classList.add('blue')
                            }
                        }
                        else {
                            if (tempincrement[i] == -9 || tempincrement[i] == -11) {
                                piecesforsave[piecescountforsave] = tempelement
                                piecescountforsave++
                                piecesaction[tempelement.id] = 'attack'
                                dictionarya[tempelement.id] = document.getElementById(tempid)
                                canit = true
                                tempelement.classList.add('blue')
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
        if (element != null) {
            if (element.innerHTML && element.innerHTML[17] == checked_team && element.innerHTML[22] == 'p') {
                if (!piecesaction[element.id]) {
                    piecesaction[element.id] = 'move'
                    piecesforsave[piecescountforsave] = element
                    piecescountforsave++
                }
                else {
                    piecesaction[element.id] = 'both'
                }
                if (!dictionarym[element.id]) {
                    dictionarym[element.id] = [];
                }
                dictionarym[element.id].push(document.getElementById(tempid))
                canit = true
                element.classList.add('blue')
            }
            else if (!element.innerHTML && tempid >= 31 && tempid <= 38 && checked_team == 'b' || !element.innerHTML && tempid >= 41 && tempid <= 48 && checked_team == 'w') {
                element = document.getElementById(tempid + tempincrement[1]) 

                if (element.innerHTML[17] == checked_team && element.innerHTML[22] == 'p') {
                    if (!piecesaction[element.id]) {
                        piecesaction[element.id] = 'move'
                        piecesforsave[piecescountforsave] = element
                        piecescountforsave++
                    }
                    else {
                        piecesaction[element.id] = 'both'
                    }
                    if (!dictionarym[element.id]) {
                        dictionarym[element.id] = [];
                    }
                    if (!dictionarym[element.id]) {
                        dictionarym[element.id] = [];
                    }
                    dictionarym[element.id].push(document.getElementById(tempid))
                    canit = true
                    element.classList.add('blue')
                }
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
                        if (document.getElementById(tempid).innerHTML) {
                            if (piecesaction != null && piecesaction[element.id] == 'move' || piecesaction[element.id] == 'both') {
                                piecesaction[element.id] = 'both'
                            }
                            else {
                                piecesaction[element.id] = 'attack'
                                piecesforsave[piecescountforsave] = element
                                piecescountforsave++
                            }
                            dictionarya[element.id] = document.getElementById(tempid)  
                        }
                        else {
                            if (piecesaction != null && piecesaction[element.id] == 'attack' || piecesaction[element.id] == 'both') {
                                piecesaction[element.id] = 'both'
                            }
                            else {
                                piecesaction[element.id] = 'move'
                                piecesforsave[piecescountforsave] = element
                                piecescountforsave++
                            }
                            if (!dictionarym[element.id]) {
                                dictionarym[element.id] = [];
                            }
                            dictionarym[element.id].push(document.getElementById(tempid))  
                        }
                        canit = true
                        element.classList.add('blue')
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
            element = document.getElementById(tempid + tempincrement[i])
            if (!element.innerHTML) {}
            else if (element.innerHTML[22] == 'h' && element.innerHTML[17] == checked_team) {
                if (document.getElementById(tempid).innerHTML) {
                    if (piecesaction[element.id] == 'move') {
                        piecesaction[element.id] = 'both'
                    }
                    else {
                        piecesaction[element.id] = 'attack'
                        piecesforsave[piecescountforsave] = element
                        piecescountforsave++
                    }
                    dictionarya[element.id] = document.getElementById(tempid)  
                }
                else {
                    if (piecesaction[element.id] == 'attack') {
                        piecesaction[element.id] = 'both'
                    }
                    else {
                        piecesaction[element.id] = 'move'
                        piecesforsave[piecescountforsave] = element
                        piecescountforsave++
                    }
                    if (!dictionarym[element.id]) {
                        dictionarym[element.id] = [];
                    }
                    dictionarym[element.id].push(document.getElementById(tempid))
                }
                canit = true
                element.classList.add('blue')
            }
        }
    }
    return canit; // since none of the tests ran true
}

function remove_highlights() {
    for (let i = 0; i < highlights; i++) {
        highlighted[i].removeEventListener("click", moveclick)
        if (highlighted[i].innerHTML === '<img src="Images/ball.jpeg" draggable="false">') {
            highlighted[i].innerHTML = '' 
        }
        else if (highlighted[i].classList.contains('red')) {
            highlighted[i].classList.remove('red')
            highlighted[i].onclick = function () {
                select(this)
            }
        }
    }
    highlighted = []
    highlights = 0
}
function setboard() {    
    /* Set Black's Board */
    for (let i = 11; i <= 18; i++) {
        document.getElementById(i).innerHTML = '<img src="Images/blackpawn.png" draggable="false">'
    }  
    
    document.getElementById("1").innerHTML = '<img src="Images/blackcastle.png" draggable="false">'
    document.getElementById("8").innerHTML = '<img src="Images/blackcastle.png" draggable="false">'
    document.getElementById("2").innerHTML = '<img src="Images/blackhorse.png" draggable="false">'
    document.getElementById("7").innerHTML = '<img src="Images/blackhorse.png" draggable="false">'


    document.getElementById("3").innerHTML = '<img src="Images/blackbishop.png" draggable="false">'
    document.getElementById("6").innerHTML = '<img src="Images/blackbishop.png" draggable="false">'

    document.getElementById("5").innerHTML = '<img src="Images/blackking.png" draggable="false">'
    document.getElementById("4").innerHTML = '<img src="Images/blackqueen.png" draggable="false">'


    /* Set White's Board */
    for (let i = 61; i <= 68; i++) {
        document.getElementById(i).innerHTML = '<img src="Images/whitepawn.png" draggable="false">'
    }  
    document.getElementById("71").innerHTML = '<img src="Images/whitecastle.png" draggable="false">'
    document.getElementById("78").innerHTML = '<img src="Images/whitecastle.png" draggable="false">'

    document.getElementById("72").innerHTML = '<img src="Images/whitehorse.png" draggable="false">'
    document.getElementById("77").innerHTML = '<img src="Images/whitehorse.png" draggable="false">'


    document.getElementById("73").innerHTML = '<img src="Images/whitebishop.png" draggable="false">'
    document.getElementById("76").innerHTML = '<img src="Images/whitebishop.png" draggable="false">'

    document.getElementById("75").innerHTML = '<img src="Images/whiteking.png" draggable="false">'
    document.getElementById("74").innerHTML = '<img src="Images/whitequeen.png" draggable="false">'


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
