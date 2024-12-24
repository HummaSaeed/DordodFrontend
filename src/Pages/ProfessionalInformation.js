import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Accordion } from 'react-bootstrap';
import axios from 'axios';
import { theme } from '../theme';
import InputField from '../components/InputField';
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';

const ProfessionalInformation = () => {
  const [sections, setSections] = useState({
    work_experiences: [],
    previous_experiences: [],
    educations: [],
    language_skills: [],
    certificates: [],
    honors_awards_publications: [],
    functional_skills: [],
    technical_skills: []
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [newItem, setNewItem] = useState({});
  const [showAddForm, setShowAddForm] = useState({});

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    setLoading(true);
    try {
      const endpoints = {
        work_experiences: 'work-experiences',
        previous_experiences: 'previous-experiences',
        educations: 'educations',
        language_skills: 'language-skills',
        certificates: 'certificates',
        honors_awards_publications: 'honors-awards',
        functional_skills: 'functional-skills',
        technical_skills: 'technical-skills'
      };

      const fetchPromises = Object.entries(endpoints).map(([key, endpoint]) => 
        axios.get(`http://127.0.0.1:8000/api/${endpoint}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(response => ({ key, data: response.data }))
        .catch(error => ({ key, data: [] }))
      );

      const results = await Promise.all(fetchPromises);
      const newSections = results.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      setSections(newSections);
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (section) => {
    const newItem = getEmptyItem(section);
    const endpoint = getApiEndpoint(section);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/${endpoint}/`, newItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      setSections(prev => ({
        ...prev,
        [section]: [...prev[section], response.data]
      }));

      setToast({
        show: true,
        message: 'Item added successfully',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const handleRemoveItem = async (section, index) => {
    const itemId = sections[section][index].id;
    const endpoint = getApiEndpoint(section);

    try {
      await axios.delete(`http://dordod.com/api/${endpoint}/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setSections(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));

      setToast({
        show: true,
        message: 'Item removed successfully',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const handleItemChange = async (section, index, field, value) => {
    const item = sections[section][index];
    const updatedItem = { ...item, [field]: value };
    const endpoint = getApiEndpoint(section);

    try {
      const response = await axios.put(
        `http://dordod.com/api/${endpoint}/${item.id}/`,
        updatedItem,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSections(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => i === index ? response.data : item)
      }));
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const getEmptyItem = (section) => {
    const emptyItems = {
      work_experiences: {
        organization_name: '',
        organization_location: '',
        duration: '',
        is_current: false,
        start_date: '',
        end_date: '',
        description: ''
      },
      previous_experiences: {
        title: '',
        company_name: '',
        start_date: '',
        end_date: '',
        job_responsibilities: ''
      },
      educations: {
        college_university: '',
        degree: '',
        area_of_study: '',
        degree_completed: false,
        date_completed: ''
      },
      language_skills: {
        language: '',
        speaking_proficiency: '',
        writing_proficiency: '',
        reading_proficiency: ''
      },
      certificates: {
        certification_license: '',
        description: '',
        institution: '',
        effective_date: '',
        expiration_date: '',
        attachment: null
      },
      honors_awards_publications: {
        honor_reward_publication: '',
        description: '',
        institution: '',
        issue_date: '',
        attachment: null
      },
      functional_skills: {
        skill: '',
        proficiency: ''
      },
      technical_skills: {
        skill: '',
        proficiency: ''
      }
    };

    return emptyItems[section];
  };

  const getApiEndpoint = (section) => {
    const endpoints = {
      work_experiences: 'work-experiences',
      previous_experiences: 'previous-experiences',
      educations: 'educations',
      language_skills: 'language-skills',
      certificates: 'certificates',
      honors_awards_publications: 'honors-awards',
      functional_skills: 'functional-skills',
      technical_skills: 'technical-skills'
    };
    return endpoints[section];
  };

  const handleAddClick = (section) => {
    setNewItem(getEmptyItem(section));
    setShowAddForm(prev => ({ ...prev, [section]: true }));
  };

  const handleNewItemChange = (section, field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewItem = async (section) => {
    const endpoint = getApiEndpoint(section);
    try {
      const response = await axios.post(`http://dordod.com/api/${endpoint}/`, newItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      setSections(prev => ({
        ...prev,
        [section]: [...prev[section], response.data]
      }));

      setShowAddForm(prev => ({ ...prev, [section]: false }));
      setNewItem({});

      setToast({
        show: true,
        message: 'Item added successfully',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const renderSection = (title, section, fields) => (
    <Card className="mb-4" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Header
        style={{
          backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
          color: 'white',
          padding: '15px'
        }}
      >
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        {sections[section].length > 0 && (
          <Accordion className="mb-3">
            {sections[section].map((item, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>
                  {item[fields[0].name] || `${title} ${index + 1}`}
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {fields.map((field) => (
                      <Col key={field.name} md={field.width || 6}>
                        <InputField
                          label={field.label}
                          name={field.name}
                          type={field.type || 'text'}
                          value={item[field.name] || ''}
                          onChange={(e) => handleItemChange(
                            section, 
                            index, 
                            field.name, 
                            field.type === 'checkbox' ? e.target.checked : e.target.value
                          )}
                          as={field.type === 'select' ? 'select' : field.as}
                          options={field.options || []}
                          placeholder={`Enter ${field.label}`}
                          rows={field.rows}
                        />
                      </Col>
                    ))}
                  </Row>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(section, index)}
                    className="mt-3"
                  >
                    Remove
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
        
        {showAddForm[section] ? (
          <Card className="mb-3">
            <Card.Body>
              <Row>
                {fields.map((field) => (
                  <Col key={field.name} md={field.width || 6}>
                    <InputField
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={newItem[field.name] || ''}
                      onChange={(e) => handleNewItemChange(
                        section,
                        field.name,
                        field.type === 'checkbox' ? e.target.checked : e.target.value
                      )}
                      as={field.type === 'select' ? 'select' : field.as}
                      options={field.options || []}
                      placeholder={`Enter ${field.label}`}
                      rows={field.rows}
                    />
                  </Col>
                ))}
              </Row>
              <div className="mt-3">
                <Button
                  onClick={() => handleSaveNewItem(section)}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none',
                    marginRight: '10px'
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddForm(prev => ({ ...prev, [section]: false }))}
                >
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
        <Button
            onClick={() => handleAddClick(section)}
          className="mt-3"
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            border: 'none'
          }}
        >
          Add {title}
        </Button>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Professional Information
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
      <Form>
        {renderSection('Work Experience', 'work_experiences', [
          { name: 'organization_name', label: 'Organization Name' },
          { name: 'organization_location', label: 'Location' },
          { name: 'start_date', label: 'Start Date', type: 'date' },
          { name: 'end_date', label: 'End Date', type: 'date' },
          { name: 'is_current', label: 'Current Position', type: 'checkbox', width: 12 },
          { name: 'description', label: 'Description', as: 'textarea', rows: 3, width: 12 }
        ])}

        {renderSection('Previous Experience', 'previous_experiences', [
          { name: 'title', label: 'Title' },
          { name: 'company_name', label: 'Company Name' },
          { name: 'start_date', label: 'Start Date', type: 'date' },
          { name: 'end_date', label: 'End Date', type: 'date' },
          { name: 'job_responsibilities', label: 'Job Responsibilities', as: 'textarea', rows: 3, width: 12 }
        ])}

        {renderSection('Education', 'educations', [
          { name: 'college_university', label: 'College/University' },
          { name: 'degree', label: 'Degree' },
          { name: 'area_of_study', label: 'Area of Study' },
          { name: 'degree_completed', label: 'Degree Completed', type: 'checkbox' },
          { name: 'date_completed', label: 'Date Completed', type: 'date' }
        ])}

        {renderSection('Language Skills', 'language_skills', [
          { name: 'language', label: 'Language' },
          { name: 'speaking_proficiency', label: 'Speaking Proficiency', type: 'select', options: [
            'Beginner', 'Intermediate', 'Advanced', 'Native'
          ]},
          { name: 'writing_proficiency', label: 'Writing Proficiency', type: 'select', options: [
            'Beginner', 'Intermediate', 'Advanced', 'Native'
          ]},
          { name: 'reading_proficiency', label: 'Reading Proficiency', type: 'select', options: [
            'Beginner', 'Intermediate', 'Advanced', 'Native'
          ]}
        ])}

        {renderSection('Certificates', 'certificates', [
          { name: 'certification_license', label: 'Certification/License' },
          { name: 'institution', label: 'Institution' },
          { name: 'effective_date', label: 'Effective Date', type: 'date' },
          { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
          { name: 'description', label: 'Description', as: 'textarea', rows: 3, width: 12 },
          { name: 'attachment', label: 'Attachment', type: 'file', width: 12 }
        ])}

        {renderSection('Honors, Awards & Publications', 'honors_awards_publications', [
          { name: 'honor_reward_publication', label: 'Honor/Award/Publication Title' },
          { name: 'institution', label: 'Institution' },
          { name: 'issue_date', label: 'Issue Date', type: 'date' },
          { name: 'description', label: 'Description', as: 'textarea', rows: 3, width: 12 },
          { name: 'attachment', label: 'Attachment', type: 'file', width: 12 }
        ])}

        {renderSection('Functional Skills', 'functional_skills', [
          { name: 'skill', label: 'Skill Name' },
          { name: 'proficiency', label: 'Proficiency Level', type: 'select', options: [
            'Beginner',
            'Intermediate',
            'Advanced',
            'Expert'
          ]}
        ])}

        {renderSection('Technical Skills', 'technical_skills', [
          { name: 'skill', label: 'Skill Name' },
          { name: 'proficiency', label: 'Proficiency Level', type: 'select', options: [
            'Beginner',
            'Intermediate',
            'Advanced',
            'Expert'
          ]}
        ])}
      </Form>
      )}
    </Container>
  );
};

export default ProfessionalInformation;
