'use client'
import React, { useEffect, useState } from 'react';
import { Select, Empty, Card } from 'antd';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const { Option } = Select;

const ActivityArchive = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    useEffect(() => {
        if (activities.length > 0) {
            setSelectedActivity(activities[0].activity.id); // กำหนดค่าเริ่มต้นเป็นกิจกรรมล่าสุด
        }
    }, [activities]);

    useEffect(() => {
        if (selectedActivity) {
            generateChartData(selectedActivity);
        }
    }, [selectedActivity]);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/userActivityArchive');
            const data = await res.json();
            setActivities(data);
            console.log(data)
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateChartData = (activityId) => {
        const activityData = activities.filter(item => item.activity.id === activityId);
        if (activityData.length === 0) {
            setChartData(null);
            return;
        }

        const majorCounts = activityData.reduce((acc, item) => {
            const majorName = item.user.major.majorName;
            if (!acc[majorName]) {
                acc[majorName] = 0;
            }
            acc[majorName]++;
            return acc;
        }, {});

        const labels = Object.keys(majorCounts);
        const data = Object.values(majorCounts);
        const colors = labels.map((_, index) => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`);

        setChartData({
            labels,
            datasets: [{
                label: 'Number of Users',
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
            }]
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold ml-4">กราฟกิจกรรม</h1>
            </div>
            <Card className="max-w-6xl mx-4 px-2 shadow-2xl">
                {chartData ? (
                    <div className="h-80 w-full flex">
                        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                ) : (
                    <Empty description="No Data" />
                )}
                {activities.length > 0 ? (
                    <Select
                        value={selectedActivity}
                        style={{ marginTop: 20, minWidth: 200 }}
                        onChange={setSelectedActivity}
                        placeholder="Select an Activity"
                    >
                        {activities.map(activity => (
                            <Option key={activity.activity.id} value={activity.activity.id}>
                                {activity.activity.name} ({activity.activity.year})
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <Empty description="No activities available" />
                )}
            </Card>
        </div>
    );
};

export default ActivityArchive;
