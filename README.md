# Drift — AI Spend Guard

Drift is a browser-based prototype that estimates impulsive-spending risk before a purchase is made. It combines amount, category, urgency, budget timing, time of day, and decision state to generate a risk score and a recommended intervention.

## Features

- Interactive spend-risk scoring
- Context-aware recommendation and cooling-off delay
- Visual model pipeline from signal collection to learning loop
- Responsive landing page and live inference demo

## Run locally

Open `index.html` in a browser, or run a static server:

```bash
python3 -m http.server 4175
```

Then open `http://localhost:4175`.

## Tech stack

HTML, CSS, and JavaScript.

## Note

This is a demonstration interface. It does not connect to banking services or process real financial transactions.
