"use strict";
// Variable declaration
const metricButton = document.querySelector('#metric');
const imperialButton = document.querySelector('#imperial');
const imperialDisplay = document.querySelector('#imperial-display');
const metricDisplay = document.querySelector('#data-input-section');
const dataCollectionDisplay = document.querySelector('#data-collection-section');
const metricHeight = document.querySelector('#height');
const metricWeight = document.querySelector('#weight');
const bmiDisplay = document.querySelector('#value');
const initialized = document.querySelector('.initialized');
const welcome = document.querySelector('.welcome');
const initializedHealthStatus = document.querySelector('#health-status');
const initializedWeightRange = document.querySelector('#weight-gauge');
const imperialHeightFeet = document.querySelector('#imperial-height');
const imperialHeightInch = document.querySelector('#imperial-height-inch');
const imperialWeightStone = document.querySelector('#imperial-weight');
const imperialWeightPounds = document.querySelector('#imperial-weight-ibs');
// Adding an event listener to the metric radio button
metricButton.addEventListener('click', (e) => {
    unitDisplayToggle({ firstDisplay: metricDisplay,
        firstDisplayOption: 'flex',
        secondDisplay: imperialDisplay,
        secondDisplayOption: 'none',
        mainContainer: dataCollectionDisplay,
        newHeight: '315px' });
    unitDisplayToggle({ firstDisplay: welcome,
        firstDisplayOption: 'flex',
        secondDisplay: initialized,
        secondDisplayOption: 'none' });
    metricHeight.value = "";
    metricWeight.value = "";
    imperialWeightStone.value = "";
    imperialWeightPounds.value = "";
});
// Adding an event listener to the imperial radio button
imperialButton.addEventListener('click', () => {
    unitDisplayToggle({ firstDisplay: imperialDisplay,
        firstDisplayOption: 'flex',
        secondDisplay: metricDisplay,
        secondDisplayOption: 'none',
        mainContainer: dataCollectionDisplay,
        newHeight: '390px' });
    unitDisplayToggle({ firstDisplay: welcome,
        firstDisplayOption: 'flex',
        secondDisplay: initialized,
        secondDisplayOption: 'none' });
    imperialHeightFeet.value = "";
    imperialHeightInch.value = "";
});
// Adding an event listener to the height input element
metricHeight.addEventListener('keypress', (event) => { metricHeightWeightcallback(event, metricWeight); });
// Adding event listener to the weight input element
metricWeight.addEventListener('keypress', (event) => { metricHeightWeightcallback(event, metricHeight); });
// Adding event listener to the height-feet input element
imperialHeightFeet.addEventListener('keypress', (event) => {
    getImperialHeightWeight(event, {
        firstInputElement: imperialHeightInch,
        secondInputElement: imperialWeightStone,
        lastInputElement: imperialWeightPounds
    });
});
// Adding event listener to the height-inch input element
imperialHeightInch.addEventListener('keypress', (event) => {
    getImperialHeightWeight(event, {
        firstInputElement: imperialHeightFeet,
        secondInputElement: imperialWeightStone,
        lastInputElement: imperialWeightPounds
    });
});
// Adding event listener to the weight-stone input element
imperialWeightStone.addEventListener('keypress', (event) => {
    getImperialHeightWeight(event, {
        firstInputElement: imperialHeightFeet,
        secondInputElement: imperialHeightInch,
        lastInputElement: imperialWeightPounds
    });
});
//Adding event listener to the weight-pounds input element
imperialWeightPounds.addEventListener('keypress', (event) => {
    getImperialHeightWeight(event, {
        firstInputElement: imperialHeightFeet,
        secondInputElement: imperialHeightInch,
        lastInputElement: imperialWeightStone
    });
});
// Declaring a function that toggles the display of some elements based on the settings provided to its argument
function unitDisplayToggle(displaySettings) {
    /**
     * This function takes an object containing the settings to hide/reveal the appropriate display depeding on the unit selected by the user
     * @param displaySettings: displayChanger
     * @return: void
     */
    displaySettings.firstDisplay.style.display = displaySettings.firstDisplayOption;
    displaySettings.secondDisplay.style.display = displaySettings.secondDisplayOption;
    if (displaySettings.mainContainer && displaySettings.newHeight) {
        if (displaySettings.mainContainer.getBoundingClientRect().width < 430) {
            displaySettings.mainContainer.style.height = '435px';
        }
        else {
            displaySettings.mainContainer.style.height = displaySettings.newHeight;
        }
    }
}
// Declaring a function that calculates the BMI in metric units
function getMetricUnitBMI(height, weight) {
    /**
     * This function calculates the BMI given the height and weight.
     * @param height: number - Height in centimeters
     * @param weight: number - Weight in Kilograms
     * @returns: number
     */
    height = height / 100;
    return Number(weight / (height * height));
}
// Declaring a callback function that displays the appropriate message when the user fills the height and weight input fields of the
// metric unit. 
function metricHeightWeightcallback(event, measurementType) {
    /**
     * This function displays the appropriate message when a user inputs the height and weight in metric units.
     * If either of the fields (height/weight) is empty, the function returns immediately. On the other hand, if both values are provided,
     * the function calls the metricUnitBMI function to calculate the BMI and displays the appropriate message to the user.
     * @param event: KeyboardEvent - A keyboard event. In this case, we check if the user pressed 'Enter/Return' key on the keyboard.
     * @param measurementType: HTMLInputElement - The kind of input data that was provided (height/weight)
     * @returns: void
     */
    if (event.key === 'Enter' && event.code === 'Enter') {
        // checking if the one of the input fields is empty
        if (!measurementType.value) {
            return;
        }
        // Checking if the value entered is valid
        const pattern = /^[0-9]+$/;
        if (measurementType.id === 'height') {
            if (!pattern.test(metricWeight.value) || !pattern.test(metricHeight.value)) {
                alert('Enter a numeric value');
                return;
            }
        }
        else if (measurementType.id === "weight") {
            if (!pattern.test(metricHeight.value) || !pattern.test(metricWeight.value)) {
                alert('Enter a numeric value');
                return;
            }
        }
        bmiDisplay.innerText = (getMetricUnitBMI(Number(metricHeight.value), Number(metricWeight.value))).toFixed(1);
        let result = getMetricResultDisplayMessage(Number(metricHeight.value), Number(metricWeight.value));
        initializedHealthStatus.innerText = `Your BMI suggests you're ${result[0]}`;
        initializedWeightRange.innerHTML = `Your ideal weight is between <b>${result[1].toFixed(1)}Kgs</b> - <b>${result[2].toFixed(1)}Kgs</b>`;
        unitDisplayToggle({ firstDisplay: initialized,
            firstDisplayOption: 'flex',
            secondDisplay: welcome,
            secondDisplayOption: 'none' });
    }
}
// Declaring a function that determines the health status based on the BMI and also the weight range for the metric unit.
function getMetricResultDisplayMessage(height, weight) {
    const bmi = getMetricUnitBMI(height, weight);
    let healthStatus;
    let minimumWeight;
    let maximumWeight;
    height = height / 100;
    if (bmi < 18.5) {
        healthStatus = 'an underweight';
        maximumWeight = 18.5 * height * height;
        minimumWeight = 0;
    }
    else if (bmi >= 18.5 && bmi <= 24.9) {
        healthStatus = 'a healthy weight';
        minimumWeight = 18.5 * height * height;
        maximumWeight = 24.9 * height * height;
    }
    else if (bmi >= 25.0 && bmi <= 29.9) {
        healthStatus = 'an overweight';
        minimumWeight = 25 * height * height;
        maximumWeight = 29.9 * height * height;
    }
    else {
        healthStatus = 'an obese';
        minimumWeight = 30 * height * height;
        maximumWeight = 80 * height * height;
    }
    return [healthStatus, minimumWeight, maximumWeight];
}
// Calculating the the BMI in imperial units
function getImperialUnitBMI(heightInFeet, heightInInches, weightInStone, weightInPounds) {
    /**
     * This function calculates the BMI in imperial units
     * @param heightInFeet: number - Height specified in feet
     * @param heightInInches: number - Height specified in inches
     * @param weightInStone: number - weight specified in stone
     * @param weightInPounds: number - weight specified in ponds
     * @return: number
     */
    let newHeightInInches = (heightInFeet * 12) + heightInInches | 0;
    let newWeightInPounds = (weightInStone * 14) + weightInPounds | 0;
    return (newWeightInPounds / (newHeightInInches * newHeightInInches)) * 703;
}
// Declaring a callback funtion that calls the getImperialUnit BMI function and displays the appropriate message
function getImperialHeightWeight(event, measurementType) {
    /**
     * This function displays the BMI calculated, weight level based on the BMI and the ideal weight range
     * @param event: Event - The type of event triggered. In this case, a keyboard event
     * @param measurementType: measuremetObject - an object consist of all the input fields with the exception of the currently focused field
     * @return: void
     */
    if (event.code === 'Enter' && event.key === 'Enter') {
        // checking if either the weight in stone or height in feet is empty
        if (!measurementType.firstInputElement.value || !measurementType.secondInputElement.value || !measurementType.lastInputElement.value) {
            return;
        }
        // Checking if the fields have the valid inputs
        const pattern = /^[0-9]+$/;
        if (event.target) {
            if (event.target.id === "imperial-height") {
                if ((!pattern.test(imperialHeightFeet.value) || !pattern.test(imperialHeightInch.value)) || (!pattern.test(imperialWeightStone.value) || !pattern.test(imperialWeightPounds.value))) {
                    alert('Enter a numeric value');
                    return;
                }
            }
            else if (event.target.id === "imperial-height-inch") {
                if ((!pattern.test(imperialHeightFeet.value) || !pattern.test(imperialHeightInch.value)) || (!pattern.test(imperialWeightStone.value) || !pattern.test(imperialWeightPounds.value))) {
                    alert('Enter a numeric value');
                    return;
                }
            }
            else if (event.target.id === "imperial-weight") {
                if ((!pattern.test(imperialHeightFeet.value) || !pattern.test(imperialHeightInch.value)) || (!pattern.test(imperialWeightStone.value) || !pattern.test(imperialWeightPounds.value))) {
                    alert('Enter a numeric value');
                    return;
                }
            }
            else if (event.target.id === "imperial-weight-ibs") {
                if ((!pattern.test(imperialHeightFeet.value) || !pattern.test(imperialHeightInch.value)) || (!pattern.test(imperialWeightStone.value) || !pattern.test(imperialWeightPounds.value))) {
                    alert('Enter a numeric value');
                    return;
                }
            }
            const heightFeet = Number(imperialHeightFeet.value);
            const heightInch = Number(imperialHeightInch.value);
            const weightStone = Number(imperialWeightStone.value);
            const weightPound = Number(imperialWeightPounds.value);
            bmiDisplay.innerText = (Number(getImperialUnitBMI(heightFeet, heightInch, weightStone, weightPound)).toFixed(1));
            let imperialOutput = getImperialResultMessage(heightFeet, heightInch, weightStone, weightPound);
            initializedHealthStatus.innerText = `Your BMI suggests you're ${imperialOutput[0]}`;
            let lowerBound = `${Math.floor(imperialOutput[1] / 14)}st ${Number(Math.floor(imperialOutput[1] % 14))}Ibs`;
            let upperBound = `${Math.floor(imperialOutput[2] / 14)}st ${Number(Math.floor(imperialOutput[2] % 14))}Ibs`;
            console.log(lowerBound);
            initializedWeightRange.innerHTML = `Your ideal weight is between <b>${lowerBound}</b> - <b>${upperBound}</b>`;
            unitDisplayToggle({ firstDisplay: initialized,
                firstDisplayOption: 'flex',
                secondDisplay: welcome,
                secondDisplayOption: 'none' });
        }
    }
}
// Declaring a function that determines the health status and weight range in imerial units
function getImperialResultMessage(heightFeet, heightInch, weightStone, weightPounds) {
    /**
     * This function determines the weight level of an individual based on the BMI and also determines the ideal weight range
     * @param heightFeet: number - height in feet
     * @param heightInch: number - height in inch
     * @param weightStone: number - weight in stone
     * @param weightPounds: number - weinght in pounds
     * @return : [string, number, number] - tuple
     */
    const imperialBMI = getImperialUnitBMI(heightFeet, heightInch, weightStone, weightPounds);
    let healthStats;
    let miniWeight;
    let maxiWeight;
    const height = (heightFeet * 12) + heightInch;
    if (imperialBMI < 18.5) {
        healthStats = 'an underweight';
        maxiWeight = (imperialBMI * (height * height)) / 703;
        miniWeight = 0;
    }
    else if (imperialBMI >= 18.5 && imperialBMI <= 24.9) {
        healthStats = 'a healthy weight';
        miniWeight = (18.5 * (height * height)) / 703;
        maxiWeight = (24.9 * (height * height)) / 703;
    }
    else if (imperialBMI >= 25.0 && imperialBMI <= 29.9) {
        healthStats = 'an overweight';
        miniWeight = (25 * (height * height)) / 703;
        maxiWeight = (29.9 * (height * height)) / 703;
    }
    else {
        healthStats = 'an obese';
        miniWeight = (30 * (height * height)) / 703;
        maxiWeight = (80 * (height * height)) / 703;
    }
    console.log([healthStats, miniWeight, maxiWeight]);
    return [healthStats, miniWeight, maxiWeight];
}
