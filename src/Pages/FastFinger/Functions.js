import WORDS from '../../VocabResource'
import marksAndArticle from '../../VocabResource/marksAndArticle'


function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const addMarksAndArticle = (word) => {
    const addOrNot = Math.floor(Math.random() * 2) - 1
    let newWord = word
    // sẽ scale từ -1, 0, 1
    // -1 thì không thêm bất kih cái gì, 
    // 0 thì thêm marks
    // 1 thì thêm cả mark lẫn article

    const marks = marksAndArticle.marks
    const article = marksAndArticle.article
    const mark = marks[Math.floor(Math.random() * marks.length)]
    const art= article[Math.floor(Math.random() * article.length)]

    if (addOrNot === 0) {
        newWord += mark
    } else if (addOrNot === 1) {
        newWord = art + " " + newWord + mark
    }

    return newWord
}

const capitalizeFirstLetter = (word) => {
    const upperOrNot = Math.floor(Math.random() * 2)
    let newWord = word

    if (upperOrNot === 1) {
        newWord = capitalize(newWord)
    }

    return newWord
}

export const renderParagraph = (options = null) => {

    let paragraph = ''

    for (let i = 0; i < 100; i++) {
        const len = Math.floor(Math.random() * 5) + 4
        const num = Math.floor(Math.random() * WORDS[len].length)
        let word = WORDS[len][num]

        //options
        if (options) {
            if (options.useUpper) {
                word = capitalizeFirstLetter(word)
            }

            if (options.useMarkAndArticle) {
                word = addMarksAndArticle(word)
            }
        } 

        paragraph += word

        if (i !== 99) {
            paragraph += " "
        }
    }

    return paragraph
}

export const getWpmAndStat = (userInput, targetPara, startTime)  => {
    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < userInput.length; i++) {
        if (i < targetPara.length) {
            if (userInput[i] === targetPara[i]) {
                correct++;
            } else {
                incorrect++;
            }
        }
    }

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = correct / 5;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    const currentAccuracy = userInput.length > 0 ? 
        Math.round((correct / userInput.length) * 100) : 100;

    return [correct, incorrect, currentWpm, currentAccuracy]
}

export const getProgress = (game) => {
    const { targetParagraph, currentIndex } = game
    if (targetParagraph.length === 0) return 0
    return (currentIndex / targetParagraph.length) * 100
}