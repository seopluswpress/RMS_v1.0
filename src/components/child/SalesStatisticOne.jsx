import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const SalesStatisticOne = () => {
    const [chartSeries, setChartSeries] = useState([
        {
            name: 'Subscription Price',
            data: []
        }
    ]);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'area',
            height: 264,
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
        colors: ['#3b82f6'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        }
    });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await axios.get("https://hemanth525.pythonanywhere.com/accounts/user-subscribe/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = res.data.subscriptions || [];
                const filtered = data.filter(sub => !sub.is_trial);
                const seriesData = filtered.map(sub => [
                    new Date(sub.start_date).getTime(),
                    parseFloat(sub.price) || 0
                ]);

                const totalSum = filtered.reduce((acc, sub) => acc + (parseFloat(sub.price) || 0), 0);
                setTotal(totalSum);
                setChartSeries([{ name: 'Subscription Price', data: seriesData }]);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-100" style={{paddingTop:'1rem'}}>
            <div className="card h-100" style={{paddingTop:'1rem'}}>
                <div className="card-body" style={{paddingTop:'1rem'}}>
                    <div className="d-flex flex-wrap align-items-center justify-content-between" >
                        <h6 className="text-lg mb-0">Sales Statistic</h6>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                        <h6 className="mb-0">${total.toFixed(2)}</h6>
                        <span className="text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1">
                            10% <Icon icon="bxs:up-arrow" className="text-xs" />
                        </span>
                        <span className="text-xs fw-medium">+ $1500 Per Day</span>
                    </div>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={264} />
                </div>
            </div>
        </div>
    );
};

export default SalesStatisticOne;
