document.addEventListener("DOMContentLoaded", () => {
    const selectStock = document.getElementById("Select_stock");
    const startDateInput = document.getElementById("start_date");
    const timeIntervalDropdown = document.getElementById("time_interval");
    const predictButton = document.getElementById("predictButton");
    const predictionPlot = document.getElementById("predictionPlot");

    const stockImages = {
        AAPL: "static/assets/applelogo.png",
        BBCA: "static/assets/bcalogo.png",
        'BBRI.JK': "static/assets/brilogo.png"
    };

    const defaultImage = "static/assets/stocklylogo.png";
    const stockLogo = document.querySelector(".stock_logo");
    const stockNameDisplay = document.querySelector(".stock_name");

    // Set the initial stock logo and name
    stockLogo.src = defaultImage;
    stockLogo.alt = "Stockly Logo";
    stockNameDisplay.textContent = "Stockly"; // Default text

    selectStock.addEventListener("change", () => {
        const selectedValue = selectStock.value;

        if (stockImages[selectedValue]) {
            stockLogo.src = stockImages[selectedValue];
            stockLogo.alt = `${selectedValue} Logo`;
            stockNameDisplay.textContent = selectedValue; // Display the selected stock name
        } else {
            stockLogo.src = defaultImage;
            stockLogo.alt = "Stockly Logo";
            stockNameDisplay.textContent = "Stockly"; // Display "Stockly" if no stock is selected or it's the default
        }
    });

    // When "Predict" button is clicked
    predictButton.addEventListener("click", () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const ticker = selectStock.value || 'AAPL'; // Default to 'AAPL' if no stock selected
        const startDate = startDateInput.value || '2020-01-01'; // Default to '2020-01-01' if no start date
        const endDate = formattedDate; // Use today's date if no end date
        const forecastDays = parseInt(timeIntervalDropdown.value) || 365; // Default to 365 days if no interval is selected

        // Update the image source to reflect the new query parameters
        predictionPlot.src = `/predict?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}&forecast_days=${forecastDays}`;
    });
});
