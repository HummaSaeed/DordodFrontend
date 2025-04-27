import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Modal, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaChartLine, FaGraduationCap, FaCertificate, FaBrain,
  FaPlus, FaEdit, FaTrash 
} from 'react-icons/fa';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { skillsApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const SkillMatrix = () => {
  const { state, dispatch } = useApp();
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    proficiency: 'beginner',
    target_proficiency: 'intermediate',
    priority: 'medium',
    description: ''
  });

  const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const priorities = ['low', 'medium', 'high'];
  const categories = [
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'leadership', label: 'Leadership Skills' },
    { value: 'domain', label: 'Domain Knowledge' }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await skillsApi.getAll();
      setSkills(response.data);
      // Update progress report
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          ...state.progress,
          skills: calculateSkillsProgress(response.data)
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSkillsProgress = (skillsData) => {
    const totalSkills = skillsData.length;
    const completedSkills = skillsData.filter(
      skill => proficiencyLevels.indexOf(skill.proficiency) >= 
               proficiencyLevels.indexOf(skill.target_proficiency)
    ).length;
    return (completedSkills / totalSkills) * 100;
  };

  const handleSubmit = async () => {
    try {
      if (selectedSkill) {
        await skillsApi.update(selectedSkill.id, newSkill);
      } else {
        await skillsApi.create(newSkill);
      }
      fetchSkills();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setNewSkill({
      name: '',
      category: 'technical',
      proficiency: 'beginner',
      target_proficiency: 'intermediate',
      priority: 'medium',
      description: ''
    });
    setSelectedSkill(null);
  };

  const handleAssessment = async (skill) => {
    try {
      await skillsApi.assess(skill.id);
      fetchSkills();
    } catch (err) {
      console.error('Failed to assess skill:', err);
    }
  };

  const SkillCard = ({ skill }) => (
    <DashboardCard
      title={skill.name}
      headerAction={
        <div className="d-flex gap-2">
          <Badge bg={skill.priority === 'high' ? 'danger' : 
                    skill.priority === 'medium' ? 'warning' : 'success'}>
            {skill.priority}
          </Badge>
          <Badge bg="info">{skill.category}</Badge>
        </div>
      }
    >
      <div>
        <p className="text-muted">{skill.description}</p>
        <div className="mb-3">
          <small>Current Level:</small>
          <ProgressIndicator
            value={((proficiencyLevels.indexOf(skill.proficiency) + 1) / 4) * 100}
            label={skill.proficiency}
          />
        </div>
        <div className="mb-3">
          <small>Target Level:</small>
          <ProgressIndicator
            value={((proficiencyLevels.indexOf(skill.target_proficiency) + 1) / 4) * 100}
            label={skill.target_proficiency}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <ActionButton
            icon={FaEdit}
            label="Edit"
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedSkill(skill);
              setNewSkill(skill);
              setShowModal(true);
            }}
          />
          <ActionButton
            icon={FaChartLine}
            label="Assess"
            variant="outline-success"
            size="sm"
            onClick={() => handleAssessment(skill)}
          />
        </div>
      </div>
    </DashboardCard>
  );

  const ProgressIndicator = ({ value, label }) => (
    <div>
      <ProgressBar now={value} label={label} />
    </div>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Skill Matrix</h2>
        <ActionButton
          icon={FaPlus}
          label="Add Skill"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        />
      </div>

      <Row>
        <Col md={8}>
          {categories.map(category => (
            <div key={category.value} className="mb-4">
              <h4>{category.label}</h4>
              <Row>
                {skills
                  .filter(skill => skill.category === category.value)
                  .map(skill => (
                    <Col md={6} key={skill.id}>
                      <SkillCard skill={skill} />
                    </Col>
                  ))
                }
              </Row>
            </div>
          ))}
        </Col>

        <Col md={4}>
          <DashboardCard title="Skills Overview">
            <RadarChart width={300} height={300} data={categories.map(cat => ({
              subject: cat.label,
              A: skills.filter(s => s.category === cat.value).length,
              fullMark: 10
            }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </DashboardCard>

          <DashboardCard title="Recommendations">
            {/* Add skill recommendations */}
          </DashboardCard>
        </Col>
      </Row>

      {/* Add Skill Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {/* Modal content */}
      </Modal>
    </Container>
  );
};

export default SkillMatrix; 