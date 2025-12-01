import React, { useState } from 'react';
import { useTodoTemplates } from '../hooks/useTodoTemplates';
import { useTodos } from '../hooks/useTodos';
import type { TodoTemplate } from '../data/todoTemplates';

/**
 * 반복 할 일 템플릿 관리 컴포넌트
 * 매일/매주/매월 반복되는 할 일을 설정하고 자동으로 생성할 수 있습니다.
 */
const TodoTemplateManager: React.FC = () => {
  const { templates, toggleTemplate, applyTemplates, addTemplate, deleteTemplate } = useTodoTemplates();
  const { todos } = useTodos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<TodoTemplate, 'id' | 'enabled'>>({
    text: '',
    repeatType: 'daily',
    deadline: '18:00',
    importance: 2
  });

  const handleApplyTemplates = () => {
    applyTemplates();
    alert('템플릿이 적용되었습니다!');
  };

  const handleAddTemplate = () => {
    if (newTemplate.text.trim()) {
      addTemplate({ ...newTemplate, enabled: true });
      setNewTemplate({
        text: '',
        repeatType: 'daily',
        deadline: '18:00',
        importance: 2
      });
      setShowAddForm(false);
    }
  };

  const repeatTypeLabels: Record<TodoTemplate['repeatType'], string> = {
    daily: '매일',
    weekly: '매주',
    monthly: '매월'
  };

  const enabledTemplates = templates.filter(t => t.enabled);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
          🔄 반복 할 일 템플릿
        </h2>
        <button
          onClick={handleApplyTemplates}
          disabled={enabledTemplates.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: enabledTemplates.length > 0 ? '#4caf50' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: enabledTemplates.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          오늘 적용하기 ({enabledTemplates.length}개)
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        {templates.map(template => (
          <div
            key={template.id}
            style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: template.enabled ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${template.enabled ? '#2196f3' : '#ddd'}`
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                {template.text}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {repeatTypeLabels[template.repeatType]} | {template.deadline} | 
                중요도: {template.importance === 1 ? '낮음' : template.importance === 2 ? '보통' : '높음'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleTemplate(template.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: template.enabled ? '#4caf50' : '#e0e0e0',
                  color: template.enabled ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {template.enabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + 새 템플릿 추가
        </button>
      ) : (
        <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>새 템플릿 추가</h3>
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            value={newTemplate.text}
            onChange={(e) => setNewTemplate({ ...newTemplate, text: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <select
            value={newTemplate.repeatType}
            onChange={(e) => setNewTemplate({ ...newTemplate, repeatType: e.target.value as TodoTemplate['repeatType'] })}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매월</option>
          </select>
          <input
            type="time"
            value={newTemplate.deadline}
            onChange={(e) => setNewTemplate({ ...newTemplate, deadline: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <select
            value={newTemplate.importance}
            onChange={(e) => setNewTemplate({ ...newTemplate, importance: parseInt(e.target.value) as 1 | 2 | 3 })}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={1}>낮음</option>
            <option value={2}>보통</option>
            <option value={3}>높음</option>
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddTemplate}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTemplate({
                  text: '',
                  repeatType: 'daily',
                  deadline: '18:00',
                  importance: 2
                });
              }}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoTemplateManager;

