import React from 'react';
import { Card, CardBody } from 'shards-react';
import classNames from 'classnames';

interface SmallStatsProps {
  id?: string;
  variation?: string;
  label: string;
  value: string | number;
  percentage?: string | number;
  increase?: boolean;
}

const SmallStats: React.FC<SmallStatsProps> = ({
  id,
  variation = "1",
  label,
  value,
  percentage,
  increase = true
}) => {
  const cardClasses = classNames(
    'stats-small',
    variation && `stats-small--${variation}`
  );

  const cardBodyClasses = classNames(
    'p-3 d-flex flex-column justify-content-center'
  );

  const labelClasses = classNames(
    'stats-small__label',
    'text-uppercase',
    'text-muted',
    'font-weight-bold',
    'mb-2'
  );

  const valueClasses = classNames(
    'stats-small__value',
    'h3',
    'mb-2',
    'font-weight-bold'
  );

  const percentageClasses = classNames(
    'stats-small__percentage',
    'small',
    increase ? 'text-success' : 'text-danger'
  );

  return (
    <Card small className={cardClasses}>
      <CardBody className={cardBodyClasses}>
        <div className="text-center">
          <span className={labelClasses} style={{ fontSize: '0.75rem' }}>
            {label}
          </span>
          <div className={valueClasses} style={{ color: '#F5A623' }}>
            {value}
          </div>
          {percentage && (
            <span className={percentageClasses}>
              {increase ? '↗' : '↘'} {percentage}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SmallStats; 