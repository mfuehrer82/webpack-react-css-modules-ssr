import React from 'react';
import Link from 'react-router/lib/Link';
import styles from '../../../styles/component.css';

/**
 * Dashboard component
 */
export default function Dashboard() {
    return (
        <div>
            <h1 className={styles.title}>Dashboard</h1>
            <Link to="imprint">To imprint</Link>
        </div>
    );
}
