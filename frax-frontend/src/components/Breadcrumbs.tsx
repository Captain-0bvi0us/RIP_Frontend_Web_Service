import { Link } from 'react-router-dom';
import React from 'react';
// import './Breadcrumbs.css';

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => (
    <nav aria-label="breadcrumb" className="breadcrumbs-nav">
        <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Главная</Link></li>
            {crumbs.map((crumb, index) => (
                <li
                    key={index}
                    className={`breadcrumb-item ${index === crumbs.length - 1 ? 'active' : ''}`}
                >
                    {index === crumbs.length - 1 || !crumb.path ? (
                        crumb.label
                    ) : (
                        <Link to={crumb.path}>{crumb.label}</Link>
                    )}
                </li>
            ))}
        </ol>
    </nav>
);