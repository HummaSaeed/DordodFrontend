import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Home
      </Breadcrumb.Item>
      {paths.map((path, index) => (
        <Breadcrumb.Item
          key={path}
          linkAs={Link}
          linkProps={{ to: `/${paths.slice(0, index + 1).join('/')}` }}
          active={index === paths.length - 1}
        >
          {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs; 