'use client'
import React, { useEffect, useState } from 'react';
import { Select, Empty, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Loading from '/src/app/components/loading'

const { Option } = Select;

const AdminView = () => {
    const [teaching, setTeaching] = useState([]);
    const [activity, setActivity] = useState([]);
    const [research, setResearch] = useState([]);
    const [overview, setOverview] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYears, setSelectedYears] = useState([]);
    const [years, setYears] = useState([]);
    const [chartData, setChartData] = useState(null);

    const fetchteaching = async () => {
        try {
            const response = await fetch('/api/manageTeaching/')
            const data = await response.json()
            console.log('teaching data fetched:', data);
            setTeaching(data)
        } catch (error) {
            console.error('Failed to fetch teaching', error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchactivity = async () => {
        try {
            const response = await fetch('/api/manageActivity/')
            const data = await response.json()
            console.log('activity data fetched:', data);
            setActivity(data)
        } catch (error) {
            console.error('Failed to fetch activity', error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchresearch = async () => {
        try {
            const res = await fetch('/api/research')
            const data = await res.json()
            console.log('research data fetched:', data);
            setResearch(data)
        } catch (error) {
            console.error('Failed to fetch research', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOverview();
        fetchteaching();
        fetchactivity();
        fetchresearch();
    }, []);

    useEffect(() => {
        if (overview.length > 0) {
            const uniqueYears = Array.from(new Set(overview.map(item => item.year)));
            setYears(uniqueYears);
            setSelectedYears(uniqueYears.slice(0, 2));
        }
    }, [overview]);

    useEffect(() => {
        if (overview.length > 0 && selectedYears.length > 0) {
            generateChartData();
        }
    }, [overview, selectedYears]);

    const fetchOverview = async () => {
        try {
            const res = await fetch('/api/userOverview');
            const data = await res.json();
            setOverview(data);
        } catch (error) {
            console.error('Failed to fetch Overview', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateChartData = () => {
        const colors = [
            'rgba(75,192,192,1)',
            'rgba(255,99,132,1)',
            'rgba(54,162,235,1)',
            'rgba(255,206,86,1)',
            'rgba(75,192,192,1)',
            'rgba(153,102,255,1)',
            'rgba(255,159,64,1)',
        ];

        const datasets = selectedYears.map((year, index) => {
            const filteredData = overview.filter(item => item.year === year);
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const dataCounts = months.map(month =>
                filteredData.filter(item => new Date(item.createdAt).getMonth() + 1 === month).length
            );

            return {
                label: `Data for ${year}`,
                data: dataCounts,
                fill: false,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
            };
        });

        setChartData({
            labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' })),
            datasets,
        });
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }
    

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold ml-4">ผลงานบุคลากรทั้งหมด</h1>
            </div>
            <Card className="max-w-6xl mx-4 px-2 shadow-2xl">
                {chartData ? (
                    <div className=" h-60 w-full flex">
                        <Line data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                ) : (
                    <Empty description="No Data" />
                )}
                {years.length > 0 ? (
                    <Select
                        mode="multiple"
                        value={selectedYears}
                        style={{ marginTop: 20, minWidth: 100 }}
                        onChange={setSelectedYears}
                    >
                        {years.map(year => (
                            <Option key={year} value={year}>{year}</Option>
                        ))}
                    </Select>
                ) : (
                    <Empty description="No years available" />
                )}
            </Card>
            <div className="px-4">
                <div className="flex mt-8 w-full h-32">
                    <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1 flex flex-col justify-between">
                        <div className="text-gray-500 text-sm">ผลงานทั้งหมด</div>
                        <div className="text-2xl font-bold text-right">{activity.length + research.length}</div>
                    </div>
                    <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1 flex flex-col justify-between">
                        <div className="text-gray-500 text-sm">ผลงานวิจัย</div>
                        <div className="text-2xl font-bold text-right">{research.length}</div>
                    </div>
                    <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1 flex flex-col justify-between">
                        <div className="text-gray-500 text-sm">ผลงานกิจกรรม</div>
                        <div className="text-2xl font-bold text-right">{activity.length}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-xl flex-1 flex flex-col justify-between">
                        <div className="text-gray-500 text-sm">วิชาทั้งหมด</div>
                        <div className="text-2xl font-bold text-right">{teaching.length}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminView;
