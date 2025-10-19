import React from 'react'
export const SkeletonCard = () => (
    <div className="card">
        <div className="skel" style={{ height: 84 }} />
        <div className="skel" style={{ height: 12, width: '70%' }} />
        <div className="skel" style={{ height: 12, width: '40%' }} />
        <div className="skel" style={{ height: 36, width: '100%', marginTop: 8 }} />
    </div>
)
