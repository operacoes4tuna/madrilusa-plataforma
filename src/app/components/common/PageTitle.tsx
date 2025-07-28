import React from 'react';
import { Col } from 'shards-react';
import classNames from 'classnames';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  md?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  className,
  md = "12"
}) => {
  const classes = classNames(className);

  return (
    <Col md={md} className={classes}>
      <div className="page-header">
        <h2 className="page-title">{title}</h2>
        {subtitle && (
          <small className="page-subtitle text-muted">{subtitle}</small>
        )}
      </div>
    </Col>
  );
};

export default PageTitle; 