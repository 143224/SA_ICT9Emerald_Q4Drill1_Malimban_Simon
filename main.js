// Electricity Consumption Classifier
// Classification thresholds based on the provided table

const CLASSIFICATIONS = {
    lifeline: {
        name: "Lifeline Consumer",
        description: "You qualify for discounted electricity rates.",
        icon: "🛡️",
        color: "lifeline",
        rateInfo: "💰 Discounted electricity rates apply",
        advice: "You are within the lifeline rate bracket. Keep monitoring your usage to maintain eligibility."
    },
    low: {
        name: "Low Consumption",
        description: "You are within normal residential rate bracket.",
        icon: "💚",
        color: "low",
        rateInfo: "🏠 Normal residential rate applies",
        advice: "Good job keeping consumption low! Consider energy-efficient appliances to maintain this level."
    },
    average: {
        name: "Average Consumption",
        description: "You have typical electricity usage for a household.",
        icon: "💛",
        color: "average",
        rateInfo: "📊 Typical electricity usage rate",
        advice: "Your usage is typical. Look for small opportunities to reduce standby power consumption."
    },
    high: {
        name: "High Consumption",
        description: "You have higher than average electricity usage.",
        icon: "🧡",
        color: "high",
        rateInfo: "⚠️ Higher electricity usage rate",
        advice: "Consider an energy audit, upgrade to efficient appliances, and monitor AC and heating usage."
    },
    veryHigh: {
        name: "Very High Consumption",
        description: "You are a heavy electricity user.",
        icon: "❤️",
        color: "very-high",
        rateInfo: "⚡ Heavy electricity user rate",
        advice: "Immediate action recommended: Check for energy leaks, old appliances, and implement strict conservation measures."
    }
};

// DOM Elements
let consumptionInput, classifyBtn, resetBtn, resultCard, resultCategory, resultDescription, kwhDisplay, resultIcon, rateInfo;

// Initialize DOM references when page loads
document.addEventListener('DOMContentLoaded', () => {
    consumptionInput = document.getElementById('consumption');
    classifyBtn = document.getElementById('classifyBtn');
    resetBtn = document.getElementById('resetBtn');
    resultCard = document.getElementById('resultCard');
    resultCategory = document.getElementById('resultCategory');
    resultDescription = document.getElementById('resultDescription');
    kwhDisplay = document.getElementById('kwhDisplay');
    resultIcon = document.getElementById('resultIcon');
    rateInfo = document.getElementById('rateInfo');
    
    // Add event listeners
    classifyBtn.addEventListener('click', classifyConsumption);
    resetBtn.addEventListener('click', resetForm);
    consumptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') classifyConsumption();
    });
});

/**
 * Main classification function based on the table:
 * 0–100: Lifeline Consumer
 * 101–200: Low Consumption
 * 201–300: Average Consumption
 * 301–500: High Consumption
 * Above 500: Very High Consumption
 */
function classifyConsumption() {
    // Get and validate input
    let rawValue = consumptionInput.value.trim();
    
    if (rawValue === "") {
        showError("Please enter a consumption value.");
        return;
    }
    
    let kwh = parseFloat(rawValue);
    
    if (isNaN(kwh)) {
        showError("Invalid input. Please enter a valid number.");
        return;
    }
    
    if (kwh < 0) {
        showError("Consumption cannot be negative. Please enter a valid amount.");
        return;
    }
    
    // Determine classification based on the table
    let classification;
    if (kwh >= 0 && kwh <= 100) {
        classification = CLASSIFICATIONS.lifeline;
    } else if (kwh >= 101 && kwh <= 200) {
        classification = CLASSIFICATIONS.low;
    } else if (kwh >= 201 && kwh <= 300) {
        classification = CLASSIFICATIONS.average;
    } else if (kwh >= 301 && kwh <= 500) {
        classification = CLASSIFICATIONS.high;
    } else {
        classification = CLASSIFICATIONS.veryHigh;
    }
    
    // Update UI with results
    updateResultUI(classification, kwh);
    
    // Add animation
    resultCard.classList.add('fade-in');
    setTimeout(() => {
        resultCard.classList.remove('fade-in');
    }, 500);
}

/**
 * Update the result card with classification
 */
function updateResultUI(classification, kwh) {
    // Remove existing color classes
    resultCard.classList.remove('lifeline', 'low', 'average', 'high', 'very-high');
    
    // Add new color class
    resultCard.classList.add(classification.color);
    
    // Update content
    resultIcon.textContent = classification.icon;
    resultCategory.textContent = classification.name;
    resultDescription.textContent = classification.description;
    kwhDisplay.textContent = `📈 ${kwh.toFixed(2)} kWh consumed this month`;
    rateInfo.textContent = classification.rateInfo;
    
    // Add advice tooltip style
    rateInfo.style.cursor = "pointer";
    rateInfo.title = classification.advice;
    
    // Add a subtle success indicator
    resultCard.style.transform = 'scale(1.02)';
    setTimeout(() => {
        resultCard.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Display error message
 */
function showError(message) {
    // Remove existing color classes
    resultCard.classList.remove('lifeline', 'low', 'average', 'high', 'very-high');
    
    // Set error state
    resultIcon.textContent = "⚠️";
    resultCategory.textContent = "Invalid Input";
    resultDescription.textContent = message;
    kwhDisplay.textContent = "Please check your input and try again.";
    rateInfo.textContent = "";
    
    // Visual feedback
    resultCard.style.border = "2px solid #e74c3c";
    resultCard.style.backgroundColor = "#fee";
    
    // Reset border after 3 seconds
    setTimeout(() => {
        if (resultCategory.textContent === "Invalid Input") {
            resultCard.style.border = "2px solid #e0e0e0";
            resultCard.style.backgroundColor = "#f8f9fa";
        }
    }, 3000);
    
    // Shake animation for error
    resultCard.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => {
        resultCard.style.animation = '';
    }, 300);
}

/**
 * Reset form to initial state
 */
function resetForm() {
    consumptionInput.value = '';
    consumptionInput.focus();
    
    // Reset result card
    resultCard.classList.remove('lifeline', 'low', 'average', 'high', 'very-high');
    resultCard.style.border = "2px solid #e0e0e0";
    resultCard.style.backgroundColor = "#f8f9fa";
    
    resultIcon.textContent = "🔌";
    resultCategory.textContent = "—";
    resultDescription.textContent = "Enter a value and click Classify";
    kwhDisplay.textContent = "";
    rateInfo.textContent = "";
}