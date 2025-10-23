import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'react-bootstrap-icons';
import type { ICrumb } from '../types';
import './styles/Breadcrumbs.css';



interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const allCrumbs = [{ label: 'Главная', path: '/' }, ...crumbs];
  return (
    <nav className="modern-breadcrumbs" aria-label="breadcrumb">
      {allCrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
            <div className="breadcrumb-item">
                {
                crumb.active || index === allCrumbs.length - 1 ? (
                    <span className="breadcrumb-active">{crumb.label}</span>
                ) : (
                    <Link to={crumb.path || '#'} className="breadcrumb-link">
                    {crumb.label}
                    </Link>
                )
                }
            </div>

            {
                index < allCrumbs.length - 1 && (
                <div className="breadcrumb-separator">
                    <ChevronRight size={14} />
                </div>
                )
            }
        </React.Fragment>
        ))}
    </nav>
  );
};