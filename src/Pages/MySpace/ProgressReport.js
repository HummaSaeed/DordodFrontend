import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { useProgress } from '../../hooks/useSharedHooks';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { progressApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

const ProgressReport = () => {
  const { progress, progressReports, generateProgressReport } = useProgress();
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const handleGenerateReport = async () => {
    await generateProgressReport(dateRange);
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Row className="mb-4">
        <Col>
          <DashboardCard title="Report Parameters">
            <Form>
              <Row>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <ActionButton
                    label="Generate"
                    onClick={handleGenerateReport}
                    className="mt-4"
                  />
                </Col>
              </Row>
            </Form>
          </DashboardCard>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <DashboardCard title="Goals Progress">
            <BarChart width={400} height={300} data={progressReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="goals" fill="#8884d8" />
            </BarChart>
          </DashboardCard>
        </Col>

        <Col md={6}>
          <DashboardCard title="Skills Development">
            <LineChart width={400} height={300} data={progressReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="skills" stroke="#82ca9d" />
            </LineChart>
          </DashboardCard>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <DashboardCard title="Activities Distribution">
            <PieChart width={400} height={300}>
              <Pie
                data={progress.activities}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </DashboardCard>
        </Col>

        <Col md={6}>
          <DashboardCard title="Key Metrics">
            {/* Add key metrics summary */}
          </DashboardCard>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgressReport; 