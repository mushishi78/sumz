var elements = {
    scores: null,
    hand: null,
    numberPicker: null,
    signPicker: null,
    body: null,
    endScreen: null,
    endMessage: null,
}

var states = [{
    scores: [0, 0],
    selectedScoreIndex: 0,
    hand: [],
    selectedSignIndex: -1,
    selectedSign: '',
    used: [],
    show: 'hand',
    enabled: '',
}]

window.onload = function() {
    elements.scores = document.querySelectorAll('.score')
    elements.hand = document.querySelector('.hand')
    elements.numberPicker = document.querySelector('.number-picker')
    elements.signPicker = document.querySelector('.sign-picker')
    elements.body = document.body
    elements.endScreen = document.querySelector('.end-screen')
    elements.endMessage = document.querySelector('.end-message')
    setState(deal())
}

// Update state with new changes
function setState(changes) {
    var prev = states[states.length - 1]
    var next = Object.assign({}, prev, changes)
    states.push(next)
    updateDom(prev, next)
}

// Get the state from the states array
function getState() {
    return states[states.length - 1]
}

// Step back one step
function undo() {
    if (states.length <= 2) return
    var prev = states.pop()
    var next = states[states.length - 1]
    updateDom(prev, next)
}

function pass() {
    var state = getState()

    if (state.scores[0] === 0) {
        return
    }

    setState({
        scores: takeComputerTurn(state.scores),
        selectedScoreIndex: -1,
        selectedSignIndex: -1,
        selectedSign: '',
        show: 'hand',
        enabled: 'scores',
    })
}

// Update dom with new state
function updateDom(prev, next) {
    // Set scores
    for (var i = 0; i < prev.scores.length; i++) {
        if (prev.scores[i] !== next.scores[i]) {
            elements.scores[i].innerText = next.scores[i]
        }
    }

    // Set selected score
    if (prev.selectedScoreIndex !== next.selectedScoreIndex) {
        if (prev.selectedScoreIndex >= 0) {
            var prevSelected = elements.scores[prev.selectedScoreIndex]
            prevSelected.className = prevSelected.className.replace(' selected', '')
        }
        if (next.selectedScoreIndex >= 0) {
            var nextSelected = elements.scores[next.selectedScoreIndex]
            nextSelected.className += ' selected'
        }
    }

    // Update cards in hand
    if (prev.hand !== next.hand) {
        for (var i = 0; i < next.hand.length; i++) {
            var card = next.hand[i]
            var cardElement = elements.hand.children[i]
            var className = 'card'
            var innerText = ''

            if (card.sign != null) {
                className += ' sign'
                if (card.sign === 'plus') innerText = '\u002B'
                if (card.sign === 'minus') innerText = '\u2212'
                if (card.sign === 'times') innerText = '\u00D7'
                if (card.sign === 'divide') innerText = '\u00F7'
                if (card.sign === 'wild') innerText = '?'
            }
            if (card.number != null) {
                className += ' number'
                if (card.number === 'wild') innerText = '?'
                else innerText = card.number
            }

            cardElement.className = className
            cardElement.innerText = innerText
        }
    }

    // Set selected score
    if (prev.selectedSignIndex !== next.selectedSignIndex) {
        if (prev.selectedSignIndex >= 0) {
            var prevSelected = elements.hand.children[prev.selectedSignIndex]
            prevSelected.className = prevSelected.className.replace(' selected', '')
        }
        if (next.selectedSignIndex >= 0) {
            var nextSelected = elements.hand.children[next.selectedSignIndex]
            nextSelected.className += ' selected'
        }
    }

    // Set used cards
    if (prev.used !== next.used) {
        for (var i = 0; i < prev.used.length; i++) {
            // If the card remains used, ignore
            if (next.used.indexOf(prev.used[i]) >= 0) continue

            // Otherwise, remove className
            var cardElement = elements.hand.children[prev.used[i]]
            cardElement.className = cardElement.className.replace(' used', '')
        }
        for (var i = 0; i < next.used.length; i++) {
            // If the card was alread used, ignore
            if (prev.used.indexOf(next.used[i]) >= 0) continue

            // Otherwise, add className
            var cardElement = elements.hand.children[next.used[i]]
            cardElement.className += ' used'
        }
    }

    // Show (hand, number-picker or sign-picker)
    if (prev.show !== next.show) {
        if (prev.show === 'hand') {
            elements.hand.className += ' hide'
        } else if (prev.show === 'number-picker') {
            elements.numberPicker.className += ' hide'
        } else if (prev.show === 'sign-picker') {
            elements.signPicker.className += ' hide'
        }

        if (next.show === 'hand') {
            elements.hand.className = elements.hand.className.replace(' hide', '')
        } else if (next.show === 'number-picker') {
            elements.numberPicker.className = elements.numberPicker.className.replace(' hide', '')
        } else if (next.show === 'sign-picker') {
            elements.signPicker.className = elements.signPicker.className.replace(' hide', '')
        }
    }

    // Enabled
    if (prev.enabled !== next.enabled) {
        elements.body.className = 'enabled-' + next.enabled
    }

    // End screen
    if (next.used.length === 9) {
        elements.hand.className += ' hide'
        elements.endScreen.className = elements.endScreen.className.replace(' hide', '')
        var state = getState()
        if (state.scores[0] > state.scores[1]) {
            elements.endMessage.innerText = "Well done, you've won"
        } else {
            elements.endMessage.innerText = "Unlucky you've lost"
        }
    }
}

function deal() {
    var random = 0
    var signsCount = 0
    var numbersCount = 0
    var card = null
    var hand = []

    while (hand.length < 9) {
        random = Math.random()

        // Generate random card
        if (random < 1 / 15) card = { sign: 'plus' }
        else if (random < 2 / 15) card = { sign: 'minus' }
        else if (random < 3 / 15) card = { sign: 'times' }
        else if (random < 4 / 15) card = { sign: 'divide' }
        else if (random < 5 / 15) card = { sign: 'wild' }
        else if (random < 6 / 15) card = { number: 1 }
        else if (random < 7 / 15) card = { number: 2 }
        else if (random < 8 / 15) card = { number: 3 }
        else if (random < 9 / 15) card = { number: 4 }
        else if (random < 10 / 15) card = { number: 5 }
        else if (random < 11 / 15) card = { number: 6 }
        else if (random < 12 / 15) card = { number: 7 }
        else if (random < 13 / 15) card = { number: 8 }
        else if (random < 14 / 15) card = { number: 9 }
        else card = { number: 'wild' }

        // Limit number of cards of type
        if (card.sign != null) {
            if (signsCount >= 4) continue
            signsCount++
        }
        if (card.number != null) {
            if (numbersCount >= 5) continue
            numbersCount++
        }

        hand.push(card)
    }

    setState({ hand: hand, enabled: 'numbers' })
}

function onScoreClick(scoreIndex) {
    var state = getState()

    // Initially cannot select a score
    if (state.scores[0] === 0) {
        return
    }

    setState({ selectedScoreIndex: scoreIndex, enabled: 'signs' })
}

function onCardClick(cardIndex) {
    var state = getState()
    var card = state.hand[cardIndex]
    
    // Initially select a number
    if (state.scores[0] === 0) {

        // If not a number card, then ignore
        if (card.number == null) {
            return
        }

        // If wild card, show number picker
        if (card.number === "wild") {
            setState({
                show: 'number-picker',
                used: [cardIndex]
            })
            return
        }

        // Create an arbitrary computer score
        var compScore = Math.floor(Math.random() * 10)

        // Update state with scores and used card
        setState({
            scores: [card.number, compScore],
            selectedScoreIndex: -1,
            used: [cardIndex],
            enabled: 'scores',
        })
        return
    }

    // If no score is selected, then ignore
    if (state.selectedScoreIndex < 0) {
        return
    }

    // If no card is selected
    if (state.selectedSignIndex < 0) {

        // If not a sign card ignore
        if (card.sign == null) {
            return
        }

        // If wild card, show number picker
        if (card.sign === "wild") {
            setState({
                show: 'sign-picker',
                selectedSignIndex: cardIndex
            })
            return
        }

        // Otherwise update the selected card
        setState({
            selectedSignIndex: cardIndex,
            selectedSign: card.sign,
            enabled: 'numbers'
        })
        return
    }

    // If sign card is selected

    // If not a number card ignore
    if (card.number == null) {
        return
    }

    // If wild card, show number picker
    if (card.number === "wild") {
        setState({
            show: 'number-picker',
            used: state.used.concat(cardIndex),
        })
        return
    }

    // Do the sum!

    var score = state.scores[state.selectedScoreIndex]
    if (state.selectedSign === 'plus') {
        score += card.number
    } else if (state.selectedSign === 'minus') {
        score -= card.number
    } else if (state.selectedSign === 'times') {
        score *= card.number
    } else if (state.selectedSign === 'divide') {
        score /= card.number
    }

    // Validate

    if (score < 1) {
        return
    }
    if (score % 1 !== 0) {
        return
    }

    // Update state for next round

    var scores = state.scores.slice()
    scores[state.selectedScoreIndex] = score

    scores = takeComputerTurn(scores)

    setState({
        scores: scores,
        selectedScoreIndex: -1,
        selectedSignIndex: -1,
        selectedSign: '',
        used: state.used.concat(state.selectedSignIndex, cardIndex),
        enabled: 'scores'
    })
}

function takeComputerTurn(scores) {

    // Simple random score change

    var selectedScoreIndex = Math.floor(Math.random() + 0.5)
    var score = scores[selectedScoreIndex]
    var number = Math.floor((Math.random() * 9) + 0.5)

    if (selectedScoreIndex === 0) {
        if (Math.random() < 0.5) {
            score -= number
        } else {
            score /= number
        }
    } else {
        if (Math.random() < 0.5) {
            score += number
        } else {
            score *= number
        }
    }

    // Validate

    if (score < 1) {
        return scores
    }
    if (score % 1 !== 0) {
        return scores
    }

    // Update scores
    scores = scores.slice()
    scores[selectedScoreIndex] = score
    return scores
}

function onNumberPick(number) {
    var state = getState()
    
    // Initially select a number
    if (state.scores[0] === 0) {
        // Create an arbitrary computer score
        var compScore = Math.floor(Math.random() * 10)

        // Update state with scores and used card
        setState({
            scores: [number, compScore],
            selectedScoreIndex: -1,
            show: 'hand',
            enabled: 'scores',
        })
        return
    }

    // Do the sum!

    var score = state.scores[state.selectedScoreIndex]
    if (state.selectedSign === 'plus') {
        score += number
    } else if (state.selectedSign === 'minus') {
        score -= number
    } else if (state.selectedSign === 'times') {
        score *= number
    } else if (state.selectedSign === 'divide') {
        score /= number
    }

    // Validate

    if (score < 1) {
        return
    }
    if (score % 1 !== 0) {
        return
    }

    // Update state for next round

    var scores = state.scores.slice()
    scores[state.selectedScoreIndex] = score

    scores = takeComputerTurn(scores)

    setState({
        scores: scores,
        selectedScoreIndex: -1,
        selectedSignIndex: -1,
        selectedSign: '',
        used: state.used.concat(state.selectedSignIndex),
        show: 'hand',
        enabled: 'scores'
    })
}

function onSignPick(sign) {
    setState({
        selectedSign: sign,
        show: 'hand',
        enabled: 'numbers'
    })
}
