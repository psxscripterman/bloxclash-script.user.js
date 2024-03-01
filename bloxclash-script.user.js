(function () {
    // Configuration
    let autoClickEnabled = true;
    let hideUnwantedEnabled = true;
    let autoBackEnabled = false;
    let autoRefreshEnabled = true;
    let isOpen = false;
    let autoClickIntervalId = null;
    let autoBackIntervalId = null;
    let clickInterval = 100; // Default clicking interval in milliseconds
    let autoBackDelay = 15000; // Default auto-back delay in milliseconds

    // Function to hide battle previews based on certain criteria, including the specified link
    function hideBattlePreviews() {
        if (!hideUnwantedEnabled) return;

        document.querySelectorAll(".battle-preview-container").forEach((element) => {
            const textContent = element.textContent.trim();
            const imageUrl = "https://bloxclash.com/api/user/5296741155/img";

            // Check if the textContent contains the specified link
            if (textContent.includes(imageUrl)) {
                element.style.display = "none";
            } else {
                // Additional criteria check if needed
                if (!(textContent === "100" || /[^0-9]100[^0-9]/g.test(textContent))) {
                    element.style.display = "none";
                }
            }
        });
    }

    // Function to click the "join" button if visible
    function clickJoinButton(element) {
        if (!autoClickEnabled) return;
        const joinButton = element.querySelector(".bevel-gold.join");
        if (joinButton && isVisible(joinButton) && !isHiddenByUnwanted(joinButton)) {
            // Click the button repeatedly for 2 seconds
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    if (isVisible(joinButton) && !isHiddenByUnwanted(joinButton)) {
                        joinButton.click();
                    }
                }, i * 1);
            }
        }
    }

    // Function to check if the element is hidden by "Hide Unwanted"
    function isHiddenByUnwanted(element) {
        const textContent = element.textContent.trim();
        const imageUrl = "https://bloxclash.com/api/user/5296741155/img";

        // Check if the textContent contains the specified link
        if (textContent.includes(imageUrl)) {
            return true;
        } else {
            // Additional criteria check if needed
            return (textContent === "100" || /[^0-9]100[^0-9]/g.test(textContent));
        }
    }

    // Function for auto-back functionality
    function autoBack() {
        if (!autoBackEnabled) return;
        setTimeout(() => {
            document.querySelectorAll(".back.bevel-light").forEach((element) => {
                const inactiveLink = element.querySelector(".gamemode-link.inactive");
                if (inactiveLink) {
                    inactiveLink.click();
                }
            });
        }, autoBackDelay); // Delay based on the adjusted autoBackDelay
    }

    // Function to create a button with a callback
    function createButton(label, callback, isEnabled) {
        const button = document.createElement("button");
        updateButtonColor(button, isEnabled);
        button.textContent = `${label} ${isEnabled ? 'on' : 'off'}`;
        button.style.backgroundColor = isEnabled ? "green" : "red";
        button.style.padding = "20px 40px";
        button.style.border = "none";
        button.style.borderRadius = "15px";
        button.style.cursor = "pointer";
        button.style.margin = "20px";
        button.addEventListener("click", () => {
            callback();
            isEnabled = !isEnabled;
            updateButtonColor(button, isEnabled);
        });
        return button;
    }

    // Function to update button color
    function updateButtonColor(button, isEnabled) {
        button.style.backgroundColor = isEnabled ? "green" : "red";
    }

    // Function to create a slider with a callback
    function createSlider(label, min, max, step, defaultValue, callback) {
        const sliderContainer = document.createElement("div");
        sliderContainer.style.margin = "20px";
        const sliderLabel = document.createElement("label");
        sliderLabel.textContent = label;
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = defaultValue;
        slider.addEventListener("input", (event) => {
            const value = parseFloat(event.target.value);
            callback(value);
            updateSliderValueLabel(value, label);
        });

        const valueLabel = document.createElement("span");
        valueLabel.style.marginLeft = "10px";
        valueLabel.textContent = `${defaultValue} ms`;
        valueLabel.id = `${label.replace(/ /g, '')}Label`; // Add an id for easy reference

        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueLabel);

        return sliderContainer;
    }

    // Function to toggle auto-click
    function toggleAutoClick() {
        autoClickEnabled = !autoClickEnabled;
    }

    // Function to toggle hide unwanted elements
    function toggleHideUnwanted() {
        hideUnwantedEnabled = !hideUnwantedEnabled;
        hideBattlePreviews();
    }

    // Function to toggle auto-back
    function toggleAutoBack() {
        autoBackEnabled = !autoBackEnabled;
        autoBack();
    }

    // Function to toggle auto-refresh
    function toggleAutoRefresh() {
        autoRefreshEnabled = !autoRefreshEnabled;
    }

    // Function to set the clicking interval
    function setClickInterval(interval) {
        clickInterval = interval;
    }

    // Function to set the auto-back delay
    function setAutoBackDelay(delay) {
        autoBackDelay = delay;
    }

    // Function to update the slider value label
    function updateSliderValueLabel(value, label) {
        document.getElementById(`${label.replace(/ /g, '')}Label`).textContent = `${value} ms`;
    }

    // Function to generate a random color
    function generateRandomColor() {
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
        }
        return color;
    }

    // Initial click on page load
    document.querySelectorAll(".bevel-gold.join").forEach((element) => {
        if (isVisible(element) && autoClickEnabled) {
            clickJoinButton(element);
        }
    });

    // Click when the DOM structure changes
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                Array.from(mutation.addedNodes).forEach((node) => {
                    if (node instanceof HTMLElement) {
                        hideBattlePreviews();
                        clickJoinButton(node);
                        autoBack();
                    }
                });
            }
        });
    }).observe(document.body, { childList: true, subtree: true });

    // Function to create the control panel with buttons and sliders
    function createControlPanel() {
        const controlPanel = document.createElement("div");
        controlPanel.style.position = "fixed";
        controlPanel.style.top = "50%";
        controlPanel.style.left = "50%";
        controlPanel.style.transform = "translate(-50%, -50%)";
        controlPanel.style.backgroundColor = generateRandomColor();
        controlPanel.style.color = "white";
        controlPanel.style.padding = "40px";
        controlPanel.style.borderRadius = "15px";
        controlPanel.style.cursor = "pointer";

        const autoClickButton = createButton("Auto Click", toggleAutoClick, autoClickEnabled);
        const hideUnwantedButton = createButton("Hide Unwanted", toggleHideUnwanted, hideUnwantedEnabled);
        const autoBackButton = createButton("Auto Back", toggleAutoBack, autoBackEnabled);

        const intervalSlider = createSlider("Click Interval", 100, 6000, 100, clickInterval, setClickInterval);
        const autoBackSlider = createSlider("Auto Back Delay", 100, 6000, 100, autoBackDelay, setAutoBackDelay);

        const infoText = document.createElement("div");
        infoText.innerHTML = '<span style="color: green;">Click E to close and open</span>';

        controlPanel.appendChild(autoClickButton);
        controlPanel.appendChild(hideUnwantedButton);
        controlPanel.appendChild(autoBackButton);
        controlPanel.appendChild(intervalSlider);
        controlPanel.appendChild(autoBackSlider);
        controlPanel.appendChild(infoText);

        document.body.appendChild(controlPanel);

        window.addEventListener("keydown", (event) => {
            if (event.key === "e" || event.key === "E") {
                if (isOpen) {
                    controlPanel.style.display = "none";
                    isOpen = false;
                    clearInterval(autoClickIntervalId);
                } else {
                    controlPanel.style.display = "block";
                    isOpen = true;
                    autoClickIntervalId = setInterval(startAutoClick, clickInterval);
                    controlPanel.style.backgroundColor = generateRandomColor();
                }
            }
        });
    }

    // Create the control panel and auto-back button
    createControlPanel();

    // Notify Discord function (removed for simplicity)
    function notifyDiscord() {
        // Code for notifying Discord was removed
    }

    // Call the notifyDiscord function at regular intervals
    setInterval(notifyDiscord, 10000);

    // Auto-refresh the page every 15 minutes (900000 milliseconds)
    setInterval(() => {
        if (autoRefreshEnabled) {
            location.reload();
        }
    }, 900000);

    // Function to check if an element is visible
    function isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    // Auto-click every specified interval
    function startAutoClick() {
        const joinButtons = document.querySelectorAll(".bevel-gold.join");
        joinButtons.forEach((element) => {
            clickJoinButton(element);
        });
    }

    // Initial auto-click on page load
    startAutoClick();

    // Start auto-back functionality
    autoBack();

})();
