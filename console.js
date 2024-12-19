'use strict';

// Core language.
const TRANSLATION_COMMAND_NOT_FOUND = 'This command was not found. Use \'help\' to get a list of available commands.';
const TRANSLATION_COMMAND_INPUT_EMPTY = 'You can\'t submit an empty field!';

const TRANSLATION_COMMAND_INPUT_PLACEHOLDER = 'Enter your command here.';

// Other options and variables.
const letterTimeout = 20;

const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

const inputSuggestions = document.getElementById('inputSuggestions');

const inputSendButton = document.getElementById('inputSendButton');

const availableCommands = ['clear', 'play', 'settings', 'credits', 'discord', 'telegram', 'twitch'];

let inputPlaceholderTimeout;

let selectedSuggestionId = 0;

const emoticons = {};

// Функция для замены эмодзи на изображения. (TEST)
function replaceEmojisWithImages(arr, emoticons) {
    return arr.map(item => {
        if (emoticons[item]) {
            return `<img src="${emoticons[item]}" alt="${item}" width="32px" height="32px">`;
        }
        return item;
    });
}

document.addEventListener('keydown', e => {
    if(e.code === 'Enter')
    {
        if(isFocused(terminalInput)) processConsoleInput();
    }

    if(e.code === 'Tab')
    {
        e.preventDefault();

        if(isFocused(terminalInput))
        {
            const filteredSuggestions = getAvailableSuggestions();

            if(filteredSuggestions.length >= 1)
            {
                terminalInput.value = filteredSuggestions[getAvailableSuggestionCount() > 1 ? selectedSuggestionId : 0];

                checkCurrentInputLine(filteredSuggestions[getAvailableSuggestionCount() > 1 ? selectedSuggestionId : 0]);

                checkForSuggestions();
            }
        }
    }

    if(e.code === 'Escape')
    {
        e.preventDefault();

        terminalInput.blur();

        clearSuggestions();
		
		isGameStarted = !isGameStarted;
		isPaused = !isPaused;
    }

    if(e.code === 'ArrowUp')
    {
        e.preventDefault();

        if(getAvailableSuggestionCount() > 1)
        {
            if (selectedSuggestionId > 0) selectedSuggestionId--;

            clearSuggestions();

            checkForSuggestions();
        }
    }

    if(e.code === 'ArrowDown')
    {
        e.preventDefault();

        if(getAvailableSuggestionCount() > 1)
        {
            if (selectedSuggestionId < getAvailableSuggestionCount() - 1) selectedSuggestionId++;

            clearSuggestions();

            checkForSuggestions();
        }
    }

    if(e.code === 'Minus')
    {
        e.preventDefault();

        audio.volume = Math.round(Math.max(0, audio.volume - 0.1) * 100) / 100;

        sendPlaceholderText(`Current audio volume set to ${audio.volume.toString()}.`);
    }

    if(e.code === 'Equal')
    {
        e.preventDefault();

        audio.volume = Math.round(Math.min(1, audio.volume + 0.1) * 100) / 100;

        sendPlaceholderText(`Current audio volume set to ${audio.volume.toString()}.`);
    }
});

document.addEventListener('contextmenu', e => e.preventDefault());

terminalInput.addEventListener('input', () => checkCurrentInputLine(terminalInput.value.trim().toLowerCase()) || checkForSuggestions());

terminalInput.addEventListener('focusin', () => checkForSuggestions());
terminalInput.addEventListener('focusout', () => clearSuggestions());

terminalInput.placeholder = TRANSLATION_COMMAND_INPUT_PLACEHOLDER;

inputSendButton.addEventListener('click', () => {
    processConsoleInput()

    terminalInput.blur();

    clearSuggestions();
});

function processConsoleInput()
{
    let formattedCommand = terminalInput.value.trim().split(' ');

    formattedCommand[0] = formattedCommand[0].toLowerCase();

    clearInput();

    if(!formattedCommand[0])
    {
        sendPlaceholderText(TRANSLATION_COMMAND_INPUT_EMPTY);

        return;
    }

    if(!availableCommands.includes(formattedCommand[0]))
    {
        sendToConsole(TRANSLATION_COMMAND_NOT_FOUND);

        return;
    }

    if(formattedCommand[0] === 'clear')
    {
        clearConsole();

        return;
    }

    if(formattedCommand[0] === 'play')
    {
		if(isGameStarted) return;
		
		isGameStarted = true;
		RegisterGameEv();
		RegisterTimers();

        return;
    }

    if(formattedCommand[0] === 'settings')
    {
		sendToConsole('Not implemented.');

        return;
    }

    if(formattedCommand[0] === 'discord')
    {
		sendToConsole(`You can join my discord server to follow any other project development: <a href="https://discord.com/LINK_IS_NOT_CREATED">Discord</a>`);

        return;
    }

    if(formattedCommand[0] === 'telegram')
    {
		sendToConsole(`Visit my telegram group and follow the news about dev and life: <a href="https://t.me/node_off">Telegram</a>`);

        return;
    }

    if(formattedCommand[0] === 'twitch')
    {
		sendToConsole(`Please, follow my twitch channel and see for the nearest stream about something... <a href="https://twitch.tv/node_off">Twitch</a>`);

        return;
    }

    if(formattedCommand[0] === 'pause')
    {
		//isGameStarted = !isGameStarted;
		//isPaused = !isPaused;

        return;
    }
}

function sendToConsole(responseText)
{
    let startLetterAnimation = function (animationTarget, animationText)
    {
        animationTarget.innerText = '';

        for(let i = 0; i < animationText.length; i++)
        {
            setTimeout(() => animationTarget.textContent += animationText[i], i * letterTimeout);
        }

        setTimeout(() => {
            responseInnerElement.innerHTML = animationText;

            createInteractableText(responseInnerElement);
        }, animationText.length * letterTimeout);
    }

    let currentTime = new Date();

    let currentHours = String(currentTime.getHours()).padStart(2, '0');
    let currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
    let currentSeconds = String(currentTime.getSeconds()).padStart(2, '0');

    let currentTimeLine = `<span class="lineTime">[${currentHours}:${currentMinutes}:${currentSeconds}]</span>`;

    let responseElement = document.createElement('p');
    let responseInnerElement = document.createElement('span');

    responseElement.innerHTML = `${currentTimeLine} [Console]: `;
    responseElement.append(responseInnerElement);
	
	responseInnerElement.innerHTML = responseText; // Animation is disabled.

    terminalOutput.append(responseElement);

    //startLetterAnimation(responseInnerElement, responseText);

    scrollConsole();
}

function scrollConsole()
{
    terminalOutput.scrollTo({top: 1_000_000_000});
}

function clearConsole()
{
    terminalOutput.innerHTML = '';
}

function clearInput()
{
    terminalInput.value = '';

    checkForSuggestions();
}

function createInteractableText(interactableElement)
{
    let interactableText = interactableElement.querySelectorAll('span.lineCommand');

    interactableText.forEach((element) => {
        element.setAttribute('translate', 'no');

        element.addEventListener('click', () => {
            terminalInput.value = element.innerText;
            terminalInput.focus();

            checkCurrentInputLine(terminalInput.value.trim());
        });
    });
}

function checkCurrentInputLine(inputLine)
{
    if(availableCommands.includes(inputLine.trim().toLowerCase().split(' ')[0]))
        terminalInput.style.color = 'var(--menco-ui--accent)';
    else
        terminalInput.style.color = 'var(--menco-ui--text)';
}

function checkForSuggestions()
{
    const availableSuggestionCount = getAvailableSuggestionCount();

    if (availableSuggestionCount <= 0)
    {
        selectedSuggestionId = 0;
    }
    else
    {
        if (selectedSuggestionId < 0 || selectedSuggestionId >= availableSuggestionCount)
        {
            selectedSuggestionId = availableSuggestionCount - 1;
        }
    }

    clearSuggestions();

    if (availableSuggestionCount > 0)
    {
        inputSuggestions.classList.add('suggestionsVisible');

        getAvailableSuggestions().forEach((suggestionText, i) => {
            const suggestionElement = document.createElement('p');

            suggestionElement.setAttribute('translate', 'no');
            suggestionElement.textContent = suggestionText;

            inputSuggestions.appendChild(suggestionElement);

            if(i === selectedSuggestionId)
            {
                suggestionElement.classList.add('possibleSuggestion');
            }
        });
    }
}

function getAvailableSuggestions()
{
    let inputText = terminalInput.value.trim().toLowerCase();

    return availableCommands.filter(word => word.includes(inputText) && word.indexOf(inputText) === 0);
}

function getAvailableSuggestionCount()
{
    return getAvailableSuggestions().length;
}

function clearSuggestions()
{
    inputSuggestions.innerHTML = '';
    inputSuggestions.classList.remove('suggestionsVisible');
}

function sendPlaceholderText(placeholderText)
{
    clearTimeout(inputPlaceholderTimeout);

    terminalInput.placeholder = placeholderText;

    inputPlaceholderTimeout = setTimeout(() => terminalInput.placeholder = TRANSLATION_COMMAND_INPUT_PLACEHOLDER, 1500);
}

function isFocused(targetElement)
{
    return document.activeElement === targetElement;
}
