import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTodos, getStatistics, setStatistics, type DailyStat } from '../utils/storage';
import { isToday } from '../utils/timeUtils';
import LazinessPatternAnalysis from '../components/LazinessPatternAnalysis';
import AdBanner from '../components/AdBanner';
import CoupangRandomLink from '../components/CoupangRandomLink';
import type { Todo } from '../types/todo';

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
    })) as Array<{ date: string; 달성률: number }>;
  };

  const getWeeklyData = () => {
    const dates = Object.keys(stats.dailyStats).sort().slice(-28);
    const weeks: { [key: string]: number[] } = {};
    
    dates.forEach(date => {
      const d = new Date(date);
      const weekKey = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
      if (!weeks[weekKey]) weeks[weekKey] = [];
      const rate = stats.dailyStats[date]?.rate || 0;
      weeks[weekKey].push(rate);
    });

    return Object.keys(weeks).map(week => ({
      week,
      달성률: weeks[week].reduce((a, b) => a + b, 0) / weeks[week].length
    })) as Array<{ week: string; 달성률: number }>;
  };

  const getMonthlyData = () => {
    const dates = Object.keys(stats.dailyStats).sort();
    const months: { [key: string]: number[] } = {};
    
    dates.forEach(date => {
      const monthKey = date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) months[monthKey] = [];
      const rate = stats.dailyStats[date]?.rate || 0;
      months[monthKey].push(rate);
    });

    return Object.keys(months).map(month => ({
      month: month.split('-')[1] + '월',
      달성률: months[month].reduce((a, b) => a + b, 0) / months[month].length
    })) as Array<{ month: string; 달성률: number }>;
  };

  const chartData = period === 'day' ? getDailyData() : period === 'week' ? getWeeklyData() : getMonthlyData();

  // 가장 자주 미룬 할 일 분석
  const getMostProcrastinatedTodos = () => {
    const todos = getTodos();
    const incompleteTodos = todos.filter((todo: Todo) => !todo.isCompleted);
    const todoCounts: { [key: string]: number } = {};
    
    incompleteTodos.forEach((todo: Todo) => {
      const key = todo.text;
      todoCounts[key] = (todoCounts[key] || 0) + 1;
    });

    return Object.entries(todoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));
  };

  // 가장 빨리 완료한 할 일 분석
  const getFastestCompletedTodos = () => {
    const todos = getTodos();
    const completedTodos = todos.filter((todo: Todo) => todo.isCompleted && todo.startedAt);
    
    const fastest = completedTodos
      .map((todo: Todo) => {
        const createdAt = new Date(todo.createdAt);
        const startedAt = todo.startedAt ? new Date(`${new Date().toISOString().split('T')[0]}T${todo.startedAt}`) : null;
        if (!startedAt) return null;
        const minutes = (startedAt.getTime() - createdAt.getTime()) / (1000 * 60);
        return { text: todo.text, minutes };
      })
      .filter((item): item is { text: string; minutes: number } => item !== null)
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 5);

    return fastest;
  };

  // 시간대별 완료 패턴 분석
  const getCompletionTimePattern = () => {
    const todos = getTodos();
    const completedTodos = todos.filter((todo: Todo) => todo.isCompleted && todo.startedAt);
    
    const hourCounts: { [key: number]: number } = {};
    completedTodos.forEach((todo: Todo) => {
      if (todo.startedAt) {
        const hour = parseInt(todo.startedAt.split(':')[0]);
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: `${hour}시`, count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  // 중요도별 완료율
  const getImportanceCompletionRate = () => {
    const todos = getTodos();
    const importanceStats: { [key: number]: { total: number; completed: number } } = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 }
    };

    todos.forEach((todo: Todo) => {
      importanceStats[todo.importance].total++;
      if (todo.isCompleted) {
        importanceStats[todo.importance].completed++;
      }
    });

    return Object.entries(importanceStats).map(([importance, stats]) => ({
      importance: importance === '1' ? '낮음' : importance === '2' ? '보통' : '높음',
      rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      completed: stats.completed,
      total: stats.total
    }));
  };

  const mostProcrastinated = getMostProcrastinatedTodos();
  const fastestCompleted = getFastestCompletedTodos();
  const timePattern = getCompletionTimePattern();
  const importanceData = getImportanceCompletionRate();

  // 이번 주 최고 생산성 날짜
  const getBestProductivityDay = () => {
    const dates = Object.keys(stats.dailyStats).sort().slice(-7);
    let bestDay = { date: '', rate: 0 };
    dates.forEach(date => {
      const rate = stats.dailyStats[date]?.rate || 0;
      if (rate > bestDay.rate) {
        bestDay = { date, rate };
      }
    });
    return bestDay;
  };

  // 이번 달 평균 완료율
  const getMonthlyAverage = () => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const monthDates = Object.keys(stats.dailyStats).filter(date => date.startsWith(currentMonth));
    if (monthDates.length === 0) return 0;
    const totalRate = monthDates.reduce((sum, date) => sum + (stats.dailyStats[date]?.rate || 0), 0);
    return totalRate / monthDates.length;
  };

  // 완료 누적 추이
  const getCumulativeData = () => {
    const dates = Object.keys(stats.dailyStats).sort();
    let cumulative = 0;
    return dates.map(date => {
      cumulative += stats.dailyStats[date]?.completed || 0;
      return {
        date: date.split('-').slice(1).join('/'),
        누적완료: cumulative
      };
    });
  };

  // 중요도별 평균 마감 시간
  const getImportanceDeadlineAverage = () => {
    const todos = getTodos();
    const importanceDeadlines: { [key: number]: number[] } = { 1: [], 2: [], 3: [] };
    todos.forEach((todo: Todo) => {
      if (todo.deadline) {
        const [hours, minutes] = todo.deadline.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        importanceDeadlines[todo.importance].push(totalMinutes);
      }
    });
    return Object.entries(importanceDeadlines).map(([importance, times]) => {
      const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      const hours = Math.floor(avg / 60);
      const mins = Math.floor(avg % 60);
      return {
        importance: importance === '1' ? '낮음' : importance === '2' ? '보통' : '높음',
        averageTime: `${hours}:${String(mins).padStart(2, '0')}`
      };
    });
  };

  const bestDay = getBestProductivityDay();
  const monthlyAvg = getMonthlyAverage();
  const cumulativeData = getCumulativeData();
  const importanceDeadlines = getImportanceDeadlineAverage();

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
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

      <LazinessPatternAnalysis />

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

      {/* 추가 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '12px', textAlign: 'center', border: '1px solid #2196f3' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>이번 주 최고 생산성</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3', marginBottom: '4px' }}>
            {bestDay.rate.toFixed(0)}%
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {bestDay.date ? new Date(bestDay.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '없음'}
          </div>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '12px', textAlign: 'center', border: '1px solid #9c27b0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>이번 달 평균 완료율</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
            {monthlyAvg.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* 완료 누적 추이 그래프 */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '20px', 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px var(--shadow)' 
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>완료 누적 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeData.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="누적완료" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 중요도별 평균 마감 시간 */}
      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>중요도별 평균 마감 시간</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {importanceDeadlines.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>{item.importance}</span>
              <span style={{ fontSize: '18px', color: '#2196f3' }}>{item.averageTime}</span>
            </div>
          ))}
        </div>
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
            {Object.values(stats.dailyStats).reduce((sum: number, day: DailyStat) => sum + (day.total || 0), 0)}
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

      {/* 일별 달성률 막대그래프 */}
      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>일별 달성률 막대그래프</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getDailyData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="달성률" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 중요도별 완료율 */}
      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>중요도별 완료율</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={importanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="importance" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rate" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 시간대별 완료 패턴 */}
      {timePattern.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>시간대별 완료 패턴</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timePattern}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 가장 자주 미룬 할 일 */}
      {mostProcrastinated.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>가장 자주 미룬 할 일</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mostProcrastinated.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.text}</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b' }}>
                  {item.count}회 미룸
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 가장 빨리 완료한 할 일 */}
      {fastestCompleted.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>가장 빨리 완료한 할 일</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fastestCompleted.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.text}</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>
                  {Math.round(item.minutes)}분 만에 완료
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 쿠팡 파트너스 랜덤 링크 */}
      <CoupangRandomLink />

      {/* Google AdSense 광고 */}
      <AdBanner slot="STATS_01" />
    </div>
  );
};

export default StatisticsPage;

