import React, { useRef, useState, useEffect } from 'react';
import { Container, Card, Button, ButtonGroup, Form, Row, Col } from 'react-bootstrap';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaUndo, FaRedo, FaSave, FaTrash } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    saveState();
  }, []);

  const saveState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    setHistory(prev => [...prev.slice(0, historyStep + 1), canvas.toDataURL()]);
    setHistoryStep(prev => prev + 1);
  };

  const restoreState = (step) => {
    if (step < 0 || step >= history.length) return;
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };
    setHistoryStep(step);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);

    if (tool === 'eraser') {
      context.strokeStyle = '#ffffff';
    } else {
      context.strokeStyle = color;
    }
    context.lineWidth = lineWidth;
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getCoordinates(e);

    if (tool === 'pencil' || tool === 'eraser') {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } else if (tool === 'rectangle') {
      const startX = context.moveTo.x;
      const startY = context.moveTo.y;
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      restoreState(historyStep);
      context.strokeRect(startX, startY, offsetX - startX, offsetY - startY);
    } else if (tool === 'circle') {
      const startX = context.moveTo.x;
      const startY = context.moveTo.y;
      const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY - startY, 2));
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      restoreState(historyStep);
      context.beginPath();
      context.arc(startX, startY, radius, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    saveState();
  };

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState();
  };

  const saveCanvas = () => {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    setToast({
      show: true,
      message: 'Whiteboard saved successfully!',
      variant: 'success'
    });
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Whiteboard</h5>
            <ButtonGroup>
              <Button
                variant="outline-light"
                onClick={() => restoreState(historyStep - 1)}
                disabled={historyStep <= 0}
              >
                <FaUndo />
              </Button>
              <Button
                variant="outline-light"
                onClick={() => restoreState(historyStep + 1)}
                disabled={historyStep >= history.length - 1}
              >
                <FaRedo />
              </Button>
              <Button variant="outline-light" onClick={saveCanvas}>
                <FaSave />
              </Button>
              <Button variant="outline-light" onClick={clearCanvas}>
                <FaTrash />
              </Button>
            </ButtonGroup>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <ButtonGroup>
                <Button
                  variant={tool === 'pencil' ? 'success' : 'outline-success'}
                  onClick={() => setTool('pencil')}
                >
                  <FaPencilAlt />
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'success' : 'outline-success'}
                  onClick={() => setTool('eraser')}
                >
                  <FaEraser />
                </Button>
                <Button
                  variant={tool === 'rectangle' ? 'success' : 'outline-success'}
                  onClick={() => setTool('rectangle')}
                >
                  <FaSquare />
                </Button>
                <Button
                  variant={tool === 'circle' ? 'success' : 'outline-success'}
                  onClick={() => setTool('circle')}
                >
                  <FaCircle />
                </Button>
              </ButtonGroup>
            </Col>
            <Col>
              <Form.Control
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Choose color"
              />
            </Col>
            <Col>
              <Form.Range
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <div style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '600px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Whiteboard; 