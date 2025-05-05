# BudgetBuddy

BudgetBuddy is a full-stack personal finance app that helps users track their monthly expenses, set budgets, and download reports. Built to demonstrate real-world CRUD functionality, authentication, and responsive design — ideal for internship portfolios.

## Features

- User authentication with Firebase (login and register)
- Add, edit, and delete expenses
- Dashboard with budget progress bar and expense chart
- Monthly budget tracking and spending summary
- Export data to CSV for reports
- Responsive UI with Tailwind CSS

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Chart.js
- Backend: Firebase Authentication and Firestore
- Data Export: react-csv

## Screenshots

(Add screenshots of login, dashboard, and chart here)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/humayunejaz/budgetbuddy.git
cd budgetbuddy/client
```

2. Install dependencies:
```bash
npm install
```

3. Add your Firebase configuration to `firebase.js`

4. Start the app:
```bash
npm start
```

## Folder Structure
```
client/
├── src/
│   ├── components/       # Chart, CSV export button
│   ├── pages/            # Login, Signup, Dashboard
│   ├── firebase.js       # Firebase configuration
│   └── App.js, index.js
```

## Deployment
You can deploy the app using:
- Vercel
- Firebase Hosting

## Author
Humayun Ejaz – [GitHub](https://github.com/humayunejaz)

## License
This project is licensed under the MIT License.

