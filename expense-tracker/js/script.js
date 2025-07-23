// script.js
const form = document.getElementById('expense-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const list = document.getElementById('expense-list');
const totalEl = document.getElementById('total-amount');
const chartCtx = document.getElementById('expense-chart').getContext('2d');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

let expenseChart;

function renderChart(data) {
  const totals = {};
  data.forEach(item => {
    totals[item.category] = (totals[item.category] || 0) + item.amount;
  });

  const categories = Object.keys(totals);
  const amounts = Object.values(totals);

  if (expenseChart) expenseChart.destroy();

  expenseChart = new Chart(chartCtx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        label: 'Expenses',
        data: amounts,
        backgroundColor: [
          '#fd79a8', '#00b894', '#0984e3', '#ffeaa7', '#a29bfe'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateUI() {
  list.innerHTML = '';
  let total = 0;
  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${exp.description} (₹${exp.amount}) - <em>${exp.category}</em></span>
      <button onclick="deleteExpense(${index})">🗑</button>
    `;
    list.appendChild(li);
    total += exp.amount;
  });
  totalEl.textContent = total;
  renderChart(expenses);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateUI();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  if (!desc || isNaN(amount) || amount <= 0) return;

  expenses.push({ description: desc, amount, category });
  descInput.value = '';
  amountInput.value = '';
  updateUI();
});

updateUI();
