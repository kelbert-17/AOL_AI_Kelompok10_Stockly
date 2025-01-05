from flask import Flask, render_template, request, send_file
import yfinance as yf
from prophet import Prophet
import matplotlib.pyplot as plt
import os

app = Flask(__name__)

# Define the path to save the plot images
PLOTS_DIR = 'static/plots'


def download_and_forecast(ticker, start_date, end_date, forecast_days):
    try:
        # Download stock data from Yahoo Finance
        df_train = yf.download(ticker, start=start_date, end=end_date)
        if df_train.empty:
            raise ValueError("No data found for the given inputs.")
    except Exception as e:
        return str(e), None

    # Prepare the data for Prophet
    prophet_df = df_train.reset_index()[['Date', 'Close']]
    prophet_df.columns = ['ds', 'y']

    # Create and train the Prophet model
    model = Prophet()
    model.fit(prophet_df)

    # Create a dataframe for future predictions
    future = model.make_future_dataframe(periods=forecast_days)

    # Make predictions
    forecast = model.predict(future)

    # Visualize the forecast
    plt.figure(figsize=(10, 10))
    model.plot(forecast)
    plt.title(f"Forecast for {ticker} Stock Prices")
    plt.xlabel("Date")
    plt.ylabel("Price")
    
    # Adjust the layout to avoid title clipping
    plt.tight_layout()

    # Save the plot as a PNG image
    if not os.path.exists(PLOTS_DIR):
        os.makedirs(PLOTS_DIR)
    plot_path = os.path.join(PLOTS_DIR, f"{ticker}_forecast.png")
    plt.savefig(plot_path)
    plt.close()

    return None, plot_path



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['GET'])
def predict():
    # Get parameters from the URL query string
    ticker = request.args.get('ticker', 'AAPL')
    start_date = request.args.get('start_date', '2020-01-01')
    end_date = request.args.get('end_date', '2022-01-01')
    forecast_days = int(request.args.get('forecast_days', 365))

    # Call the forecast function
    error, plot_path = download_and_forecast(ticker, start_date, end_date, forecast_days)

    if error:
        return f"Error: {error}"

    # Return the plot image for the front-end
    return send_file(plot_path, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)
