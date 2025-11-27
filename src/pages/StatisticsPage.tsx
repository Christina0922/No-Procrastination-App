import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTodos, getStatistics, setStatistics } from '../utils/storage';
import { isToday, formatDate } from '../utils/timeUtils';
import type { Todo } from '../hooks/useTodos';

const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getStatistics());
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const todos = getTodos();
    const todayTodos = todos.filter((todo: Todo) => isToday(todo.createdAt));
    const completedToday = todayTodos.filter((todo: Todo) => todo.isCompleted).length;
    const totalToday = todayTodos.length;
    const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    // 오늘 통계 업데이트
    const today = new Date().toISOString().split('T')[0];
    const newStats = { ...stats };
    
    if (!newStats.dailyStats[today]) {
      newStats.dailyStats[today] = { completed: 0, total: 0, rate: 0 };
    }
    newStats.dailyStats[today] = {
      completed: completedToday,
      total: totalToday,
      rate: completionRate
    };

    // 연속 성공 일수 계산
    const dates = Object.keys(newStats.dailyStats).sort();
    let streak = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      const dayStats = newStats.dailyStats[dates[i]];
      if (dayStats && dayStats.rate === 100) {
        streak++;
      } else {
        break;
      }
    }
    newStats.streakDays = streak;

    setStatistics(newStats);
    setStats(newStats);
  }, []);

  const getDailyData = () => {
    const dates = Object.keys(stats.dailyStats).sort().slice(-7);
    return dates.map(date => ({
      date: date.split('-').slice(1).join('/'),
      달성률: stats.dailyStats[date]?.rate || 0
    }));
  };

  const getWeeklyData = () => {
    const dates = Object.keys(stats.dailyStats).sort().slice(-28);
    const weeks: { [key: string]: number[] } = {};
    
    dates.forEach(date => {
      const d = new Date(date);
      const weekKey = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(stats.dailyStats[date]?.rate || 0);
    });

    return Object.keys(weeks).map(week => ({
      week,
      달성률: weeks[week].reduce((a, b) => a + b, 0) / weeks[week].length
    }));
  };

  const getMonthlyData = () => {
    const dates = Object.keys(stats.dailyStats).sort();
    const months: { [key: string]: number[] } = {};
    
    dates.forEach(date => {
      const monthKey = date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) months[monthKey] = [];
      months[monthKey].push(stats.dailyStats[date]?.rate || 0);
    });

    return Object.keys(months).map(month => ({
      month: month.split('-')[1] + '월',
      달성률: months[month].reduce((a, b) => a + b, 0) / months[month].length
    }));
  };

  const chartData = period === 'day' ? getDailyData() : period === 'week' ? getWeeklyData() : getMonthlyData();

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>통계</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          홈으로
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setPeriod('day')}
          style={{
            padding: '12px 24px',
            backgroundColor: period === 'day' ? '#2196f3' : '#e0e0e0',
            color: period === 'day' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          일별
        </button>
        <button
          onClick={() => setPeriod('week')}
          style={{
            padding: '12px 24px',
            backgroundColor: period === 'week' ? '#2196f3' : '#e0e0e0',
            color: period === 'week' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          주별
        </button>
        <button
          onClick={() => setPeriod('month')}
          style={{
            padding: '12px 24px',
            backgroundColor: period === 'month' ? '#2196f3' : '#e0e0e0',
            color: period === 'month' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          월별
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>연속 성공 일수</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff6b6b' }}>
            {stats.streakDays}일
          </div>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>총 할 일 수</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196f3' }}>
            {Object.values(stats.dailyStats).reduce((sum, day) => sum + (day.total || 0), 0)}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>달성률 그래프</h2>
        <ResponsiveContainer width="100%" height={300}>
          {period === 'day' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="달성률" stroke="#2196f3" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={period === 'week' ? 'week' : 'month'} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="달성률" fill="#2196f3" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsPage;

