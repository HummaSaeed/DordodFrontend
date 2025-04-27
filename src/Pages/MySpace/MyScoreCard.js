import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTrophy, FaChartLine, FaCheckCircle, FaStar } from 'react-icons/fa';
import { DashboardCard, ProgressIndicator } from '../../components/SharedComponents';
import { useProgress } from '../../hooks/useSharedHooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyScoreCard = () => {
  const { progress, progressReports, loading } = useProgress();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const scoreCategories = [
    { title: 'Goals Achievement', value: progress.goals, icon: FaTrophy },
    { title: 'Skills Development', value: progress.skills, icon: FaChartLine },
    { title: 'Activities Completion', value: progress.activities, icon: FaCheckCircle },
    { title: 'Overall Rating', value: progress.overall, icon: FaStar }
  ];

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Row>
        {scoreCategories.map(category => (
          <Col md={3} key={category.title}>
            <DashboardCard
              title={
                <div className="d-flex align-items-center">
                  <category.icon className="me-2" />
                  {category.title}
                </div>
              }
            >
              <div className="text-center">
                <h2>{category.value}%</h2>
                <ProgressIndicator value={category.value} />
              </div>
            </DashboardCard>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <DashboardCard title="Progress Trend">
            <LineChart width={700} height={300} data={progressReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="goals" stroke="#8884d8" />
              <Line type="monotone" dataKey="skills" stroke="#82ca9d" />
              <Line type="monotone" dataKey="activities" stroke="#ffc658" />
            </LineChart>
          </DashboardCard>
        </Col>

        <Col md={4}>
          <DashboardCard title="Recent Achievements">
            {/* List recent achievements */}
          </DashboardCard>
        </Col>
      </Row>
    </Container>
  );
};

export default MyScoreCard; 