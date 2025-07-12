import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const IncomeVsExpense = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [incomeExpenseSeries, setIncomeExpenseSeries] = useState([
    {
      name: "Income",
      data: []
    },
    {
      name: "Expenses",
      data: []
    }
  ]);

  const incomeExpenseOptions = {
    chart: {
      type: 'area',
      height: 270,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false }
    },
    
    yaxis: {
      labels: { formatter: val => `$${val.toFixed(0)}` }
    },
    tooltip: {
      x: { format: 'dd MMM yyyy' }
    },
    colors: ['#3b82f6', '#facc15'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");

        const invoiceRes = await axios.get("https://hemanth525.pythonanywhere.com/properties/property/invoice/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const invoices = invoiceRes.data.data || [];
        const paidInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'paid');
        const incomeSum = paidInvoices.reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
        setIncome(incomeSum);

        const maintainenceRes = await axios.get("https://hemanth525.pythonanywhere.com/properties/maintainence/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const maintenance = maintainenceRes.data.data || [];
        const activeMaintenance = maintenance.filter(req => req.active);
        const expenseSum = activeMaintenance.reduce((acc, req) => acc + (parseFloat(req.maintainence_cost) || 0), 0);
        setExpense(expenseSum);

        const groupByMonth = (data, key, valueKey) => {
          const result = {};
        
          data.forEach(item => {
            const date = new Date(item[key]);
            if (isNaN(date)) return; // skip invalid date
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            if (!result[monthKey]) result[monthKey] = 0;
            result[monthKey] += parseFloat(item[valueKey]) || 0;
          });
        
          // Convert to ApexChart-compatible format
          return Object.entries(result).map(([month, total]) => {
            const date = new Date(`${month}-01T00:00:00`);
            return [date.getTime(), parseFloat(total.toFixed(2))];
          });
        };
        

        setIncomeExpenseSeries([
          {
            name: "Income",
            data: groupByMonth(paidInvoices, "created_at", "amount")
          },
          {
            name: "Expenses",
            data: groupByMonth(activeMaintenance, "maintainence_date", "maintainence_cost")
          }
        ]);

      } catch (error) {
        console.error("Error loading income vs expense data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='col-6 col-md-6 w-100 p-3'>
      <div className='card h-100 w-100'>
        <div className='card-body w-100 p-24 mb-8'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between w-100'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Income Vs Expense </h6>
          </div>
          <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-24'>
            <li className='d-flex flex-column gap-1'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-8-px h-8-px rounded-pill bg-primary-600' />
                <span className='text-secondary-light text-sm fw-semibold'>Income</span>
              </div>
              <div className='d-flex align-items-center gap-8'>
                <h6 className='mb-0'>${income.toFixed(2)}</h6>
              </div>
            </li>
            <li className='d-flex flex-column gap-1'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-8-px h-8-px rounded-pill bg-warning-600' />
                <span className='text-secondary-light text-sm fw-semibold'>Expenses</span>
              </div>
              <div className='d-flex align-items-center gap-8'>
                <h6 className='mb-0'>${expense.toFixed(2)}</h6>
              </div>
            </li>
          </ul>
          <div id='incomeExpense' className='apexcharts-tooltip-style-1'>
            <ReactApexChart
              options={incomeExpenseOptions}
              series={incomeExpenseSeries}
              type='area'
              height={270}
              width={'100%'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpense;
